import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Phone, CreditCard, MapPin, Calendar, Wallet, Building2, Edit, Camera, Shield, Copy, ExternalLink, CheckCircle, XCircle, Clock, LucideIcon } from 'lucide-react-native';
import api from '../../app/api/api'; // Adjust the path as necessary

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
  aadhar_status: 'PENDING' | 'VERIFIED' | 'INVALID';
  address: string;
  account_status: string;
  created_at: string;
}

// Define interface for profile section items
interface ProfileSectionItem {
  label: string;
  value: string;
  icon: LucideIcon;
  action: (() => void) | null | undefined;
  customStyle?: any;
  statusColor?: string;
}

interface ProfileSection {
  title: string;
  items: ProfileSectionItem[];
}

export default function ProfileComponent() {
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await api.get('/users/vendor-details/me');
        setVendorData(response.data);
      } catch (err: any) {
        console.error("Error fetching vendor data:", err);
        setError('Failed to fetch vendor data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    Alert.alert('Copied', `${label} copied to clipboard!`);
  };

  const openAadharImage = async () => {
    if (!vendorData?.aadhar_front_img) {
      Alert.alert('Error', 'Aadhar image not available');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(vendorData.aadhar_front_img);
      
      if (supported) {
        await Linking.openURL(vendorData.aadhar_front_img);
      } else {
        Alert.alert('Error', 'Cannot open the image URL');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Failed to open image');
    }
  };

  const getAadharStatusConfig = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return {
          color: '#10B981',
          backgroundColor: '#D1FAE5',
          text: 'Verified',
          icon: CheckCircle
        };
      case 'INVALID':
        return {
          color: '#EF4444',
          backgroundColor: '#FEE2E2',
          text: 'Invalid',
          icon: XCircle
        };
      case 'PENDING':
      default:
        return {
          color: '#F59E0B',
          backgroundColor: '#FEF3C7',
          text: 'Pending',
          icon: Clock
        };
    }
  };

  // If still loading, show a spinner or loading text
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If error
  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  // Now vendorData is non-null, so safe to use
  const data = vendorData!;
  const aadharStatusConfig = getAadharStatusConfig(data.aadhar_status);

  const profileSections: ProfileSection[] = [
    {
      title: 'Personal Information',
      items: [
        {
          label: 'Full Name',
          value: data.full_name,
          icon: User,
          action: () => copyToClipboard(data.full_name, 'Full Name'),
        },
        {
          label: 'Vendor ID',
          value: data.id.substring(0, 8) + '...',
          icon: Shield,
          action: () => copyToClipboard(data.id, 'Vendor ID'),
        },
        {
          label: 'Address',
          value: data.address,
          icon: MapPin,
          action: () => copyToClipboard(data.address, 'Address'),
        },
        {
          label: 'Member Since',
          value: formatDate(data.created_at),
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
          value: data.primary_number,
          icon: Phone,
          action: () => copyToClipboard(data.primary_number, 'Primary Number'),
        },
        {
          label: 'Secondary Number',
          value: data.secondary_number,
          icon: Phone,
          action: () => copyToClipboard(data.secondary_number || '', 'Secondary Number'),
        },
        {
          label: 'GPay Number',
          value: data.gpay_number,
          icon: CreditCard,
          action: () => copyToClipboard(data.gpay_number, 'GPay Number'),
        },
      ],
    },
    {
      title: 'Financial Information',
      items: [
        {
          label: 'Wallet Balance',
          value: `₹${data.wallet_balance.toLocaleString('en-IN')}`,
          icon: Wallet,
          action: null,
        },
        {
          label: 'Bank Balance',
          value: `₹${data.bank_balance.toLocaleString('en-IN')}`,
          icon: Building2,
          action: null,
        },
        {
          label: 'Total Balance',
          value: `₹${(data.wallet_balance + data.bank_balance).toLocaleString('en-IN')}`,
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
          value: `****-****-${data.aadhar_number.slice(-4)}`,
          icon: Shield,
          action: () => copyToClipboard(data.aadhar_number, 'Aadhar Number'),
        },
        {
          label: 'Aadhar Status',
          value: aadharStatusConfig.text,
          icon: aadharStatusConfig.icon,
          action: undefined,
          customStyle: {
            backgroundColor: aadharStatusConfig.backgroundColor,
          },
          statusColor: aadharStatusConfig.color,
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
                    {data.full_name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{data.full_name}</Text>
                <Text style={styles.profilePhone}>+91 {data.primary_number}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: data.account_status === 'Active' ? '#10B981' : '#F59E0B' }
                ]}>
                  <Text style={styles.statusText}>{data.account_status}</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Content Section */}
        <View style={styles.contentSection}>

          {/* Aadhar Document Section */}
          {data.aadhar_front_img && (
            <View style={styles.documentSection}>
              <Text style={styles.sectionTitle}>Aadhar Document</Text>
              <View style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: aadharStatusConfig.backgroundColor }]}>
                    <aadharStatusConfig.icon size={16} color={aadharStatusConfig.color} />
                    <Text style={[styles.documentStatus, { color: aadharStatusConfig.color, marginLeft: 4 }]}>
                      {aadharStatusConfig.text}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={openAadharImage}
                  >
                    <ExternalLink size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={openAadharImage}>
                  <Image 
                    source={{ uri: data.aadhar_front_img }} 
                    style={styles.documentImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.documentNumber}>
                    Aadhar: ****-****-{data.aadhar_number.slice(-4)}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.viewFullButton}
                  onPress={openAadharImage}
                >
                  <Text style={styles.viewFullButtonText}>View Full Document</Text>
                  <ExternalLink size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          )}

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
                      itemIndex < section.items.length - 1 && styles.infoItemBorder,
                      item.customStyle
                    ]}
                    onPress={item.action ?? undefined}
                    disabled={!item.action}
                  >
                    <View style={styles.infoLeft}>
                      <View style={[
                        styles.infoIcon,
                        item.statusColor && { backgroundColor: `${item.statusColor}15` }
                      ]}>
                        <item.icon 
                          size={20} 
                          color={item.statusColor || '#6B7280'} 
                        />
                      </View>
                      <View style={styles.infoText}>
                        <Text style={styles.infoLabel}>{item.label}</Text>
                        <Text style={[
                          styles.infoValue,
                          item.statusColor && { color: item.statusColor }
                        ]}>
                          {item.value}
                        </Text>
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
                  ₹{(data.wallet_balance + data.bank_balance).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.balanceBreakdown}>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceSmallLabel}>Wallet</Text>
                  <Text style={styles.balanceSmallValue}>₹{data.wallet_balance.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceSmallLabel}>Bank</Text>
                  <Text style={styles.balanceSmallValue}>₹{data.bank_balance.toLocaleString('en-IN')}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
    justifyContent: 'space-between',
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  documentNumber: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  viewFullButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginRight: 8,
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