import test from 'node:test';
import assert from 'node:assert';

const BASE_URL = process.env.TEST_API_URL || 'https://holistic-edge-pied.vercel.app';
let ADMIN_HEADER = {
  'x-admin-user-email': 'admin@holisticedge.in',
};

test('HE-QA-05: API Contract & Route Integrity Verification', async (t) => {
  // Pre-auth step
  try {
    const authRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@holisticedge.in', password: 'HolisticEdge@2025' })
    });
    const authJson = await authRes.json();
    if (authJson.token) {
      ADMIN_HEADER.Authorization = `Bearer ${authJson.token}`;
    }
  } catch (e) {
    // fallback to header auth
  }
  // 1. Health endpoint
  await t.test('GET /api/health returns operational status', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'online');
    assert.strictEqual(data.founder, 'Healer Abdul Mallik');
  });

  // 2. Patient Directory: GET /api/patients (root alias)
  await t.test('GET /api/patients returns patient directory array', async () => {
    const res = await fetch(`${BASE_URL}/api/patients`, { headers: ADMIN_HEADER });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.patients), 'patients must be an array');
  });

  // 3. Patient Directory: GET /api/patients/search
  await t.test('GET /api/patients/search returns filtered patient array', async () => {
    const res = await fetch(`${BASE_URL}/api/patients/search?q=test`, { headers: ADMIN_HEADER });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.patients), 'patients must be an array');
  });

  // 4. Appointments: GET /api/appointments
  await t.test('GET /api/appointments returns appointments contract', async () => {
    const res = await fetch(`${BASE_URL}/api/appointments`, { headers: ADMIN_HEADER });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.appointments), 'appointments must be an array');
  });

  // 5. Booking Slots: GET /api/booking-slots
  await t.test('GET /api/booking-slots returns slots array', async () => {
    const res = await fetch(`${BASE_URL}/api/booking-slots`, { headers: ADMIN_HEADER });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.slots), 'slots must be an array');
  });

  // 6. Public Booking: GET /api/public/slots
  await t.test('GET /api/public/slots?date=YYYY-MM-DD returns slot contract', async () => {
    const res = await fetch(`${BASE_URL}/api/public/slots?date=2026-09-10`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.slots), 'slots must be an array');
    if (data.slots.length > 0) {
      const first = data.slots[0];
      assert.ok('capacity' in first, 'slot must contain capacity');
      assert.ok('booked' in first, 'slot must contain booked');
    }
  });

  // 7. Follow-ups: GET /api/follow-ups
  await t.test('GET /api/follow-ups returns reminders contract', async () => {
    const res = await fetch(`${BASE_URL}/api/follow-ups`, { headers: ADMIN_HEADER });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.reminders), 'reminders must be an array');
  });

  // 8. Email: GET /api/email/logs
  await t.test('GET /api/email/logs returns email log history', async () => {
    const res = await fetch(`${BASE_URL}/api/email/logs`, { headers: ADMIN_HEADER });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    const logs = data.emailLogs || data.logs;
    assert.ok(Array.isArray(logs), 'emailLogs or logs must be an array');
  });
});
