import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Hồ sơ</Text>
        <Text style={styles.subtitle}>Đặt phòng VKU</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatar}><Text style={styles.avatarText}>S</Text></View>
        <Text style={styles.name}>Sinh viên</Text>
        <Text style={styles.caption}>Tài khoản đặt phòng trong khuôn viên trường</Text>
        <Text style={styles.note}>Dự án mô phỏng này không yêu cầu đăng nhập.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f3f4f6', flex: 1 },
  header: { backgroundColor: '#1a1a2e', padding: 18 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#cbd5e1', marginTop: 4 },
  content: { alignItems: 'center', padding: 28 },
  avatar: { alignItems: 'center', backgroundColor: '#dbeafe', borderRadius: 40, height: 80, justifyContent: 'center', width: 80 },
  avatarText: { color: '#1d4ed8', fontSize: 30, fontWeight: '700' },
  name: { color: '#172554', fontSize: 22, fontWeight: '700', marginTop: 16 },
  caption: { color: '#64748b', marginTop: 5 },
  note: { color: '#94a3b8', marginTop: 30, textAlign: 'center' },
});
