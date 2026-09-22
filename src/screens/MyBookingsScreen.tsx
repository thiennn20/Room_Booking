import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookings } from '../context/BookingContext';
import { mockRoomDataSource } from '../services/roomDataSource';
import { formatDateLabel } from '../services/bookingService';
import type { Booking } from '../types/booking';

const bookingStatusLabels = {
  CONFIRMED: 'ĐÃ XÁC NHẬN',
  CANCELLED: 'ĐÃ HỦY',
  COMPLETED: 'ĐÃ HOÀN TẤT',
} as const;

export default function MyBookingsScreen() {
  const { bookings, cancelBooking } = useBookings();
  const visibleBookings = bookings.filter((booking) => booking.status !== 'COMPLETED');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch đặt phòng</Text>
        <Text style={styles.subtitle}>Các phòng bạn đã đăng ký</Text>
      </View>
      <FlatList
        data={visibleBookings}
        keyExtractor={(booking) => booking.id}
        contentContainerStyle={[styles.list, visibleBookings.length === 0 && styles.emptyList]}
        ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa có lịch đặt phòng</Text>}
        renderItem={({ item }) => <BookingCard booking={item} onCancel={cancelBooking} />}
      />
    </SafeAreaView>
  );
}

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) {
  const room = mockRoomDataSource.getRoomById(booking.roomId);

  return (
    <View style={styles.card}>
      <Text style={styles.roomName}>{room?.name ?? 'Phòng không xác định'}</Text>
      <Text style={styles.detail}>{room?.building ?? 'Tòa nhà không xác định'}</Text>
      <Text style={styles.detail}>{formatDateLabel(booking.date)}  |  {booking.startTime} - {booking.endTime}</Text>
      <View style={styles.footer}>
        <Text style={[styles.status, booking.status === 'CANCELLED' && styles.cancelled]}>{bookingStatusLabels[booking.status]}</Text>
        {booking.status === 'CONFIRMED' ? (
          <Pressable onPress={() => onCancel(booking.id)} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Hủy đặt phòng</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f3f4f6', flex: 1 },
  header: { backgroundColor: '#1a1a2e', padding: 18 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#cbd5e1', marginTop: 4 },
  list: { gap: 12, padding: 16 },
  emptyList: { flexGrow: 1 },
  emptyText: { alignSelf: 'center', color: '#64748b', marginTop: 28 },
  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16 },
  roomName: { color: '#172554', fontSize: 17, fontWeight: '700' },
  detail: { color: '#64748b', marginTop: 6 },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  status: { color: '#15803d', fontSize: 12, fontWeight: '700' },
  cancelled: { color: '#dc2626' },
  cancelButton: { padding: 4 },
  cancelText: { color: '#dc2626', fontWeight: '600' },
});
