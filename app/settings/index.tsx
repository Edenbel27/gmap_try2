import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, toggleSetting, logout } = useGMAP();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your GMAP account? This action is irreversible and will erase all membership, streak, and booking logs.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/onboarding');
          }
        }
      ]
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Switches Preference Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          {/* Dark Mode toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={18} color="#FFFFFF" style={{ marginRight: 12 }} />
              <Text style={styles.settingText}>Dark Mode (Default)</Text>
            </View>
            <Switch
              trackColor={{ false: '#2A2A35', true: '#FF8080' }}
              thumbColor={settings.darkMode ? '#FF2A2A' : '#9CA3AF'}
              ios_backgroundColor="#2A2A35"
              value={settings.darkMode}
              onValueChange={() => toggleSetting('darkMode')}
            />
          </View>

          {/* Push notifications toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={18} color="#FFFFFF" style={{ marginRight: 12 }} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: '#2A2A35', true: '#FF8080' }}
              thumbColor={settings.pushNotifications ? '#FF2A2A' : '#9CA3AF'}
              ios_backgroundColor="#2A2A35"
              value={settings.pushNotifications}
              onValueChange={() => toggleSetting('pushNotifications')}
            />
          </View>
        </View>

        {/* Legal/Info Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>About & Legal</Text>
          
          <TouchableOpacity style={styles.legalRow}>
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.legalRow}>
            <Text style={styles.legalText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={16} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Account Deletion Area */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.8} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

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
  settingsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 14,
    paddingLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    color: '#E5E7EB',
    fontSize: 13.5,
    fontWeight: '600',
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  legalText: {
    color: '#E5E7EB',
    fontSize: 13.5,
    fontWeight: '600',
  },
  deleteBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800',
  },
});
