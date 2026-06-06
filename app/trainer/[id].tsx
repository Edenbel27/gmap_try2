import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TrainerDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { trainers, gyms } = useGMAP();

  const trainer = trainers.find((t) => t.id === id);
  const gym = trainer ? gyms.find((g) => g.id === trainer.gymId) : null;

  if (!trainer) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Trainer not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleBook = () => {
    router.push(`/trainer/schedule?trainerId=${trainer.id}`);
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
        
        {/* Photo Hero */}
        <Image source={{ uri: trainer.photo }} style={styles.heroImage} />

        <View style={styles.contentWrapper}>
          
          {/* Header Row */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.trainerName}>{trainer.name}</Text>
              <Text style={styles.trainerRole}>{trainer.experience} Experience</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color="#FACC15" />
              <Text style={styles.ratingText}>{trainer.rating}</Text>
            </View>
          </View>

          {/* Gym link */}
          {gym && (
            <View style={styles.gymRow}>
              <Ionicons name="fitness-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
              <Text style={styles.gymName}>Affiliated Gym: <Text style={styles.boldGym}>{gym.name}</Text></Text>
            </View>
          )}

          {/* Pricing indicator */}
          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceLabel}>SESSION COST</Text>
              <Text style={styles.priceVal}>{trainer.price} ETB <Text style={styles.priceSub}>/ session</Text></Text>
            </View>
            <Ionicons name="sparkles" size={20} color="#FF2A2A" />
          </View>

          {/* Specialties pills */}
          <Text style={styles.sectionTitle}>Trainer Specialties</Text>
          <View style={styles.pillContainer}>
            {trainer.specialties.map((specialty) => (
              <View key={specialty} style={styles.specialtyPill}>
                <Ionicons name="flash-outline" size={12} color="#FF2A2A" style={{ marginRight: 4 }} />
                <Text style={styles.pillText}>{specialty}</Text>
              </View>
            ))}
          </View>

          {/* Bio section */}
          <Text style={styles.sectionTitle}>Biography</Text>
          <Text style={styles.bioText}>{trainer.bio}</Text>

          {/* Certifications or generic lists */}
          <Text style={styles.sectionTitle}>Why Train With {trainer.name.split(' ')[0]}?</Text>
          <View style={styles.benefitItem}>
            <View style={styles.bulletCheck}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.benefitText}>Customized workout plans tailored to your specific physique goals.</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.bulletCheck}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.benefitText}>Expert posture corrections and barbell technique training.</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.bulletCheck}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.benefitText}>Weekly tracking metrics to monitor power lifting progression.</Text>
          </View>

          {/* Book Session CTA */}
          <TouchableOpacity 
            style={styles.bookBtn}
            onPress={handleBook}
            activeOpacity={0.85}
          >
            <Ionicons name="calendar-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.bookText}>BOOK PRIVATE SESSION</Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 300,
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
    marginBottom: 8,
  },
  trainerName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  trainerRole: {
    color: '#FF2A2A',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  ratingBadge: {
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
  gymRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  gymName: {
    color: '#6B7280',
    fontSize: 12.5,
    fontWeight: '600',
  },
  boldGym: {
    color: '#E5E7EB',
    fontWeight: '700',
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  priceLabel: {
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  priceVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  priceSub: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 18,
  },
  bioText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  specialtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 42, 42, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 42, 0.15)',
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
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  bulletCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  benefitText: {
    color: '#9CA3AF',
    fontSize: 12.5,
    lineHeight: 18,
    flex: 1,
    fontWeight: '600',
  },
  bookBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF2A2A',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.5,
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
