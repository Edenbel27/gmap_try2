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
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

function StarRow({ rating }: Readonly<{ rating: number }>) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons key={i} name="star" size={11} color={i <= rating ? '#FACC15' : '#2A2A35'} />
      ))}
    </View>
  );
}

export default function TrainerReviewsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reviews, trainers } = useGMAP();

  const trainer = trainers.find(t => t.id === id) ?? trainers[0];
  const trainerReviews = reviews.filter(r => r.targetId === (id ?? trainer?.id));

  const avgRating = trainerReviews.length
    ? Math.round((trainerReviews.reduce((s, r) => s + r.rating, 0) / trainerReviews.length) * 10) / 10
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trainer Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.avgRating}>{avgRating || trainer?.rating || '—'}</Text>
          <StarRow rating={Math.round(avgRating || trainer?.rating || 0)} />
          <Text style={styles.reviewCount}>{trainerReviews.length} review{trainerReviews.length === 1 ? '' : 's'}</Text>
        </View>

        {trainerReviews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-ellipses-outline" size={40} color="rgba(255,255,255,0.05)" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No reviews yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to review this trainer after a session.</Text>
          </View>
        ) : (
          trainerReviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{review.userName.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.reviewerName}>{review.userName}</Text>
                  <StarRow rating={review.rating} />
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewComment}>"{review.comment}"</Text>
            </View>
          ))
        )}
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
  summaryCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  avgRating: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 8,
  },
  reviewCount: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 6 },
  emptySubtitle: { color: '#6B7280', fontSize: 12, textAlign: 'center', paddingHorizontal: 20 },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,42,42,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#FF2A2A', fontSize: 14, fontWeight: '800' },
  reviewerName: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', marginBottom: 4 },
  reviewDate: { color: '#4B5563', fontSize: 10, fontWeight: '600' },
  reviewComment: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
