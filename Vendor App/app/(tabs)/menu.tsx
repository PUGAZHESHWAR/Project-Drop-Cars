import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User, Package, DollarSign, TrendingUp, Calendar, Settings, CircleHelp as HelpCircle, Info, LogOut, Bell, Shield, Star, Phone, Mail, Globe, FileText, CreditCard, Clock, Award, ChevronRight, Wallet } from 'lucide-react-native';

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
  const router = useRouter();
  const [vendorData] = useState<VendorData>({
    id: "7c7ae8a8-3d57-4feb-9ea1-2b80e91a0e83",
    full_name: "Pugazheshwar",
    primary_number: "9600048429",
    secondary_number: "9585984449",
    gpay_number: "9600048429",
    wallet_balance: 2450,
    bank_balance: 15630,
    aadhar_number: "123412341234",
    aadhar_front_img: "https://storage.googleapis.com/drop-cars-files/vendor_details/aadhar/a27638bc-5879-4f8b-8ceb-7b89173333a2.jpg",
    address: "Bypass Road 2nd street",
    account_status: "Active",
    created_at: "2025-09-17T18:43:45.189233Z"
  });

  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logging out...');
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
      id: 'earnings',
      title: 'Earnings',
      subtitle: 'Track your income',
      icon: DollarSign,
      iconColor: '#60A5FA',
      action: () => console.log('Navigate to Earnings'),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences',
      icon: Settings,
      iconColor: '#6B7280',
      action: () => console.log('Navigate to Settings'),
    },
    {
      id: 'support',
      title: 'Support',
      subtitle: 'Get help and contact us',
      icon: HelpCircle,
      iconColor: '#F59E0B',
      action: () => console.log('Navigate to Support'),
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App information',
      icon: Info,
      iconColor: '#8B5CF6',
      action: () => console.log('Navigate to About'),
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
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                    {vendorData.full_name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={[
                  styles.statusIndicator, 
                  { backgroundColor: vendorData.account_status === 'Active' ? '#10B981' : '#F59E0B' }
                ]} />
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{vendorData.full_name}</Text>
                <View style={styles.statusContainer}>
                  <View style={styles.statusBadge}>
                    <Shield size={12} color="#FFFFFF" />
                    <Text style={styles.statusText}>{vendorData.account_status}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#FFFFFF" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* Wallet Balance Card */}
          <View style={styles.walletSection}>
            <View style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <Wallet size={24} color="#FFFFFF" />
                <Text style={styles.walletLabel}>Wallet Balance</Text>
              </View>
              <Text style={styles.walletAmount}>
                ₹{vendorData.wallet_balance.toLocaleString('en-IN')}
              </Text>
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
                  <ChevronRight size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Support Section */}
          <View style={styles.supportSection}>
            <Text style={styles.sectionTitle}>Support & Help</Text>
            
            <View style={styles.supportCard}>
              <TouchableOpacity style={styles.supportItem}>
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
              
              <TouchableOpacity style={styles.supportItem}>
                <View style={styles.supportIcon}>
                  <Mail size={20} color="#3B82F6" />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportLabel}>Email Support</Text>
                  <Text style={styles.supportValue}>support@dropcars.com</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.supportItem}>
                <View style={styles.supportIcon}>
                  <Globe size={20} color="#10B981" />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportLabel}>Website</Text>
                  <Text style={styles.supportValue}>www.dropcars.com</Text>
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
                  Professional delivery management app for vendors. Manage your bookings, track earnings, and grow your business.
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
    fontSize: 24,
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
  notificationButton: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
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
    alignItems: 'center',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
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