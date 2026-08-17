import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('samvidhan_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('samvidhan_token') || null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);

  // Sync token into API client whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('samvidhan_token', token);
      apiService.setAuthToken(token);
    } else {
      localStorage.removeItem('samvidhan_token');
      apiService.setAuthToken(null);
    }
  }, [token]);

  // Sync user object
  useEffect(() => {
    if (user) {
      localStorage.setItem('samvidhan_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('samvidhan_user');
    }
  }, [user]);

  const openLogin = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiService.login(email, password);
      setToken(data.access_token);
      
      // Merge local points if any
      const localPts = Number(localStorage.getItem('samvidhan_points') || '0');
      const finalUser = {
        ...data.user,
        total_points: Math.max(data.user.total_points || 0, localPts),
      };
      
      setUser(finalUser);
      closeAuthModal();
      return { success: true, user: finalUser };
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Login failed. Please check your credentials.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, preferred_language = 'en', preferred_mode = 'simple') => {
    setLoading(true);
    try {
      const data = await apiService.register({
        name,
        email,
        password,
        preferred_language,
        preferred_mode,
      });
      setToken(data.access_token);

      // Preserve local guest progress
      const localPts = Number(localStorage.getItem('samvidhan_points') || '125');
      const finalUser = {
        ...data.user,
        total_points: (data.user.total_points || 0) + localPts,
      };

      setUser(finalUser);
      closeAuthModal();
      return { success: true, user: finalUser };
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Registration failed.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('samvidhan_token');
    localStorage.removeItem('samvidhan_user');
  };

  const updateUserProfile = async (updatedFields) => {
    if (!token) {
      setUser(prev => ({ ...prev, ...updatedFields }));
      return;
    }
    try {
      const updated = await apiService.updatePreferences(updatedFields);
      setUser(prev => ({ ...prev, ...updated }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addPoints = (points) => {
    const updated = apiService.addLocalPoints(points);
    setUser(prev => prev ? { ...prev, total_points: (prev.total_points || 0) + points } : null);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        authModalOpen,
        authModalMode,
        setAuthModalMode,
        openLogin,
        openRegister,
        closeAuthModal,
        login,
        register,
        logout,
        updateUserProfile,
        addPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
