import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const cardWidth = isWeb ? Math.min(width * 0.86, 420) : width * 0.86;
const lottieSize = isWeb ? Math.min(width * 0.72, 320) : width * 0.72;
const finalLottieSize = isWeb ? Math.min(width * 0.76, 340) : width * 0.76;
const finalGlowSize = isWeb ? Math.min(width * 0.85, 420) : width * 0.85;
const contentMaxWidth = isWeb ? 460 : undefined;

const ONBOARDING_DATA = [
  {
    id: '1',
    tag: 'DISCOVER GYMS',
    title: 'Find Gyms in\nAddis Ababa',
    subtitle:
      'Search and locate premium fitness centers, crossfit boxes, and iron bodybuilding hubs near you instantly.',
    animation: require('../../assets/animations/onboarding1.json'),
    iconBg: 'rgba(255, 42, 42, 0.07)',
  },
  {
    id: '2',
    tag: 'EXPERT TRAINERS',
    title: 'Book Certified\nPersonal Trainers',
    subtitle:
      "Schedule workout sessions with Addis's top trainers, view their reviews, prices, and specialties.",
    animation: require('../../assets/animations/onboarding2.json'),
    iconBg: 'rgba(255, 42, 42, 0.07)',
  },
  {
    id: '3',
    title: 'GMAP',
    subtitle: 'Every gym in Addis',
    isFinal: true,
    animation: require('../../assets/animations/login.json'),
  },
];

type DotProps = { index: number; scrollX: Animated.Value };

const Dot = ({ index, scrollX }: DotProps) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const dotWidth = scrollX.interpolate({ inputRange, outputRange: [6, 22, 6], extrapolate: 'clamp' });
  const opacity = scrollX.interpolate({ inputRange, outputRange: [0.25, 1, 0.25], extrapolate: 'clamp' });
  return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} />;
};

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<Animated.FlatList<any>>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) setCurrentIndex(viewableItems[0].index);
  }).current;

  const goNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      (flatListRef.current as any)?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };



  // ── Render each slide ─────────────────────────────────────────────────────
  const renderItem = ({ item, index }: { item: typeof ONBOARDING_DATA[0]; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    // Card: zoom-in from 0.82 as the slide enters, zoom-out as it leaves
    const cardScale = scrollX.interpolate({
      inputRange,
      outputRange: [0.82, 1, 0.82],
      extrapolate: 'clamp',
    });
    const cardOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    // Text parallax: moves at ~30% of scroll speed, giving depth
    const textTranslateX = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.3, 0, -width * 0.3],
      extrapolate: 'clamp',
    });
    const textOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    // Subtle vertical float for text
    const textTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [24, 0, 24],
      extrapolate: 'clamp',
    });

    if (item.isFinal) {
      return (
        <View style={styles.slide}>
          <View style={styles.finalBgGlow} />

          {/* Lottie centered */}
          <Animated.View
            style={[
              styles.finalLottieWrapper,
              { transform: [{ scale: cardScale }], opacity: cardOpacity },
            ]}
          >
            <View style={styles.finalLottieBg} />
            <LottieView
              source={item.animation}
              autoPlay
              loop
              style={styles.finalLottie}
            />
          </Animated.View>

          {/* Brand row */}
          <Animated.View
            style={[
              styles.finalBrandRow,
              {
                opacity: textOpacity,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            <Image
              source={require('../../assets/images/lanucher_icon.png')}
              style={styles.finalLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.finalTitle}>{item.title}</Text>
              <Text style={styles.finalSubtitle}>{item.subtitle}</Text>
            </View>
          </Animated.View>

          {/* CTA buttons */}
          <View style={[styles.authContainer, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>JOIN TODAY</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.primaryBtn}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.primaryBtnText}>GET STARTED</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.secondaryBtn}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.secondaryBtnText}>Sign In to Account</Text>
            </TouchableOpacity>

            <Text style={styles.footerCredit}>from Falcon Fitness</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.slide}>
        {/* Background glow tint */}
        <View style={styles.slideTopGlow} />

        {/* Animation card with scale + fade */}
        <Animated.View
          style={[
            styles.animCard,
            {
              transform: [{ scale: cardScale }],
              opacity: cardOpacity,
            },
          ]}
        >
          <View style={[styles.animCardInner, { backgroundColor: item.iconBg }]}>
            <LottieView source={item.animation} autoPlay loop style={styles.lottie} />
          </View>
        </Animated.View>

        {/* Text with parallax + fade */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [
                { translateX: textTranslateX },
                { translateY: textTranslateY },
              ],
            },
          ]}
        >
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>

          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>

          {currentIndex < ONBOARDING_DATA.length - 1 && (
            <View style={styles.paginationInline}>
              {ONBOARDING_DATA.map((d, i) => (
                    <Dot key={d.id} index={i} scrollX={scrollX} />
                  ))}
            </View>
          )}

          <View style={styles.featureRow}>
            <View style={styles.featurePill}>
              <Text style={styles.featurePillText}>
                {index === 0 ? 'Nearby Gyms' : 'Top Rated'}
              </Text>
            </View>
            <View style={styles.featurePill}>
              <Text style={styles.featurePillText}>
                {index === 0 ? 'Real-time' : 'Easy Booking'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Next button */}
        <View style={[styles.nextBtnContainer, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
          <TouchableOpacity activeOpacity={0.85} style={styles.nextBtn} onPress={goNext}>
            <Text style={styles.nextBtnText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#08080A" />

      {/* Skip */}
      {currentIndex < ONBOARDING_DATA.length - 1 && (
        <TouchableOpacity
          style={[styles.skipBtn, { top: Math.max(insets.top, 12) + 8 }]}
          onPress={() => (flatListRef.current as any)?.scrollToEnd({ animated: true })}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        decelerationRate="fast"
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080A' },

  skipBtn: {
    position: 'absolute',
    top: 0,
    right: 24,
    zIndex: 99,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  skipText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },

  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  slideTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.52,
    marginTop: 8,
    marginBottom: 8,
  },

  // ── Animation card ──
  animCard: {
    marginTop: height * 0.07,
    width: cardWidth,
    aspectRatio: 1,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  animCardInner: {
    flex: 1,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: lottieSize,
    height: lottieSize,
  },

  // ── Text ──
  textContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 18,
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 42, 42, 0.09)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 42, 0.25)',
    marginBottom: 18,
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#FF2A2A',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
    letterSpacing: 0.3,
  },
  slideSubtitle: {
    fontSize: 14.5,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    marginTop: 2,
  },
  paginationInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 10,
    marginTop: 10,
    marginBottom: 14,
  },
  featurePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 42, 0.25)',
    backgroundColor: 'rgba(255, 42, 42, 0.05)',
  },
  featurePillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FF2A2A',
  },

  // ── Next button ──
  nextBtnContainer: {
    width: '100%',
    paddingHorizontal: 28,
  },
  nextBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF2A2A',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  // ── Dots ──
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
    backgroundColor: '#FF2A2A',
  },

  // ── Final slide ──────────────────────────────────────────────────────────
  finalBgGlow: {
    position: 'absolute',
    top: height * 0.05,
    alignSelf: 'center',
    width: finalGlowSize,
    height: finalGlowSize,
    borderRadius: finalGlowSize * 0.5,
    backgroundColor: '#FF2A2A',
    opacity: 0.05,
    transform: [{ scale: 1.6 }],
  },
  finalLottieWrapper: {
    marginTop: height * 0.07,
    width: finalLottieSize,
    height: finalLottieSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalLottieBg: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: 100,
    backgroundColor: 'rgba(255,42,42,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,42,42,0.12)',
  },
  finalLottie: {
    width: finalLottieSize,
    height: finalLottieSize,
  },
  finalBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  finalLogo: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  finalTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'serif',
    letterSpacing: 4,
    textShadowColor: 'rgba(255,42,42,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  finalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'serif',
    letterSpacing: 0.5,
  },

  // CTA
  authContainer: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  dividerLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#4B5563',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  primaryBtn: {
    backgroundColor: '#FF2A2A',
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 12,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  secondaryBtnText: {
    color: '#D1D5DB',
    fontSize: 15,
    fontWeight: '600',
  },
  footerCredit: {
    fontSize: 11,
    color: '#374151',
    fontFamily: 'serif',
    letterSpacing: 0.5,
  },
});