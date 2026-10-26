import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('eventease_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('eventease_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('eventease_token');
      if (savedToken) {
        try {
          const profile = await authService.getCurrentUser();
          setUser(profile);
          localStorage.setItem('eventease_user', JSON.stringify(profile));
        } catch {
          // Token is invalid or expired
          localStorage.removeItem('eventease_token');
          localStorage.removeItem('eventease_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const authData = await authService.login({ email, password });
    localStorage.setItem('eventease_token', authData.token);
    localStorage.setItem('eventease_user', JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
    return authData.user;
  };

  const register = async (formData) => {
    const authData = await authService.register(formData);
    localStorage.setItem('eventease_token', authData.token);
    localStorage.setItem('eventease_user', JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
    return authData.user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isOrganiser: user?.role === 'ORGANISER',
    isStudent: user?.role === 'STUDENT',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
