// client/src/services/api.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Don't unwrap here — let each service handle its own response shape
api.interceptors.response.use(
  (response) => response,  // ← was response.data, now just response
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // ✅ Reject with full error so authService can read error.response.data.message
    return Promise.reject(error);
  }
);

export default api;