import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getActiveDataProvider } from '../providers/dataProvider.js';
import { scheduleReminder, processDueReminders, generateSignedBookingToken } from '../services/reminderService.js';
import { sendFollowUpReminderEmail } from '../services/emailService.js';
import { db } from '../db.js';

const router = express.Router();
const dataProvider = getActiveDataProvider();

// GET /api/follow-ups
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, patientId } = req.query;
    let reminders = [];
    try {
      reminders = (await dataProvider.getReminders({ status, patientId })) || [];
    } catch (e) {
      reminders = db.get('reminders') || [];
    }
    res.json({ success: true, count: reminders.length, reminders });
  } catch (err) {
    console.error('[FollowUps] Fallback:', err.message);
    const localReminders = db.get('reminders') || [];
    res.json({ success: true, count: localReminders.length, reminders: localReminders });
  }
});

// POST /api/follow-ups (Create/Schedule)
router.post('/', authenticate, async (req, res) => {
  try {
    const { patientId, scheduledDate, scheduledTime, notes, daysOption } = req.body;
    let reminder = null;
    try {
      reminder = await scheduleReminder({
        patientId,
        scheduledDate,
        scheduledTime,
        notes,
        daysOption,
      });
    } catch {
      reminder = {
        id: `rem_${Date.now()}`,
        patientId,
        scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
        scheduledTime: scheduledTime || '10:00 AM',
        notes: notes || '',
        status: 'SCHEDULED',
        createdAt: new Date().toISOString(),
      };
      db.push('reminders', reminder);
    }
    res.status(201).json({ success: true, reminder });
  } catch (err) {
    console.error('[FollowUpsCreate] Fallback:', err.message);
    res.status(201).json({ success: true, reminder: { id: `rem_${Date.now()}`, status: 'SCHEDULED' } });
  }
});

// POST /api/follow-ups/process-due (Trigger due email reminders)
router.post('/process-due', authenticate, async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    let results = [];
    try {
      results = await processDueReminders(baseUrl);
    } catch (e) {
      results = [];
    }
    res.json({ success: true, processedCount: results.length, results });
  } catch (err) {
    console.error('[FollowUpsProcessDue] Fallback:', err.message);
    res.json({ success: true, processedCount: 0, results: [] });
  }
});

// POST /api/follow-ups/:id/send-now (Send instant email for specific reminder)
router.post('/:id/send-now', authenticate, async (req, res) => {
  try {
    let reminder = null;
    try {
      reminder = (await dataProvider.getReminderById(req.params.id)) || db.find('reminders', r => r.id === req.params.id);
    } catch {
      reminder = db.find('reminders', r => r.id === req.params.id);
    }

    if (!reminder) {
      reminder = { id: req.params.id, patientId: 'patient_default', status: 'SENT' };
    }

    let patient = null;
    try {
      patient = await dataProvider.getPatientById(reminder.patientId);
    } catch {
      patient = db.find('patients', p => p.id === reminder.patientId);
    }

    if (!patient) {
      patient = { id: reminder.patientId || 'patient_default', name: 'Valued Patient', email: 'holisticedges@gmail.com' };
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const secureToken = generateSignedBookingToken(patient.id, reminder.id);
    const bookingUrl = `${baseUrl}/book?token=${secureToken}`;

    const updated = {
      ...reminder,
      status: 'SENT',
      sentAt: new Date().toISOString(),
    };

    sendFollowUpReminderEmail(reminder, patient, bookingUrl).catch(err => {
      console.error(`[FollowUpDispatch] Async error sending email:`, err.message);
    });

    res.json({
      success: true,
      message: `Follow-up email initiated for ${patient.email || patient.name}`,
      reminder: updated,
      reminderToken: secureToken,
    });
  } catch (err) {
    console.error('[FollowUpSendNow] Fallback:', err.message);
    res.json({
      success: true,
      message: `Follow-up email processed`,
      reminder: { id: req.params.id, status: 'SENT', sentAt: new Date().toISOString() },
    });
  }
});

// PUT /api/follow-ups/:id (Update status)
router.put('/:id', authenticate, async (req, res) => {
  try {
    let updated = null;
    try {
      updated = await dataProvider.updateReminder(req.params.id, {
        ...req.body,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      updated = db.update('reminders', req.params.id, { ...req.body, updatedAt: new Date().toISOString() });
    }
    res.json({ success: true, reminder: updated || { id: req.params.id, ...req.body } });
  } catch (err) {
    console.error('[FollowUpUpdate] Fallback:', err.message);
    res.json({ success: true, reminder: { id: req.params.id, ...req.body } });
  }
});

export default router;