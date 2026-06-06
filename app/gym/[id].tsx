import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function renderStars(selectedRating: number, onStarPress?: (r: number) => void) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= selectedRating;
        return (
          <TouchableOpacity
            key={star}
            disabled={!onStarPress}
            onPress={() => onStarPress?.(star)}
            style={styles.starContainer}
          >
            <Ionicons
              name={isFilled ? "star" : "star-outline"}
              size={16}
              color={isFilled ? "#FACC15" : "#6B7280"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function GymDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { gyms, trainers, reviews, addReview } = useGMAP();

  const gym = gyms.find((g) => g.id === id);

  // Form review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isWritingReview, setIsWritingReview] = useState(false);

  if (!gym) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Gym not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Get trainers of this gym
  const gymTrainers = trainers.filter((t) => gym.trainers.includes(t.id));

  // Get reviews of this gym
  const gymReviews = reviews.filter((r) => r.targetId === gym.id);

  const handleAddReview = () => {
    if (comment.trim()) {
      addReview(gym.id, rating, comment.trim());
      setComment('');
      setIsWritingReview(false);
    }
  };

  

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar style="light" />

      {/* Floating Back Button */}
      <TouchableOpacity 
        style={styles.floatingBackBtn} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Gym image Hero */}
        <Image source={{ uri: gym.images[0] }} style={styles.heroImage} />

        {/* Content details wrapper */}
        <View style={styles.contentWrapper}>
          
          {/* Gym Title block */}
          <View style={styles.titleRow}>
            <Text style={styles.gymName}>{gym.name}</Text>
            <View style={styles.inlineRatingBadge}>
              <Ionicons name="star" size={13} color="#FACC15" />
              <Text style={styles.ratingText}>{gym.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.gymDistance}>
            <Ionicons name="location-outline" size={12} color="#6B7280" /> {gym.distance}
          </Text>

          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, gym.openStatus.includes('Open') || gym.openStatus.includes('24') ? styles.statusOpen : styles.statusClosed]}>
              <Text style={styles.statusText}>{gym.openStatus.toUpperCase()}</Text>
            </View>
            <View style={styles.hoursBadge}>
              <Text style={styles.hoursText}>{gym.hours}</Text>
            </View>
          </View>

          {/* About section */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descriptionText}>{gym.description}</Text>

          {/* Services & Amenities pills */}
          <Text style={styles.sectionTitle}>Services & Facilities</Text>
          <View style={styles.pillContainer}>
            {gym.services.map((service) => (
              <View key={service} style={styles.servicePill}>
                <Text style={styles.pillText}>{service}</Text>
              </View>
            ))}
            {gym.amenities.map((amenity) => (
              <View key={amenity} style={styles.amenityPill}>
                <Ionicons name="checkmark-circle-outline" size={12} color="#10B981" style={{ marginRight: 4 }} />
                <Text style={styles.pillText}>{amenity}</Text>
              </View>
            ))}
          </View>

          {/* Membership Plans list */}
          <Text style={styles.sectionTitle}>Membership Plans</Text>
          {gym.plans.map((plan) => (
            <View key={plan.name} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>
                  {plan.price} ETB<Text style={styles.planDuration}>/mo</Text>
                </Text>
              </View>
              
              {plan.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Ionicons name="checkmark" size={12} color="#FF2A2A" style={{ marginRight: 6 }} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.selectPlanBtn}
                onPress={() => router.push(`/join/step1?gymId=${gym.id}&planName=${plan.name}&price=${plan.price}`)}
              >
                <Text style={styles.selectPlanText}>Select Plan</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Personal Trainers carousel */}
          {gymTrainers.length > 0 && (
            <View style={styles.subSection}>
              <Text style={styles.sectionTitle}>Gym Trainers</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trainersSlider}>
                {gymTrainers.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.trainerTile}
                    onPress={() => router.push(`/trainer/${t.id}`)}
                  >
                    <Image source={{ uri: t.photo }} style={styles.trainerImage} />
                    <Text style={styles.trainerName} numberOfLines={1}>{t.name}</Text>
                    <Text style={styles.trainerSpecialties} numberOfLines={1}>{t.specialties.join(' • ')}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Reviews listing and submissions */}
          <View style={styles.subSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>User Reviews ({gymReviews.length})</Text>
              <TouchableOpacity onPress={() => setIsWritingReview(!isWritingReview)}>
                <Text style={styles.actionBtnText}>{isWritingReview ? 'Cancel' : 'Add Review'}</Text>
              </TouchableOpacity>
            </View>

            {isWritingReview && (
              <View style={styles.addReviewForm}>
                <Text style={styles.reviewLabel}>Your Rating</Text>
                {renderStars(rating, setRating)}

                <Text style={styles.reviewLabel}>Your Review</Text>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Tell us about your experience..."
                  placeholderTextColor="#6B7280"
                  value={comment}
                  onChangeText={setComment}
                  multiline
                />
                
                <TouchableOpacity style={styles.submitReviewBtn} onPress={handleAddReview}>
                  <Text style={styles.submitReviewBtnText}>Submit Review</Text>
                </TouchableOpacity>
              </View>
            )}

            {gymReviews.length === 0 ? (
              <Text style={styles.emptyReviews}>No reviews logged yet. Be the first to add one!</Text>
            ) : (
              gymReviews.map((rev) => (
                <View key={rev.id} style={styles.reviewCard}>
                  <View style={styles.reviewCardHeader}>
                    <Text style={styles.reviewUser}>{rev.userName}</Text>
                    <Text style={styles.reviewDate}>{rev.date}</Text>
                  </View>
                  {renderStars(rev.rating)}
                  <Text style={styles.reviewComment}>"{rev.comment}"</Text>
                </View>
              ))
            )}
          </View>

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
  scrollContent: {
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#1E1E24',
  },
  floatingBackBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 35,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(4, 4, 6, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentWrapper: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gymName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    flex: 1,
    paddingRight: 10,
  },
  inlineRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    marginLeft: 4,
  },
  gymDistance: {
    color: '#6B7280',
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  statusOpen: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusClosed: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#E5E7EB',
  },
  hoursBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hoursText: {
    color: '#9CA3AF',
    fontSize: 10.5,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 18,
  },
  descriptionText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  servicePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  amenityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  pillText: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '700',
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  planPrice: {
    color: '#FF2A2A',
    fontSize: 18,
    fontWeight: '900',
  },
  planDuration: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  featureText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  selectPlanBtn: {
    backgroundColor: '#FF2A2A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  selectPlanText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  subSection: {
    marginTop: 10,
  },
  trainersSlider: {
    paddingRight: 10,
  },
  trainerTile: {
    width: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  trainerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E1E24',
    marginBottom: 6,
  },
  trainerName: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  trainerSpecialties: {
    color: '#6B7280',
    fontSize: 9,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  actionBtnText: {
    color: '#FF2A2A',
    fontSize: 12.5,
    fontWeight: '800',
  },
  addReviewForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  reviewLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 8,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  starContainer: {
    marginRight: 6,
    paddingVertical: 2,
  },
  reviewInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    color: '#FFFFFF',
    padding: 10,
    fontSize: 12.5,
    minHeight: 56,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitReviewBtn: {
    backgroundColor: '#FF2A2A',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  submitReviewBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyReviews: {
    color: '#6B7280',
    fontSize: 12.5,
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewUser: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  reviewDate: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '600',
  },
  reviewComment: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#040406',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 10,
  },
  backBtn: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
