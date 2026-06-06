import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BookingsListScreen() {
  const router = useRouter();
  const { bookings } = useGMAP();

  const getStatusColor = (status: string) => {
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

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color="rgba(255,255,255,0.05)" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySubtitle}>Book a trainer session from the Discover screen.</Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/booking/details?id=${booking.id}`)}
            >
              <Image source={{ uri: booking.trainerPhoto }} style={styles.trainerPhoto} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <View style={styles.cardTop}>
                  <Text style={styles.trainerName}>{booking.trainerName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '18' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {booking.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.sessionInfo}>{booking.day}  ·  {booking.time}</Text>
                {booking.note ? (
                  <Text style={styles.noteText} numberOfLines={1}>"{booking.note}"</Text>
                ) : null}
                <Text style={styles.priceText}>{booking.price} ETB / session</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#4B5563" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          ))
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 6 },
  emptySubtitle: { color: '#6B7280', fontSize: 12, textAlign: 'center', paddingHorizontal: 20 },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  trainerPhoto: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#1A1A22',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  trainerName: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', flex: 1 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  sessionInfo: { color: '#9CA3AF', fontSize: 12, marginBottom: 3 },
  noteText: { color: '#6B7280', fontSize: 11, fontStyle: 'italic', marginBottom: 4 },
  priceText: { color: '#FF2A2A', fontSize: 12, fontWeight: '800' },
});
