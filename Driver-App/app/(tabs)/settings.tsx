import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { Moon, Sun, LogOut, ChevronRight, User, Bell, Shield, Car, Users, X } from 'lucide-react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { notificationsEnabled, toggleNotifications, permission1, permission2, setPermission1, setPermission2 } = useNotifications();
  const { dashboardData, loading } = useDashboard();
  const router = useRouter();
  const [showTermsModal, setShowTermsModal] = useState(false);

  const termsAndConditions = `
Terms and Conditions – Drop Cars

Effective Date: from 2025 November

Welcome to Drop Cars. These Terms and Conditions ("Terms") govern your use of the Drop Cars mobile application and related services (collectively, the "App"). By registering or using the App, you agree to comply with and be bound by these Terms. Please read them carefully.

1. Definitions

"App" refers to the Drop Cars mobile application and related services.

"Vehicle Owner" means the registered owner of a vehicle who offers ride services using their own vehicle and driver.

"Driver" refers to the person assigned by the Vehicle Owner to operate the vehicle.

"Customer" means the individual booking rides through the App.

"We," "Us," or "Company" refers to Drop Cars and its administrators.

2. Eligibility

Vehicle Owners must:

• Own validly registered vehicles with all required permits and insurance.
• Employ or assign licensed drivers who meet legal driving requirements.
• Ensure vehicles are in safe, roadworthy condition.

3. Registration and Account

• Vehicle Owners must create an account on the App using accurate and verifiable details.
• The Company reserves the right to verify information and suspend or terminate accounts found to be fraudulent or misleading.

4. Services Provided

• Drop Cars acts as a technology platform connecting customers with vehicle owners for ride bookings.
• The Company does not own vehicles or employ drivers.
• All rides and payments are facilitated through the App, but the service agreement for transportation is between the customer and the vehicle owner.

5. Payments and Settlements

• All ride payments are processed through the App's payment gateway.
• After service completion, payment will be automatically settled to the vehicle owner's registered account, after deducting applicable service charges or commissions.
• The Company is not responsible for any disputes between vehicle owners and drivers regarding internal payments or settlements.
• Taxes, tolls, and additional charges (if applicable) must comply with government laws and policies.

6. Vehicle Owner Responsibilities

Vehicle Owners must:

• Ensure their drivers follow traffic laws and maintain courteous behavior.
• Keep the vehicle clean, insured, and regularly serviced.
• Immediately report accidents, breakdowns, or incidents involving customers.
• Not engage in unlawful or unsafe transportation activities through the App.

7. Driver Conduct

Drivers must:

• Possess a valid driving license and required documents.
• Refrain from alcohol, drugs, or any illegal activity while operating the vehicle.
• Follow all safety and traffic regulations.
• Treat passengers respectfully and maintain professionalism at all times.

8. Commission and Fees

• The Company may charge a commission or service fee on each completed ride.
• Fees may vary based on service type or promotional offers and are subject to change with prior notice.

9. Liability

• The Company is not liable for any accidents, damages, or losses arising from rides booked through the App.
• The Vehicle Owner and Driver are solely responsible for compliance with local laws and passenger safety.
• The Company provides technology support only and is not a transport service provider.

10. Data and Privacy

• User data (vehicle details, contact info, payment details) will be stored and used as per the Drop Cars Privacy Policy.
• The Company ensures reasonable security measures to protect user information.

11. Suspension or Termination

The Company reserves the right to:

• Suspend or terminate any account found violating these Terms or engaging in fraudulent activity.
• Withhold payments for review in case of reported disputes or fraudulent transactions.

12. Amendments

• Drop Cars may modify these Terms from time to time. Any updates will be notified through the App or website. Continued use after such updates constitutes acceptance of the revised Terms.

13. Governing Law

• These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your City/State].

14. Contact Us

For any queries or support, contact us at:
📧 support@dropcars.com
📞 1234567890
`;

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
            router.replace('/login');
          }
        }
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
      marginBottom: 12,
      marginLeft: 4,
    },
    settingItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    settingTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    settingSubtitle: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    logoutButton: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#FEE2E2',
    },
    logoutButtonText: {
      color: colors.error,
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 8,
    },
    profileCard: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    profileAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
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
      marginBottom: 4,
    },
    profileSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
    },
    profileStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      marginTop: 8,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      height: screenHeight * 0.8,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
    },
    closeButton: {
      padding: 8,
    },
    modalContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    termsText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      lineHeight: 22,
    },
  });

  type SettingItemProps = {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  };

  const SettingItem: React.FC<SettingItemProps> = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={dynamicStyles.settingItem} onPress={onPress}>
      <View style={dynamicStyles.settingLeft}>
        <View style={dynamicStyles.settingIcon}>{icon}</View>
        <View>
          <Text style={dynamicStyles.settingTitle}>{title}</Text>
          {subtitle && <Text style={dynamicStyles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <ChevronRight color={colors.textSecondary} size={20} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Settings</Text>
        <Text style={dynamicStyles.headerSubtitle}>
          Welcome back, {(dashboardData?.user_info?.full_name || user?.fullName || 'Driver')}!
        </Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Preferences</Text>
          
          <SettingItem
            icon={isDarkMode ? <Moon color={colors.textSecondary} size={20} /> : <Sun color={colors.textSecondary} size={20} />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDarkMode ? '#FFFFFF' : '#F3F4F6'}
              />
            }
          />

          <SettingItem
            icon={<Bell color={colors.textSecondary} size={20} />}
            title="Notifications"
            subtitle="Receive booking and trip notifications"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#F3F4F6'}
              />
            }
          />

          {/* Priority permissions */}
          <SettingItem
            icon={<Bell color={colors.textSecondary} size={20} />}
            title="Priority Alerts"
            subtitle="High-importance notifications"
            rightComponent={
              <Switch
                value={permission1}
                onValueChange={(v) => setPermission1(v)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={permission1 ? '#FFFFFF' : '#F3F4F6'}
              />
            }
          />
          <SettingItem
            icon={<Bell color={colors.textSecondary} size={20} />}
            title="General Alerts"
            subtitle="Regular updates and offers"
            rightComponent={
              <Switch
                value={permission2}
                onValueChange={(v) => setPermission2(v)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={permission2 ? '#FFFFFF' : '#F3F4F6'}
              />
            }
          />
        </View>

        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Account</Text>
          
          {/* Profile Card */}
          <View style={[dynamicStyles.profileCard, { backgroundColor: colors.surface }]}>
            <View style={dynamicStyles.profileHeader}>
              <View style={[dynamicStyles.profileAvatar, { backgroundColor: colors.primary }]}>
                <Text style={dynamicStyles.profileAvatarText}>
                  {(dashboardData?.user_info?.full_name || user?.fullName || 'V').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={dynamicStyles.profileInfo}>
                <Text style={[dynamicStyles.profileName, { color: colors.text }]}>
                  {dashboardData?.user_info?.full_name || user?.fullName || 'Vehicle Owner'}
                </Text>
                <Text style={[dynamicStyles.profileSubtitle, { color: colors.textSecondary }]}>
                  Vehicle Owner
                </Text>
              </View>
            </View>
            
            <View style={dynamicStyles.profileStats}>
              <View style={dynamicStyles.statItem}>
                <Car color={colors.primary} size={20} />
                <Text style={[dynamicStyles.statValue, { color: colors.text }]}>
                  {dashboardData?.cars?.length || 0}
                </Text>
                <Text style={[dynamicStyles.statLabel, { color: colors.textSecondary }]}>
                  Total Cars
                </Text>
              </View>
              <View style={dynamicStyles.statItem}>
                <Users color={colors.primary} size={20} />
                <Text style={[dynamicStyles.statValue, { color: colors.text }]}>
                  {dashboardData?.drivers?.length || 0}
                </Text>
                <Text style={[dynamicStyles.statLabel, { color: colors.textSecondary }]}>
                  Total Drivers
                </Text>
              </View>
            </View>
          </View>

          {/* <SettingItem
            icon={<User color={colors.textSecondary} size={20} />}
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon')}
          /> */}

          <SettingItem
            icon={<Shield color={colors.textSecondary} size={20} />}
            title="Privacy & Security"
            subtitle="View Terms and Conditions"
            onPress={() => setShowTermsModal(true)}
          />
        </View>


        <View style={dynamicStyles.section}>
          <TouchableOpacity style={dynamicStyles.logoutButton} onPress={handleLogout}>
            <LogOut color={colors.error} size={20} />
            <Text style={dynamicStyles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Terms and Conditions Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={[dynamicStyles.modalContainer, { backgroundColor: colors.surface }]}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={[dynamicStyles.modalTitle, { color: colors.text }]}>
                Terms and Conditions
              </Text>
              <TouchableOpacity 
                onPress={() => setShowTermsModal(false)}
                style={dynamicStyles.closeButton}
              >
                <X color={colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={dynamicStyles.modalContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={[dynamicStyles.termsText, { color: colors.text }]}>
                {termsAndConditions}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}