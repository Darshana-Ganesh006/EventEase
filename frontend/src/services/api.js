import axios from 'axios';

// Determine API Base URL:
// In local development, default to local Spring Boot (http://localhost:8080/api).
// In production (e.g. GitHub Pages), do NOT use localhost; use VITE_API_BASE_URL if configured.
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (import.meta.env.DEV || isLocalhost) {
    return 'http://localhost:8080/api';
  }
  return '';
};

const API_BASE_URL = getApiBaseUrl();

export const isBackendConnected = () => Boolean(API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Authorization header
api.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL) {
      return Promise.reject(
        new Error('Backend server is not configured for this online deployment. Please deploy the Spring Boot backend online and set VITE_API_BASE_URL, or test locally with the local backend.')
      );
    }
    const token = localStorage.getItem('eventease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors and handle expired tokens
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on a protected route, remove stale token
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        localStorage.removeItem('eventease_token');
        localStorage.removeItem('eventease_user');
      }
    }
    let message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    if (message === 'Network Error' && typeof window !== 'undefined' && window.location.protocol === 'https:' && (!API_BASE_URL || API_BASE_URL.startsWith('http://localhost'))) {
      message = 'Backend is not reachable over HTTPS. For online functionality on GitHub Pages, deploy the Spring Boot backend online and set VITE_API_BASE_URL.';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
