import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminStoreProvider } from './context/AdminStoreContext';
import { AdminShell } from './components/shell/AdminShell';
import { LoginPage } from './pages/login/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AppointmentsPage } from './pages/appointments/AppointmentsPage';
import { AppointmentDetailPage } from './pages/appointments/AppointmentDetailPage';
import { AppointmentForm } from './pages/appointments/AppointmentForm';
import { LeadsPage } from './pages/leads/LeadsPage';
import { LeadDetailPage } from './pages/leads/LeadDetailPage';
import { LeadForm } from './pages/leads/LeadForm';
import { TestimonialsPage } from './pages/testimonials/TestimonialsPage';
import { TestimonialForm } from './pages/testimonials/TestimonialForm';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { AuditLogsPage } from './pages/audit-logs/AuditLogsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { UsersPage } from './pages/users/UsersPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { ServicesPage } from './pages/services/ServicesPage';
import { ConditionsPage } from './pages/conditions/ConditionsPage';
import { FaqPage } from './pages/faq/FaqPage';
import { TeamPage } from './pages/team/TeamPage';
import { ClinicPage } from './pages/clinic/ClinicPage';
import { MediaPage } from './pages/media/MediaPage';
import { GoogleReviewsPage } from './pages/reviews/GoogleReviewsPage';
import { Loader2 } from 'lucide-react';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <Loader2 className="animate-spin text-[#0F2747]" size={24} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminStoreProvider>
        <Routes>
          {/* Public Login Route */}
          <Route path="login" element={<LoginPage />} />

          {/* Protected Admin Routes inside AdminShell */}
          <Route
            path="/*"
            element={
              <ProtectedAdminRoute>
                <AdminShell />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Appointments */}
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="appointments/new" element={<AppointmentForm />} />
            <Route path="appointments/:id" element={<AppointmentDetailPage />} />

            {/* Leads */}
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/new" element={<LeadForm />} />
            {/* Testimonials & Google Reviews */}
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="testimonials/new" element={<TestimonialForm />} />
            <Route path="reviews/google" element={<GoogleReviewsPage />} />

            {/* Content */}
            <Route path="services" element={<ServicesPage />} />
            <Route path="conditions" element={<ConditionsPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="clinic" element={<ClinicPage />} />
            <Route path="media" element={<MediaPage />} />

            {/* Insights & System */}
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />

            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </AdminStoreProvider>
    </AdminAuthProvider>
  );
}
