import React, { useEffect, useRef } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // Entrance animations
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  // Pulse glow
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  // Loading bar
  const loadingProgress = useRef(new Animated.Value(0)).current;

  // Floating particles
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;
  const particle1Opacity = useRef(new Animated.Value(0.4)).current;
  const particle2Opacity = useRef(new Animated.Value(0.6)).current;
  const particle3Opacity = useRef(new Animated.Value(0.3)).current;

  const [supabaseStatus, setSupabaseStatus] = React.useState<string>("Testing Supabase...");

  useEffect(() => {
  //     {const testSupabase = async () => {
  //   try {
  //     const { data, error } = await supabase.auth.getSession();

  //     console.log("SUPABASE DATA:", data);
  //     console.log("SUPABASE ERROR:", error);

  //     if (error) {
  //       setSupabaseStatus("❌ Supabase Error: " + error.message);
  //     } else {
  //       setSupabaseStatus("✅ Supabase Connected (Session OK)");
  //     }

  //   } catch (err: any) {
  //     console.log("SUPABASE CATCH ERROR:", err);
  //     setSupabaseStatus("❌ Connection Failed");
  //   }
  // };

  // testSupabase();
  // }, []);
    

    // --- Entrance sequence ---
    Animated.sequence([
      // Logo pops in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Title slides up
      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
      // Subtitle & footer fade in
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // --- Loading bar fills over 4.5s ---
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 4500,
      useNativeDriver: false,
    }).start();

    // --- Pulse glow loop ---
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowScale, { toValue: 1.2, duration: 1400, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.65, duration: 1400, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, { toValue: 1.0, duration: 1400, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.3, duration: 1400, useNativeDriver: true }),
        ]),
      ])
    );
    pulse.start();

    // --- Floating particle loops ---
    const makeFloat = (val: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: -18, duration, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration, useNativeDriver: true }),
        ])
      );
    const makeOpacityPulse = (val: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0.2, duration, useNativeDriver: true }),
        ])
      );

    makeFloat(particle1Y, 2200).start();
    makeFloat(particle2Y, 1800).start();
    makeFloat(particle3Y, 2600).start();
    makeOpacityPulse(particle1Opacity, 2200).start();
    makeOpacityPulse(particle2Opacity, 1800).start();
    makeOpacityPulse(particle3Opacity, 2600).start();

    // --- Navigate after 5s ---
    const navTimer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 5000);

    return () => {
      pulse.stop();
      clearTimeout(navTimer);
    };
  }
  , []);

  const loadingBarWidth = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#040406" />

      {/* Deep ambient background glow */}
      <View style={styles.ambientGlow} />
      <View style={styles.ambientGlow2} />

      {/* Corner decorations */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.cornerBracket, styles.cornerTL]} />
        <View style={[styles.cornerBracket, styles.cornerTR, { transform: [{ rotate: '90deg' }] }]} />
        <View style={[styles.cornerBracket, styles.cornerBL, { transform: [{ rotate: '270deg' }] }]} />
        <View style={[styles.cornerBracket, styles.cornerBR, { transform: [{ rotate: '180deg' }] }]} />
      </View>

      {/* Floating particles */}
      <Animated.View style={[styles.particle, styles.particle1, { transform: [{ translateY: particle1Y }], opacity: particle1Opacity }]} />
      <Animated.View style={[styles.particle, styles.particle2, { transform: [{ translateY: particle2Y }], opacity: particle2Opacity }]} />
      <Animated.View style={[styles.particle, styles.particle3, { transform: [{ translateY: particle3Y }], opacity: particle3Opacity }]} />

      {/* Center Content */}
      <View style={styles.centerContent}>
        {/* Logo with glow */}
        <Animated.View style={[styles.logoWrapper, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
          <Animated.View style={[styles.glowRing, { transform: [{ scale: glowScale }], opacity: glowOpacity }]} />
          <View style={styles.glowRingMid} />
          <View style={styles.logoBorder}>
            <Image
              source={require('../assets/images/lanucher_icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={[styles.title, { transform: [{ translateY: titleTranslateY }], opacity: titleOpacity }]}
        >
          GMAP
        </Animated.Text>

        {/* Subtitle badge */}
        <Animated.View style={[styles.subtitleBadge, { opacity: subtitleOpacity }]}>
          <Text style={styles.subtitleDot}>◆</Text>
          <Text style={styles.subtitle}>EVERY GYM IN ADDIS</Text>
          <Text style={styles.subtitleDot}>◆</Text>
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footerContainer, { opacity: footerOpacity }]}>
        <Text style={styles.footerLabel}>DESIGNED BY</Text>
        <Text style={styles.footerBrand}>FALCON FITNESS</Text>

        {/* Loading bar */}
        <View style={styles.loadingBarTrack}>
          <Animated.View style={[styles.loadingBarFill, { width: loadingBarWidth }]} />
        </View>
        <Text style={styles.loadingLabel}>LOADING...</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040406',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    top: height * 0.15,
    alignSelf: 'center',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: '#FF1E1E',
    opacity: 0.04,
    transform: [{ scale: 1.8 }],
  },
  ambientGlow2: {
    position: 'absolute',
    bottom: height * 0.1,
    left: -width * 0.2,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: '#7B1FA2',
    opacity: 0.04,
    transform: [{ scale: 1.5 }],
  },
  // Corner bracket decorations
  cornerBracket: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: 'rgba(255, 42, 42, 0.2)',
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTL: { top: 50, left: 24 },
  cornerTR: { top: 50, right: 24 },
  cornerBL: { bottom: 50, left: 24 },
  cornerBR: { bottom: 50, right: 24 },
  // Particles
  particle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#FF2A2A',
  },
  particle1: { width: 6, height: 6, top: height * 0.28, left: width * 0.15 },
  particle2: { width: 4, height: 4, top: height * 0.45, right: width * 0.12 },
  particle3: { width: 5, height: 5, top: height * 0.62, left: width * 0.3 },
  // Logo area
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
  },
  glowRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 44,
    backgroundColor: '#FF2A2A',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 30,
  },
  glowRingMid: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 42, 0.35)',
  },
  logoBorder: {
    padding: 4,
    borderRadius: 30,
    backgroundColor: '#0A0A0E',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 42, 42, 0.5)',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
  logo: {
    width: 115,
    height: 115,
    borderRadius: 26,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'serif',
    letterSpacing: 8,
    marginBottom: 16,
    textShadowColor: 'rgba(255, 42, 42, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 42, 42, 0.06)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 42, 0.2)',
    gap: 8,
  },
  subtitleDot: {
    color: '#FF2A2A',
    fontSize: 7,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D1D5DB',
    fontFamily: 'monospace',
    letterSpacing: 3,
  },
  // Footer
  footerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 40,
  },
  footerLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.25)',
    letterSpacing: 3,
    marginBottom: 4,
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F9FAFB',
    fontFamily: 'serif',
    letterSpacing: 3,
    marginBottom: 20,
  },
  loadingBarTrack: {
    width: '70%',
    height: 2,
    backgroundColor: 'rgba(255, 42, 42, 0.12)',
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#FF2A2A',
    borderRadius: 1,
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  loadingLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.18)',
    letterSpacing: 3,
    fontFamily: 'monospace',
  },
});