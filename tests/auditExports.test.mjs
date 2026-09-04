import test from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('HE-QA-01: Backend services and route modules must resolve all exports without startup crash', async (t) => {
  // Test emailService exports
  const emailServicePath = pathToFileURL(path.resolve('server/services/emailService.js')).href;
  const emailService = await import(emailServicePath);

  assert.ok(
    typeof emailService.sendAppointmentConfirmationEmail === 'function',
    'emailService must export sendAppointmentConfirmationEmail as a function'
  );

  // Both named export and alias must be available to prevent caller mismatch
  assert.ok(
    typeof emailService.sendAppointmentConfirmation === 'function',
    'emailService must export sendAppointmentConfirmation alias for backward compatibility'
  );

  assert.ok(
    typeof emailService.sendFollowUpReminderEmail === 'function',
    'emailService must export sendFollowUpReminderEmail as a function'
  );

  // Test bookingService exports
  const bookingServicePath = pathToFileURL(path.resolve('server/services/bookingService.js')).href;
  const bookingService = await import(bookingServicePath);

  assert.ok(
    typeof bookingService.createBookingTransaction === 'function',
    'bookingService must export createBookingTransaction'
  );

  // Test patientService exports
  const patientServicePath = pathToFileURL(path.resolve('server/services/patientService.js')).href;
  const patientService = await import(patientServicePath);

  assert.ok(
    typeof patientService.findOrCreatePatient === 'function',
    'patientService must export findOrCreatePatient'
  );

  // Test reminderService exports
  const reminderServicePath = pathToFileURL(path.resolve('server/services/reminderService.js')).href;
  const reminderService = await import(reminderServicePath);

  assert.ok(
    typeof reminderService.generateSignedBookingToken === 'function',
    'reminderService must export generateSignedBookingToken'
  );
  assert.ok(
    typeof reminderService.verifySignedBookingToken === 'function',
    'reminderService must export verifySignedBookingToken'
  );

  // Test publicBooking route module imports cleanly
  const publicBookingPath = pathToFileURL(path.resolve('server/routes/publicBooking.js')).href;
  const publicBookingModule = await import(publicBookingPath);
  assert.ok(publicBookingModule.default, 'publicBooking.js must export an express router as default');

  // Test patients route module imports cleanly
  const patientsRoutePath = pathToFileURL(path.resolve('server/routes/patients.js')).href;
  const patientsRouteModule = await import(patientsRoutePath);
  assert.ok(patientsRouteModule.default, 'patients.js must export an express router as default');

  // Test appointments route module imports cleanly
  const appointmentsRoutePath = pathToFileURL(path.resolve('server/routes/appointments.js')).href;
  const appointmentsRouteModule = await import(appointmentsRoutePath);
  assert.ok(appointmentsRouteModule.default, 'appointments.js must export an express router as default');

  // Test bookingSlots route module imports cleanly
  const bookingSlotsRoutePath = pathToFileURL(path.resolve('server/routes/bookingSlots.js')).href;
  const bookingSlotsRouteModule = await import(bookingSlotsRoutePath);
  assert.ok(bookingSlotsRouteModule.default, 'bookingSlots.js must export an express router as default');

  // Test followUps route module imports cleanly
  const followUpsRoutePath = pathToFileURL(path.resolve('server/routes/followUps.js')).href;
  const followUpsRouteModule = await import(followUpsRoutePath);
  assert.ok(followUpsRouteModule.default, 'followUps.js must export an express router as default');
});
