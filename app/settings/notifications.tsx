import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface NotifPref {
  key: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  defaultOn: boolean;
}

const NOTIFICATION_PREFS: NotifPref[] = [
  {
    key: 'membership',
    label: 'Membership Alerts',
    description: 'Approval, renewal reminders, and expiry notices.',
    icon: 'fitness-outline',
    color: '#FF2A2A',
    defaultOn: true,
  },
  {
    key: 'booking',
    label: 'PT Booking Updates',
    description: 'Trainer confirmations, cancellations, and reminders.',
    icon: 'calendar-outline',
    color: '#8B5CF6',
    defaultOn: true,
  },
  {
    key: 'classes',
    label: 'Class Reminders',
    description: 'Alerts 30 minutes before a registered class.',
    icon: 'people-outline',
    color: '#3B82F6',
    defaultOn: true,
  },
  {
    key: 'checkin',
    label: 'Check-In Confirmations',
    description: 'Notifications when your QR pass is scanned.',
    icon: 'qr-code-outline',
    color: '#10B981',
    defaultOn: true,
  },
  {
    key: 'announcements',
    label: 'Gym Announcements',
    description: 'General news, promos, and event broadcasts.',
    icon: 'megaphone-outline',
    color: '#FACC15',
    defaultOn: false,
  },
];

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_PREFS.map(p => [p.key, p.defaultOn]))
  );

  const toggle = (key: string) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Choose which alerts you want to receive from GMAP.
        </Text>

        <View style={styles.card}>
          {NOTIFICATION_PREFS.map((pref, index) => (
            <View
              key={pref.key}
              style={[
                styles.prefRow,
                index < NOTIFICATION_PREFS.length - 1 && styles.prefRowBorder,
              ]}
            >
              <View style={[styles.prefIcon, { backgroundColor: pref.color + '15' }]}>
                <Ionicons name={pref.icon as any} size={16} color={pref.color} />
              </View>
              <View style={styles.prefText}>
                <Text style={styles.prefLabel}>{pref.label}</Text>
                <Text style={styles.prefDescription}>{pref.description}</Text>
              </View>
              <Switch
                trackColor={{ false: '#2A2A35', true: '#FF8080' }}
                thumbColor={prefs[pref.key] ? '#FF2A2A' : '#9CA3AF'}
                ios_backgroundColor="#2A2A35"
                value={prefs[pref.key]}
                onValueChange={() => toggle(pref.key)}
              />
            </View>
          ))}
        </View>

        <View style={styles.footNote}>
          <Ionicons name="shield-checkmark-outline" size={13} color="#6B7280" style={{ marginRight: 6 }} />
          <Text style={styles.footNoteText}>
            We never send spam. Notifications are only sent for activity you care about.
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
  intro: {
    color: '#6B7280',
    fontSize: 12.5,
    marginBottom: 20,
    lineHeight: 18,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 8,
    marginBottom: 16,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  prefRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  prefIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  prefText: { flex: 1, marginRight: 8 },
  prefLabel: { color: '#E5E7EB', fontSize: 13.5, fontWeight: '700', marginBottom: 3 },
  prefDescription: { color: '#6B7280', fontSize: 11, lineHeight: 16 },
  footNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 14,
    padding: 12,
  },
  footNoteText: { color: '#6B7280', fontSize: 11.5, lineHeight: 18, flex: 1 },
});
