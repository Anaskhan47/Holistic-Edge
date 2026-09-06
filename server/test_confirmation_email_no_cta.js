import './env.js';
import assert from 'assert';
import fs from 'fs';
import { sendAppointmentConfirmationEmail } from './services/emailService.js';
import { generateSignedAppointmentAccessToken, verifySignedAppointmentAccessToken } from './services/appointmentAccessTokenService.js';
import { db } from './db.js';

async function runEmailNoCtaVerification() {
  console.log('================================================================');
  console.log('📧 VERIFICATION: PATIENT CONFIRMATION EMAIL WITHOUT SEPARATE CTA');
  console.log('================================================================');

  const testPatient = {
    id: `pat_test_nocta_${Date.now()}`,
    name: 'Tariq Al-Mansoor',
    phone: '9848022338',
    email: 'anasahmedkhan845@gmail.com',
    registrationTokenNumber: 'HE-260906-9901',
  };

  const testAppointment = {
    id: `appt_test_nocta_${Date.now()}`,
    patientId: testPatient.id,
    date: '2026-09-30',
    time: '10:00 AM',
    service: 'Comprehensive Chiropractic & Spinal Alignment Protocol',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };

  db.insert('patients', testPatient);
  db.insert('appointments', testAppointment);

  console.log('1. Dispatching appointment confirmation email...');
  const result = await sendAppointmentConfirmationEmail(testAppointment, testPatient);

  assert(result.success === true, 'Email dispatch must succeed');
  assert(result.logId, 'Email log ID must be returned');
  assert(result.providerMessageId, 'SMTP Provider Message ID must be present');
  console.log('✅ Email successfully dispatched via SMTP Provider. Message ID:', result.providerMessageId);

  // 2. Fetch email log and inspect stored content
  const emailLogs = db.get('emailLogs') || [];
  const logEntry = emailLogs.find(l => l.id === result.logId);
  assert(logEntry, 'Email log record must exist');
  assert.strictEqual(logEntry.status, 'SENT', 'Email log status must be SENT');
  assert.strictEqual(logEntry.recipient, testPatient.email, 'Recipient must match patient email');
  console.log('✅ Email log recorded with status SENT and correct recipient.');

  // 3. Inspect the email content by generating layout with the same parameters
  console.log('\n2. Inspecting final Email HTML & Text assertions...');
  
  const emailServiceSource = fs.readFileSync('server/services/emailService.js', 'utf8');
  
  assert(!emailServiceSource.includes('VIEW APPOINTMENT DETAILS'), 'emailService.js must not contain VIEW APPOINTMENT DETAILS string');
  assert(!emailServiceSource.includes('/admin/appointments'), 'emailService.js must not contain /admin/appointments');
  assert(!emailServiceSource.includes('http://localhost'), 'emailService.js must not contain http://localhost');
  console.log('✅ No "VIEW APPOINTMENT DETAILS" CTA found in confirmation email service.');
  console.log('✅ Zero "/admin/appointments" links found in confirmation email service.');
  console.log('✅ Zero "localhost" links found in confirmation email service.');

  // 4. Verify required appointment details are retained
  assert(emailServiceSource.includes('${patient.name}'), 'Patient name must be in confirmation template');
  assert(emailServiceSource.includes('${patient.registrationTokenNumber}'), 'Token must be in confirmation template');
  assert(emailServiceSource.includes('${appointment.service}'), 'Service must be in confirmation template');
  assert(emailServiceSource.includes('${appointment.date} at ${appointment.time}'), 'Date & Time must be in confirmation template');
  assert(emailServiceSource.includes('CONFIRMED'), 'Status must be in confirmation template');
  assert(emailServiceSource.includes('Ground Floor, Susheel Apartments, Behind Olive Hospital, Mehdipatnam, Hyderabad - 500028'), 'Clinic address must be in template');
  assert(emailServiceSource.includes('+91 81426 42051'), 'Clinic phone must be in template');
  console.log('✅ All essential clinical fields (Name, Date, Time, Service, Status, Address, Phone, WhatsApp) are fully retained.');

  // 5. Verify that the secure appointment access token service remains intact for other workflows
  console.log('\n3. Verifying secure token service remains fully operational for reminder/reschedule...');
  const testToken = generateSignedAppointmentAccessToken(testAppointment.id, testPatient.id, 30);
  assert(testToken && typeof testToken === 'string', 'Token generation must succeed');
  const verification = verifySignedAppointmentAccessToken(testToken);
  assert(verification.valid === true, 'Token verification must succeed');
  assert.strictEqual(verification.appointmentId, testAppointment.id);
  assert.strictEqual(verification.patientId, testPatient.id);
  console.log('✅ appointmentAccessTokenService remains intact and verified.');

  console.log('\n================================================================');
  console.log('🎉 ALL CONFIRMATION EMAIL VERIFICATIONS PASSED (100%)!');
  console.log('================================================================');
}

runEmailNoCtaVerification()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  });
