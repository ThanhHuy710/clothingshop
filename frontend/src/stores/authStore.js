import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const customStorage = {
  getItem: (name) => {
    try {
      const isRemembered = localStorage.getItem('admin_remember_me') === 'true';
      if (isRemembered) {
        const localVal = localStorage.getItem(name);
        if (localVal) return localVal;
      }
      const sessionVal = sessionStorage.getItem(name);
      if (sessionVal) return sessionVal;
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      const isRemembered = localStorage.getItem('admin_remember_me') === 'true';
      if (isRemembered) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name);
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name);
      }
    } catch (e) {
      console.warn('Could not persist auth state:', e);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
      sessionStorage.removeItem(name);
    } catch (e) {
      console.warn('Could not remove auth state:', e);
    }
  },
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token, rememberMe = false) => {
        if (rememberMe) {
          localStorage.setItem('admin_remember_me', 'true');
          localStorage.setItem('token', token);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('auth-storage');
        } else {
          localStorage.removeItem('admin_remember_me');
          localStorage.removeItem('token');
          localStorage.removeItem('auth-storage');
          sessionStorage.setItem('token', token);
        }
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin_remember_me');
        localStorage.removeItem('auth-storage');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('auth-storage');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);

