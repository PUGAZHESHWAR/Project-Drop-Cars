import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useCarDriver } from '@/contexts/CarDriverContext';
import { useRouter } from 'expo-router';
import { 
  X, 
  User, 
  Car, 
  History, 
  Settings, 
  LogOut,
  ChevronRight,
  Phone,
  MapPin,
  Languages,
  Users,
  Wallet
} from 'lucide-react-native';

interface DrawerNavigationProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerNavigation({ visible, onClose }: DrawerNavigationProps) {
  const { user, refreshUserData, logout } = useAuth();
  const { balance } = useWallet();
  const { colors } = useTheme();
  const { dashboardData, clearAllData: clearDashboardData } = useDashboard();
  const { clearAllData: clearCarDriverData } = useCarDriver();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            console.log('🔄 Starting comprehensive logout process...');
            
            // Clear all context data first
            clearDashboardData();
            clearCarDriverData();
            
            // Then perform auth logout (which clears storage)
            await logout();
            
            console.log('✅ Logout completed, redirecting to login...');
            onClose();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleRefreshUserData = async () => {
    try {
      await refreshUserData();
      Alert.alert('Success', 'User data refreshed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh user data');
    }
  };

  const getDriverStatusSummary = () => {
    if (!dashboardData?.drivers || dashboardData.drivers.length === 0) {
      console.log('🔍 No drivers found in dashboard data');
      return '0 drivers';
    }

    const drivers = dashboardData.drivers;
    console.log('🔍 Driver status summary - Total drivers:', drivers.length);
    console.log('🔍 Driver statuses:', drivers.map(d => ({ name: d.full_name, status: d.driver_status })));

    const statusCounts = {
      ONLINE: 0,
      OFFLINE: 0,
      DRIVING: 0,
      BLOCKED: 0,
      PROCESSING: 0,
      OTHER: 0
    };

    drivers.forEach(driver => {
      const status = driver.driver_status?.toUpperCase();
      console.log(`🔍 Processing driver ${driver.full_name} with status: ${status}`);
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      } else {
        statusCounts.OTHER++;
      }
    });

    console.log('🔍 Status counts:', statusCounts);

    const total = drivers.length;
    const onlineCount = statusCounts.ONLINE;
    const offlineCount = statusCounts.OFFLINE;
    const drivingCount = statusCounts.DRIVING;
    const blockedCount = statusCounts.BLOCKED;
    const processingCount = statusCounts.PROCESSING;

    // Show online and offline drivers prominently
    if (onlineCount > 0 && offlineCount > 0) {
      return `${total} drivers • ${onlineCount} online • ${offlineCount} offline`;
    } else if (onlineCount > 0) {
      return `${total} drivers • ${onlineCount} online`;
    } else if (offlineCount > 0) {
      return `${total} drivers • ${offlineCount} offline`;
    } else if (drivingCount > 0) {
      return `${total} drivers • ${drivingCount} on duty`;
    } else if (blockedCount > 0) {
      return `${total} drivers • ${blockedCount} blocked`;
    } else if (processingCount > 0) {
      return `${total} drivers • ${processingCount} verifying`;
    } else {
      return `${total} drivers`;
    }
  };

  const dynamicStyles = StyleSheet.create({
    overlay: {
      flex: 1,
    },
    backdrop: {
      flex: 1,
    },
    drawer: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '85%',
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 10,
    },
    drawerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginTop: 40,
    },
    headerLeft: {
      flex: 1,
    },
    drawerTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    drawerContent: {
      flex: 1,
      paddingTop: 20,
    },
    profileSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    profileDetails: {
      flex: 1,
    },
    profileName: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    profileText: {
      marginLeft: 8,
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    menuSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.background,
    },
    menuLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    dangerIcon: {
      backgroundColor: '#FEE2E2',
    },
    menuTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    dangerText: {
      color: colors.error,
    },
    menuSubtitle: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    logoutSection: {
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 20,
    },
  });
  const MenuItem = ({ icon, title, subtitle, onPress, danger = false, rightComponent }: {
    icon: React.ReactElement;
    title: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
    rightComponent?: React.ReactElement;
  }) => (
    <TouchableOpacity style={dynamicStyles.menuItem} onPress={onPress}>
      <View style={dynamicStyles.menuLeft}>
        <View style={[dynamicStyles.menuIcon, danger && dynamicStyles.dangerIcon]}>
          {icon}
        </View>
        <View>
          <Text style={[dynamicStyles.menuTitle, danger && dynamicStyles.dangerText]}>{title}</Text>
          {subtitle && <Text style={dynamicStyles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <ChevronRight color={danger ? colors.error : colors.textSecondary} size={20} />}
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={50} style={dynamicStyles.overlay}>
        <TouchableOpacity style={dynamicStyles.backdrop} onPress={onClose} />
        
        <View style={dynamicStyles.drawer}>
          <View style={dynamicStyles.drawerHeader}>
            <View style={dynamicStyles.headerLeft}>
              <Text style={dynamicStyles.drawerTitle}>Menu</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={dynamicStyles.closeButton}>
              <X color={colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={dynamicStyles.drawerContent} showsVerticalScrollIndicator={false}>
            {/* Profile Section */}
            <View style={dynamicStyles.profileSection}>
              <View style={dynamicStyles.profileInfo}>
                <View style={dynamicStyles.avatarContainer}>
                  <User color="#FFFFFF" size={24} />
                </View>
                <View style={dynamicStyles.profileDetails}>
                  <Text style={dynamicStyles.profileName}>
                    {dashboardData?.user_info?.full_name || user?.fullName || 'Driver'}
                  </Text>
                  <View style={dynamicStyles.profileRow}>
                    <Phone color={colors.textSecondary} size={14} />
                    <Text style={dynamicStyles.profileText}>
                      {dashboardData?.user_info?.primary_number || user?.primaryMobile || 'No mobile number'}
                    </Text>
                  </View>
                  <View style={dynamicStyles.profileRow}>
                    <MapPin color={colors.textSecondary} size={14} />
                    <Text style={dynamicStyles.profileText}>
                      {dashboardData?.user_info?.address || user?.address || 'No address'}
                    </Text>
                  </View>
                  <View style={dynamicStyles.profileRow}>
                    <Languages color={colors.textSecondary} size={14} />
                    <Text style={dynamicStyles.profileText}>
                      {user?.languages && user.languages.length > 0 ? user.languages.join(', ') : 'No languages'}
                    </Text>
                  </View>
                  <View style={dynamicStyles.profileRow}>
                    <Wallet color={colors.textSecondary} size={14} />
                    <Text style={dynamicStyles.profileText}>
                      ₹{dashboardData?.user_info?.wallet_balance || 0}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Menu Items */}
            <View style={dynamicStyles.menuSection}>
              <MenuItem
                icon={<Car color={colors.textSecondary} size={20} />}
                title="My Cars"
                subtitle={`${dashboardData?.cars?.length || 0} vehicles`}
                onPress={() => {
                  onClose();
                  if (dashboardData?.cars && dashboardData.cars.length > 0) {
                    router.push('/my-cars');
                  } else {
                    router.push('/add-car');
                  }
                }}
                rightComponent={<ChevronRight color={colors.textSecondary} size={20} />}
              />

              <MenuItem
                icon={<Users color={colors.textSecondary} size={20} />}
                title="My Drivers"
                subtitle={getDriverStatusSummary()}
                onPress={() => {
                  onClose();
                  if (dashboardData?.drivers && dashboardData.drivers.length > 0) {
                    router.push('/my-drivers');
                  } else {
                    router.push('/add-driver');
                  }
                }}
                rightComponent={<ChevronRight color={colors.textSecondary} size={20} />}
              />

              <MenuItem
                icon={<History color={colors.textSecondary} size={20} />}
                title="Trip History"
                subtitle="View completed trips"
                onPress={() => {
                  onClose();
                  router.push('/(tabs)/rides');
                }}
                rightComponent={<ChevronRight color={colors.textSecondary} size={20} />}
              />

              <MenuItem
                icon={<Settings color={colors.textSecondary} size={20} />}
                title="Settings"
                subtitle="App preferences"
                onPress={() => {
                  onClose();
                  router.push('/(tabs)/settings');
                }}
                rightComponent={<ChevronRight color={colors.textSecondary} size={20} />}
              />

              <MenuItem
                icon={<User color={colors.textSecondary} size={20} />}
                title="Refresh Data"
                subtitle="Update user information"
                onPress={handleRefreshUserData}
                rightComponent={<ChevronRight color={colors.textSecondary} size={20} />}
              />
            </View>

            {/* Logout */}
            <View style={dynamicStyles.logoutSection}>
              <MenuItem
                icon={<LogOut color={colors.error} size={20} />}
                title="Logout"
                onPress={handleLogout}
                danger={true}
              />
            </View>
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
}