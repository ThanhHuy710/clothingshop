import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const isRemembered = localStorage.getItem('admin_remember_me') === 'true';
    const token = (isRemembered ? localStorage.getItem('token') : null) ||
      sessionStorage.getItem('token') ||
      localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // If request payload is FormData, remove Content-Type to allow browser boundary calculation
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized: Token may be invalid or expired.');
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('admin_remember_me');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('auth-storage');

      // Only redirect if current path is in admin and not already on login page
      if (
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login'
      ) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
