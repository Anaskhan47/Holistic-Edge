import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AdminUser } from '../types/admin.types';
import { sessionStorage_admin, userStorage, seedDemoData } from '../services/adminStorage';

interface AdminAuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string; error: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize: verify existing session with backend or local session
  useEffect(() => {
    seedDemoData();
    userStorage.getAll();

    async function checkAuthSession() {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              setUser(data.user);
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('Backend session verification fallback to local storage:', e);
        }
      }

      const session = sessionStorage_admin.getSession();
      if (session) {
        setUser(session.user);
      }
      setIsLoading(false);
    }

    checkAuthSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
          localStorage.setItem('admin_user', JSON.stringify(data.user));
        }
        setUser(data.user);
        setIsLoading(false);
        return { success: true };
      }

      // Offline / fallback login
      const localUser = sessionStorage_admin.login(email, password);
      if (localUser) {
        setUser(localUser);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: data.error || 'Invalid email or password.' };
    } catch (err: any) {
      // Local fallback on network error
      const localUser = sessionStorage_admin.login(email, password);
      if (localUser) {
        setUser(localUser);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.warn('Logout API error:', e);
      }
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage_admin.logout();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message || 'Password reset email sent.' };
      }
      return { success: false, error: data.error || 'Failed to send password reset.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send password reset.' };
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      resetPassword,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
