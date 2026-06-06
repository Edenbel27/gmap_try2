import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const { payments } = useGMAP();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'pending': return '#FACC15';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {payments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color="rgba(255,255,255,0.05)" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No transaction history</Text>
            <Text style={styles.emptySubtitle}>Billing statements will show up once memberships or bookings are logged.</Text>
          </View>
        ) : (
          payments.map((p) => (
            <View key={p.id} style={styles.paymentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.itemTitle} numberOfLines={1}>{p.item}</Text>
                <Text style={styles.amountText}>{p.amount} ETB</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.label}>DATE</Text>
                  <Text style={styles.value}>{p.date}</Text>
                </View>
                <View>
                  <Text style={styles.label}>METHOD</Text>
                  <Text style={styles.value}>{p.method}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.label}>STATUS</Text>
                  <Text style={[styles.statusText, { color: getStatusColor(p.status) }]}>
                    {p.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  paymentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    paddingRight: 10,
  },
  amountText: {
    color: '#FF2A2A',
    fontSize: 15,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#6B7280',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  value: {
    color: '#E5E7EB',
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
});
