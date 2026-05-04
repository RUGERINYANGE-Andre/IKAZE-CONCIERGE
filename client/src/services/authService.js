// client/src/services/authService.js

import api from './api';

export const authService = {
  // Register client
  register: async (userData) => {
    const response = await api.post('/auth/register/client', userData);
    return response.data.data;
  },

  // Register admin
  registerAdmin: async (userData) => {
    const response = await api.post('/auth/register/admin', userData);
    return response.data.data;
  },

  // Login
  login: async (credentials, isAdmin = false) => {
    const endpoint = isAdmin ? '/auth/login/admin' : '/auth/login/client';
    const response = await api.post(endpoint, credentials);
    return response.data.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
};