import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = ['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'];

export default function RescheduleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings } = useGMAP();

  const booking = bookings.find(b => b.id === id) ?? bookings[0];

  const [selectedDay, setSelectedDay] = useState(booking?.day ?? 'Monday');
  const [selectedTime, setSelectedTime] = useState(booking?.time ?? '09:00 AM');
  const [note, setNote] = useState(booking?.note ?? '');

  const handleConfirm = () => {
    Alert.alert(
      'Reschedule Requested',
      `Your session has been rescheduled to ${selectedDay} at ${selectedTime}. Awaiting trainer confirmation.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reschedule Session</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {booking && (
          <View style={styles.currentInfo}>
            <Ionicons name="information-circle-outline" size={14} color="#FACC15" style={{ marginRight: 6 }} />
            <Text style={styles.currentInfoText}>
              Current: {booking.day}  ·  {booking.time}
            </Text>
          </View>
        )}

        {/* Day picker */}
        <Text style={styles.sectionTitle}>SELECT NEW DAY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {DAYS.map(day => (
            <TouchableOpacity
              key={day}
              style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayChipText, selectedDay === day && styles.dayChipTextActive]}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time picker */}
        <Text style={styles.sectionTitle}>SELECT NEW TIME</Text>
        <View style={styles.timeGrid}>
          {TIMES.map(time => (
            <TouchableOpacity
              key={time}
              style={[styles.timeChip, selectedTime === time && styles.timeChipActive]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeChipText, selectedTime === time && styles.timeChipTextActive]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <Text style={styles.sectionTitle}>UPDATE NOTE (OPTIONAL)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note for your trainer..."
          placeholderTextColor="#4B5563"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>New Schedule</Text>
          <Text style={styles.summaryLine}>{selectedDay}  ·  {selectedTime}</Text>
        </View>

        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} onPress={handleConfirm}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.confirmBtnText}>Confirm Reschedule</Text>
        </TouchableOpacity>
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
  currentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250,204,21,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(250,204,21,0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  currentInfoText: { color: '#FACC15', fontSize: 12, fontWeight: '700' },
  sectionTitle: {
    color: '#4B5563',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  dayChipActive: {
    backgroundColor: '#FF2A2A',
    borderColor: '#FF2A2A',
  },
  dayChipText: { color: '#9CA3AF', fontSize: 13, fontWeight: '700' },
  dayChipTextActive: { color: '#FFFFFF' },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  timeChipActive: {
    backgroundColor: 'rgba(255,42,42,0.15)',
    borderColor: 'rgba(255,42,42,0.4)',
  },
  timeChipText: { color: '#9CA3AF', fontSize: 12.5, fontWeight: '700' },
  timeChipTextActive: { color: '#FF2A2A' },
  noteInput: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 14,
    color: '#E5E7EB',
    fontSize: 13,
    minHeight: 80,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,42,42,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,42,42,0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryTitle: { color: '#9CA3AF', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  summaryLine: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  confirmBtn: {
    backgroundColor: '#FF2A2A',
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
