import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const DEFAULT_USERS = [
  {
    id: 'user_admin_001',
    name: 'Admin',
    email: 'admin@holisticedge.in',
    role: 'SUPER_ADMIN',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_reception_001',
    name: 'Reception',
    email: 'reception@holisticedge.in',
    role: 'RECEPTION',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_CLINIC_SETTINGS = {
  clinicName: 'Holistic Edge',
  tagline: 'Chiropractic & Wellness Clinic',
  founderName: 'Healer Abdul Mallik',
  phone: '+91 98765 43210',
  phoneRaw: '+919876543210',
  whatsapp: '919876543210',
  email: 'info@holisticedge.in',
  address: 'Ground Floor, Susheel Apartments, Behind Olive Hospital',
  landmark: 'Behind Olive Hospital',
  city: 'Mehdipatnam, Hyderabad',
  state: 'Telangana',
  pincode: '500028',
  openingHoursNote: 'Mon-Sat: 9AM-7PM | Sunday: Closed',
  googleMapsUrl: 'https://maps.google.com',
  seoTitle: 'Holistic Edge | Premium Chiropractic & Wellness in Hyderabad',
  seoDescription: 'Non-surgical, non-medicinal root-cause spinal realignment & joint pain care in Mehdipatnam, Hyderabad led by Healer Abdul Mallik.',
};

const DEFAULT_PATIENTS = [
  { id: 'patient_HE-001281', registrationTokenNumber: 'HE-001281', name: 'Rashid Khan', phone: '+91 98765 11111', email: 'rashid.khan@example.com', patientType: 'Chiropractic Care', createdAt: new Date().toISOString() },
  { id: 'patient_HE-001282', registrationTokenNumber: 'HE-001282', name: 'Priya Sharma', phone: '+91 98765 22222', email: 'priya.sharma@example.com', patientType: 'Alternative Therapies', createdAt: new Date().toISOString() },
  { id: 'patient_HE-001283', registrationTokenNumber: 'HE-001283', name: 'Mohammed Iqbal', phone: '+91 98765 33333', email: 'iqbal.m@example.com', patientType: 'Chiropractic Care', createdAt: new Date().toISOString() },
  { id: 'patient_HE-001284', registrationTokenNumber: 'HE-001284', name: 'Ananya Reddy', phone: '+91 98765 44444', email: 'ananya.reddy@example.com', patientType: 'Acupuncture', createdAt: new Date().toISOString() },
  { id: 'patient_HE-001285', registrationTokenNumber: 'HE-001285', name: 'Sanjay Verma', phone: '+91 98765 55555', email: 'sanjay.v@example.com', patientType: 'Chiropractic Care', createdAt: new Date().toISOString() },
  { id: 'patient_HE-001286', registrationTokenNumber: 'HE-001286', name: 'Fatima Begum', phone: '+91 98765 66666', email: 'fatima.begum@example.com', patientType: 'Lead Inquiry', createdAt: new Date().toISOString() },
];

const DEFAULT_APPOINTMENTS = [
  { id: 'HE-0001', fullName: 'Rashid Khan', phone: '+91 98765 11111', email: 'rashid.khan@example.com', service: 'Chiropractic Care', condition: 'Lower Back Pain', preferredDate: new Date().toISOString().split('T')[0], preferredTime: '10:00 AM', status: 'Confirmed', source: 'Website', notes: 'Patient has chronic L4-L5 issue', createdAt: new Date().toISOString() },
  { id: 'HE-0002', fullName: 'Priya Sharma', phone: '+91 98765 22222', email: 'priya.sharma@example.com', service: 'Alternative Therapies', condition: 'Neck Pain', preferredDate: new Date().toISOString().split('T')[0], preferredTime: '11:30 AM', status: 'Pending', source: 'WhatsApp', createdAt: new Date().toISOString() },
  { id: 'HE-0003', fullName: 'Mohammed Iqbal', phone: '+91 98765 33333', email: 'iqbal.m@example.com', service: 'Chiropractic Care', condition: 'Sciatica', preferredDate: new Date().toISOString().split('T')[0], preferredTime: '02:00 PM', status: 'Confirmed', source: 'Referral', createdAt: new Date().toISOString() },
];

const DEFAULT_LEADS = [
  { id: 'lead_001', fullName: 'Fatima Begum', phone: '+91 98765 66666', email: 'fatima.begum@example.com', condition: 'Back Pain', message: 'Been suffering for 6 months, looking for non-surgical treatment', source: 'Website Form', status: 'New', notes: [], appointmentIds: [], createdAt: new Date().toISOString() },
  { id: 'lead_002', fullName: 'Suresh Babu', phone: '+91 98765 77777', email: '', condition: 'Cervical Spondylosis', source: 'WhatsApp', status: 'Contacted', notes: [], appointmentIds: [], createdAt: new Date().toISOString() },
];

function getDefaultDbSchema() {
  return {
    users: DEFAULT_USERS,
    clinicSettings: INITIAL_CLINIC_SETTINGS,
    patients: DEFAULT_PATIENTS,
    appointments: DEFAULT_APPOINTMENTS,
    reminders: [],
    emailLogs: [],
    mediaAssets: [],
    leads: DEFAULT_LEADS,
    bookingSlots: [],
    cmsServices: [],
    cmsConditions: [],
    cmsFaqs: [],
    cmsTeam: [],
    offers: [],
    googleReviews: [],
    notifications: [],
    auditLogs: [],
  };
}

class PersistentDb {
  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        if (!parsed.users || parsed.users.length === 0) {
          parsed.users = DEFAULT_USERS;
        }
        if (!parsed.patients || parsed.patients.length === 0) {
          parsed.patients = DEFAULT_PATIENTS;
        }
        if (!parsed.appointments || parsed.appointments.length === 0) {
          parsed.appointments = DEFAULT_APPOINTMENTS;
        }
        if (!parsed.leads || parsed.leads.length === 0) {
          parsed.leads = DEFAULT_LEADS;
        }
        return { ...getDefaultDbSchema(), ...parsed };
      }
    } catch (e) {
      console.error('[DB] Failed to parse db.json, creating fresh schema', e);
    }
    const fresh = getDefaultDbSchema();
    this.saveData(fresh);
    return fresh;
  }

  saveData(data = this.data) {
    try {
      this.ensureDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      if (e.code !== 'EROFS') {
        console.error('[DB] Failed to save database file', e.message);
      }
    }
  }

  get(table) {
    if (!this.data[table]) {
      this.data[table] = [];
    }
    return this.data[table];
  }

  set(table, items) {
    this.data[table] = items;
    this.saveData();
    return items;
  }

  find(table, predicate) {
    const items = this.get(table);
    return items.find(predicate) || null;
  }

  filter(table, predicate) {
    const items = this.get(table);
    return items.filter(predicate);
  }

  insert(table, item) {
    const items = this.get(table);
    items.unshift(item);
    this.saveData();
    return item;
  }

  update(table, id, updates) {
    const items = this.get(table);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData();
    return items[index];
  }

  delete(table, id) {
    const items = this.get(table);
    const filtered = items.filter(i => i.id !== id);
    this.data[table] = filtered;
    this.saveData();
    return true;
  }

  remove(table, id) {
    return this.delete(table, id);
  }
}

export const db = new PersistentDb();