import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BrowseRoomsScreen from '../screens/BrowseRoomsScreen';
import RoomDetailScreen from '../screens/RoomDetailScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import type { BrowseStackParamList, RootTabParamList } from './types';

const BrowseStack = createNativeStackNavigator<BrowseStackParamList>();
const RootTabs = createBottomTabNavigator<RootTabParamList>();

function BrowseStackNavigator() {
  return (
    <BrowseStack.Navigator>
      <BrowseStack.Screen name="BrowseRooms" component={BrowseRoomsScreen} options={{ headerShown: false }} />
      <BrowseStack.Screen name="RoomDetail" component={RoomDetailScreen} options={{ title: 'Chi tiết phòng' }} />
    </BrowseStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootTabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>{route.name === 'Browse' ? '⌂' : route.name === 'MyBookings' ? '▣' : '◎'}</Text>,
          tabBarActiveTintColor: '#1d4ed8',
          tabBarInactiveTintColor: '#64748b',
        })}
      >
        <RootTabs.Screen name="Browse" component={BrowseStackNavigator} options={{ title: 'Danh sách phòng' }} />
        <RootTabs.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'Lịch đặt phòng' }} />
        <RootTabs.Screen name="Profile" component={ProfileScreen} options={{ title: 'Hồ sơ' }} />
      </RootTabs.Navigator>
    </NavigationContainer>
  );
}
