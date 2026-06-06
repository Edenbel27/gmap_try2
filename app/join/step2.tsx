import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function JoinStep2Screen() {
  const router = useRouter();
  const { gymId, planName, price, paymentMethod } = useLocalSearchParams();
  const { gyms, joinGym } = useGMAP();

  const gym = gyms.find((g) => g.id === gymId);

  if (!gym || !planName || !price || !paymentMethod) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid registration parameters.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleConfirm = () => {
    joinGym(gym.id, planName as string, Number.parseFloat(price as string), paymentMethod as string);
    router.push('/join/success');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review & Confirm</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 2/2</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.introText}>Please review your membership order details before confirming.</Text>

        {/* Confirmation review box */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>GYM</Text>
            <Text style={styles.summaryValLarge}>{gym.name}</Text>
            <Text style={styles.summarySub}>{gym.distance}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>MEMBERSHIP PLAN</Text>
            <Text style={styles.summaryVal}>{planName}</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>PAYMENT METHOD</Text>
            <Text style={styles.summaryVal}>{paymentMethod}</Text>
          </View>
        </View>

        {/* Totals box */}
        <View style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Plan Amount</Text>
            <Text style={styles.totalVal}>{price} ETB</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Registration Fee</Text>
            <Text style={styles.totalVal}>0 ETB</Text>
          </View>
          <View style={[styles.divider, { marginVertical: 8 }]} />
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Total Due Today</Text>
            <Text style={styles.grandTotalVal}>{price} ETB</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.confirmBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.confirmText}>CONFIRM & REGISTER</Text>
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
  stepIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  introText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 22,
    padding: 20,
    flex: 0.6,
    justifyContent: 'space-between',
  },
  summaryBlock: {
    marginVertical: 4,
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  summaryValLarge: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  summaryVal: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  summarySub: {
    color: '#9CA3AF',
    fontSize: 11.5,
    marginTop: 2,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginVertical: 10,
  },
  totalsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 18,
    padding: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  totalLabel: {
    color: '#6B7280',
    fontSize: 12.5,
    fontWeight: '600',
  },
  totalVal: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '700',
  },
  grandTotalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  grandTotalVal: {
    color: '#FF2A2A',
    fontSize: 18,
    fontWeight: '900',
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
  confirmText: {
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
