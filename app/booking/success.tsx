import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function BookingSuccessScreen() {
  const router = useRouter();
  const { trainerId, day, time } = useLocalSearchParams();
  const { trainers } = useGMAP();

  const trainer = trainers.find((t) => t.id === trainerId);

  const handleDashboard = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        
        {/* Success Icon Block */}
        <View style={styles.iconWrapper}>
          <Ionicons name="hourglass" size={48} color="#FACC15" />
          <View style={styles.successPulseRing} />
        </View>

        {/* Text Details */}
        <Text style={styles.title}>Booking Requested</Text>
        <Text style={styles.statusLabel}>STATUS: PENDING APPROVAL</Text>
        
        {trainer && (
          <View style={styles.detailsBox}>
            <Text style={styles.detailsLabel}>SESSION DETAILS</Text>
            <Text style={styles.detailsTrainer}>{trainer.name}</Text>
            <Text style={styles.detailsTime}>{day} • {time}</Text>
            <Text style={styles.detailsPrice}>Price: {trainer.price} ETB</Text>
          </View>
        )}

        <View style={styles.noteBox}>
          <Ionicons name="flash-outline" size={14} color="#FF2A2A" style={{ marginRight: 6 }} />
          <Text style={styles.noteText}>
            Demo Simulation: The trainer will automatically confirm your session booking in 10 seconds!
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.doneBtn}
          onPress={handleDashboard}
          activeOpacity={0.85}
        >
          <Text style={styles.doneText}>GO TO DASHBOARD</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040406',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(250, 204, 21, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  successPulseRing: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    left: -4,
    right: -4,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.15)',
    opacity: 0.8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusLabel: {
    color: '#FACC15',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 20,
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.25)',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
  },
  detailsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsLabel: {
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  detailsTrainer: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  detailsTime: {
    color: '#FF2A2A',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 4,
  },
  detailsPrice: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 42, 42, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 42, 0.15)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 36,
    width: '100%',
  },
  noteText: {
    color: '#FF8080',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    flex: 1,
  },
  doneBtn: {
    backgroundColor: '#FF2A2A',
    width: '100%',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
