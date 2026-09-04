/**
 * Canonical Slot Availability Model & Calculation Rules (HE-QA-03)
 * Provides the single source of truth for slot capacity, booked count, and remaining availability.
 * Guarantees that the UI never displays "undefined", "NaN", or negative slot counts.
 */

export type CanonicalSlotStatus = 'OPEN' | 'FULL' | 'CLOSED' | 'BLOCKED';

export interface CanonicalSlot {
  id: string;
  date: string;
  time: string;
  timeLabel: string;
  capacity: number;
  booked: number;
  remaining: number;
  status: CanonicalSlotStatus;
  isAvailable: boolean;
  notes?: string;
  blockedReason?: string;
}

/**
 * Calculates remaining available seats with strict bounds.
 * Single source of truth: remaining = Math.max(0, capacity - booked).
 * Always returns a non-negative finite integer.
 */
export function calculateRemainingSlots(capacity: unknown, booked: unknown): number {
  const cap = typeof capacity === 'number' && !Number.isNaN(capacity) && Number.isFinite(capacity)
    ? Math.max(0, Math.floor(capacity))
    : 0;

  const bkd = typeof booked === 'number' && !Number.isNaN(booked) && Number.isFinite(booked)
    ? Math.max(0, Math.floor(booked))
    : 0;

  return Math.max(0, cap - bkd);
}

/**
 * Formats slot availability label for display in UI.
 * Guaranteed to never output "undefined slots left", "NaN", or "null".
 */
export function formatSlotAvailability(slot: Partial<CanonicalSlot> | null | undefined): string {
  if (!slot) {
    return 'Slot unavailable';
  }

  if (slot.status === 'BLOCKED') {
    return slot.blockedReason ? `Blocked (${slot.blockedReason})` : 'Slot blocked';
  }

  if (slot.status === 'CLOSED') {
    return 'Slot closed';
  }

  const remaining = typeof slot.remaining === 'number' && !Number.isNaN(slot.remaining)
    ? slot.remaining
    : calculateRemainingSlots(slot.capacity, slot.booked);

  if (remaining <= 0 || slot.status === 'FULL') {
    return 'Fully booked (0 seats left)';
  }

  return `${remaining} slot${remaining === 1 ? '' : 's'} left`;
}

/**
 * Normalizes any incoming slot data (API DTO, Sheet row, or storage object)
 * into a verified, typed CanonicalSlot.
 */
export function normalizeSlot(raw: any): CanonicalSlot {
  if (!raw || typeof raw !== 'object') {
    return {
      id: 'unknown',
      date: '',
      time: '',
      timeLabel: '',
      capacity: 0,
      booked: 0,
      remaining: 0,
      status: 'CLOSED',
      isAvailable: false,
    };
  }

  const capacity = typeof raw.capacity === 'number' ? Math.max(0, raw.capacity) : Number(raw.capacity) || 5;
  // Handle any legacy aliases across API boundaries:
  const booked = typeof raw.booked === 'number'
    ? Math.max(0, raw.booked)
    : (raw.bookedCount !== undefined ? Number(raw.bookedCount) : (Number(raw.booked) || 0));

  const remaining = calculateRemainingSlots(capacity, booked);

  let rawStatus = String(raw.status || '').toUpperCase();
  let status: CanonicalSlotStatus = 'OPEN';

  if (rawStatus === 'BLOCKED') {
    status = 'BLOCKED';
  } else if (rawStatus === 'CLOSED') {
    status = 'CLOSED';
  } else if (remaining <= 0 || rawStatus === 'FULL') {
    status = 'FULL';
  } else {
    status = 'OPEN';
  }

  const isAvailable = status === 'OPEN' && remaining > 0;

  return {
    id: String(raw.id || ''),
    date: String(raw.date || ''),
    time: String(raw.time || ''),
    timeLabel: String(raw.timeLabel || raw.time || ''),
    capacity,
    booked,
    remaining,
    status,
    isAvailable,
    notes: raw.notes ? String(raw.notes) : undefined,
    blockedReason: raw.blockedReason ? String(raw.blockedReason) : undefined,
  };
}
