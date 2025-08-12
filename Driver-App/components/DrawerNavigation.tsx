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
  Users
} from 'lucide-react-native';

interface DrawerNavigationProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerNavigation({ visible, onClose }: DrawerNavigationProps) {
  const { user, logout } = useAuth();
  const { balance } = useWallet();
  const { colors } = useTheme();
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
            await logout();
            onClose();
            router.replace('/login');
          }
        }
      ]
    );
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
  const MenuItem = ({ icon, title, subtitle, onPress, danger = false, rightComponent }) => (
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
                  <Text style={dynamicStyles.profileName}>{user?.name}</Text>
                  <View style={dynamicStyles.profileRow}>
                    <Phone color={colors.textSecondary} size={14} />
                    <Text style={dynamicStyles.profileText}>{user?.mobile}</Text>
                  </View>
                  <View style={dynamicStyles.profileRow}>
                    <MapPin color={colors.textSecondary} size={14} />
                    <Text style={dynamicStyles.profileText}>{user?.address}</Text>
                  </View>
                  <View style={dynamicStyles.profileRow}>
                    <Languages color={colors.textSecondary} size={14} />
                    <Text style={dynamicStyles.profileText}>
                      {user?.languages?.join(', ')}
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
                subtitle={`${user?.cars?.length || 0} vehicles registered`}
                onPress={() => {
                  onClose();
                  router.push('/my-cars');
                }}
              />

              <MenuItem
                icon={<Users color={colors.textSecondary} size={20} />}
                title="My Drivers"
                subtitle="Manage your drivers"
                onPress={() => {
                  onClose();
                  router.push('/my-drivers');
                }}
              />

              <MenuItem
                icon={<History color={colors.textSecondary} size={20} />}
                title="My Rides"
                subtitle="View trip history"
                onPress={() => {
                  onClose();
                  router.push('/(tabs)/rides');
                }}
              />

              <MenuItem
                icon={<Settings color={colors.textSecondary} size={20} />}
                title="Settings"
                subtitle="App preferences"
                onPress={() => {
                  onClose();
                  router.push('/(tabs)/settings');
                }}
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