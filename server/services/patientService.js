import { getActiveDataProvider } from '../providers/dataProvider.js';
import { db } from '../db.js';

const dataProvider = getActiveDataProvider();

let allocationLock = Promise.resolve();

export async function allocateRegistrationToken() {
  return new Promise((resolve, reject) => {
    allocationLock = allocationLock.then(async () => {
      try {
        const patients = await dataProvider.searchPatients('');
        let maxNumber = 0;
        patients.forEach(p => {
          if (p.registrationTokenNumber && p.registrationTokenNumber.startsWith('HE-')) {
            const num = parseInt(p.registrationTokenNumber.replace('HE-', ''), 10);
            if (!isNaN(num) && num > maxNumber) maxNumber = num;
          }
        });
        const nextNum = maxNumber + 1;
        const padded = String(nextNum).padStart(6, '0');
        const token = `HE-${padded}`;
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  });
}

export async function matchPatient({ name, phone, email, registrationTokenNumber }) {
  // 1. HIGHEST: Exact Registration / Token Number
  if (registrationTokenNumber) {
    const byToken = await dataProvider.getPatientByRegistrationToken(registrationTokenNumber);
    if (byToken) {
      return { status: 'MATCHED_EXACT', patient: byToken, confidence: 'HIGHEST' };
    }
  }

  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const cleanEmail = email ? email.toLowerCase().trim() : '';
  const cleanName = name ? name.toLowerCase().trim() : '';

  const allPatients = await dataProvider.searchPatients('');

  // 2. HIGH: Exact Verified Phone
  if (cleanPhone) {
    const phoneMatches = allPatients.filter(p => p.phone && p.phone.replace(/\D/g, '') === cleanPhone);
    if (phoneMatches.length === 1) {
      return { status: 'MATCHED_EXACT', patient: phoneMatches[0], confidence: 'HIGH' };
    } else if (phoneMatches.length > 1) {
      return { status: 'AMBIGUOUS', matches: phoneMatches, confidence: 'HIGH_AMBIGUOUS' };
    }
  }

  // 3. MEDIUM: Exact Email
  if (cleanEmail) {
    const emailMatches = allPatients.filter(p => p.email && p.email.toLowerCase().trim() === cleanEmail);
    if (emailMatches.length === 1) {
      return { status: 'MATCHED_EXACT', patient: emailMatches[0], confidence: 'MEDIUM' };
    } else if (emailMatches.length > 1) {
      return { status: 'AMBIGUOUS', matches: emailMatches, confidence: 'MEDIUM_AMBIGUOUS' };
    }
  }

  // 4. LOW: Similar Name (No auto-merge, return potential matches)
  if (cleanName) {
    const nameMatches = allPatients.filter(p => p.name && p.name.toLowerCase().trim() === cleanName);
    if (nameMatches.length > 0) {
      return { status: 'AMBIGUOUS', matches: nameMatches, confidence: 'LOW_AMBIGUOUS' };
    }
  }

  return { status: 'NO_MATCH', patient: null, confidence: 'NONE' };
}

export async function findOrCreatePatient(patientInput) {
  const matchResult = await matchPatient(patientInput);

  if (matchResult.status === 'MATCHED_EXACT') {
    return { patient: matchResult.patient, isNew: false, isAmbiguous: false };
  }

  if (matchResult.status === 'AMBIGUOUS') {
    return { patient: null, isNew: false, isAmbiguous: true, matches: matchResult.matches };
  }

  const registrationTokenNumber = await allocateRegistrationToken();
  const newPatient = {
    id: `pt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    registrationTokenNumber,
    name: patientInput.name.trim(),
    phone: patientInput.phone.trim(),
    email: patientInput.email ? patientInput.email.trim() : '',
    patientType: patientInput.patientType || 'Standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = await dataProvider.createPatient(newPatient);
  return { patient: created, isNew: true, isAmbiguous: false };
}
