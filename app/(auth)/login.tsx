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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useGMAP();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const result = await Promise.resolve(login(email.trim(), password));

    setIsSubmitting(false);

    if (result.success) {
      router.replace('/(tabs)/home');
      return;
    }

    if ((result.message || '').toLowerCase().includes('email not confirmed')) {
      setErrorMsg('Please verify your email before signing in.');
      return;
    }

    setErrorMsg(result.message || 'Unable to sign in. Please try again.');
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
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(auth)/onboarding')}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Heading */}
          <View style={styles.headerBlock}>
            <Text style={styles.brandTitle}>GMAP</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to access gyms, trainers, and your active pass.</Text>
          </View>

          {/* Form */}
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

            {/* Password Field */}
            <View style={styles.passwordHeader}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotBtnText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
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

            {/* Submit */}
            <TouchableOpacity
              style={[styles.signInBtn, isSubmitting && { opacity: 0.7 }]}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              <Text style={styles.signInText}>{isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}</Text>
            </TouchableOpacity>

            {/* Google Sign In Option */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
              <Ionicons name="logo-google" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.googleBtnText}>Google Sign In</Text>
            </TouchableOpacity>

          </View>

          {/* Footer link to register */}
          <View style={styles.footerLinkRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.signUpLinkText}>Create Account</Text>
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
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14.5,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF2A2A',
    marginBottom: 8,
  },
  signInBtn: {
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
  signInText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  dividerText: {
    color: '#4B5563',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginHorizontal: 14,
  },
  googleBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  googleBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
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
  signUpLinkText: {
    color: '#FF2A2A',
    fontSize: 13,
    fontWeight: '700',
  },
});
