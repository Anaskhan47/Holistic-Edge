import '../server/env.js';
import express from 'express';
import cors from 'cors';
import authRoutes from '../server/routes/auth.js';
import appointmentRoutes from '../server/routes/appointments.js';
import leadRoutes from '../server/routes/leads.js';
import bookingSlotRoutes from '../server/routes/bookingSlots.js';
import cmsRoutes from '../server/routes/cms.js';
import reviewRoutes from '../server/routes/reviews.js';
import notificationRoutes from '../server/routes/notifications.js';
import auditLogRoutes from '../server/routes/auditLogs.js';
import systemHealthRoutes from '../server/routes/systemHealth.js';
import patientRoutes from '../server/routes/patients.js';
import followUpRoutes from '../server/routes/followUps.js';
import emailRoutes from '../server/routes/email.js';
import publicBookingRoutes from '../server/routes/publicBooking.js';
import mediaRoutes from '../server/routes/media.js';
import integrationRoutes from '../server/routes/integrations.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    clinic: 'Holistic Edge Chiropractic & Wellness Clinic',
    founder: 'Healer Abdul Mallik',
    timestamp: new Date().toISOString(),
  });
});

// System Health endpoint
app.use('/api/system-health', systemHealthRoutes);
app.use('/api/integrations', integrationRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/booking-slots', bookingSlotRoutes);
app.use('/api/follow-ups', followUpRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/public', publicBookingRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// 404 Handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
