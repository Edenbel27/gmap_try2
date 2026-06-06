import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TABS = [
  { name: 'home',     label: 'Home',    icon: 'home',    iconOutline: 'home-outline' },
  { name: 'discover', label: 'Explore', icon: 'search',   iconOutline: 'search-outline' },
  { name: 'calendar', label: 'Classes', icon: 'calendar', iconOutline: 'calendar-outline' },
  { name: 'pass',     label: 'Pass',    icon: 'qr-code',  iconOutline: 'qr-code-outline' },
  { name: 'profile',  label: 'Profile', icon: 'person',   iconOutline: 'person-outline' },
];

function CustomTabBar(props: Readonly<BottomTabBarProps>) {
  const { state, navigation } = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const tab = TABS.find((t) => t.name === route.name) ?? TABS[0];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              // Active tab gets flex:2 so the pill has room; inactive get flex:1
              style={[styles.tabItem, isFocused ? styles.tabItemFocused : styles.tabItemBlur]}
            >
              {isFocused ? (
                <View style={styles.pill}>
                  <Ionicons name={tab.icon as any} size={16} color="#FFFFFF" />
                  <Text style={styles.pillLabel} numberOfLines={1}>
                    {tab.label}
                  </Text>
                </View>
              ) : (
                <Ionicons name={tab.iconOutline as any} size={22} color="#4B5563" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="pass" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Outer wrapper — NOT absolutely positioned so screens don't scroll under it
  wrapper: {
    backgroundColor: '#08080A',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 42, 42, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E12',
    borderRadius: 26,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  // Inactive tabs share equal small flex
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  tabItemFocused: {
    flex: 2,
  },
  tabItemBlur: {
    flex: 1,
  },
  // Active red pill — row with icon + label
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF2A2A',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 6,
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    width: '100%',
  },
  pillLabel: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.2,
    flexShrink: 1,
  },
});
