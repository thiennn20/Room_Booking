export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export type TimeSlotState = 'AVAILABLE' | 'OCCUPIED' | 'SELECTED';
