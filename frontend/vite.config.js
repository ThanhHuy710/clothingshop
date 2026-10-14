import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { Buffer } from 'node:buffer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendRoot = path.dirname(fileURLToPath(import.meta.url))
const settingsFile = path.join(frontendRoot, 'src', 'config', 'siteSettings.js')
const settingsImageDirectory = path.join(frontendRoot, 'public', 'site-settings')
const MAX_REQUEST_SIZE = 5 * 1024 * 1024
const IMAGE_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const readJsonBody = (request) => new Promise((resolve, reject) => {
  let body = ''
  request.setEncoding('utf8')
  request.on('data', (chunk) => {
    body += chunk
    if (Buffer.byteLength(body, 'utf8') > MAX_REQUEST_SIZE) {
      reject(new Error('Dữ liệu Site Settings vượt quá giới hạn 5 MB.'))
      request.destroy()
    }
  })
  request.on('end', () => {
    try {
      resolve(JSON.parse(body || '{}'))
    } catch {
      reject(new Error('Dữ liệu Site Settings không hợp lệ.'))
    }
  })
  request.on('error', reject)
})

const saveDataImage = async (field, dataUrl) => {
  const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '')
  if (!match || !IMAGE_TYPES[match[1]]) {
    throw new Error(`Ảnh ${field} không đúng định dạng PNG, JPG, WEBP hoặc GIF.`)
  }

  await mkdir(settingsImageDirectory, { recursive: true })
  const extension = IMAGE_TYPES[match[1]]
  const fileName = `${field}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`
  await writeFile(path.join(settingsImageDirectory, fileName), Buffer.from(match[2], 'base64'))
  return `/site-settings/${fileName}`
}

const siteSettingsPlugin = () => ({
  name: 'watch-store-site-settings',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__site-settings', async (request, response, next) => {
      if (request.method !== 'POST') {
        next()
        return
      }

      try {
        const payload = await readJsonBody(request)
        const input = payload.settings || {}
        const images = payload.images || {}
        const nextSettings = {
          logoUrl: String(input.logoUrl || ''),
          bannerUrl: String(input.bannerUrl || ''),
          loginBackgroundUrl: String(input.loginBackgroundUrl || ''),
          heroEyebrow: String(input.heroEyebrow || '').trim(),
          heroTitle: String(input.heroTitle || '').trim(),
          heroDescription: String(input.heroDescription || '').trim(),
          updatedAt: new Date().toISOString(),
        }

        for (const [imageKey, settingsKey] of Object.entries({
          logo: 'logoUrl',
          banner: 'bannerUrl',
          loginBackground: 'loginBackgroundUrl',
        })) {
          if (images[imageKey]) {
            nextSettings[settingsKey] = await saveDataImage(imageKey, images[imageKey])
          }
        }

        const source = `const siteSettings = ${JSON.stringify(nextSettings, null, 2)};\n\nexport default siteSettings;\n`
        await writeFile(settingsFile, source, 'utf8')

        response.statusCode = 200
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify({ success: true, data: nextSettings }))
      } catch (error) {
        response.statusCode = 400
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify({ success: false, message: error.message }))
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteSettingsPlugin()],
})
