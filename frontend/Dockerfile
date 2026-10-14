# ==============================================================================
# Frontend Dockerfile for Render Web Service or Docker Container
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build React/Vite SPA
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (cached if package files don't change)
COPY package*.json ./
RUN npm ci || npm install

# Copy source code
COPY . .

# Pass backend API URL at build time (e.g. --build-arg VITE_API_URL=https://your-backend.onrender.com/api)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build production bundle to /app/dist
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Serve with lightweight Nginx Alpine
# ------------------------------------------------------------------------------
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx files
RUN rm -rf ./*

# Copy built frontend assets
COPY --from=builder /app/dist .

# Copy nginx template (Render assigns dynamic PORT, nginx will substitute it via envsubst)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Default port 80 (Render overrides PORT automatically)
ENV PORT=80
EXPOSE ${PORT}

CMD ["nginx", "-g", "daemon off;"]
