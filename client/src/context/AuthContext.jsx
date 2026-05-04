// client/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, isAdmin = false) => {
    try {
      const data = await authService.login(credentials, isAdmin);
      if (!data?.token) throw new Error('No token received');
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  };

  // ✅ Register client
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (!data?.token) throw new Error('No token received');
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  // ✅ Register admin
  const registerAdmin = async (userData) => {
    try {
      const data = await authService.registerAdmin(userData);
      if (!data?.token) throw new Error('No token received');
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    registerAdmin,
    logout,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};