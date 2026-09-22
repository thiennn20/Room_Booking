export type RoomStatus = 'Available' | 'Occupied';

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  status: RoomStatus;
  image: number; // require() returns a number in React Native
}
