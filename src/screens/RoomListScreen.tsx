import React from 'react';
import {
  FlatList,
  Pressable,
  TextInput,
  type ListRenderItem,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoomCard from '../components/RoomCard';
import { rooms } from '../data/rooms';
import type { Room } from '../types/room';

const keyExtractor = (item: Room) => item.id;

const ItemSeparator = () => <View style={styles.separator} />;

const filterOptions = ['All', 'Available', 'Occupied'] as const;
type RoomFilter = (typeof filterOptions)[number];

const filterLabels: Record<RoomFilter, string> = {
  All: 'Tất cả',
  Available: 'Còn trống',
  Occupied: 'Đang sử dụng',
};

interface RoomListScreenProps {
  onRoomPress?: (roomId: string) => void;
}

export default function RoomListScreen({ onRoomPress }: RoomListScreenProps) {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState<RoomFilter>('All');
  const columns = width >= 768 ? 3 : width >= 480 ? 2 : 1;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(normalizedQuery) ||
      room.building.toLowerCase().includes(normalizedQuery);
    const matchesFilter =
      selectedFilter === 'All' || room.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const renderItem: ListRenderItem<Room> = ({ item }) => (
    <View style={styles.itemContainer}>
      <RoomCard room={item} onPress={() => onRoomPress?.(item.id)} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đặt phòng VKU</Text>
        <Text style={styles.headerSubtitle}>{filteredRooms.length} phòng</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm theo tên phòng hoặc tòa nhà"
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
        <View style={styles.filterRow}>
          {filterOptions.map((filter) => {
            const isSelected = selectedFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={[styles.filterDot, isSelected && styles.filterDotSelected]}>
                  {filter === 'All' ? '✦' : '●'}
                </Text>
                <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {filterLabels[filter]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList<Room>
        key={`rooms-${columns}`}
        data={filteredRooms}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        ListEmptyComponent={<Text style={styles.emptyState}>Không tìm thấy phòng phù hợp</Text>}
        contentContainerStyle={[styles.listContent, filteredRooms.length === 0 && styles.emptyListContent]}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 16,
    paddingBottom: 13,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 11,
  },
  searchIcon: {
    color: '#64748b',
    fontSize: 23,
    lineHeight: 24,
    width: 23,
  },
  searchInput: {
    color: '#111827',
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: '#30364c',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterButtonSelected: {
    backgroundColor: '#ffffff',
  },
  filterText: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: '#1a1a2e',
  },
  filterDot: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  filterDotSelected: {
    color: '#1a1a2e',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    alignSelf: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 32,
  },
  itemContainer: {
    flex: 1,
    marginBottom: 14,
  },
  columnWrapper: {
    gap: 14,
  },
  separator: {
    height: 14,
  },
});
