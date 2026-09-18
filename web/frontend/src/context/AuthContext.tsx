import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { ApiClient } from '../services/api';
import { sound } from '../utils/sound';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  verifyOtp: (email: string, code: string) => Promise<any>;
  resendOtp: (email: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isVerified: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('jarvis_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const userData = await ApiClient.getMe();
      setUser(userData);
    } catch {
      setUser(null);
      ApiClient.clearToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    const res = await ApiClient.login(credentials);
    if (res.access_token) {
      ApiClient.setToken(res.access_token);
    }
    if (res.user) {
      setUser(res.user);
    }
    sound.playAccessGranted();
    return res;
  };

  const register = async (data: any) => {
    const res = await ApiClient.register(data);
    if (res.access_token && res.status !== 'PENDING_VERIFICATION') {
      ApiClient.setToken(res.access_token);
      setUser(res.user);
      sound.playAccessGranted();
    } else {
      sound.playProcessing();
    }
    return res;
  };

  const verifyOtp = async (email: string, code: string) => {
    const res = await ApiClient.verifyOtp(email, code);
    if (res.access_token) {
      ApiClient.setToken(res.access_token);
      setUser(res.user);
      sound.playAccessGranted();
    }
    return res;
  };

  const resendOtp = async (email: string) => {
    const res = await ApiClient.resendOtp(email);
    sound.playClick();
    return res;
  };

  const logout = async () => {
    try {
      await ApiClient.logout();
    } catch {}
    setUser(null);
    sound.playAlert();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isVerified: user?.status === 'VERIFIED',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
