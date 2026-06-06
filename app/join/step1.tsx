import React, { useState } from 'react';
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

export default function JoinStep1Screen() {
  const router = useRouter();
  const { gymId, planName, price } = useLocalSearchParams();
  const { gyms } = useGMAP();

  const gym = gyms.find((g) => g.id === gymId);
  const [paymentMethod, setPaymentMethod] = useState('Pay In Person');

  if (!gym || !planName) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid registration parameters.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleNext = () => {
    router.push(
      `/join/step2?gymId=${gym.id}&planName=${planName}&price=${price}&paymentMethod=${paymentMethod}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Payment Method</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 1/2</Text>
        </View>
      </View>

      <View style={styles.content}>
        
        {/* Selection Review */}
        <View style={styles.reviewCard}>
          <Text style={styles.gymName}>{gym.name}</Text>
          <Text style={styles.planName}>{planName}</Text>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Monthly Cost</Text>
            <Text style={styles.priceVal}>{price} ETB</Text>
          </View>
        </View>

        {/* Payment selector */}
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        
        {/* Option 1: Pay In Person */}
        <TouchableOpacity 
          style={[styles.paymentOption, paymentMethod === 'Pay In Person' ? styles.paymentOptionActive : null]}
          onPress={() => setPaymentMethod('Pay In Person')}
          activeOpacity={0.8}
        >
          <View style={styles.paymentLeft}>
            <View style={[styles.iconBg, paymentMethod === 'Pay In Person' ? styles.iconBgActive : null]}>
              <Ionicons 
                name="cash-outline" 
                size={18} 
                color={paymentMethod === 'Pay In Person' ? '#FFFFFF' : '#9CA3AF'} 
              />
            </View>
            <View>
              <Text style={styles.optionTitle}>Pay In Person</Text>
              <Text style={styles.optionDesc}>Complete registration and settle payment at the gym front desk.</Text>
            </View>
          </View>
          
          <View style={styles.radioOutline}>
            {paymentMethod === 'Pay In Person' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        {/* Option 2: Card (Locked in simulation) */}
        <TouchableOpacity 
          style={[styles.paymentOption, styles.paymentOptionDisabled]}
          disabled
          activeOpacity={0.8}
        >
          <View style={styles.paymentLeft}>
            <View style={styles.iconBg}>
              <Ionicons name="card-outline" size={18} color="#4B5563" />
            </View>
            <View>
              <Text style={[styles.optionTitle, { color: '#6B7280' }]}>Credit/Debit Card (Online)</Text>
              <Text style={styles.optionDesc}>Pay instantly using local gateway. (Coming Soon)</Text>
            </View>
          </View>
          
          <View style={[styles.radioOutline, { borderColor: '#4B5563' }]} />
        </TouchableOpacity>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.nextBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>CONTINUE TO REVIEW</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
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
    justifyContent: 'flex-start',
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  gymName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  planName: {
    color: '#FF2A2A',
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
    letterSpacing: 1,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  priceVal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: '#FF2A2A',
    backgroundColor: 'rgba(255, 42, 42, 0.02)',
  },
  paymentOptionDisabled: {
    opacity: 0.5,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconBgActive: {
    backgroundColor: '#FF2A2A',
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  optionDesc: {
    color: '#6B7280',
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 2,
    paddingRight: 8,
  },
  radioOutline: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF2A2A',
  },
  nextBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF2A2A',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextText: {
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
