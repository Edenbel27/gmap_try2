import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function BookingDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings } = useGMAP();

  const booking = bookings.find(b => b.id === id) ?? bookings[0];

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#6B7280' }}>Booking not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#FACC15';
      case 'declined': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleReschedule = () => {
    router.push(`/booking/reschedule?id=${booking.id}`);
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your session with ${booking.trainerName}?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        { text: 'Cancel Session', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Trainer Card */}
        <View style={styles.trainerCard}>
          <Image source={{ uri: booking.trainerPhoto }} style={styles.trainerPhoto} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.trainerName}>{booking.trainerName}</Text>
            <Text style={styles.trainerRole}>Personal Trainer</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '18' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
              {booking.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Session Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionLabel}>SESSION DETAILS</Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
            <Text style={styles.detailLabel}>Day</Text>
            <Text style={styles.detailValue}>{booking.day}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{booking.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color="#9CA3AF" />
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={[styles.detailValue, { color: '#FF2A2A' }]}>{booking.price} ETB</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="wallet-outline" size={16} color="#9CA3AF" />
            <Text style={styles.detailLabel}>Payment</Text>
            <Text style={styles.detailValue}>Pay In Person</Text>
          </View>
        </View>

        {/* Notes */}
        {booking.note ? (
          <View style={styles.noteSection}>
            <Text style={styles.sectionLabel}>YOUR NOTES</Text>
            <Text style={styles.noteText}>"{booking.note}"</Text>
          </View>
        ) : null}

        {/* Actions */}
        {booking.status !== 'declined' && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.rescheduleBtn} activeOpacity={0.8} onPress={handleReschedule}>
              <Ionicons name="refresh-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.rescheduleBtnText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8} onPress={handleCancel}>
              <Ionicons name="close-outline" size={16} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040406' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  trainerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#1A1A22',
  },
  trainerName: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 3 },
  trainerRole: { color: '#9CA3AF', fontSize: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  detailsSection: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#4B5563',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  detailLabel: { color: '#6B7280', fontSize: 13, flex: 1, marginLeft: 10 },
  detailValue: { color: '#E5E7EB', fontSize: 13, fontWeight: '700' },
  noteSection: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  noteText: { color: '#9CA3AF', fontSize: 13, fontStyle: 'italic', lineHeight: 20 },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rescheduleBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FF2A2A',
    borderRadius: 14,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rescheduleBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    borderRadius: 14,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: { color: '#EF4444', fontSize: 13, fontWeight: '800' },
});
