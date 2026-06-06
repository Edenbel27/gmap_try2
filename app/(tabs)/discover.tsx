import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP, Gym, Trainer } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type FilterType = 'All' | 'Near Me' | 'Open Now' | 'Top Rated' | '24 Hour';

export default function DiscoverScreen() {
  const router = useRouter();
  const { gyms, trainers } = useGMAP();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  // Filter logic
  const filteredGyms = gyms.filter((gym) => {
    // Search query match
    const matchesSearch =
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Filter chip match
    switch (activeFilter) {
      case 'Near Me':
        return Number.parseFloat(gym.distance) < 2; // mock near me definition (<2km)
      case 'Open Now':
        return gym.openStatus === 'Open Now' || gym.openStatus === '24 Hour';
      case 'Top Rated':
        return gym.rating >= 4.8;
      case '24 Hour':
        return gym.openStatus === '24 Hour';
      default:
        return true;
    }
  });

  const filteredTrainers = trainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderFeaturedGym = ({ item }: { item: Gym }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      activeOpacity={0.9}
      onPress={() => router.push(`/gym/${item.id}`)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.featuredImage} />
      
      {/* Overlay rating & distance */}
      <View style={styles.overlayRow}>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FACC15" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{item.distance.split(' ')[0]} km</Text>
        </View>
      </View>

      <View style={styles.featuredInfo}>
        <Text style={styles.featuredName}>{item.name}</Text>
        <Text style={styles.featuredHours} numberOfLines={1}>
          <Ionicons name="time-outline" size={12} color="#9CA3AF" /> {item.hours}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderNearbyGym = ({ item }: { item: Gym }) => (
    <TouchableOpacity
      style={styles.nearbyCard}
      activeOpacity={0.85}
      onPress={() => router.push(`/gym/${item.id}`)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.nearbyImage} />
      
      <View style={styles.nearbyInfo}>
        <View style={styles.nearbyHeaderRow}>
          <Text style={styles.nearbyName}>{item.name}</Text>
          <View style={styles.inlineRating}>
            <Ionicons name="star" size={13} color="#FACC15" />
            <Text style={styles.inlineRatingText}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.nearbyDesc} numberOfLines={1}>{item.description}</Text>
        
        <View style={styles.nearbyFooterRow}>
          <Text style={styles.nearbyDistance}>
            <Ionicons name="location-outline" size={11} color="#6B7280" /> {item.distance}
          </Text>
          <Text style={[styles.nearbyStatus, item.openStatus.includes('Open') || item.openStatus.includes('24') ? { color: '#10B981' } : { color: '#EF4444' }]}>
            {item.openStatus}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTrainerCard = ({ item }: { item: Trainer }) => (
    <TouchableOpacity
      style={styles.trainerCard}
      activeOpacity={0.85}
      onPress={() => router.push(`/trainer/${item.id}`)}
    >
      <Image source={{ uri: item.photo }} style={styles.trainerImage} />
      <Text style={styles.trainerName} numberOfLines={1}>{item.name}</Text>
      <View style={styles.trainerRatingRow}>
        <Ionicons name="star" size={11} color="#FACC15" />
        <Text style={styles.trainerRatingText}>{item.rating}</Text>
      </View>
      <Text style={styles.trainerSpecialties} numberOfLines={1}>
        {item.specialties.slice(0, 2).join(' • ')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search gyms, trainers, or services..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Filter Chips row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScrollView}
          contentContainerStyle={styles.filtersContainer}
        >
          {(['All', 'Near Me', 'Open Now', 'Top Rated', '24 Hour'] as FilterType[]).map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isSelected ? styles.filterChipActive : null]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, isSelected ? styles.filterTextActive : null]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Gyms Section */}
        {filteredGyms.length > 0 && activeFilter === 'All' && !searchQuery ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Featured Gyms</Text>
            <FlatList
              data={filteredGyms.slice(0, 2)}
              renderItem={renderFeaturedGym}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>
        ) : null}

        {/* Nearby Gyms List */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Matching Gyms (${filteredGyms.length})` : 'Gym Directory'}
          </Text>
          {filteredGyms.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={28} color="#6B7280" style={{ marginBottom: 6 }} />
              <Text style={styles.emptyText}>No gyms match your criteria.</Text>
            </View>
          ) : (
            filteredGyms.map((item) => <View key={item.id}>{renderNearbyGym({ item })}</View>)
          )}
        </View>

        {/* Recommended Trainers Section */}
        {filteredTrainers.length > 0 && (
          <View style={[styles.sectionContainer, { marginBottom: 20 }]}>
            <Text style={styles.sectionTitle}>Personal Trainers</Text>
            <FlatList
              data={filteredTrainers}
              renderItem={renderTrainerCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trainersList}
            />
          </View>
        )}

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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13.5,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  filtersScrollView: {
    marginVertical: 12,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#FF2A2A',
    borderColor: '#FF2A2A',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  filterText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  featuredList: {
    paddingRight: 16,
  },
  featuredCard: {
    width: width * 0.65,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 14,
  },
  featuredImage: {
    width: '100%',
    height: 120,
  },
  overlayRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(4, 4, 6, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    marginLeft: 3,
  },
  distanceBadge: {
    backgroundColor: 'rgba(4, 4, 6, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  featuredInfo: {
    padding: 12,
  },
  featuredName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  featuredHours: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  nearbyCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  nearbyImage: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#1E1E24',
  },
  nearbyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nearbyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearbyName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    paddingRight: 6,
  },
  inlineRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineRatingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 3,
  },
  nearbyDesc: {
    color: '#9CA3AF',
    fontSize: 11.5,
    marginTop: 2,
  },
  nearbyFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  nearbyDistance: {
    color: '#6B7280',
    fontSize: 10.5,
    fontWeight: '600',
  },
  nearbyStatus: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  trainersList: {
    paddingRight: 16,
  },
  trainerCard: {
    width: 105,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 10,
    marginRight: 12,
    alignItems: 'center',
  },
  trainerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E1E24',
    marginBottom: 8,
  },
  trainerName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  trainerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  trainerRatingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 3,
  },
  trainerSpecialties: {
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
});
