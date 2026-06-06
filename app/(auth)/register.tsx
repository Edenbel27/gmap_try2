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
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useGMAP();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setInfoMsg('');

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const result = await Promise.resolve(register(name.trim(), email.trim(), password));

    setIsSubmitting(false);

    if (result.success && !result.requiresEmailConfirmation) {
      router.replace('/(tabs)/home');
      return;
    }

    if (result.requiresEmailConfirmation) {
      setErrorMsg('');
      setInfoMsg(result.message || 'Check your email to confirm your account before signing in.');
      return;
    }

    setErrorMsg(result.message || 'Unable to create account. Please try again.');
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

          {/* Heading */}
          <View style={styles.headerBlock}>
            <Text style={styles.brandTitle}>GMAP</Text>
            <Text style={styles.title}>Join Gym Zone</Text>
            <Text style={styles.subtitle}>Create an account to explore local gyms and trainers.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {errorMsg ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {infoMsg ? (
              <View style={styles.infoContainer}>
                <Ionicons name="mail-open-outline" size={16} color="#38BDF8" style={{ marginRight: 6 }} />
                <Text style={styles.infoText}>{infoMsg}</Text>
              </View>
            ) : null}

            {/* Name Field */}
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your name"
                placeholderTextColor="#6B7280"
                value={name}
                onChangeText={setName}
              />
            </View>

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

            {/* Password Field */}
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Choose password (min 6 chars)"
                placeholderTextColor="#6B7280"
                secureTextEntry={secureText}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons name={secureText ? "eye-outline" : "eye-off-outline"} size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Field */}
            <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Re-enter password"
                placeholderTextColor="#6B7280"
                secureTextEntry={secureText}
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.signUpBtn, isSubmitting && { opacity: 0.7 }]}
              activeOpacity={0.85}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              <Text style={styles.signUpText}>{isSubmitting ? 'CREATING...' : 'CREATE ACCOUNT'}</Text>
            </TouchableOpacity>

          </View>

          {/* Footer link to login */}
          <View style={styles.footerLinkRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.signInLinkText}>Sign In</Text>
            </TouchableOpacity>
          </View>

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
    marginTop: 15,
    marginBottom: 15,
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
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    color: '#BAE6FD',
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
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14.5,
  },
  signUpBtn: {
    backgroundColor: '#FF2A2A',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
  signInLinkText: {
    color: '#FF2A2A',
    fontSize: 13,
    fontWeight: '700',
  },
});
