import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookings } from '../context/BookingContext';
import { mockRoomDataSource } from '../services/roomDataSource';
import {
  formatDate,
  formatDateLabel,
  isSlotOccupied,
  timeSlots,
} from '../services/bookingService';
import type { Booking } from '../types/booking';
import type { BrowseStackParamList } from '../navigation/types';

const slotStateLabels = {
  AVAILABLE: 'CÒN TRỐNG',
  OCCUPIED: 'ĐÃ ĐƯỢC ĐẶT',
  SELECTED: 'ĐANG CHỌN',
} as const;

type Props = NativeStackScreenProps<BrowseStackParamList, 'RoomDetail'>;

const getDateOptions = () =>
  [0, 1, 2].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return formatDate(date);
  });

export default function RoomDetailScreen({ route, navigation }: Props) {
  const room = mockRoomDataSource.getRoomById(route.params.roomId);
  const { bookings, addBooking } = useBookings();
  const dateOptions = React.useMemo(getDateOptions, []);
  const [selectedDate, setSelectedDate] = React.useState(dateOptions[0]);
  const [selectedSlotId, setSelectedSlotId] = React.useState<string>();
  const [message, setMessage] = React.useState<string>();

  if (!room) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.emptyState}>Không tìm thấy phòng</Text>
      </SafeAreaView>
    );
  }

  const selectedSlot = timeSlots.find((slot) => slot.id === selectedSlotId);

  const handleBooking = () => {
    if (!selectedSlot) {
      return;
    }

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      roomId: room.id,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: 'CONFIRMED',
    };
    const result = addBooking(booking);
    setMessage(result.success ? 'Đặt phòng thành công.' : result.message);
    if (result.success) {
      setSelectedSlotId(undefined);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={room.image} style={styles.image} resizeMode="cover" />
        <Text style={styles.title}>{room.name}</Text>
        <Text style={styles.subtitle}>{room.building}  |  {room.capacity} chỗ</Text>

        <Text style={styles.sectionTitle}>Tình trạng phòng</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {dateOptions.map((date) => (
            <Pressable
              key={date}
              onPress={() => {
                setSelectedDate(date);
                setSelectedSlotId(undefined);
                setMessage(undefined);
              }}
              style={[styles.dateButton, selectedDate === date && styles.selectedDateButton]}
            >
              <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
                {formatDateLabel(date)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Khung giờ trống</Text>
        <View style={styles.slotGrid}>
          {timeSlots.map((slot) => {
            const occupied = isSlotOccupied(room.id, selectedDate, slot, bookings);
            const selected = selectedSlotId === slot.id;

            return (
              <Pressable
                key={slot.id}
                disabled={occupied}
                onPress={() => {
                  setSelectedSlotId(slot.id);
                  setMessage(undefined);
                }}
                style={[
                  styles.slot,
                  occupied && styles.occupiedSlot,
                  selected && styles.selectedSlot,
                ]}
              >
                <Text style={[styles.slotText, occupied && styles.occupiedSlotText, selected && styles.selectedSlotText]}>
                  {slot.startTime} - {slot.endTime}
                </Text>
                <Text style={styles.slotState}>
                  {occupied ? slotStateLabels.OCCUPIED : selected ? slotStateLabels.SELECTED : slotStateLabels.AVAILABLE}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable
          onPress={handleBooking}
          disabled={!selectedSlot}
          style={({ pressed }) => [styles.bookButton, (!selectedSlot || pressed) && styles.bookButtonMuted]}
        >
          <Text style={styles.bookButtonText}>Đặt phòng</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('BrowseRooms')} style={styles.backButton}>
          <Text style={styles.backButtonText}>Quay lại danh sách phòng</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 16, paddingBottom: 28 },
  image: { borderRadius: 16, height: 190, width: '100%' },
  title: { color: '#172554', fontSize: 24, fontWeight: '700', marginTop: 16 },
  subtitle: { color: '#64748b', fontSize: 15, marginTop: 6 },
  sectionTitle: { color: '#172554', fontSize: 17, fontWeight: '700', marginTop: 24 },
  dateRow: { gap: 8, paddingTop: 10 },
  dateButton: { backgroundColor: '#ffffff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11 },
  selectedDateButton: { backgroundColor: '#1d4ed8' },
  dateText: { color: '#52627a', fontSize: 13, fontWeight: '600' },
  selectedDateText: { color: '#ffffff' },
  slotGrid: { gap: 10, paddingTop: 10 },
  slot: { backgroundColor: '#ffffff', borderRadius: 10, padding: 13 },
  selectedSlot: { backgroundColor: '#dbeafe' },
  occupiedSlot: { backgroundColor: '#f1f5f9', opacity: 0.7 },
  slotText: { color: '#172554', fontSize: 15, fontWeight: '700' },
  selectedSlotText: { color: '#1d4ed8' },
  occupiedSlotText: { color: '#94a3b8' },
  slotState: { color: '#64748b', fontSize: 11, marginTop: 3 },
  message: { color: '#15803d', fontSize: 14, fontWeight: '600', marginTop: 14 },
  bookButton: { alignItems: 'center', backgroundColor: '#1d4ed8', borderRadius: 10, marginTop: 18, padding: 14 },
  bookButtonMuted: { backgroundColor: '#94a3b8' },
  bookButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  backButton: { alignItems: 'center', padding: 14 },
  backButtonText: { color: '#1d4ed8', fontWeight: '600' },
  emptyState: { color: '#64748b', padding: 24 },
});
