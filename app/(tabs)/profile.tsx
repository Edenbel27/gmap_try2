import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, membership, bookings, logout } = useGMAP();

  const [bookingsModalVisible, setBookingsModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/onboarding');
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#FACC15';
      case 'declined': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>ACCOUNT PROFILE</Text>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#FF2A2A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarText}>{currentUser?.name.substring(0, 1) || 'A'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser?.name || 'Athlete'}</Text>
            <Text style={styles.userEmail}>{currentUser?.email || 'gmap@gmap.com'}</Text>
            {membership.status === 'active' && (
              <View style={styles.gymBadge}>
                <Ionicons name="fitness" size={11} color="#FF2A2A" style={{ marginRight: 4 }} />
                <Text style={styles.gymBadgeText}>{membership.gymName}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Menu Items List */}
        <View style={styles.menuCard}>
          <Text style={styles.menuCardTitle}>Gym Settings & Activities</Text>

          {/* Attendance Calendar (redirects to calendar tab) */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/calendar')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
              </View>
              <Text style={styles.menuItemText}>Attendance Calendar</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#4B5563" />
          </TouchableOpacity>

          {/* My Bookings modal trigger */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setBookingsModalVisible(true)}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                <Ionicons name="fitness-outline" size={16} color="#8B5CF6" />
              </View>
              <Text style={styles.menuItemText}>Trainer Bookings ({bookings.length})</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#4B5563" />
          </TouchableOpacity>

          {/* Payment History */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/payment-history')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Ionicons name="card-outline" size={16} color="#10B981" />
              </View>
              <Text style={styles.menuItemText}>Payment History</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#4B5563" />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/notifications')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Ionicons name="notifications-outline" size={16} color="#EF4444" />
              </View>
              <Text style={styles.menuItemText}>Notification Inbox</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#4B5563" />
          </TouchableOpacity>

          {/* Settings Screen */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                <Ionicons name="settings-outline" size={16} color="#F59E0B" />
              </View>
              <Text style={styles.menuItemText}>App Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#4B5563" />
          </TouchableOpacity>

          {/* Support */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => setSupportModalVisible(true)}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(107, 114, 128, 0.1)' }]}>
                <Ionicons name="help-circle-outline" size={16} color="#9CA3AF" />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#4B5563" />
          </TouchableOpacity>

        </View>

        {/* Footer info */}
        <Text style={styles.versionText}>GMAP Customer App v1.0.0 • Falcon Fitness</Text>

      </ScrollView>

      {/* Trainer Bookings Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bookingsModalVisible}
        onRequestClose={() => setBookingsModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Personal Training Bookings</Text>
              <TouchableOpacity onPress={() => setBookingsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {bookings.length === 0 ? (
                <Text style={styles.emptyBookingsText}>No sessions booked yet.</Text>
              ) : (
                bookings.map((bk) => (
                  <View key={bk.id} style={styles.bookingRow}>
                    <View style={styles.bookingLeft}>
                      <View style={styles.bookingAvatar}>
                        <Text style={styles.bookingAvatarText}>{bk.trainerName.substring(0, 1)}</Text>
                      </View>
                      <View>
                        <Text style={styles.bookingTrainerName}>{bk.trainerName}</Text>
                        <Text style={styles.bookingMeta}>{bk.day} • {bk.time}</Text>
                        {Boolean(bk.note) && <Text style={styles.bookingNote}>"{bk.note}"</Text>}
                      </View>
                    </View>
                    
                    <View style={[styles.bookingStatus, { backgroundColor: getBookingStatusColor(bk.status) + '15', borderColor: getBookingStatusColor(bk.status) + '35' }]}>
                      <Text style={[styles.bookingStatusText, { color: getBookingStatusColor(bk.status) }]}>
                        {bk.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Help & Support Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={supportModalVisible}
        onRequestClose={() => setSupportModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Customer Support</Text>
              <TouchableOpacity onPress={() => setSupportModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.supportContainer}>
              <Ionicons name="headset-outline" size={48} color="#FF2A2A" style={{ marginBottom: 16 }} />
              <Text style={styles.supportTitle}>How can we help you?</Text>
              <Text style={styles.supportDesc}>
                Experiencing check-in issues? Payments not showing up? Reach out to gym support:
              </Text>
              
              <View style={styles.supportDetailRow}>
                <Ionicons name="mail" size={16} color="#6B7280" style={{ marginRight: 8 }} />
                <Text style={styles.supportDetailText}>support@gmapapp.com</Text>
              </View>
              <View style={styles.supportDetailRow}>
                <Ionicons name="call" size={16} color="#6B7280" style={{ marginRight: 8 }} />
                <Text style={styles.supportDetailText}>+251 911 234567</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.closeSupportBtn}
                onPress={() => setSupportModalVisible(false)}
              >
                <Text style={styles.closeSupportBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  headerSubtitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FF2A2A',
    letterSpacing: 2,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 42, 42, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  userEmail: {
    color: '#6B7280',
    fontSize: 12.5,
    marginTop: 2,
  },
  gymBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 42, 42, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 42, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 8,
  },
  gymBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
  },
  menuCardTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 14,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    color: '#E5E7EB',
    fontSize: 13.5,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: '#4B5563',
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 10,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(4, 4, 6, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F0F13',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
  },
  modalScroll: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  emptyBookingsText: {
    color: '#4B5563',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bookingAvatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  bookingTrainerName: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  bookingMeta: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  bookingNote: {
    color: '#6B7280',
    fontSize: 10.5,
    fontStyle: 'italic',
    marginTop: 4,
  },
  bookingStatus: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bookingStatusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  supportContainer: {
    padding: 30,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 45 : 30,
  },
  supportTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  supportDesc: {
    color: '#9CA3AF',
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  supportDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  supportDetailText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  closeSupportBtn: {
    backgroundColor: '#FF2A2A',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  closeSupportBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
