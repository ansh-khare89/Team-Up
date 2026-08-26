'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  switchDemoUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const res = await api.getMe();
      setUser(res.user);
    } catch (err) {
      if (typeof window !== 'undefined') localStorage.setItem('teamup_token', 'user-anshk');
      try {
        const res = await api.getMe();
        setUser(res.user);
      } catch (e) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    if (typeof window !== 'undefined') localStorage.setItem('teamup_token', res.token);
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    if (typeof window !== 'undefined') localStorage.setItem('teamup_token', res.token);
    setUser(res.user);
  };

  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('teamup_token');
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const switchDemoUser = async (userId: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('teamup_token', userId);
    await fetchMe();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, switchDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
