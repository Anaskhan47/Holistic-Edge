// ============================================================
// HOLISTIC EDGE — useBookingSlots Hook
// Reactive real-time hook for booking slots availability
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import {
  bookingSlotStorage,
  type BookingSlot,
  type SlotStatus,
} from '../admin/services/bookingSlotStorage';

export function useBookingSlots(date: string) {
  const [slots, setSlots] = useState<BookingSlot[]>(() =>
    date ? bookingSlotStorage.getByDate(date) : bookingSlotStorage.getAll()
  );

  const refresh = useCallback(() => {
    setSlots(date ? bookingSlotStorage.getByDate(date) : bookingSlotStorage.getAll());
  }, [date]);

  useEffect(() => {
    refresh();
    const unsub = bookingSlotStorage.subscribe(refresh);
    return unsub;
  }, [refresh]);

  // Derived helpers
  const availableSlots = slots.filter(s => s.status === 'OPEN' && s.booked < s.capacity);
  const fullSlots = slots.filter(s => s.status === 'FULL' || s.booked >= s.capacity);
  const closedSlots = slots.filter(s => s.status === 'CLOSED');
  const blockedSlots = slots.filter(s => s.status === 'BLOCKED');

  const totalCapacity = slots.reduce((acc, s) => acc + s.capacity, 0);
  const totalBooked = slots.reduce((acc, s) => acc + s.booked, 0);
  const remainingSeats = Math.max(0, totalCapacity - totalBooked);
  const utilizationPercent = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  return {
    slots,
    availableSlots,
    fullSlots,
    closedSlots,
    blockedSlots,
    totalCapacity,
    totalBooked,
    remainingSeats,
    utilizationPercent,
    refresh,
  };
}
