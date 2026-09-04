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
import { BookingSlotsPage } from './pages/booking-slots/BookingSlotsPage';
import { PatientsPage } from './pages/patients/PatientsPage';
import { FollowUpsPage } from './pages/followups/FollowUpsPage';
import { LeadsPage } from './pages/leads/LeadsPage';
import { LeadDetailPage } from './pages/leads/LeadDetailPage';
import { LeadForm } from './pages/leads/LeadForm';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { AuditLogsPage } from './pages/audit-logs/AuditLogsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { UsersPage } from './pages/users/UsersPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { ServicesPage } from './pages/services/ServicesPage';
import { ServiceFormPage } from './pages/services/ServiceFormPage';
import { ConditionsPage } from './pages/conditions/ConditionsPage';
import { ConditionFormPage } from './pages/conditions/ConditionFormPage';
import { FaqPage } from './pages/faq/FaqPage';
import { FaqFormPage } from './pages/faq/FaqFormPage';
import { TeamPage } from './pages/team/TeamPage';
import { TeamFormPage } from './pages/team/TeamFormPage';
import { ClinicPage } from './pages/clinic/ClinicPage';
import { MediaPage } from './pages/media/MediaPage';
import { OffersPage } from './pages/offers/OffersPage';
import { OfferFormPage } from './pages/offers/OfferFormPage';
import { GoogleReviewsPage } from './pages/reviews/GoogleReviewsPage';
import { SystemHealthPage } from './pages/system/SystemHealthPage';
import { EmailCenterPage } from './pages/email/EmailCenterPage';
import { IntegrationsPage } from './pages/integrations/IntegrationsPage';
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

            {/* Booking Slots */}
            <Route path="booking-slots" element={<BookingSlotsPage />} />
            <Route path="slots" element={<BookingSlotsPage />} />

            {/* Patients Directory */}
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:id" element={<PatientsPage />} />

            {/* Follow-up Reminders */}
            <Route path="follow-ups" element={<FollowUpsPage />} />

            {/* Leads */}
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/new" element={<LeadForm />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />

            {/* Content (Active CMS Modules) */}
            <Route path="offers" element={<OffersPage />} />
            <Route path="offers/new" element={<OfferFormPage />} />
            <Route path="offers/:id" element={<OfferFormPage />} />

            <Route path="reviews" element={<GoogleReviewsPage />} />
            <Route path="google-reviews" element={<GoogleReviewsPage />} />

            <Route path="services" element={<ServicesPage />} />
            <Route path="services/new" element={<ServiceFormPage />} />
            <Route path="services/:id" element={<ServiceFormPage />} />

            <Route path="conditions" element={<ConditionsPage />} />
            <Route path="conditions/new" element={<ConditionFormPage />} />
            <Route path="conditions/:id" element={<ConditionFormPage />} />

            <Route path="faq" element={<FaqPage />} />
            <Route path="faq/new" element={<FaqFormPage />} />
            <Route path="faq/:id" element={<FaqFormPage />} />

            <Route path="team" element={<TeamPage />} />
            <Route path="team/new" element={<TeamFormPage />} />
            <Route path="team/:id" element={<TeamFormPage />} />

            <Route path="clinic" element={<ClinicPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="media-library" element={<MediaPage />} />

            {/* System & Operations */}
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="system-health" element={<SystemHealthPage />} />
            <Route path="system" element={<SystemHealthPage />} />
            <Route path="email" element={<EmailCenterPage />} />
            <Route path="email-logs" element={<EmailCenterPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="staff" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="audit" element={<AuditLogsPage />} />

            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </AdminStoreProvider>
    </AdminAuthProvider>
  );
}
