// ============================================================
// HOLISTIC EDGE — Booking Slots Storage Service
// Handles appointment slot capacity, availability, and scheduling.
// Real-time synchronization via custom event.
// ============================================================

export type SlotStatus = 'OPEN' | 'FULL' | 'CLOSED' | 'BLOCKED';

export interface BookingSlot {
  id: string;
  date: string;              // "YYYY-MM-DD"
  time: string;              // "10:00" (24-hour format)
  timeLabel: string;         // "10:00 AM" (Display format)
  capacity: number;          // Total available patient capacity (seats)
  booked: number;            // Number of confirmed appointments
  status: SlotStatus;        // Slot availability state
  blockedReason?: string;    // Reason when status is BLOCKED (e.g. "Doctor in surgery")
  notes?: string;            // Internal clinical/administrative notes
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const STORAGE_KEY = 'he_admin_booking_slots_v1';
export const SLOTS_UPDATED_EVENT = 'he_slots_updated';

export function notifySlotsChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SLOTS_UPDATED_EVENT));
  }
}

// ─── Helpers ──────────────────────────────────────────────────

function generateId(): string {
  return `slot_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function formatTime24to12(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export function formatTime12to24(time12: string): string {
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12;
  let h = parseInt(match[1], 10);
  const m = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m}`;
}

/** Standard default clinic operating slots */
export const DEFAULT_TIME_SLOTS = [
  '10:00 AM',
  '10:45 AM',
  '11:30 AM',
  '12:15 PM',
  '01:00 PM',
  '03:00 PM',
  '03:45 PM',
  '04:30 PM',
  '05:15 PM',
  '06:00 PM',
  '06:45 PM',
  '07:30 PM',
];

function seedDefaultSlots(): BookingSlot[] {
  const slots: BookingSlot[] = [];
  const today = new Date();
  const now = new Date().toISOString();

  // Seed next 14 days with default slots
  for (let d = 0; d < 14; d++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + d);
    const dateStr = targetDate.toISOString().split('T')[0];
    const isSunday = targetDate.getDay() === 0;

    // Sunday has fewer slots
    const times = isSunday
      ? ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM']
      : DEFAULT_TIME_SLOTS;

    times.forEach(t => {
      const time24 = formatTime12to24(t);
      // Simulate realistic bookings on today and tomorrow
      const booked = d === 0 ? Math.floor(Math.random() * 3) : (d === 1 ? Math.floor(Math.random() * 2) : 0);
      const capacity = 4;
      const status: SlotStatus = booked >= capacity ? 'FULL' : 'OPEN';

      slots.push({
        id: `slot_${dateStr.replace(/-/g, '')}_${time24.replace(':', '')}`,
        date: dateStr,
        time: time24,
        timeLabel: t,
        capacity,
        booked,
        status,
        createdAt: now,
        updatedAt: now,
        createdBy: 'System Seed',
      });
    });
  }

  return slots;
}

function read(): BookingSlot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedDefaultSlots();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function write(slots: BookingSlot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
    notifySlotsChanged();
  } catch (e) {
    console.error('[BookingSlotStorage] Write failed', e);
  }
}

// ─── Main API ─────────────────────────────────────────────────

export const bookingSlotStorage = {
  /** Get all slots across all dates */
  getAll(): BookingSlot[] {
    return read().sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  },

  /** Get all slots for a specific date (YYYY-MM-DD) */
  getByDate(date: string): BookingSlot[] {
    return this.getAll().filter(s => s.date === date);
  },

  /** Get a single slot by ID */
  getById(id: string): BookingSlot | null {
    return read().find(s => s.id === id) || null;
  },

  /** Create a new single slot */
  create(data: {
    date: string;
    time: string;
    timeLabel: string;
    capacity: number;
    notes?: string;
    createdBy?: string;
  }): { success: boolean; slot?: BookingSlot; error?: string } {
    if (!data.date || !data.time) {
      return { success: false, error: 'Date and time are required.' };
    }
    if (data.capacity < 1) {
      return { success: false, error: 'Capacity must be at least 1 seat.' };
    }

    const all = read();
    const time24 = data.time.includes(':') && data.time.length === 5 ? data.time : formatTime12to24(data.time);
    const timeLabel = data.timeLabel || formatTime24to12(time24);

    // Duplicate check for same date + time
    const duplicate = all.find(s => s.date === data.date && s.time === time24);
    if (duplicate) {
      return {
        success: false,
        error: `A slot for ${data.date} at ${timeLabel} already exists.`,
      };
    }

    const now = new Date().toISOString();
    const newSlot: BookingSlot = {
      id: generateId(),
      date: data.date,
      time: time24,
      timeLabel,
      capacity: data.capacity,
      booked: 0,
      status: 'OPEN',
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy || 'Admin',
    };

    write([...all, newSlot]);
    return { success: true, slot: newSlot };
  },

  /** Update an existing slot */
  update(
    id: string,
    updates: Partial<Pick<BookingSlot, 'date' | 'time' | 'timeLabel' | 'capacity' | 'status' | 'blockedReason' | 'notes'>>
  ): { success: boolean; slot?: BookingSlot; error?: string } {
    const all = read();
    const slot = all.find(s => s.id === id);
    if (!slot) return { success: false, error: 'Slot not found.' };

    // Validation: Capacity cannot be less than already booked count
    if (updates.capacity !== undefined && updates.capacity < slot.booked) {
      return {
        success: false,
        error: `Cannot reduce capacity to ${updates.capacity}. This slot already has ${slot.booked} confirmed booking(s).`,
      };
    }

    // Check duplicate if date/time changed
    if ((updates.date && updates.date !== slot.date) || (updates.time && updates.time !== slot.time)) {
      const targetDate = updates.date || slot.date;
      const targetTime = updates.time || slot.time;
      const duplicate = all.find(s => s.id !== id && s.date === targetDate && s.time === targetTime);
      if (duplicate) {
        return {
          success: false,
          error: `A slot for ${targetDate} at ${updates.timeLabel || formatTime24to12(targetTime)} already exists.`,
        };
      }
    }

    // Evaluate dynamic status
    let nextStatus = updates.status || slot.status;
    const finalCapacity = updates.capacity || slot.capacity;
    if (nextStatus === 'OPEN' && slot.booked >= finalCapacity) {
      nextStatus = 'FULL';
    } else if (nextStatus === 'FULL' && slot.booked < finalCapacity) {
      nextStatus = 'OPEN';
    }

    const updated: BookingSlot = {
      ...slot,
      ...updates,
      time: updates.time ? (updates.time.length === 5 ? updates.time: formatTime12to24(updates.time)) : slot.time,
      timeLabel: updates.timeLabel ?? (updates.time ? formatTime24to12(updates.time) : slot.timeLabel),
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };

    write(all.map(s => (s.id === id ? updated: s)));
    return { success: true, slot: updated };
  },

  /** Increment booked count (called when an appointment is booked) */
  bookSeat(id: string): { success: boolean; error?: string } {
    const all = read();
    const slot = all.find(s => s.id === id);
    if (!slot) return { success: false, error: 'Slot not found.' };
    if (slot.status !== 'OPEN' || slot.booked >= slot.capacity) {
      return { success: false, error: 'This time slot is full or unavailable.' };
    }

    const booked = slot.booked + 1;
    const status: SlotStatus = booked >= slot.capacity ? 'FULL' : 'OPEN';

    const updated: BookingSlot = {
      ...slot,
      booked,
      status,
      updatedAt: new Date().toISOString(),
    };

    write(all.map(s => (s.id === id ? updated: s)));
    return { success: true };
  },

  /** Decrement booked count (called when appointment is cancelled) */
  releaseSeat(id: string): { success: boolean } {
    const all = read();
    const slot = all.find(s => s.id === id);
    if (!slot || slot.booked <= 0) return { success: true };

    const booked = Math.max(0, slot.booked - 1);
    let status = slot.status;
    if (status === 'FULL' && booked < slot.capacity) {
      status = 'OPEN';
    }

    const updated: BookingSlot = {
      ...slot,
      booked,
      status,
      updatedAt: new Date().toISOString(),
    };

    write(all.map(s => (s.id === id ? updated: s)));
    return { success: true };
  },

  /** Toggle slot status (Open / Closed / Blocked) */
  setStatus(id: string, status: SlotStatus, blockedReason?: string): BookingSlot | null {
    const all = read();
    const slot = all.find(s => s.id === id);
    if (!slot) return null;

    const updated: BookingSlot = {
      ...slot,
      status,
      blockedReason: status === 'BLOCKED' ? (blockedReason || 'Blocked by administrator') : undefined,
      updatedAt: new Date().toISOString(),
    };

    write(all.map(s => (s.id === id ? updated: s)));
    return updated;
  },

  /** Duplicate a slot for another date */
  duplicate(id: string, targetDate: string): BookingSlot | null {
    const slot = this.getById(id);
    if (!slot) return null;

    const date = targetDate || slot.date;
    const res = this.create({
      date,
      time: slot.time,
      timeLabel: slot.timeLabel,
      capacity: slot.capacity,
      notes: slot.notes ? `${slot.notes} (Copied)` : undefined,
    });

    return res.slot || null;
  },

  /** Delete a single slot */
  delete(id: string): { success: boolean; error?: string } {
    const all = read();
    const slot = all.find(s => s.id === id);
    if (!slot) return { success: false, error: 'Slot not found' };
    if (slot.booked > 0) {
      return {
        success: false,
        error: `Cannot delete slot with ${slot.booked} active booking(s). Cancel or reschedule appointments first.`,
      };
    }

    write(all.filter(s => s.id !== id));
    return { success: true };
  },

  /** Batch generate standard schedule for a date */
  generateScheduleForDate(
    date: string,
    options: Partial<{
      times: string[];
      defaultCapacity: number;
      overwriteExisting: boolean;
    }> = {}
  ): { created: number; skipped: number } {
    const times = options.times || DEFAULT_TIME_SLOTS;
    const capacity = options.defaultCapacity || 4;
    const all = read();
    const existingForDate = all.filter(s => s.date === date);

    let created = 0;
    let skipped = 0;
    const now = new Date().toISOString();
    const newSlots: BookingSlot[] = [];

    times.forEach(t => {
      const time24 = formatTime12to24(t);
      const exists = existingForDate.some(s => s.time === time24);

      if (exists) {
        skipped++;
      } else {
        newSlots.push({
          id: generateId(),
          date,
          time: time24,
          timeLabel: t,
          capacity,
          booked: 0,
          status: 'OPEN',
          createdAt: now,
          updatedAt: now,
          createdBy: 'Batch Generator',
        });
        created++;
      }
    });

    if (newSlots.length > 0) {
      write([...all, ...newSlots]);
    }

    return { created, skipped };
  },

  /** Public website getter — returns only OPEN slots with remaining capacity for a date */
  getPublicAvailableSlots(date: string): BookingSlot[] {
    return this.getByDate(date).filter(s => s.status === 'OPEN' && s.booked < s.capacity);
  },

  /** Subscribe to real-time changes */
  subscribe(handler: () => void): () => void {
    window.addEventListener(SLOTS_UPDATED_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(SLOTS_UPDATED_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  },
};
