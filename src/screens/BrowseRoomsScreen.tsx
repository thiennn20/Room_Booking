import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import RoomListScreen from './RoomListScreen';
import type { BrowseStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<BrowseStackParamList, 'BrowseRooms'>;

export default function BrowseRoomsScreen({ navigation }: Props) {
  return <RoomListScreen onRoomPress={(roomId) => navigation.navigate('RoomDetail', { roomId })} />;
}
