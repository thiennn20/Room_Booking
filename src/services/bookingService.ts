import type { Booking, TimeSlot } from '../types/booking';

export const timeSlots: TimeSlot[] = [
  { id: '09:00-10:00', startTime: '09:00', endTime: '10:00' },
  { id: '10:00-11:00', startTime: '10:00', endTime: '11:00' },
  { id: '11:00-12:00', startTime: '11:00', endTime: '12:00' },
  { id: '13:00-14:00', startTime: '13:00', endTime: '14:00' },
  { id: '14:00-15:00', startTime: '14:00', endTime: '15:00' },
];

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const bookingsConflict = (candidate: Booking, existing: Booking) =>
  candidate.roomId === existing.roomId &&
  candidate.date === existing.date &&
  existing.status === 'CONFIRMED' &&
  toMinutes(candidate.startTime) < toMinutes(existing.endTime) &&
  toMinutes(candidate.endTime) > toMinutes(existing.startTime);

export const hasBookingConflict = (candidate: Booking, bookings: Booking[]) =>
  bookings.some((booking) => bookingsConflict(candidate, booking));

export const isSlotOccupied = (
  roomId: string,
  date: string,
  slot: TimeSlot,
  bookings: Booking[],
) =>
  bookings.some(
    (booking) =>
      booking.roomId === roomId &&
      booking.date === date &&
      booking.status === 'CONFIRMED' &&
      toMinutes(slot.startTime) < toMinutes(booking.endTime) &&
      toMinutes(slot.endTime) > toMinutes(booking.startTime),
  );

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateLabel = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString('vi-VN', { weekday: 'short', month: 'short', day: 'numeric' });
};
