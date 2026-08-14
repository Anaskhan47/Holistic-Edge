import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AdminUser } from '../types/admin.types';
import { sessionStorage_admin, userStorage, seedDemoData } from '../services/adminStorage';

interface AdminAuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize: seed demo data and check existing session
  useEffect(() => {
    seedDemoData();
    userStorage.getAll(); // ensure default user exists

    const session = sessionStorage_admin.getSession();
    if (session) {
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate async (ready for real API swap)
      await new Promise(r => setTimeout(r, 400));
      const loggedInUser = sessionStorage_admin.login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: 'Invalid email or password.' };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage_admin.logout();
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
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
