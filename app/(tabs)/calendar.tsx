import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ClassesCalendarScreen() {
  const {
    classes,
    classRegistrations,
    checkIns,
    registerForClass,
    cancelClassRegistration,
  } = useGMAP();

  const [selectedDayOffset, setSelectedDayOffset] = useState(0); // Offset from today

  // Generate 7 days starting from today for our quick calendar segment slider
  const getCalendarDays = () => {
    const days = [];
    const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = -1; i < 6; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const dayName = weekdaysShort[date.getDay()];
      const dayNum = date.getDate();
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      const weekdayFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
      const isToday = i === 0;

      // Count check-ins on this date
      const checkedIn = checkIns.some(ch => ch.date === dateStr);
      
      days.push({
        offset: i,
        dayName,
        dayNum,
        dateStr,
        weekdayFull,
        checkedIn,
        isToday,
      });
    }
    return days;
  };

  const calendarDays = getCalendarDays();
  const selectedDayInfo = calendarDays.find(d => d.offset === selectedDayOffset) || calendarDays[1]; // fallback to today (offset 0)

  // Filter classes available on the selected weekday
  const dailyClasses = classes.filter(c => c.day === selectedDayInfo.weekdayFull);
  
  // Filter check-ins logged on this day
  const dailyCheckIns = checkIns.filter(ch => ch.date === selectedDayInfo.dateStr);

  const getStatusIcon = (clsId: string) => {
    return classRegistrations.includes(clsId) ? 'checkmark-circle' : 'add-circle';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>GYM SCHEDULE</Text>
          <Text style={styles.headerTitle}>Classes Calendar</Text>
        </View>
        <View style={styles.registrationsBadge}>
          <Text style={styles.registrationsText}>{classRegistrations.length} Active</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Calendar Segment Row */}
        <View style={styles.calendarCard}>
          <Text style={styles.calendarTitle}>Attendance & Sessions Schedule</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysSlider}>
            {calendarDays.map((day) => {
              const isSelected = selectedDayOffset === day.offset;
              
              return (
                <TouchableOpacity
                  key={day.offset}
                  style={[
                    styles.dayCol,
                    isSelected ? styles.dayColSelected : null,
                    day.isToday && !isSelected ? styles.dayColToday : null,
                  ]}
                  onPress={() => setSelectedDayOffset(day.offset)}
                >
                  <Text style={[styles.dayNameText, isSelected ? styles.dayNameTextActive : null]}>
                    {day.dayName}
                  </Text>
                  <Text style={[styles.dayNumText, isSelected ? styles.dayNumTextActive : null]}>
                    {day.dayNum}
                  </Text>
                  
                  {/* Indicators for check-in attendance */}
                  {day.checkedIn && (
                    <View style={styles.dotCheckIn} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Day Details panel */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>
            {selectedDayInfo.isToday ? 'Today\'s Activity' : `${selectedDayInfo.weekdayFull} Agenda`}
          </Text>
          <Text style={styles.detailsSubtitle}>{selectedDayInfo.dateStr}</Text>

          {/* Logged check-ins for the day */}
          <View style={styles.detailsBlock}>
            <Text style={styles.blockLabel}>CHECK-INS</Text>
            {dailyCheckIns.length === 0 ? (
              <Text style={styles.emptyLabel}>No check-ins logged on this day.</Text>
            ) : (
              dailyCheckIns.map((ch) => (
                <View key={ch.id} style={styles.checkInRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginRight: 8 }} />
                  <Text style={styles.checkInText}>Checked in at {ch.gymName} ({ch.time})</Text>
                </View>
              ))
            )}
          </View>

          {/* Group Classes Section */}
          <View style={styles.detailsBlock}>
            <Text style={styles.blockLabel}>GROUP FITNESS CLASSES</Text>
            {dailyClasses.length === 0 ? (
              <View style={styles.emptyClasses}>
                <Ionicons name="fitness-outline" size={24} color="#6B7280" style={{ marginBottom: 6 }} />
                <Text style={styles.emptyLabel}>No classes scheduled for {selectedDayInfo.weekdayFull}.</Text>
              </View>
            ) : (
              dailyClasses.map((cls) => {
                const isRegistered = classRegistrations.includes(cls.id);
                
                return (
                  <View key={cls.id} style={[styles.classRow, isRegistered ? styles.classRowActive : null]}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Text style={styles.className}>{cls.name}</Text>
                      <Text style={styles.classMeta}>
                        {cls.time} • Coach: {cls.trainerName}
                      </Text>
                      <Text style={styles.classLocation}>{cls.gymName}</Text>
                      <Text style={styles.classSpots}>
                        {cls.spots > 0 ? `${cls.spots} spots remaining` : 'Class Full'}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      style={[
                        styles.registerBtn,
                        isRegistered ? styles.registerBtnActive : null,
                        cls.spots === 0 && !isRegistered ? styles.registerBtnDisabled : null,
                      ]}
                      disabled={cls.spots === 0 && !isRegistered}
                      onPress={() => {
                        if (isRegistered) {
                          cancelClassRegistration(cls.id);
                        } else {
                          registerForClass(cls.id);
                        }
                      }}
                    >
                      <Ionicons
                        name={getStatusIcon(cls.id)}
                        size={16}
                        color="#FFFFFF"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.registerBtnText}>
                        {isRegistered ? 'Leave' : 'Join'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerSubtitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FF2A2A',
    letterSpacing: 2,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  registrationsBadge: {
    backgroundColor: 'rgba(255, 42, 42, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 42, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  registrationsText: {
    color: '#FF2A2A',
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  calendarCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  calendarTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 14,
  },
  daysSlider: {
    paddingRight: 10,
  },
  dayCol: {
    width: 44,
    height: 62,
    borderRadius: 12,
    backgroundColor: '#0F0F13',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    position: 'relative',
  },
  dayColToday: {
    borderColor: 'rgba(255, 42, 42, 0.25)',
    backgroundColor: 'rgba(255, 42, 42, 0.03)',
  },
  dayColSelected: {
    backgroundColor: '#FF2A2A',
    borderColor: '#FF2A2A',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
  },
  dayNameText: {
    color: '#6B7280',
    fontSize: 9.5,
    fontWeight: '700',
  },
  dayNameTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dayNumText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
    marginTop: 4,
  },
  dayNumTextActive: {
    color: '#FFFFFF',
  },
  dotCheckIn: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 22,
    padding: 18,
    marginBottom: 10,
  },
  detailsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  detailsSubtitle: {
    color: '#6B7280',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 16,
  },
  detailsBlock: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 14,
    marginBottom: 14,
  },
  blockLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  emptyLabel: {
    color: '#4B5563',
    fontSize: 12.5,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  emptyClasses: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  checkInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  checkInText: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '600',
  },
  classRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  classRowActive: {
    borderColor: 'rgba(16, 185, 129, 0.2)',
    backgroundColor: 'rgba(16, 185, 129, 0.02)',
  },
  className: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  classMeta: {
    color: '#FF2A2A',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  classLocation: {
    color: '#9CA3AF',
    fontSize: 11.5,
    marginTop: 2,
  },
  classSpots: {
    color: '#6B7280',
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 4,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF2A2A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  registerBtnActive: {
    backgroundColor: '#10B981',
  },
  registerBtnDisabled: {
    backgroundColor: '#1E1E24',
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
