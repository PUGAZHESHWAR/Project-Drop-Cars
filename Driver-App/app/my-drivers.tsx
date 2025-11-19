import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, Plus, Phone, MapPin, CreditCard, RefreshCw } from 'lucide-react-native';
import { fetchDashboardData } from '@/services/orders/dashboardService';

export default function MyDriversScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { 
    dashboardData, 
    loading, 
    error, 
    fetchData,
    availableDrivers,
    availableDriversLoading,
    availableDriversError,
    fetchAvailableDriversData,
    refreshAvailableDrivers
  } = useDashboard();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL'); // Default to show all

  // Auto-fetch available drivers when component mounts
  useEffect(() => {
    console.log('🚀 MyDriversScreen mounted, auto-fetching available drivers...');
    fetchAvailableDriversData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
      await refreshAvailableDrivers();
    } catch (error) {
      console.error('Error refreshing drivers:', error);
    } finally {
      setRefreshing(false);
    }
  };


  const handleStatusFilterChange = (status: string) => {
    setSelectedStatusFilter(status);
  };

  // Filter available drivers based on selected status
  const getFilteredAvailableDrivers = () => {
    if (!availableDrivers || availableDrivers.length === 0) return [];
    
    if (selectedStatusFilter === 'ALL') {
      return availableDrivers;
    }
    
    return availableDrivers.filter(driver => 
      driver.driver_status?.toUpperCase() === selectedStatusFilter
    );
  };

  // Get status counts for tabs
  const getStatusCounts = () => {
    if (!availableDrivers || availableDrivers.length === 0) {
      return { ALL: 0, ONLINE: 0, OFFLINE: 0, PROCESSING: 0 };
    }
    
    return {
      ALL: availableDrivers.length,
      ONLINE: availableDrivers.filter(d => d.driver_status === 'ONLINE').length,
      OFFLINE: availableDrivers.filter(d => d.driver_status === 'OFFLINE').length,
      PROCESSING: availableDrivers.filter(d => d.driver_status === 'PROCESSING').length,
    };
  };

  // Get readable status labels
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ALL': return 'All';
      case 'ONLINE': return 'Online';
      case 'OFFLINE': return 'Offline';
      case 'PROCESSING': return 'Verifying';
      default: return status;
    }
  };

  const handleAddDriver = () => {
    router.push('/add-driver');
  };

  // Edit/Delete not implemented – hide controls

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
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 4,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    driverCard: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    driverHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    driverTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      flex: 1,
    },
    driverActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
    },
    driverInfo: {
      marginBottom: 16,
    },
    driverRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    driverLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      width: 100,
    },
    driverValue: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      flex: 1,
    },
    driverImages: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    imageItem: {
      width: 80,
      height: 60,
      backgroundColor: colors.border,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageText: {
      fontSize: 10,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    errorText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.error,
      textAlign: 'center',
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 4,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    toggleButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
      marginRight: 6,
    },
    availableDriversSection: {
      marginTop: 0,
      paddingHorizontal: 0,
    },
    availableDriversHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    availableDriversTitleContainer: {
      flex: 1,
    },
    sectionSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    availableDriversActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    refreshButton: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.primary + '15',
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    statusTabsContainer: {
      flexDirection: 'row',
      marginBottom: 24,
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 4,
    },
    statusTab: {
      flex: 1,
      alignItems: 'center',
      borderRadius: 16,
      backgroundColor: 'transparent',
      minHeight: 60,
    },
    statusTabSelected: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    statusTabText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
      marginBottom: 6,
      textAlign: 'center',
      lineHeight: 20,
    },
    statusTabTextSelected: {
      color: '#FFFFFF',
      fontFamily: 'Inter-Bold',
      fontSize: 16,
    },
    statusTabCountContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 14,
      minWidth: 28,
      alignItems: 'center',
    },
    statusTabCountContainerSelected: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    statusTabCount: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    statusTabCountSelected: {
      color: '#FFFFFF',
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.loadingContainer}>
          <Text style={dynamicStyles.loadingText}>Loading your drivers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.errorContainer}>
          <Text style={dynamicStyles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={dynamicStyles.retryButton} onPress={fetchData}>
            <Text style={dynamicStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Sort drivers by status priority: ONLINE, DRIVING, OFFLINE, BLOCKED, PROCESSING, OTHER
  const getDriverStatusPriority = (status: string) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'ONLINE': return 1;
      case 'DRIVING': return 2;
      case 'OFFLINE': return 3;
      case 'BLOCKED': return 4;
      case 'PROCESSING': return 5;
      default: return 6;
    }
  };

  const getStatusColor = (status: string) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'ONLINE': return '#10B981'; // Green
      case 'DRIVING': return '#3B82F6'; // Blue
      case 'OFFLINE': return '#6B7280'; // Gray
      case 'BLOCKED': return '#EF4444'; // Red
      case 'PROCESSING': return '#F59E0B'; // Orange
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'ONLINE': return 'Online';
      case 'DRIVING': return 'On Duty';
      case 'OFFLINE': return 'Offline';
      case 'BLOCKED': return 'Blocked';
      case 'PROCESSING': return 'Verifying';
      default: return status || 'Unknown';
    }
  };

  const drivers = (dashboardData?.drivers || []).sort((a, b) => {
    return getDriverStatusPriority(a.driver_status) - getDriverStatusPriority(b.driver_status);
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={dynamicStyles.backButton}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>My Drivers</Text>
        </View>
        <TouchableOpacity style={dynamicStyles.addButton} onPress={handleAddDriver}>
          <Plus color="#FFFFFF" size={16} />
          <Text style={dynamicStyles.addButtonText}>Add Driver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={dynamicStyles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
{/* 
        {drivers.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <Users color={colors.textSecondary} size={64} style={dynamicStyles.emptyIcon} />
            <Text style={dynamicStyles.emptyTitle}>No Drivers Added Yet</Text>
            <Text style={dynamicStyles.emptySubtitle}>
              Add your first driver to start earning with Drop Cars
            </Text>
            <TouchableOpacity style={dynamicStyles.addButton} onPress={handleAddDriver}>
              <Plus color="#FFFFFF" size={16} />
              <Text style={dynamicStyles.addButtonText}>Add Your First Driver</Text>
            </TouchableOpacity>
          </View>
        ) : (
          drivers.map((driver) => (
            <View key={driver.id} style={dynamicStyles.driverCard}>
              <View style={dynamicStyles.driverHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={dynamicStyles.driverTitle}>
                    {driver.full_name}
                  </Text>
                  <View style={[dynamicStyles.statusBadge, { backgroundColor: getStatusColor(driver.driver_status) + '20' }]}>
                    <View style={[dynamicStyles.statusDot, { backgroundColor: getStatusColor(driver.driver_status) }]} />
                    <Text style={[dynamicStyles.statusText, { color: getStatusColor(driver.driver_status) }]}>
                      {getStatusText(driver.driver_status)}
                    </Text>
                  </View>
                </View>
                <View style={dynamicStyles.driverActions}>
                  <TouchableOpacity 
                    style={dynamicStyles.actionButton}
                    onPress={() => handleEditDriver(driver.id)}
                  >
                    <Edit color={colors.primary} size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={dynamicStyles.actionButton}
                    onPress={() => handleDeleteDriver(driver.id)}
                  >
                    <Trash2 color={colors.error} size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={dynamicStyles.driverInfo}>
                <View style={dynamicStyles.driverRow}>
                  <Phone color={colors.textSecondary} size={16} />
                  <Text style={dynamicStyles.driverLabel}>Primary:</Text>
                  <Text style={dynamicStyles.driverValue}>{driver.primary_number}</Text>
                </View>
                {driver.secondary_number && (
                  <View style={dynamicStyles.driverRow}>
                    <Phone color={colors.textSecondary} size={16} />
                    <Text style={dynamicStyles.driverLabel}>Secondary:</Text>
                    <Text style={dynamicStyles.driverValue}>{driver.secondary_number}</Text>
                  </View>
                )}
                <View style={dynamicStyles.driverRow}>
                  <CreditCard color={colors.textSecondary} size={16} />
                  <Text style={dynamicStyles.driverLabel}>Licence:</Text>
                  <Text style={dynamicStyles.driverValue}>{driver.licence_number}</Text>
                </View>
                <View style={dynamicStyles.driverRow}>
                  <MapPin color={colors.textSecondary} size={16} />
                  <Text style={dynamicStyles.driverLabel}>Address:</Text>
                  <Text style={dynamicStyles.driverValue}>{driver.adress}</Text>
                </View>
                <View style={dynamicStyles.driverRow}>
                  <Text style={dynamicStyles.driverLabel}>Organization:</Text>
                  <Text style={dynamicStyles.driverValue}>{driver.organization_id}</Text>
                </View>
              </View>

              <View style={dynamicStyles.driverImages}>
                <View style={dynamicStyles.imageItem}>
                  <CreditCard color={colors.textSecondary} size={20} />
                  <Text style={dynamicStyles.imageText}>Licence</Text>
                </View>
              </View>
            </View>
          ))
        )} */}

        {/* Drivers Section */}
        <View style={dynamicStyles.availableDriversSection}>
          <View style={dynamicStyles.availableDriversHeader}>
            <View style={dynamicStyles.availableDriversTitleContainer}>
              <Text style={dynamicStyles.sectionSubtitle}>
                {availableDrivers.length} drivers available
              </Text>
            </View>
            <TouchableOpacity 
              style={dynamicStyles.refreshButton} 
              onPress={refreshAvailableDrivers}
            >
              <RefreshCw color={colors.primary} size={16} />
            </TouchableOpacity>
          </View>

          {/* Status Filter Tabs */}
          <View style={dynamicStyles.statusTabsContainer}>
            {['ALL', 'ONLINE', 'OFFLINE', 'PROCESSING'].map((status) => {
              const counts = getStatusCounts();
              const isSelected = selectedStatusFilter === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[
                    dynamicStyles.statusTab,
                    isSelected && dynamicStyles.statusTabSelected
                  ]}
                  onPress={() => handleStatusFilterChange(status)}
                >
                  <Text style={[
                    dynamicStyles.statusTabText,
                    isSelected && dynamicStyles.statusTabTextSelected
                  ]}>
                    {getStatusLabel(status)}
                  </Text>
                  <View style={[
                    dynamicStyles.statusTabCountContainer,
                    isSelected && dynamicStyles.statusTabCountContainerSelected
                  ]}>
                    <Text style={[
                      dynamicStyles.statusTabCount,
                      isSelected && dynamicStyles.statusTabCountSelected
                    ]}>
                      {counts[status as keyof typeof counts]}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {availableDriversLoading ? (
            <View style={dynamicStyles.loadingContainer}>
              <Text style={dynamicStyles.loadingText}>Loading available drivers...</Text>
            </View>
          ) : availableDriversError ? (
            <View style={dynamicStyles.errorContainer}>
              <Text style={dynamicStyles.errorText}>{availableDriversError}</Text>
              <TouchableOpacity style={dynamicStyles.retryButton} onPress={refreshAvailableDrivers}>
                <Text style={dynamicStyles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : getFilteredAvailableDrivers().length === 0 ? (
            <View style={dynamicStyles.emptyState}>
              <Users color={colors.textSecondary} size={64} style={dynamicStyles.emptyIcon} />
              <Text style={dynamicStyles.emptyTitle}>
                {selectedStatusFilter === 'ALL' ? 'No Drivers Found' : `No ${getStatusLabel(selectedStatusFilter)}`}
              </Text>
              <Text style={dynamicStyles.emptySubtitle}>
                {selectedStatusFilter === 'ALL' 
                  ? 'There are no drivers available at the moment.'
                  : `No drivers with ${getStatusLabel(selectedStatusFilter).toLowerCase()} status found.`
                }
              </Text>
            </View>
          ) : (
            getFilteredAvailableDrivers().map((driver) => (
                <View key={driver.id} style={dynamicStyles.driverCard}>
                  <View style={dynamicStyles.driverHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={dynamicStyles.driverTitle}>
                        {driver.full_name}
                      </Text>
                      <View style={[dynamicStyles.statusBadge, { backgroundColor: getStatusColor(driver.driver_status) + '20' }]}>
                        <View style={[dynamicStyles.statusDot, { backgroundColor: getStatusColor(driver.driver_status) }]} />
                        <Text style={[dynamicStyles.statusText, { color: getStatusColor(driver.driver_status) }]}>
                          {getStatusText(driver.driver_status)}
                        </Text>
                      </View>
                    </View>
                    {/* Edit/Delete actions removed */}
                  </View>

                  <View style={dynamicStyles.driverInfo}>
                    <View style={dynamicStyles.driverRow}>
                      <Phone color={colors.textSecondary} size={16} />
                      <Text style={dynamicStyles.driverLabel}>Primary:</Text>
                      <Text style={dynamicStyles.driverValue}>{driver.primary_number}</Text>
                    </View>
                    {driver.secondary_number && (
                      <View style={dynamicStyles.driverRow}>
                        <Phone color={colors.textSecondary} size={16} />
                        <Text style={dynamicStyles.driverLabel}>Secondary:</Text>
                        <Text style={dynamicStyles.driverValue}>{driver.secondary_number}</Text>
                      </View>
                    )}
                    <View style={dynamicStyles.driverRow}>
                      <CreditCard color={colors.textSecondary} size={16} />
                      <Text style={dynamicStyles.driverLabel}>Licence:</Text>
                      <Text style={dynamicStyles.driverValue}>{driver.licence_number}</Text>
                    </View>
                    <View style={dynamicStyles.driverRow}>
                      <MapPin color={colors.textSecondary} size={16} />
                      <Text style={dynamicStyles.driverLabel}>Address:</Text>
                      <Text style={dynamicStyles.driverValue}>{driver.adress}</Text>
                    </View>
                    <View style={dynamicStyles.driverRow}>
                      <Text style={dynamicStyles.driverLabel}>Organization:</Text>
                      <Text style={dynamicStyles.driverValue}>{driver.organization_id}</Text>
                    </View>
                  </View>

                  <View style={dynamicStyles.driverImages}>
                    <View style={dynamicStyles.imageItem}>
                      <CreditCard color={colors.textSecondary} size={20} />
                      <Text style={dynamicStyles.imageText}>Licence</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}