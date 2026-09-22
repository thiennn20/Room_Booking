import React from 'react';
import { mockBookingDataSource } from '../services/bookingDataSource';
import { hasBookingConflict } from '../services/bookingService';
import type { Booking } from '../types/booking';

interface BookingContextValue {
  bookings: Booking[];
  addBooking: (booking: Booking) => { success: boolean; message?: string };
  cancelBooking: (bookingId: string) => void;
}

const BookingContext = React.createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: React.PropsWithChildren) {
  const [bookings, setBookings] = React.useState<Booking[]>(() => mockBookingDataSource.getBookings());

  const addBooking = (booking: Booking) => {
    if (hasBookingConflict(booking, bookings)) {
      return { success: false, message: 'Khung giờ này không còn trống.' };
    }

    setBookings((currentBookings) => [...currentBookings, booking]);
    return { success: true };
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: 'CANCELLED' } : booking,
      ),
    );
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = React.useContext(BookingContext);

  if (!context) {
    throw new Error('useBookings must be used inside BookingProvider');
  }

  return context;
}
