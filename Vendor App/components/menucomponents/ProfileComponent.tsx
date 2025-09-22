import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Phone, CreditCard, MapPin, Calendar, Wallet, Building2, CreditCard as Edit, Camera, Shield, Copy, ExternalLink } from 'lucide-react-native';

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

export default function ProfileComponent() {
  const [vendorData] = useState<VendorData>({
    id: "7c7ae8a8-3d57-4feb-9ea1-2b80e91a0e83",
    full_name: "Pugazheshwar",
    primary_number: "9600048429",
    secondary_number: "9585984449",
    gpay_number: "9600048429",
    wallet_balance: 0,
    bank_balance: 0,
    aadhar_number: "123412341234",
    aadhar_front_img: "https://storage.googleapis.com/drop-cars-files/vendor_details/aadhar/a27638bc-5879-4f8b-8ceb-7b89173333a2.jpg",
    address: "Bypass Road 2nd street",
    account_status: "Active",
    created_at: "2025-09-17T18:43:45.189233Z"
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    // In a real app, you'd use Clipboard API
    Alert.alert('Copied', `${label} copied to clipboard!`);
  };

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        {
          label: 'Full Name',
          value: vendorData.full_name,
          icon: User,
          action: () => copyToClipboard(vendorData.full_name, 'Full Name'),
        },
        {
          label: 'Vendor ID',
          value: vendorData.id.substring(0, 8) + '...',
          icon: Shield,
          action: () => copyToClipboard(vendorData.id, 'Vendor ID'),
        },
        {
          label: 'Address',
          value: vendorData.address,
          icon: MapPin,
          action: () => copyToClipboard(vendorData.address, 'Address'),
        },
        {
          label: 'Member Since',
          value: formatDate(vendorData.created_at),
          icon: Calendar,
          action: undefined,
        },
      ],
    },
    {
      title: 'Contact Information',
      items: [
        {
          label: 'Primary Number',
          value: vendorData.primary_number,
          icon: Phone,
          action: () => copyToClipboard(vendorData.primary_number, 'Primary Number'),
        },
        {
          label: 'Secondary Number',
          value: vendorData.secondary_number,
          icon: Phone,
          action: () => copyToClipboard(vendorData.secondary_number, 'Secondary Number'),
        },
        {
          label: 'GPay Number',
          value: vendorData.gpay_number,
          icon: CreditCard,
          action: () => copyToClipboard(vendorData.gpay_number, 'GPay Number'),
        },
      ],
    },
    {
      title: 'Financial Information',
      items: [
        {
          label: 'Wallet Balance',
          value: `₹${vendorData.wallet_balance.toLocaleString('en-IN')}`,
          icon: Wallet,
          action: null,
        },
        {
          label: 'Bank Balance',
          value: `₹${vendorData.bank_balance.toLocaleString('en-IN')}`,
          icon: Building2,
          action: null,
        },
        {
          label: 'Total Balance',
          value: `₹${(vendorData.wallet_balance + vendorData.bank_balance).toLocaleString('en-IN')}`,
          icon: CreditCard,
          action: null,
        },
      ],
    },
    {
      title: 'Verification',
      items: [
        {
          label: 'Aadhar Number',
          value: `****-****-${vendorData.aadhar_number.slice(-4)}`,
          icon: Shield,
          action: () => copyToClipboard(vendorData.aadhar_number, 'Aadhar Number'),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={['#0b336bff', '#133b72ff', '#542683ff']}
          style={styles.headerSection}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileImageSection}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                  <Text style={styles.profileInitials}>
                    {vendorData.full_name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <TouchableOpacity style={styles.editImageButton}>
                  <Camera size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{vendorData.full_name}</Text>
                <Text style={styles.profilePhone}>+91 {vendorData.primary_number}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: vendorData.account_status === 'Active' ? '#10B981' : '#F59E0B' }
                ]}>
                  <Text style={styles.statusText}>{vendorData.account_status}</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Content Section */}
        <View style={styles.contentSection}>

          {/* Profile Sections */}
          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionCard}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.infoItem,
                      itemIndex < section.items.length - 1 && styles.infoItemBorder
                    ]}
                    onPress={item.action ?? undefined}
                    disabled={!item.action}
                  >
                    <View style={styles.infoLeft}>
                      <View style={styles.infoIcon}>
                        <item.icon size={20} color="#6B7280" />
                      </View>
                      <View style={styles.infoText}>
                        <Text style={styles.infoLabel}>{item.label}</Text>
                        <Text style={styles.infoValue}>{item.value}</Text>
                      </View>
                    </View>
                    {item.action && (
                      <Copy size={16} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Balance Summary */}
          <View style={styles.balanceSummary}>
            <Text style={styles.sectionTitle}>Financial Summary</Text>
            <LinearGradient
              colors={['#059669', '#10B981', '#34D399']}
              style={styles.balanceCard}
            >
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Total Available</Text>
                <Text style={styles.balanceAmount}>
                  ₹{(vendorData.wallet_balance + vendorData.bank_balance).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.balanceBreakdown}>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceSmallLabel}>Wallet</Text>
                  <Text style={styles.balanceSmallValue}>₹{vendorData.wallet_balance}</Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceSmallLabel}>Bank</Text>
                  <Text style={styles.balanceSmallValue}>₹{vendorData.bank_balance}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
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
    alignItems: 'center',
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  profilePhone: {
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  documentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  documentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  documentStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  viewButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  documentImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  documentNumber: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  infoItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  balanceSummary: {
    marginBottom: 32,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  balanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceSmallLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  balanceSmallValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});