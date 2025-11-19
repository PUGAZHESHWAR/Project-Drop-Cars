import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useCarDriver } from '@/contexts/CarDriverContext';
import { 
  Car, 
  User, 
  Phone, 
  MapPin, 
  LogOut, 
  Settings, 
  Wifi, 
  WifiOff,
  Clock,
  Calendar,
  Star,
  AlertCircle
} from 'lucide-react-native';

export default function CarDriverDashboardScreen() {
  const { colors } = useTheme();
  const { 
    driver, 
    isAuthenticated, 
    isLoading, 
    error, 
    goOnline, 
    goOffline, 
    signout,
    refreshDriverData,
    clearError 
  } = useCarDriver();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/car-driver/signin');
    }
  }, [isAuthenticated, router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshDriverData();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!driver) return;

    try {
      setStatusLoading(true);
      clearError();

      if (driver.status === 'online' || driver.driver_status === 'ONLINE') {
        await goOffline();
        Alert.alert('Status Updated', 'You are now offline');
      } else {
        await goOnline();
        Alert.alert('Status Updated', 'You are now online and ready for trips');
      }
    } catch (error: any) {
      Alert.alert('Status Update Failed', error.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSignout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signout();
              router.replace('/car-driver/signin');
            } catch (error) {
              console.error('Signout failed:', error);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = () => {
    const normalized = (driver?.status || '').toLowerCase() || (driver?.driver_status || '').toLowerCase();
    switch (normalized) {
      case 'online':
        return '#10B981'; // Green
      case 'offline':
        return '#6B7280'; // Gray
      case 'busy':
        return '#F59E0B'; // Yellow
      case 'inactive':
        return '#EF4444'; // Red
      default:
        return '#6B7280';
    }
  };

  const getStatusText = () => {
    const normalized = (driver?.status || '').toLowerCase() || (driver?.driver_status || '').toLowerCase();
    switch (normalized) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'busy':
        return 'On Trip';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      padding: 8,
      marginLeft: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    statusCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginTop: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    statusTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    statusText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    statusButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 12,
    },
    statusButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    loadingButton: {
      opacity: 0.7,
    },
    profileCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    profileAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    profileAvatarText: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    profileStatus: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    profileDetails: {
      marginTop: 16,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    detailIcon: {
      marginRight: 12,
    },
    detailText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      flex: 1,
    },
    statsCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statsTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    actionsCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionsTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: colors.background,
    },
    actionIcon: {
      marginRight: 12,
    },
    actionText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      flex: 1,
    },
    errorContainer: {
      backgroundColor: colors.error + '20',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.error,
      marginLeft: 8,
      flex: 1,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={[dynamicStyles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, color: colors.textSecondary }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!driver) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={[dynamicStyles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: colors.text }}>No driver data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Driver Dashboard</Text>
        <View style={dynamicStyles.headerActions}>
          <TouchableOpacity 
            onPress={() => router.push('/car-driver/profile' as any)}
            style={dynamicStyles.headerButton}
          >
            <Settings color={colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSignout}
            style={dynamicStyles.headerButton}
          >
            <LogOut color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={dynamicStyles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={dynamicStyles.errorContainer}>
            <AlertCircle color={colors.error} size={20} />
            <Text style={dynamicStyles.errorText}>{error}</Text>
          </View>
        )}

        {/* Status Card */}
        <View style={dynamicStyles.statusCard}>
          <View style={dynamicStyles.statusHeader}>
            <Text style={dynamicStyles.statusTitle}>Current Status</Text>
            <View style={dynamicStyles.statusIndicator}>
              <View 
                style={[
                  dynamicStyles.statusDot, 
                  { backgroundColor: getStatusColor() }
                ]} 
              />
              <Text style={dynamicStyles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              dynamicStyles.statusButton,
              statusLoading && dynamicStyles.loadingButton
            ]}
            onPress={handleStatusToggle}
            disabled={statusLoading}
          >
            {statusLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={dynamicStyles.statusButtonText}>
                {(driver.driver_status === 'ONLINE' || driver.status === 'online') ? 'Go Offline' : 'Go Online'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={dynamicStyles.profileCard}>
          <View style={dynamicStyles.profileHeader}>
            <View style={dynamicStyles.profileAvatar}>
              <Text style={dynamicStyles.profileAvatarText}>
                {driver.full_name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={dynamicStyles.profileInfo}>
              <Text style={dynamicStyles.profileName}>{driver.full_name}</Text>
              <Text style={dynamicStyles.profileStatus}>
                Driver • {driver.organization_id}
              </Text>
            </View>
          </View>

          <View style={dynamicStyles.profileDetails}>
            <View style={dynamicStyles.detailRow}>
              <Phone color={colors.textSecondary} size={16} style={dynamicStyles.detailIcon} />
              <Text style={dynamicStyles.detailText}>{driver.primary_number}</Text>
            </View>
            
            {driver.secondary_number && (
              <View style={dynamicStyles.detailRow}>
                <Phone color={colors.textSecondary} size={16} style={dynamicStyles.detailIcon} />
                <Text style={dynamicStyles.detailText}>{driver.secondary_number}</Text>
              </View>
            )}
            
            <View style={dynamicStyles.detailRow}>
              <MapPin color={colors.textSecondary} size={16} style={dynamicStyles.detailIcon} />
              <Text style={dynamicStyles.detailText}>{driver.address}</Text>
            </View>
            
            {driver.email && (
              <View style={dynamicStyles.detailRow}>
                <User color={colors.textSecondary} size={16} style={dynamicStyles.detailIcon} />
                <Text style={dynamicStyles.detailText}>{driver.email}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Card */}
        <View style={dynamicStyles.statsCard}>
          <Text style={dynamicStyles.statsTitle}>Today's Stats</Text>
          <View style={dynamicStyles.statsGrid}>
            <View style={dynamicStyles.statItem}>
              <Text style={dynamicStyles.statValue}>0</Text>
              <Text style={dynamicStyles.statLabel}>Trips</Text>
            </View>
            <View style={dynamicStyles.statItem}>
              <Text style={dynamicStyles.statValue}>₹0</Text>
              <Text style={dynamicStyles.statLabel}>Earnings</Text>
            </View>
            <View style={dynamicStyles.statItem}>
              <Text style={dynamicStyles.statValue}>0</Text>
              <Text style={dynamicStyles.statLabel}>Hours</Text>
            </View>
            <View style={dynamicStyles.statItem}>
              <Text style={dynamicStyles.statValue}>5.0</Text>
              <Text style={dynamicStyles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Actions Card */}
        <View style={dynamicStyles.actionsCard}>
          <Text style={dynamicStyles.actionsTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={dynamicStyles.actionButton}
            onPress={() => router.push('/car-driver/profile')}
          >
            <User color={colors.textSecondary} size={20} style={dynamicStyles.actionIcon} />
            <Text style={dynamicStyles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={dynamicStyles.actionButton}
            onPress={() => router.push('/car-driver/trips')}
          >
            <Car color={colors.textSecondary} size={20} style={dynamicStyles.actionIcon} />
            <Text style={dynamicStyles.actionText}>View Trips</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={dynamicStyles.actionButton}
            onPress={() => router.push('/car-driver/earnings')}
          >
            <Star color={colors.textSecondary} size={20} style={dynamicStyles.actionIcon} />
            <Text style={dynamicStyles.actionText}>Earnings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={dynamicStyles.actionButton}
            onPress={() => router.push('/car-driver/schedule')}
          >
            <Calendar color={colors.textSecondary} size={20} style={dynamicStyles.actionIcon} />
            <Text style={dynamicStyles.actionText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
