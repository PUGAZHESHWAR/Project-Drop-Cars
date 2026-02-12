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
import { ArrowLeft, Car, Plus, Image as ImageIcon } from 'lucide-react-native';
import { fetchDashboardData } from '@/services/orders/dashboardService';

export default function MyCarsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { dashboardData, loading, error, fetchData } = useDashboard();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error('Error refreshing cars:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddCar = () => {
    router.push('/add-car');
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
    carCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    carHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    carTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      flex: 1,
    },
    carActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
    },
    carInfo: {
      marginBottom: 16,
    },
    carRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    carLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      width: 100,
    },
    carValue: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      flex: 1,
    },
    carImages: {
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
  });

  if (loading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.loadingContainer}>
          <Text style={dynamicStyles.loadingText}>Loading your cars...</Text>
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

  const cars = dashboardData?.cars || [];

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={dynamicStyles.backButton}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>My Cars</Text>
        </View>
        <TouchableOpacity style={dynamicStyles.addButton} onPress={handleAddCar}>
          <Plus color="#FFFFFF" size={16} />
          <Text style={dynamicStyles.addButtonText}>Add Car</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={dynamicStyles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {cars.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <Car color={colors.textSecondary} size={64} style={dynamicStyles.emptyIcon} />
            <Text style={dynamicStyles.emptyTitle}>No Cars Added Yet</Text>
            <Text style={dynamicStyles.emptySubtitle}>
              Add your first car to start earning with Drop Cars
            </Text>
            <TouchableOpacity style={dynamicStyles.addButton} onPress={handleAddCar}>
              <Plus color="#FFFFFF" size={16} />
              <Text style={dynamicStyles.addButtonText}>Add Your First Car</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cars.map((car) => (
            <View key={car.id} style={dynamicStyles.carCard}>
              <View style={dynamicStyles.carHeader}>
                <Text style={dynamicStyles.carTitle}>
                  {car.car_brand} {car.car_model}
                </Text>
                {/* Edit/Delete actions removed */}
              </View>

              <View style={dynamicStyles.carInfo}>
                <View style={dynamicStyles.carRow}>
                  <Text style={dynamicStyles.carLabel}>Registration:</Text>
                  <Text style={dynamicStyles.carValue}>{car.car_number}</Text>
                </View>
                <View style={dynamicStyles.carRow}>
                  <Text style={dynamicStyles.carLabel}>Type:</Text>
                  <Text style={dynamicStyles.carValue}>{car.car_type}</Text>
                </View>
                <View style={dynamicStyles.carRow}>
                  <Text style={dynamicStyles.carLabel}>Year:</Text>
                  <Text style={dynamicStyles.carValue}>{car.car_year}</Text>
                </View>
                <View style={dynamicStyles.carRow}>
                  <Text style={dynamicStyles.carLabel}>Organization:</Text>
                  <Text style={dynamicStyles.carValue}>{car.organization_id}</Text>
                </View>
              </View>

              <View style={dynamicStyles.carImages}>
                <View style={dynamicStyles.imageItem}>
                  <ImageIcon color={colors.textSecondary} size={20} />
                  <Text style={dynamicStyles.imageText}>RC Front</Text>
                </View>
                <View style={dynamicStyles.imageItem}>
                  <ImageIcon color={colors.textSecondary} size={20} />
                  <Text style={dynamicStyles.imageText}>RC Back</Text>
                </View>
                <View style={dynamicStyles.imageItem}>
                  <ImageIcon color={colors.textSecondary} size={20} />
                  <Text style={dynamicStyles.imageText}>Insurance</Text>
                </View>
                <View style={dynamicStyles.imageItem}>
                  <ImageIcon color={colors.textSecondary} size={20} />
                  <Text style={dynamicStyles.imageText}>FC</Text>
                </View>
                <View style={dynamicStyles.imageItem}>
                  <ImageIcon color={colors.textSecondary} size={20} />
                  <Text style={dynamicStyles.imageText}>Car Image</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}