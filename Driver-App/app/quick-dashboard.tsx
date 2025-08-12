import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { MapPin, User, Phone, Car, ArrowRight, LogOut } from 'lucide-react-native';

export default function QuickDashboardScreen() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [tripStarted, setTripStarted] = useState(false);

  const assignedOrder = user?.assignedOrder;

  const handleStartTrip = () => {
    setTripStarted(true);
    router.push('/trip/start');
  };

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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 20,
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
      paddingTop: 24,
    },
    welcomeCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    welcomeText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    quickDriverText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    orderCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    orderTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
    routeContainer: {
      marginBottom: 16,
    },
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    routeText: {
      marginLeft: 12,
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    routeLine: {
      width: 1,
      height: 20,
      backgroundColor: colors.border,
      marginLeft: 8,
      marginVertical: 4,
    },
    customerInfo: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    customerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    customerText: {
      marginLeft: 12,
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    fareInfo: {
      backgroundColor: '#D1FAE5',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    fareText: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: '#065F46',
    },
    startButton: {
      backgroundColor: colors.success,
      borderRadius: 12,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    startButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      marginRight: 8,
    },
    logoutButton: {
      padding: 8,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerContent}>
          <Text style={dynamicStyles.headerTitle}>Quick Driver Dashboard</Text>
          <Text style={dynamicStyles.headerSubtitle}>Welcome back, {user?.name}!</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={dynamicStyles.logoutButton}>
          <LogOut color={colors.error} size={24} />
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.content}>
        <View style={dynamicStyles.welcomeCard}>
          <Text style={dynamicStyles.welcomeText}>Welcome, {user?.name}</Text>
          <Text style={dynamicStyles.quickDriverText}>Quick Driver Mode</Text>
        </View>

        {assignedOrder && (
          <View style={dynamicStyles.orderCard}>
            <Text style={dynamicStyles.orderTitle}>Assigned Trip #{assignedOrder.booking_id}</Text>
            
            <View style={dynamicStyles.routeContainer}>
              <View style={dynamicStyles.routeRow}>
                <MapPin color={colors.success} size={16} />
                <Text style={dynamicStyles.routeText}>{assignedOrder.pickup}</Text>
              </View>
              <View style={dynamicStyles.routeLine} />
              <View style={dynamicStyles.routeRow}>
                <MapPin color={colors.error} size={16} />
                <Text style={dynamicStyles.routeText}>{assignedOrder.drop}</Text>
              </View>
            </View>

            <View style={dynamicStyles.customerInfo}>
              <View style={dynamicStyles.customerRow}>
                <User color={colors.textSecondary} size={16} />
                <Text style={dynamicStyles.customerText}>{assignedOrder.customer_name}</Text>
              </View>
              <View style={dynamicStyles.customerRow}>
                <Phone color={colors.textSecondary} size={16} />
                <Text style={dynamicStyles.customerText}>{assignedOrder.customer_mobile}</Text>
              </View>
              <View style={dynamicStyles.customerRow}>
                <Car color={colors.textSecondary} size={16} />
                <Text style={dynamicStyles.customerText}>
                  {assignedOrder.distance_km} km • ₹{assignedOrder.fare_per_km}/km
                </Text>
              </View>
            </View>

            <View style={dynamicStyles.fareInfo}>
              <Text style={dynamicStyles.fareText}>₹{assignedOrder.total_fare}</Text>
            </View>

            <TouchableOpacity style={dynamicStyles.startButton} onPress={handleStartTrip}>
              <Text style={dynamicStyles.startButtonText}>Start Trip</Text>
              <ArrowRight color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}