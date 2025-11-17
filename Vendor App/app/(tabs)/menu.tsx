import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api from '../../app/api/api'; // Adjust the path as necessary
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Package, DollarSign, TrendingUp, Calendar,ArrowRight, Settings, CircleHelp as HelpCircle, Info, LogOut, Bell, Shield, Star, Phone, Mail, Globe, FileText, CreditCard, Clock, Award, ChevronRight, Wallet, RefreshCw } from 'lucide-react-native';

interface VendorData {
  id: string;
  full_name: string;
  primary_number: string;
  secondary_number: string;
  gpay_number: string;
  wallet_balance: number;
  bank_balance: number;
  aadhar_number: string;
  aadhar_front_img: string;
  address: string;
  account_status: string;
  created_at: string;
}

export default function MenuScreen() {
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchVendorData = async () => {
    try {
      const response = await api.get('/users/vendor-details/me');
      setVendorData(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching vendor data:", err);
      setError('Failed to fetch vendor data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVendorData();
  };

  const handleWalletRefresh = () => {
    setRefreshing(true);
    fetchVendorData();
  };

  const handleCall = () => {
    const phoneNumber = '+919876543210';
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to open dial pad');
    });
  };

  const handleEmail = () => {
    const email = 'dropcars.in@gmail.com';
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Unable to open the Gmail');
    });
  };

  const handleWebSite = () => {
    const weblink = 'www.arunachalatravels.in/#features';
    Linking.openURL(`https://${weblink}`).catch(() => {
      Alert.alert('Error', 'Unable to open the Gmail');
    });
  };

  const removeAccessToken = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      console.log('Access token removed successfully');
    } catch (error) {
      console.error('Error removing access token:', error);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    removeAccessToken();
    router.replace('/(auth)/sign-in');
  };

  const menuItems = [
    {
      id: 'profile',
      title: 'Profile',
      subtitle: 'View and edit your profile',
      icon: User,
      iconColor: '#1E40AF',
      action: () => router.push('/(menu)/profile'),
    },
    {
      id: 'orders',
      title: 'Orders',
      subtitle: 'Manage your deliveries',
      icon: Package,
      iconColor: '#3B82F6',
      action: () => router.push('/(menu)/orders'),
    },
    {
      id: 'Statement',
      title: 'Statement',
      subtitle: 'Track your income',
      icon: DollarSign,
      iconColor: '#60A5FA',
      action: () => router.push('/(menu)/wallet'),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences',
      icon: Settings,
      iconColor: '#6B7280',
      action: () => router.push('/(menu)/notification'),
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App information',
      icon: Info,
      iconColor: '#8B5CF6',
      action: () => router.push('/(menu)/about'),
    },
  ];

  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header Section */}
        <LinearGradient
          colors={['#057296ff', '#10575eff', '#094157ff']}
          style={styles.headerSection}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                  <Text style={styles.profileInitials}>
                    {vendorData?.full_name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={[
                  styles.statusIndicator, 
                  { backgroundColor: vendorData?.account_status === 'Active' ? '#10B981' : '#F59E0B' }
                ]} />
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{vendorData?.full_name}</Text>
                <View style={styles.statusContainer}>
                  <View style={styles.statusBadge}>
                    <Shield size={12} color="#FFFFFF" />
                    <Text style={styles.statusText}>{vendorData?.account_status}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Wallet Balance Card */}
          <View style={styles.walletSection}>
            <View style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <View style={styles.walletTitleContainer}>
                  <Wallet size={24} color="#FFFFFF" />
                  <Text style={styles.walletLabel}>Wallet Balance</Text>
                </View>
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={handleWalletRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw 
                    size={20} 
                    color="#FFFFFF" 
                    style={refreshing ? styles.refreshingIcon : null}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.walletAmount}>
                ₹{vendorData?.wallet_balance.toLocaleString('en-IN')}
              </Text>
              {refreshing && (
                <Text style={styles.refreshingText}>Updating...</Text>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Main Menu</Text>
            
            <View style={styles.menuGrid}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={item.action}
                >
                  <View style={styles.menuItemContent}>
                    <View style={[styles.menuIcon, { backgroundColor: `${item.iconColor}15` }]}>
                      <item.icon size={24} color={item.iconColor} />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                 <ArrowRight size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Support Section */}
          <View style={styles.supportSection}>
            <Text style={styles.sectionTitle}>Support & Help</Text>
            
            <View style={styles.supportCard}>
              <TouchableOpacity style={styles.supportItem} onPress={handleCall}>
                <View style={styles.supportIcon}>
                  <Phone size={20} color="#1E40AF" />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportLabel}>Call Support</Text>
                  <Text style={styles.supportValue}>+91 98765 43210</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.supportItem} onPress={handleEmail}>
                <View style={styles.supportIcon}>
                  <Mail size={20} color="#3B82F6" />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportLabel}>Email Support</Text>
                  <Text style={styles.supportValue}>dropcars.in@gmail.com</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.supportItem} onPress={handleWebSite}>
                <View style={styles.supportIcon}>
                  <Globe size={20} color="#10B981" />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportLabel}>Website</Text>
                  <Text style={styles.supportValue}>www.arunachalatravels.com</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* App Information */}
          <View style={styles.appSection}>
            <Text style={styles.sectionTitle}>App Information</Text>
            
            <View style={styles.appCard}>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>Drop Cars Vendor</Text>
                <Text style={styles.appVersion}>Version 1.0.0</Text>
                <Text style={styles.appDescription}>
                  Professional delivery management app for vendors. Manage your bookings, track Statement, and grow your business.
                </Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  profileSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  walletSection: {
    marginTop: 20,
  },
  walletCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  walletTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 16,
    color: '#E2E8F0',
    marginLeft: 8,
    fontWeight: '500',
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  refreshingIcon: {
    transform: [{ rotate: '360deg' }],
  },
  refreshingText: {
    fontSize: 12,
    color: '#E2E8F0',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuGrid: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  supportSection: {
    marginBottom: 32,
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportContent: {
    flex: 1,
  },
  supportLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  supportValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 72,
  },
  appSection: {
    marginBottom: 32,
  },
  appCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appInfo: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 40,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});