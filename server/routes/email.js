import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getActiveEmailProvider } from '../providers/emailProvider.js';
import { db } from '../db.js';

const router = express.Router();
const emailProvider = getActiveEmailProvider();

// GET /api/email/logs
router.get('/logs', authenticate, (req, res) => {
  const logs = db.get('emailLogs') || [];
  res.json({ success: true, count: logs.length, logs, emailLogs: logs });
});

// GET /api/email/templates
router.get('/templates', authenticate, (req, res) => {
  const templates = db.get('emailTemplates') || [
    {
      id: 'APPOINTMENT_CONFIRMATION',
      name: 'Booking Confirmation Email',
      subject: 'Appointment Confirmed - {{registrationTokenNumber}} | Holistic Edge',
      type: 'TRANSACTIONAL',
    },
    {
      id: 'FOLLOW_UP_REMINDER',
      name: 'Follow-up Health Reminder',
      subject: 'Follow-up Health Reminder - {{registrationTokenNumber}} | Holistic Edge',
      type: 'REMINDER',
    },
    {
      id: 'CANCELLATION',
      name: 'Appointment Cancellation Notice',
      subject: 'Appointment Cancellation Notice - {{registrationTokenNumber}} | Holistic Edge',
      type: 'TRANSACTIONAL',
    },
  ];
  res.json({ success: true, templates });
});

// POST /api/email/retry/:id
router.post('/retry/:id', authenticate, async (req, res) => {
  try {
    const log = db.find('emailLogs', l => l.id === req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Email log record not found' });
    }

    const result = await emailProvider.sendEmail({
      to: log.recipient,
      subject: log.subject,
      html: log.html || `<p>${log.subject}</p>`,
      text: log.text || log.subject,
      idempotencyKey: `retry_${log.id}_${Date.now()}`,
    });

    db.update('emailLogs', log.id, {
      status: 'SENT',
      sentAt: new Date().toISOString(),
      providerMessageId: result.providerMessageId,
      failureReason: null,
    });

    if (log.appointmentId) {
      db.update('appointments', log.appointmentId, { emailStatus: 'SENT' });
    }

    res.json({ success: true, message: 'Email successfully retried and sent.', providerMessageId: result.providerMessageId });
  } catch (err) {
    db.update('emailLogs', req.params.id, {
      failedAt: new Date().toISOString(),
      failureReason: err.message,
    });
    res.status(500).json({ error: err.message });
  }
});

export default router;
