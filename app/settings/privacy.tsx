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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly to us when you create an account, join a gym, or book a trainer. This includes your name, email address, phone number, and fitness preferences. We may also collect usage data about how you interact with our platform.',
  },
  {
    title: '2. How We Use Your Data',
    body: 'Your data is used to provide and improve our services, process gym memberships and trainer bookings, send you relevant notifications about your activity, and personalize your experience. We do not sell your personal information to third parties.',
  },
  {
    title: '3. Data Sharing',
    body: 'We share your information with gyms and trainers only as necessary to facilitate your membership and bookings. Gym managers may view your name and membership status. Trainers may view your booking details.',
  },
  {
    title: '4. Data Security',
    body: 'We implement industry-standard security measures to protect your personal information. Your data is encrypted in transit and at rest. We regularly audit our security practices to ensure your data remains safe.',
  },
  {
    title: '5. Your Rights',
    body: 'You have the right to access, correct, or delete your personal data at any time. You may also opt out of marketing communications or request a copy of your data by contacting our support team.',
  },
  {
    title: '6. Cookies & Tracking',
    body: 'Our mobile application does not use browser cookies. We may use anonymous analytics to understand app usage patterns and improve performance. No personally identifiable information is included in analytics.',
  },
  {
    title: '7. Changes to Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or by email. Continued use of GMAP after changes constitutes acceptance of the updated policy.',
  },
  {
    title: '8. Contact Us',
    body: 'If you have questions or concerns about our privacy practices, please contact us at privacy@gmapethiopia.com or visit our support center within the app.',
  },
];

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.lastUpdated}>
          <Ionicons name="time-outline" size={13} color="#6B7280" style={{ marginRight: 6 }} />
          <Text style={styles.lastUpdatedText}>Last updated: May 1, 2026</Text>
        </View>

        <Text style={styles.intro}>
          GMAP ("we", "our", or "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our platform.
        </Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
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
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  lastUpdatedText: { color: '#6B7280', fontSize: 11.5, fontWeight: '600' },
  intro: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionBody: {
    color: '#9CA3AF',
    fontSize: 12.5,
    lineHeight: 20,
  },
});
