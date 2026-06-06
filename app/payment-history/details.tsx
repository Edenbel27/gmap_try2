import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PaymentDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { payments } = useGMAP();

  const payment = payments.find(p => p.id === id) ?? payments[0];

  if (!payment) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#6B7280' }}>Payment record not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'pending': return '#FACC15';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const isGym = payment.item.includes('Membership');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Amount Hero */}
        <View style={styles.amountCard}>
          <View style={styles.iconCircle}>
            <Ionicons name={isGym ? 'fitness-outline' : 'barbell-outline'} size={28} color="#FF2A2A" />
          </View>
          <Text style={styles.amountValue}>{payment.amount} ETB</Text>
          <Text style={styles.amountItem}>{payment.item}</Text>
          <View style={[styles.statusPill, { backgroundColor: getStatusColor(payment.status) + '18' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
              {payment.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionLabel}>TRANSACTION DETAILS</Text>

          {[
            { icon: 'receipt-outline', label: 'Payment ID', value: payment.id.toUpperCase() },
            { icon: 'calendar-outline', label: 'Date', value: payment.date },
            { icon: 'wallet-outline', label: 'Method', value: payment.method },
            { icon: 'shield-checkmark-outline', label: 'Status', value: payment.status.charAt(0).toUpperCase() + payment.status.slice(1) },
          ].map(item => (
            <View key={item.label} style={styles.detailRow}>
              <Ionicons name={item.icon as any} size={15} color="#6B7280" />
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Info note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={14} color="#6B7280" style={{ marginRight: 6 }} />
          <Text style={styles.infoNoteText}>
            All payments are processed in person at the gym. Digital receipts are issued post-confirmation.
          </Text>
        </View>
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
  amountCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    padding: 28,
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,42,42,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 6,
  },
  amountItem: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 14,
  },
  statusPill: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  detailsCard: {
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
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  detailLabel: { color: '#6B7280', fontSize: 13, flex: 1, marginLeft: 10 },
  detailValue: { color: '#E5E7EB', fontSize: 13, fontWeight: '700' },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 14,
    padding: 12,
  },
  infoNoteText: {
    color: '#6B7280',
    fontSize: 11.5,
    lineHeight: 18,
    flex: 1,
  },
});
