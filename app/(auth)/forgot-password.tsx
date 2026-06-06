import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {submitted ? (
            /* Success confirmation display */
            <View style={styles.successBlock}>
              <View style={styles.successIconWrapper}>
                <Ionicons name="mail-open-outline" size={48} color="#10B981" />
              </View>
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.successSubtitle}>
                We've sent a password reset link to <Text style={styles.boldEmail}>{email.trim()}</Text>. Please follow the instructions to set a new password.
              </Text>
              
              <TouchableOpacity 
                style={styles.actionBtn} 
                activeOpacity={0.85} 
                onPress={() => router.replace('/(auth)/login')}
              >
                <Text style={styles.actionText}>BACK TO SIGN IN</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Input Form display */
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={styles.headerBlock}>
                <Text style={styles.brandTitle}>GMAP SECURITY</Text>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Enter the email associated with your account, and we'll send recovery instructions.</Text>
              </View>

              <View style={styles.form}>
                {errorMsg ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  </View>
                ) : null}

                {/* Email Field */}
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#6B7280"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* Submit */}
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85} onPress={handleSubmit}>
                  <Text style={styles.actionText}>SEND INSTRUCTIONS</Text>
                </TouchableOpacity>

              </View>
            </View>
          )}

          {/* Empty bottom element for flex spacing alignment */}
          <View />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040406',
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    paddingTop: 10,
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  headerBlock: {
    marginTop: 20,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF2A2A',
    letterSpacing: 3,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12.5,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14.5,
  },
  actionBtn: {
    backgroundColor: '#FF2A2A',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  successBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 40,
  },
  successIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successSubtitle: {
    fontSize: 14.5,
    color: '#9CA3AF',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 15,
  },
  boldEmail: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
