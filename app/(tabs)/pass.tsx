import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGMAP } from '@/shared/context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function QRPassScreen() {
  const { membership, triggerCheckIn } = useGMAP();

  const [scanSuccess, setScanSuccess] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  // Scanner slide line animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    
    if (membership.status === 'active') {
      animation.start();
    } else {
      animation.stop();
    }

    return () => animation.stop();
  }, [membership.status]);

  const handleSimulateScan = () => {
    if (membership.status !== 'active') return;

    triggerCheckIn();
    setScanSuccess(true);
    
    setTimeout(() => {
      setScanSuccess(false);
    }, 4000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'pending': return '#FACC15';
      case 'expired': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180], // Slide range inside the QR box
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>CHECK-IN ACCESS</Text>
          <Text style={styles.headerTitle}>My QR Pass</Text>
        </View>
        <View style={styles.offlineBadge}>
          <Ionicons name="cloud-offline" size={12} color="#10B981" />
          <Text style={styles.offlineBadgeText}>Offline Active</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Offline Support Notice banner */}
        <View style={styles.offlineNoticeCard}>
          <Ionicons name="information-circle" size={20} color="#10B981" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.offlineNoticeTitle}>Offline Entry Supported</Text>
            <Text style={styles.offlineNoticeDesc}>
              Your pass credentials, membership status, and gym parameters are cached locally. You can check in at the reception desk even without internet connection.
            </Text>
          </View>
        </View>

        {/* QR Code access panel */}
        {membership.status === 'none' ? (
          <View style={styles.emptyPassCard}>
            <Ionicons name="qr-code-outline" size={48} color="#6B7280" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyPassTitle}>No Active Membership Pass</Text>
            <Text style={styles.emptyPassDesc}>
              You must join a gym membership first to generate an entry QR code access token.
            </Text>
          </View>
        ) : (
          <View style={styles.passWrapperCard}>
            
            {/* Active Gym Header */}
            <Text style={styles.passGymName}>{membership.gymName}</Text>
            <Text style={styles.passPlanName}>{membership.planName.toUpperCase()}</Text>

            {/* Simulated QR Code box */}
            <View style={styles.qrOuterBorder}>
              {membership.status === 'active' ? (
                <View style={styles.qrInnerWrapper}>
                  {/* Mock high-fidelity code pattern */}
                  <View style={styles.qrMockCode}>
                    {/* Corners */}
                    <View style={[styles.qrCorner, { top: 0, left: 0 }]} />
                    <View style={[styles.qrCorner, { top: 0, right: 0 }]} />
                    <View style={[styles.qrCorner, { bottom: 0, left: 0 }]} />
                    
                    {/* Tiny visual square grid layout */}
                    <View style={styles.qrCenterCore} />
                  </View>
                  
                  {/* Moving scanning line */}
                  <Animated.View style={[styles.scannerLine, { transform: [{ translateY: scanLineTranslateY }] }]} />
                </View>
              ) : (
                <View style={styles.qrPendingWrapper}>
                  <Ionicons name="hourglass-outline" size={36} color="#FACC15" />
                  <Text style={styles.qrPendingText}>Pending Gym Approval</Text>
                  <Text style={styles.qrPendingSub}>Access token will generate once approved.</Text>
                </View>
              )}
            </View>

            {/* Membership ID and status */}
            <Text style={styles.membershipIdText}>{membership.qrCode}</Text>
            
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(membership.status) + '15', borderColor: getStatusColor(membership.status) + '35' }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(membership.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(membership.status) }]}>
                MEMBERSHIP {membership.status.toUpperCase()}
              </Text>
            </View>

            {/* Last check in detail metadata */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLbl}>LAST CHECK-IN</Text>
                <Text style={styles.metaVal}>{membership.lastCheckIn}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaLbl}>VALID UNTIL</Text>
                <Text style={styles.metaVal}>{membership.endDate.split(',')[0]}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Scan Entrance Simulator Button */}
        {membership.status === 'active' && (
          <View style={styles.simulatorSection}>
            <TouchableOpacity 
              style={[styles.simulateBtn, scanSuccess ? styles.simulateBtnSuccess : null]}
              onPress={handleSimulateScan}
              disabled={scanSuccess}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={scanSuccess ? "checkmark-circle" : "walk"} 
                size={18} 
                color="#FFFFFF" 
                style={{ marginRight: 6 }} 
              />
              <Text style={styles.simulateBtnText}>
                {scanSuccess ? 'ACCESS GRANTED!' : 'SIMULATE ENTRANCE SCAN'}
              </Text>
            </TouchableOpacity>
            
            {scanSuccess && (
              <View style={styles.successToast}>
                <Text style={styles.successToastText}>Check-in logged! Streak updated. Check your notifications tab.</Text>
              </View>
            )}
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
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  offlineBadgeText: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '800',
    marginLeft: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    alignItems: 'center',
  },
  offlineNoticeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
  },
  offlineNoticeTitle: {
    color: '#A7F3D0',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  offlineNoticeDesc: {
    color: '#6B7280',
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '500',
  },
  emptyPassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 22,
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  emptyPassTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyPassDesc: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 24,
  },
  passWrapperCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    width: '100%',
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  passGymName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  passPlanName: {
    color: '#FF2A2A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
  },
  qrOuterBorder: {
    width: 200,
    height: 200,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0A0A0E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  qrInnerWrapper: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  qrMockCode: {
    width: 130,
    height: 130,
    position: 'relative',
  },
  qrCorner: {
    width: 32,
    height: 32,
    borderWidth: 6,
    borderColor: '#FFFFFF',
    position: 'absolute',
  },
  qrCenterCore: {
    width: 44,
    height: 44,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: 43,
  },
  scannerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FF2A2A',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  qrPendingWrapper: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  qrPendingText: {
    color: '#FACC15',
    fontSize: 13.5,
    fontWeight: '800',
    marginTop: 10,
  },
  qrPendingSub: {
    color: '#6B7280',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  membershipIdText: {
    color: '#9CA3AF',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  metaLbl: {
    color: '#6B7280',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaVal: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  simulatorSection: {
    width: '100%',
    alignItems: 'center',
  },
  simulateBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF2A2A',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF2A2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  simulateBtnSuccess: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  simulateBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  successToast: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  successToastText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
