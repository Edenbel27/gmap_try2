import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const {
    currentUser,
    membership,
    bookings,
    classRegistrations,
    checkIns,
    classes,
    streak,
  } = useGMAP();

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayWeekday = weekdays[new Date().getDay()];

  const registeredClasses = classes.filter(
    (cls) => classRegistrations.includes(cls.id) && cls.day === todayWeekday
  );

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'pending': return '#FACC15';
      case 'expired': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.usernameText}>{currentUser?.name || 'Athlete'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, styles.iconBtnRed]}
            onPress={() => router.push('/(tabs)/pass')}
          >
            <Ionicons name="qr-code" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Streak Hero Card ──────────────────────────────────────────── */}
        <View style={styles.streakCard}>
          <View style={styles.streakCardBg} />
          <View style={styles.streakRow}>
            <View style={styles.streakLeft}>
              <Ionicons name="flame" size={32} color="#FF5A2A" />
              <View style={styles.streakTextGroup}>
                <Text style={styles.streakCount}>{streak.count} Day Streak</Text>
                <Text style={styles.streakSub}>
                  {streak.count > 3
                    ? 'On fire! Keep crushing it.'
                    : 'Build momentum this week!'}
                </Text>
              </View>
            </View>
            <View style={styles.streakCircle}>
              <Text style={styles.streakNum}>{streak.count}</Text>
            </View>
          </View>

          {/* Day tracker */}
          <View style={styles.daysRow}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const done = streak.days.includes(day);
              return (
                <View key={day} style={styles.dayCol}>
                  <View style={[styles.dayDot, done && styles.dayDotActive]}>
                    {done && <Ionicons name="checkmark" size={11} color="#fff" />}
                  </View>
                  <Text style={[styles.dayLabel, done && styles.dayLabelActive]}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Quick Actions ─────────────────────────────────────────────── */}
        <View style={styles.quickActions}>
          {[
            { icon: 'search', label: 'Find Gym', route: '/(tabs)/discover' },
            { icon: 'calendar', label: 'Classes', route: '/(tabs)/calendar' },
            { icon: 'person', label: 'Trainer', route: '/(tabs)/discover' },
            { icon: 'qr-code', label: 'My Pass', route: '/(tabs)/pass' },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              activeOpacity={0.75}
              onPress={() => router.push(action.route as any)}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon as any} size={20} color="#FF2A2A" />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Membership Card ───────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Your Membership</Text>
        {membership.status === 'none' ? (
          <TouchableOpacity
            style={styles.emptyCard}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/discover')}
          >
            <Ionicons name="fitness-outline" size={30} color="#FF2A2A" />
            <Text style={styles.emptyCardTitle}>No Active Membership</Text>
            <Text style={styles.emptyCardSub}>Join a gym to start training.</Text>
            <Text style={styles.emptyCardCta}>Find Gym →</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.membershipCard}>
            {/* Top accent bar */}
            <View style={[styles.membershipAccent, { backgroundColor: getStatusColor(membership.status) }]} />
            <View style={styles.membershipBody}>
              <View style={styles.membershipTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.membershipGym}>{membership.gymName}</Text>
                  <Text style={styles.membershipPlan}>{membership.planName}</Text>
                </View>
                <View style={[styles.statusPill, { borderColor: getStatusColor(membership.status) + '50' }]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(membership.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(membership.status) }]}>
                    {membership.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.membershipDivider} />

              <View style={styles.membershipFooter}>
                <View>
                  <Text style={styles.metaLabel}>EXPIRES</Text>
                  <Text style={styles.metaValue}>{membership.endDate.split(',')[0]}</Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>LAST CHECK-IN</Text>
                  <Text style={styles.metaValue}>{membership.lastCheckIn}</Text>
                </View>
                <TouchableOpacity
                  style={styles.qrBtn}
                  onPress={() => router.push('/(tabs)/pass')}
                >
                  <Ionicons name="qr-code-outline" size={14} color="#fff" />
                  <Text style={styles.qrBtnText}>QR Pass</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── Today's Classes ───────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Today · {todayWeekday}</Text>
        {registeredClasses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={28} color="#374151" />
            <Text style={styles.emptyCardTitle}>No Classes Today</Text>
            <Text style={styles.emptyCardSub}>Browse and register for group classes.</Text>
            <TouchableOpacity
              style={styles.smallCta}
              onPress={() => router.push('/(tabs)/calendar')}
            >
              <Text style={styles.smallCtaText}>Browse Classes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          registeredClasses.map((cls) => (
            <View key={cls.id} style={styles.classCard}>
              <View style={styles.classTimeCol}>
                <Text style={styles.classTime}>{cls.time}</Text>
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classGym}>{cls.gymName} · {cls.trainerName}</Text>
              </View>
              <View style={styles.registeredBadge}>
                <Ionicons name="checkmark-circle" size={15} color="#10B981" />
              </View>
            </View>
          ))
        )}

        {/* ── Stats Grid ────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Activity Stats</Text>
        <View style={styles.statsGrid}>
          {[
            { icon: 'checkmark-done', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', value: checkIns.length, label: 'Check-ins' },
            { icon: 'people',         color: '#10B981', bg: 'rgba(16,185,129,0.1)', value: classRegistrations.length, label: 'Classes' },
            { icon: 'fitness',        color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', value: confirmedBookings.length, label: 'PT Sessions' },
            { icon: 'flame',          color: '#FF5A2A', bg: 'rgba(255,90,42,0.1)',  value: streak.count, label: 'Day Streak' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: stat.bg }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Upcoming Bookings ─────────────────────────────────────────── */}
        {confirmedBookings.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            {confirmedBookings.slice(0, 2).map((b) => (
              <View key={b.id} style={styles.bookingCard}>
                <View style={styles.bookingLeft}>
                  <Text style={styles.bookingDay}>{b.day}</Text>
                  <Text style={styles.bookingTime}>{b.time}</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTrainer}>{b.trainerName}</Text>
                  <Text style={styles.bookingNote} numberOfLines={1}>{b.note}</Text>
                </View>
                <View style={styles.confirmedBadge}>
                  <Text style={styles.confirmedText}>Confirmed</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040406' },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  greetingText: { fontSize: 12, fontWeight: '700', color: '#6B7280', letterSpacing: 0.5 },
  usernameText: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  iconBtnRed: {
    backgroundColor: 'rgba(255,42,42,0.12)',
    borderColor: 'rgba(255,42,42,0.3)',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  scrollContent: { padding: 16, paddingBottom: 24 },

  // ── Streak Card ──
  streakCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    backgroundColor: 'rgba(255,90,42,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,90,42,0.2)',
    overflow: 'hidden',
  },
  streakCardBg: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,90,42,0.06)',
  },
  streakRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakTextGroup: { flex: 1 },
  streakCount: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  streakSub: { color: '#9CA3AF', fontSize: 11.5, marginTop: 2, lineHeight: 16 },
  streakCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#FF5A2A',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#FF5A2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 10, elevation: 8,
  },
  streakNum: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  dayCol: { alignItems: 'center', gap: 5 },
  dayDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  dayDotActive: {
    backgroundColor: '#FF5A2A',
    borderColor: '#FF5A2A',
    shadowColor: '#FF5A2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5, shadowRadius: 5, elevation: 4,
  },
  dayLabel: { color: '#4B5563', fontSize: 9, fontWeight: '700' },
  dayLabelActive: { color: '#FF5A2A' },

  // ── Quick Actions ──
  quickActions: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22,
  },
  quickAction: { alignItems: 'center', gap: 7 },
  quickActionIcon: {
    width: (width - 80) / 4, height: 52,
    backgroundColor: 'rgba(255,42,42,0.07)',
    borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,42,42,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  quickActionLabel: { color: '#9CA3AF', fontSize: 10, fontWeight: '700' },

  // ── Section titles ──
  sectionTitle: {
    color: '#FFFFFF', fontSize: 15, fontWeight: '800',
    letterSpacing: 0.4, marginBottom: 12, marginTop: 4,
  },

  // ── Empty Card ──
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20, paddingVertical: 28, paddingHorizontal: 20,
    alignItems: 'center', marginBottom: 20, gap: 6,
  },
  emptyCardTitle: { color: '#D1D5DB', fontSize: 14, fontWeight: '800' },
  emptyCardSub: { color: '#6B7280', fontSize: 11.5, textAlign: 'center' },
  emptyCardCta: { color: '#FF2A2A', fontSize: 13, fontWeight: '700', marginTop: 4 },
  smallCta: {
    marginTop: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  smallCtaText: { color: '#D1D5DB', fontSize: 12, fontWeight: '700' },

  // ── Membership Card ──
  membershipCard: {
    borderRadius: 20, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  membershipAccent: { height: 3, width: '100%' },
  membershipBody: { padding: 16 },
  membershipTopRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  membershipGym: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  membershipPlan: { color: '#FF2A2A', fontSize: 12, fontWeight: '700', letterSpacing: 0.8, marginTop: 3 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, paddingHorizontal: 9, paddingVertical: 4,
    borderRadius: 8,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  membershipDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 14 },
  membershipFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: { color: '#6B7280', fontSize: 8.5, fontWeight: '800', letterSpacing: 0.5 },
  metaValue: { color: '#E5E7EB', fontSize: 12, fontWeight: '700', marginTop: 2 },
  qrBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FF2A2A', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  qrBtnText: { color: '#FFFFFF', fontSize: 11.5, fontWeight: '800' },

  // ── Class Card ──
  classCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16, padding: 14, marginBottom: 10, gap: 14,
  },
  classTimeCol: {
    backgroundColor: 'rgba(255,42,42,0.1)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
    alignItems: 'center',
  },
  classTime: { color: '#FF2A2A', fontSize: 11, fontWeight: '800' },
  classInfo: { flex: 1 },
  className: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  classGym: { color: '#9CA3AF', fontSize: 11.5, marginTop: 2 },
  registeredBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(16,185,129,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },

  // ── Stats Grid ──
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18, padding: 16,
    marginBottom: 12, alignItems: 'center',
  },
  statIconBg: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  statValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  statLabel: { color: '#6B7280', fontSize: 10, fontWeight: '700', marginTop: 3 },

  // ── Booking Card ──
  bookingCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16, padding: 14, marginBottom: 10, gap: 12,
  },
  bookingLeft: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
    alignItems: 'center', minWidth: 58,
  },
  bookingDay: { color: '#8B5CF6', fontSize: 10, fontWeight: '800' },
  bookingTime: { color: '#A78BFA', fontSize: 11, fontWeight: '700', marginTop: 2 },
  bookingInfo: { flex: 1 },
  bookingTrainer: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  bookingNote: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },
  confirmedBadge: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  confirmedText: { color: '#10B981', fontSize: 9, fontWeight: '800' },
});
