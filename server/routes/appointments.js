import express from 'express';
import { db } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { getActiveDataProvider } from '../providers/dataProvider.js';
import { sendAppointmentConfirmationEmail } from '../services/emailService.js';

const router = express.Router();
const dataProvider = getActiveDataProvider();

// GET /api/appointments
router.get('/', async (req, res) => {
  try {
    let appointments = [];
    try {
      appointments = await dataProvider.getAppointments(req.query);
    } catch (e) {
      appointments = db.get('appointments') || [];
    }
    res.json({ success: true, count: appointments.length, appointments });
  } catch (err) {
    const appointments = db.get('appointments') || [];
    res.json({ success: true, count: appointments.length, appointments });
  }
});

// GET /api/appointments/:id
router.get('/:id', (req, res) => {
  const appt = db.find('appointments', a => a.id === req.params.id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  res.json({ success: true, appointment: appt });
});

// POST /api/appointments (Public booking & Admin creation)
router.post('/', async (req, res) => {
  const {
    fullName,
    patientName,
    phone,
    email,
    service,
    condition,
    preferredDate,
    date,
    preferredTime,
    timeSlot,
    notes,
    status,
    source,
  } = req.body;

  const pName = fullName || patientName;
  const pDate = date || preferredDate;
  const pTime = timeSlot || preferredTime;

  if (!pName || !phone || !service) {
    return res.status(400).json({ error: 'Patient name, phone, and service are required.' });
  }

  if (email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    const cleanEmail = email.trim();
    if (!emailRegex.test(cleanEmail) || cleanEmail.includes('<') || cleanEmail.includes('>') || !cleanEmail.split('@')[1]?.includes('.')) {
      return res.status(400).json({
        error: 'Please provide a valid email address with a domain (e.g. name@example.com).',
        field: 'email',
      });
    }
  }

  const apptId = `HE-APPT-${Date.now().toString().slice(-6)}`;
  const newAppt = {
    id: apptId,
    fullName: pName,
    patientName: pName,
    phone,
    email: email || '',
    service,
    condition: condition || 'General Care',
    preferredDate: pDate || new Date().toISOString().split('T')[0],
    preferredTime: pTime || '10:00 AM',
    notes: notes || '',
    status: status || 'Pending',
    source: source || 'Website',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Find or create patient for admin appointment
  let patient = db.find('patients', p => (p.phone && p.phone === phone) || (email && p.email === email));
  if (!patient) {
    const token = `HE-${Date.now().toString().slice(-6)}`;
    patient = {
      id: `pt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: pName,
      phone,
      email: email || '',
      registrationTokenNumber: token,
      patientType: 'Standard',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await dataProvider.createPatient(patient);
    } catch (e) {
      db.insert('patients', patient);
    }
  }

  newAppt.patientId = patient.id;
  newAppt.registrationTokenNumber = patient.registrationTokenNumber;

  try {
    await dataProvider.createAppointment(newAppt);
  } catch (err) {
    db.insert('appointments', newAppt);
  }

  // Trigger confirmation email if email provided
  let emailSent = false;
  if (email) {
    try {
      const emailResult = await sendAppointmentConfirmationEmail(newAppt, patient);
      emailSent = Boolean(emailResult?.success);
    } catch (err) {
      console.warn('[AdminAppointments] Confirmation email send error:', err.message);
    }
  }

  // Auto-create lead
  const leadId = `LEAD-${Date.now().toString().slice(-6)}`;
  db.insert('leads', {
    id: leadId,
    fullName: pName,
    phone,
    email: email || '',
    condition: condition || service,
    message: notes || `Booked appointment for ${pDate} (${pTime})`,
    source: source || 'Website Booking',
    status: 'Converted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Auto-create notification
  db.insert('notifications', {
    id: `notif_${Date.now()}`,
    type: 'appointment',
    title: 'New Appointment Booking',
    message: `${pName} booked ${service} for ${pDate} (${pTime})`,
    entityId: apptId,
    entityType: 'appointment',
    link: `/admin/appointments/${apptId}`,
    status: 'unread',
    createdAt: new Date().toISOString(),
  });

  // Audit log
  db.insert('auditLogs', {
    id: `audit_${Date.now()}`,
    actor: pName,
    action: 'created',
    entity: 'appointment',
    entityId: apptId,
    description: `Patient ${pName} booked ${service} via ${source || 'Website'}`,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({ success: true, appointment: newAppt, patient, emailSent });
});

// PUT /api/appointments/:id
router.put('/:id', authenticate, (req, res) => {
  const updated = db.update('appointments', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Appointment not found' });

  db.insert('auditLogs', {
    id: `audit_${Date.now()}`,
    actor: req.user?.name || 'Admin',
    action: 'updated',
    entity: 'appointment',
    entityId: req.params.id,
    description: `Updated appointment status to ${updated.status}`,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, appointment: updated });
});

// DELETE /api/appointments/:id
router.delete('/:id', authenticate, (req, res) => {
  const deleted = db.delete('appointments', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Appointment not found' });
  res.json({ success: true, message: 'Appointment deleted successfully' });
});

export default router;
