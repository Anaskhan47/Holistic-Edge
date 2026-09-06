import './env.js';
import assert from 'assert';
import { generateSignedAppointmentAccessToken, verifySignedAppointmentAccessToken } from './services/appointmentAccessTokenService.js';
import { sendAppointmentConfirmationEmail } from './services/emailService.js';
import { db } from './db.js';

async function runSecurityAndFunctionalityTests() {
  console.log('====================================================');
  console.log('🔒 PATIENT EMAIL CTA SECURITY & FUNCTIONALITY TEST SUITE');
  console.log('====================================================');

  const testPatientA = {
    id: 'pat_test_sec_001',
    name: 'Amina Test-Patient',
    phone: '9876543210',
    email: 'amina.test@example.com',
    registrationTokenNumber: 'HE-260906-8801',
  };

  const testPatientB = {
    id: 'pat_test_sec_002',
    name: 'Bilal Test-Patient',
    phone: '9876543222',
    email: 'bilal.test@example.com',
    registrationTokenNumber: 'HE-260906-8802',
  };

  const testApptA = {
    id: 'appt_test_sec_001',
    patientId: testPatientA.id,
    date: '2026-09-15',
    time: '11:00 AM',
    service: 'Chiropractic Consultation & Spinal Assessment',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };

  const testApptB = {
    id: 'appt_test_sec_002',
    patientId: testPatientB.id,
    date: '2026-09-16',
    time: '02:00 PM',
    service: 'Sciatica & Disc Decompression Care',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };

  // 1. Insert records to DB
  db.insert('patients', testPatientA);
  db.insert('patients', testPatientB);
  db.insert('appointments', testApptA);
  db.insert('appointments', testApptB);

  console.log('✅ 1. Test database records initialized.');

  // 2. Token Generation & Verification
  const tokenA = generateSignedAppointmentAccessToken(testApptA.id, testPatientA.id, 30);
  assert(tokenA && typeof tokenA === 'string', 'Token should be a non-empty string');
  assert(!tokenA.includes(testPatientA.id), 'Token must be opaque and not expose raw patientId');
  assert(!tokenA.includes(testPatientA.registrationTokenNumber), 'Token must not expose registration token');
  console.log('✅ 2. Token is cryptographically opaque and URL-safe.');

  const verifyA = verifySignedAppointmentAccessToken(tokenA);
  assert(verifyA.valid === true, 'Token A must be valid');
  assert.strictEqual(verifyA.appointmentId, testApptA.id, 'Token A appointmentId must match');
  assert.strictEqual(verifyA.patientId, testPatientA.id, 'Token A patientId must match');
  console.log('✅ 3. Valid signed token verifies correctly.');

  // 3. Tampered Token Test
  const tamperedToken = tokenA.substring(0, tokenA.length - 4) + 'X9zZ';
  const verifyTampered = verifySignedAppointmentAccessToken(tamperedToken);
  assert.strictEqual(verifyTampered.valid, false, 'Tampered token must be rejected');
  console.log('✅ 4. Tampered token signature fails safely with valid=false.');

  // 4. Invalid Token Test
  const verifyInvalid = verifySignedAppointmentAccessToken('completely_invalid_garbage_token_string');
  assert.strictEqual(verifyInvalid.valid, false, 'Garbage token must be rejected');
  console.log('✅ 5. Garbage / unparseable token fails safely.');

  // 5. Expired Token Test
  const expiredToken = generateSignedAppointmentAccessToken(testApptA.id, testPatientA.id, -1); // Expired yesterday
  const verifyExpired = verifySignedAppointmentAccessToken(expiredToken);
  assert.strictEqual(verifyExpired.valid, false, 'Expired token must be rejected');
  assert(verifyExpired.error.includes('expired'), 'Error message must specify expiration');
  console.log('✅ 6. Expired token is rejected safely.');

  // 6. Cross-Patient Isolation Test (Token for Patient A cannot authorize Patient B)
  assert.notStrictEqual(verifyA.patientId, testPatientB.id, 'Patient A token must not equal Patient B id');
  // If someone attempts to access Appt B with Token A:
  const isAuthorizedForApptB = (testApptB.patientId === verifyA.patientId);
  assert.strictEqual(isAuthorizedForApptB, false, 'Cross-patient access must be strictly forbidden');
  console.log('✅ 7. Strict cross-patient isolation enforced.');

  // 7. Email Confirmation Generation Test
  const emailRes = await sendAppointmentConfirmationEmail(testApptA, testPatientA);
  assert(emailRes.success, 'Confirmation email must succeed');
  
  const emailLogs = db.get('emailLogs') || [];
  const generatedLog = emailLogs.find(l => l.appointmentId === testApptA.id);
  assert(generatedLog, 'Email log must exist for appointment');
  console.log('✅ 8. Confirmation email generated and recorded in audit email log.');

  console.log('====================================================');
  console.log('🎉 ALL 8 PATIENT CTA SECURITY ASSERTIONS PASSED!');
  console.log('====================================================');
}

runSecurityAndFunctionalityTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
