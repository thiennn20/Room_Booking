import type { Booking } from '../types/booking';

export interface BookingDataSource {
  getBookings(): Booking[];
}

const initialBookings: Booking[] = [
  {
    id: 'mock-booking-1',
    roomId: '2',
    date: '2026-09-23',
    startTime: '10:00',
    endTime: '11:00',
    status: 'CONFIRMED',
  },
  {
    id: 'mock-booking-2',
    roomId: '4',
    date: '2026-09-24',
    startTime: '13:00',
    endTime: '14:00',
    status: 'CONFIRMED',
  },
];

export const mockBookingDataSource: BookingDataSource = {
  getBookings: () => initialBookings.map((booking) => ({ ...booking })),
};
