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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function JoinSuccessScreen() {
  const router = useRouter();

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
        <Text style={styles.title}>Request Received</Text>
        <Text style={styles.statusLabel}>STATUS: PENDING APPROVAL</Text>
        
        <Text style={styles.desc}>
          Your request to join has been successfully logged! Please visit the gym reception counter to settle payment and activate your offline QR Pass.
        </Text>

        <View style={styles.noteBox}>
          <Ionicons name="flash-outline" size={14} color="#FF2A2A" style={{ marginRight: 6 }} />
          <Text style={styles.noteText}>
            Demo Simulation: Gym management will automatically approve your membership in 15 seconds!
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
  desc: {
    color: '#9CA3AF',
    fontSize: 13.5,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 15,
    fontWeight: '550',
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
