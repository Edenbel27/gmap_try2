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
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { currentUser } = useGMAP();

  const [name, setName] = useState(currentUser?.name ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [phone, setPhone] = useState('+251 9XX XXX XXXX');

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your account information has been saved successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{(name || 'U').charAt(0).toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Ionicons name="camera-outline" size={14} color="#FF2A2A" style={{ marginRight: 4 }} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#4B5563"
              placeholder="Your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#4B5563"
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#4B5563"
              placeholder="+251 9XX XXX XXXX"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SECURITY</Text>
          <TouchableOpacity style={styles.securityRow} onPress={() =>
            Alert.alert('Change Password', 'A password reset link will be sent to your email.')
          }>
            <Ionicons name="lock-closed-outline" size={16} color="#FFFFFF" style={{ marginRight: 10 }} />
            <Text style={styles.securityText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={16} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
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
  saveText: { color: '#FF2A2A', fontSize: 13, fontWeight: '800' },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,42,42,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,42,42,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLetter: { color: '#FF2A2A', fontSize: 32, fontWeight: '900' },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePhotoText: { color: '#FF2A2A', fontSize: 12, fontWeight: '700' },
  section: {
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
  inputGroup: { marginBottom: 14 },
  inputLabel: { color: '#6B7280', fontSize: 11, fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: '#E5E7EB',
    fontSize: 13,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  securityText: { color: '#E5E7EB', fontSize: 13.5, fontWeight: '600', flex: 1 },
  saveBtn: {
    backgroundColor: '#FF2A2A',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
