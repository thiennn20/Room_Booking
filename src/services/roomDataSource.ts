import { rooms } from '../data/rooms';
import type { Room } from '../types/room';

export interface RoomDataSource {
  getRooms(): Room[];
  getRoomById(roomId: string): Room | undefined;
}

export const mockRoomDataSource: RoomDataSource = {
  getRooms: () => rooms,
  getRoomById: (roomId) => rooms.find((room) => room.id === roomId),
};
