import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type {
  AdminAppointment,
  AdminLead,
  AdminTestimonial,
  AdminNotification,
  AuditEntry,
  DashboardMetrics,
  ToastMessage,
  ToastType,
} from '../types/admin.types';
import {
  appointmentStorage,
  leadStorage,
  testimonialStorage,
  notificationStorage,
  auditStorage,
  computeDashboardMetrics,
} from '../services/adminStorage';
import { useAdminAuth } from './AdminAuthContext';

interface AdminStoreContextValue {
  // Appointments
  appointments: AdminAppointment[];
  refreshAppointments: () => void;
  // Leads
  leads: AdminLead[];
  refreshLeads: () => void;
  // Testimonials
  testimonials: AdminTestimonial[];
  refreshTestimonials: () => void;
  // Notifications
  notifications: AdminNotification[];
  unreadCount: number;
  refreshNotifications: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  // Audit
  auditEntries: AuditEntry[];
  logAudit: (action: string, entity: string, entityId: string, description: string, metadata?: Record<string, unknown>) => void;
  // Dashboard
  metrics: DashboardMetrics;
  refreshMetrics: () => void;
  // Toast
  toasts: ToastMessage[];
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const AdminStoreContext = createContext<AdminStoreContextValue | null>(null);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAdminAuth();

  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    todayAppointments: 0,
    upcomingAppointments: 0,
    newLeads: 0,
    pendingFollowUps: 0,
    unreadNotifications: 0,
    pendingTestimonials: 0,
    cancelledToday: 0,
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshAppointments = useCallback(() => {
    setAppointments(appointmentStorage.getAll());
  }, []);

  const refreshLeads = useCallback(() => {
    setLeads(leadStorage.getAll());
  }, []);

  const refreshTestimonials = useCallback(() => {
    setTestimonials(testimonialStorage.getAll());
  }, []);

  const refreshNotifications = useCallback(() => {
    setNotifications(notificationStorage.getAll());
  }, []);

  const refreshMetrics = useCallback(() => {
    setMetrics(computeDashboardMetrics());
  }, []);

  // Load all data on mount / auth change
  useEffect(() => {
    if (user) {
      refreshAppointments();
      refreshLeads();
      refreshTestimonials();
      refreshNotifications();
      setAuditEntries(auditStorage.getAll());
      refreshMetrics();
    }
  }, [user, refreshAppointments, refreshLeads, refreshTestimonials, refreshNotifications, refreshMetrics]);

  const markNotificationRead = useCallback((id: string) => {
    notificationStorage.markRead(id);
    refreshNotifications();
    refreshMetrics();
  }, [refreshNotifications, refreshMetrics]);

  const markAllNotificationsRead = useCallback(() => {
    notificationStorage.markAllRead();
    refreshNotifications();
    refreshMetrics();
  }, [refreshNotifications, refreshMetrics]);

  const logAudit = useCallback((
    action: string,
    entity: string,
    entityId: string,
    description: string,
    metadata?: Record<string, unknown>
  ) => {
    const entry = auditStorage.log({
      actor: user?.name ?? 'Unknown',
      actorId: user?.id ?? 'unknown',
      action,
      entity,
      entityId,
      description,
      metadata,
    });
    setAuditEntries(prev => [entry, ...prev]);
  }, [user]);

  const showToast = useCallback((type: ToastType, title: string, message?: string, duration = 4000) => {
    const id = `toast_${Date.now()}`;
    const toast: ToastMessage = { id, type, title, message, duration };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration + 300);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <AdminStoreContext.Provider value={{
      appointments,
      refreshAppointments,
      leads,
      refreshLeads,
      testimonials,
      refreshTestimonials,
      notifications,
      unreadCount,
      refreshNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      auditEntries,
      logAudit,
      metrics,
      refreshMetrics,
      toasts,
      showToast,
      dismissToast,
    }}>
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useAdminStore must be used within AdminStoreProvider');
  return ctx;
}
