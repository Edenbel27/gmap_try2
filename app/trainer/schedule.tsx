import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BOOKING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const BOOKING_TIMES = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

export default function TrainerBookingScreen() {
  const router = useRouter();
  const { trainerId } = useLocalSearchParams();
  const { trainers, bookTrainer } = useGMAP();

  const trainer = trainers.find((t) => t.id === trainerId);

  const [selectedDay, setSelectedDay] = useState(BOOKING_DAYS[0]);
  const [selectedTime, setSelectedTime] = useState(BOOKING_TIMES[0]);
  const [note, setNote] = useState('');

  if (!trainer) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Trainer not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleConfirmBooking = () => {
    bookTrainer(trainer.id, selectedDay, selectedTime, note.trim());
    router.push(
      `/booking/success?trainerId=${trainer.id}&day=${selectedDay}&time=${selectedTime}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Schedule Session</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Trainer Card */}
          <View style={styles.trainerHeaderCard}>
            <View style={styles.trainerAvatar}>
              <Text style={styles.avatarText}>{trainer.name.substring(0, 1)}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.trainerName}>{trainer.name}</Text>
              <Text style={styles.trainerSpecialties}>{trainer.specialties.join(' • ')}</Text>
            </View>
            <Text style={styles.trainerPrice}>{trainer.price} ETB</Text>
          </View>

          {/* Day selection */}
          <Text style={styles.sectionTitle}>Select Weekday</Text>
          <View style={styles.daysRow}>
            {BOOKING_DAYS.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayChip, isSelected ? styles.dayChipActive : null]}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayChipText, isSelected ? styles.dayChipTextActive : null]}>
                    {day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Time selection */}
          <Text style={styles.sectionTitle}>Select Time Slot</Text>
          <View style={styles.timesRow}>
            {BOOKING_TIMES.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeChip, isSelected ? styles.timeChipActive : null]}
                  onPress={() => setSelectedTime(time)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.timeChipText, isSelected ? styles.timeChipTextActive : null]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Add custom note */}
          <Text style={styles.sectionTitle}>Add Session Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Type any specific goals or items you'd like to focus on during this workout session..."
            placeholderTextColor="#6B7280"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
          />

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleConfirmBooking}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.confirmBtnText}>CONFIRM BOOKING</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040406',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  trainerHeaderCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  trainerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  trainerName: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  trainerSpecialties: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  trainerPrice: {
    color: '#FF2A2A',
    fontSize: 16,
    fontWeight: '900',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 6,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayChip: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayChipActive: {
    backgroundColor: '#FF2A2A',
    borderColor: '#FF2A2A',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  dayChipText: {
    color: '#9CA3AF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  dayChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  timesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timeChip: {
    width: '48%',
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  timeChipActive: {
    backgroundColor: '#FF2A2A',
    borderColor: '#FF2A2A',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  timeChipText: {
    color: '#9CA3AF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  timeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    color: '#FFFFFF',
    padding: 14,
    fontSize: 13,
    lineHeight: 18,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 28,
  },
  confirmBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF2A2A',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#040406',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
