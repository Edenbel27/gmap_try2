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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FAQ_ITEMS = [
  {
    q: 'How do I cancel my gym membership?',
    a: 'Visit the gym in person and speak with the front desk. You can also contact us via the form below and we\'ll coordinate directly with the gym on your behalf.',
  },
  {
    q: 'My QR pass isn\'t scanning. What should I do?',
    a: 'Ensure your screen brightness is at maximum and hold the code steady under the scanner. If the problem persists, contact your gym or use the "Report Issue" option below.',
  },
  {
    q: 'How long does membership approval take?',
    a: 'Gym managers typically approve memberships within 24 hours of your request and payment confirmation. You\'ll receive a notification once approved.',
  },
  {
    q: 'Can I book more than one trainer?',
    a: 'Yes! You can have multiple active trainer bookings. Browse the Discover screen and book as many sessions as you need.',
  },
  {
    q: 'How do I update my payment information?',
    a: 'Currently, GMAP uses pay-in-person for all transactions. No card details are stored. Visit your gym\'s front desk for payment queries.',
  },
];

export default function SupportScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please describe your issue before sending.');
      return;
    }
    Alert.alert(
      'Message Sent',
      'Our team will respond within 24 hours. You\'ll receive a notification when we reply.',
      [{ text: 'OK', onPress: () => setMessage('') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Contact Options */}
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactCard} activeOpacity={0.8}
            onPress={() => Alert.alert('Call Support', 'Dialling +251 11 XXX XXXX...')}>
            <Ionicons name="call-outline" size={22} color="#10B981" />
            <Text style={styles.contactLabel}>Call Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactCard} activeOpacity={0.8}
            onPress={() => Alert.alert('Email Support', 'Opening email to support@gmapethiopia.com')}>
            <Ionicons name="mail-outline" size={22} color="#3B82F6" />
            <Text style={styles.contactLabel}>Email Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactCard} activeOpacity={0.8}
            onPress={() => Alert.alert('Live Chat', 'Live chat is available weekdays 8AM–6PM.')}>
            <Ionicons name="chatbubbles-outline" size={22} color="#8B5CF6" />
            <Text style={styles.contactLabel}>Live Chat</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <Text style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
        {FAQ_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqCard}
            activeOpacity={0.8}
            onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.q}</Text>
              <Ionicons
                name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#6B7280"
              />
            </View>
            {expandedIndex === index && (
              <Text style={styles.faqAnswer}>{item.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Send Message */}
        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>SEND US A MESSAGE</Text>
        <View style={styles.messageCard}>
          <TextInput
            style={styles.messageInput}
            placeholder="Describe your issue or question..."
            placeholderTextColor="#4B5563"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.sendBtn} activeOpacity={0.85} onPress={handleSendMessage}>
            <Ionicons name="send-outline" size={15} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.sendBtnText}>Send Message</Text>
          </TouchableOpacity>
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
  contactRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  contactCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  contactLabel: { color: '#9CA3AF', fontSize: 11, fontWeight: '700' },
  sectionLabel: {
    color: '#4B5563',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  faqCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: { color: '#E5E7EB', fontSize: 13, fontWeight: '700', flex: 1, paddingRight: 10 },
  faqAnswer: {
    color: '#9CA3AF',
    fontSize: 12.5,
    lineHeight: 20,
    marginTop: 10,
  },
  messageCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 16,
  },
  messageInput: {
    color: '#E5E7EB',
    fontSize: 13,
    minHeight: 100,
    marginBottom: 14,
  },
  sendBtn: {
    backgroundColor: '#FF2A2A',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});
