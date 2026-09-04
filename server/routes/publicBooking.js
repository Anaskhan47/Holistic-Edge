import express from 'express';
import { getActiveDataProvider } from '../providers/dataProvider.js';
import { createBookingTransaction } from '../services/bookingService.js';
import { verifySignedBookingToken } from '../services/reminderService.js';
import { sendAppointmentConfirmationEmail } from '../services/emailService.js';
import { db } from '../db.js';

const router = express.Router();
const dataProvider = getActiveDataProvider();

const DEFAULT_TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'];

// GET /api/public/slots
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date query parameter is required' });

    let slots = await dataProvider.getBookingSlots(date);
    if (!slots || slots.length === 0) {
      slots = DEFAULT_TIME_SLOTS.map((time, idx) => ({
        id: `slot_${date}_${idx}`,
        date,
        time,
        capacity: 5,
        status: 'AVAILABLE',
      }));
    }

    const activeAppointments = await dataProvider.getAppointments({ date });

    const availableSlots = slots.map(slot => {
      const bookedCount = activeAppointments.filter(
        a => (a.slotId === slot.id || a.time === slot.time) && ['PENDING', 'CONFIRMED', 'ARRIVED', 'IN_PROGRESS'].includes(a.status)
      ).length;

      const capacity = slot.capacity || 5;
      const isAvailable = slot.status === 'AVAILABLE' && bookedCount < capacity;

      return {
        id: slot.id,
        date: slot.date,
        time: slot.time,
        capacity,
        booked: bookedCount,
        remaining: Math.max(0, capacity - bookedCount),
        isAvailable,
        status: !isAvailable ? (slot.status === 'BLOCKED' ? 'BLOCKED' : 'FULL') : 'AVAILABLE',
      };
    });

    res.json({ success: true, date, slots: availableSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/public/verify-reminder-token
router.get('/verify-reminder-token', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    const verification = verifySignedBookingToken(token);
    if (!verification.valid) {
      return res.status(400).json({ error: verification.error });
    }

    const patient = await dataProvider.getPatientById(verification.patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    res.json({
      success: true,
      patient: {
        id: patient.id,
        name: patient.name,
        phone: patient.phone,
        email: patient.email,
        registrationTokenNumber: patient.registrationTokenNumber,
      },
      reminderId: verification.reminderId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/public/book
router.post('/book', async (req, res) => {
  try {
    const { patientData, date, time, slotId, service, notes, idempotencyKey, reminderId, token } = req.body;

    let forcePatientId = req.body.useExistingPatientId || req.body.patientId || null;
    let bookingSource = 'WEBSITE_PUBLIC';

    if (token) {
      const verification = verifySignedBookingToken(token);
      if (verification.valid) {
        forcePatientId = verification.patientId;
        bookingSource = 'REMINDER_EMAIL';
      }
    }

    let resolvedPatientData = patientData || {
      name: (req.body.fullName || req.body.name || '').trim(),
      phone: (req.body.phone || '').trim(),
      email: (req.body.email || '').trim(),
      symptomDuration: req.body.symptomDuration,
    };

    if ((!resolvedPatientData.name || !resolvedPatientData.phone) && forcePatientId) {
      try {
        const existing = (await dataProvider.getPatientById(forcePatientId)) || db.find('patients', p => p.id === forcePatientId);
        if (existing) {
          resolvedPatientData = {
            name: resolvedPatientData.name || existing.name,
            phone: resolvedPatientData.phone || existing.phone,
            email: resolvedPatientData.email || existing.email,
            symptomDuration: resolvedPatientData.symptomDuration || existing.symptomDuration,
          };
        }
      } catch (err) {
        console.warn('[PublicBooking] Fallback patient resolution:', err.message);
      }
    }

    if (!resolvedPatientData.name || !resolvedPatientData.phone) {
      return res.status(400).json({ error: 'Patient full name and phone number are required.' });
    }

    if (resolvedPatientData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(resolvedPatientData.email)) {
        return res.status(400).json({
          error: 'Please provide a valid email address with a domain (e.g. name@example.com).',
          field: 'email'
        });
      }
    }

    const resolvedDate = date || req.body.selectedDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
    const resolvedTime = time || req.body.selectedSlot || '10:00 AM';

    const result = await createBookingTransaction({
      patientData: resolvedPatientData,
      date: resolvedDate,
      time: resolvedTime,
      slotId,
      service: service || 'Chiropractic Consultation',
      source: bookingSource,
      notes,
      idempotencyKey,
      forcePatientId,
    });

    if (!result.success) {
      if (result.isAmbiguous) {
        return res.status(409).json(result);
      }
      return res.status(400).json({ error: result.error || 'Failed to complete booking' });
    }

    // Convert reminder to BOOKED if originating from reminder token
    if (reminderId || (token && result.appointment)) {
      const remId = reminderId || (verifySignedBookingToken(token).reminderId);
      if (remId) {
        await dataProvider.updateReminder(remId, {
          status: 'BOOKED',
          bookedAppointmentId: result.appointment.id,
          bookedAt: new Date().toISOString(),
        });
      }
    }

    // Trigger confirmation email
    sendAppointmentConfirmationEmail(result.appointment, result.patient).catch(err => {
      console.error('[PublicBooking] Confirmation email error:', err.message);
    });

    res.status(201).json({
      success: true,
      appointment: result.appointment,
      patient: result.patient,
      registrationTokenNumber: result.patient.registrationTokenNumber,
      message: 'Booking Confirmed!',
    });
  } catch (err) {
    if (err.code === 'SLOT_FULL') {
      return res.status(409).json({ error: 'This time slot is no longer available. Please select another slot.', code: 'SLOT_FULL' });
    }
    res.status(500).json({ error: err.message || 'We couldn\'t complete your booking. Please try again.' });
  }
});

export default router;
