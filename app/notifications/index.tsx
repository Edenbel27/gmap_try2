import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP, Notification } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, clearNotifications } = useGMAP();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'membership': return 'fitness-outline';
      case 'booking': return 'calendar-outline';
      case 'classes': return 'people-outline';
      case 'check_in': return 'qr-code-outline';
      default: return 'notifications-outline';
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'membership': return '#FF2A2A';
      case 'booking': return '#8B5CF6';
      case 'classes': return '#3B82F6';
      case 'check_in': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={clearNotifications}>
          <Text style={styles.clearAllText}>Mark Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="rgba(255,255,255,0.05)" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>No new notifications or alerts registered.</Text>
          </View>
        ) : (
          notifications.map((notif) => (
            <View key={notif.id} style={[styles.notificationCard, notif.read ? null : styles.notificationUnread]}>
              <View style={[styles.iconBg, { backgroundColor: getIconColor(notif.type) + '15' }]}>
                <Ionicons name={getIcon(notif.type)} size={18} color={getIconColor(notif.type)} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>{notif.title}</Text>
                  {!notif.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.cardBody}>{notif.body}</Text>
                <Text style={styles.cardDate}>{notif.date}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040406',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clearAllText: {
    color: '#FF2A2A',
    fontSize: 13,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  notificationUnread: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 42, 42, 0.15)',
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    flex: 1,
    paddingRight: 10,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF2A2A',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  cardBody: {
    color: '#9CA3AF',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4,
  },
  cardDate: {
    color: '#4B5563',
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 6,
  },
});
