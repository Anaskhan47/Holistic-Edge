import crypto from 'crypto';

const TOKEN_SECRET = process.env.APPOINTMENT_ACCESS_SECRET || process.env.REMINDER_SECRET || 'holistic_edge_appointment_access_secure_key_2026';

/**
 * Generate a cryptographically signed, URL-safe opaque token for patient appointment view access.
 * @param {string} appointmentId - The appointment identifier
 * @param {string} patientId - The patient identifier
 * @param {number} expiresInDays - Token validity in days (default: 30 days)
 * @returns {string} Base64url-encoded signed token
 */
export function generateSignedAppointmentAccessToken(appointmentId, patientId, expiresInDays = 30) {
  if (!appointmentId || !patientId) {
    throw new Error('appointmentId and patientId are required to generate access token');
  }

  const expiresAt = Date.now() + expiresInDays * 24 * 3600 * 1000;
  const payloadObj = {
    appointmentId,
    patientId,
    type: 'APPT_VIEW',
    expiresAt,
    iat: Date.now(),
  };

  const payload = JSON.stringify(payloadObj);
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  const tokenData = Buffer.from(JSON.stringify({ payload, signature })).toString('base64url');
  
  return tokenData;
}

/**
 * Verify and decode a signed appointment access token.
 * @param {string} tokenData - Base64url-encoded token string
 * @returns {{ valid: boolean, appointmentId?: string, patientId?: string, error?: string, expiresAt?: number }}
 */
export function verifySignedAppointmentAccessToken(tokenData) {
  if (!tokenData || typeof tokenData !== 'string') {
    return { valid: false, error: 'Missing token' };
  }

  try {
    const rawJson = Buffer.from(tokenData, 'base64url').toString('utf8');
    const decoded = JSON.parse(rawJson);
    const { payload, signature } = decoded;

    if (!payload || !signature) {
      return { valid: false, error: 'Malformed token structure' };
    }

    const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
    
    // Constant-time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false, error: 'Invalid security signature' };
    }

    const { appointmentId, patientId, type, expiresAt } = JSON.parse(payload);

    if (type !== 'APPT_VIEW') {
      return { valid: false, error: 'Invalid token type' };
    }

    if (typeof expiresAt === 'number' && Date.now() > expiresAt) {
      return { valid: false, error: 'Appointment access link has expired', expiresAt };
    }

    if (!appointmentId || !patientId) {
      return { valid: false, error: 'Incomplete token payload' };
    }

    return { valid: true, appointmentId, patientId, expiresAt };
  } catch (err) {
    return { valid: false, error: 'Malformed or unparseable token' };
  }
}
