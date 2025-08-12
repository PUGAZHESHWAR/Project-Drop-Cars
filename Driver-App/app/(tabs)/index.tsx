import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Menu, Wallet, MapPin, Clock, User, Phone, Car } from 'lucide-react-native';
import BookingCard from '@/components/BookingCard';
import DrawerNavigation from '@/components/DrawerNavigation';

const dummyBookings = [
  {
    booking_id: 'B123',
    pickup: 'Chennai Central',
    drop: 'Tiruvannamalai',
    customer_name: 'Arun Kumar',
    customer_mobile: '9876567890',
    fare_per_km: 10,
    distance_km: 150,
    total_fare: 1500,
    status: 'available'
  },
  {
    booking_id: 'B124',
    pickup: 'Guindy',
    drop: 'Pondicherry',
    customer_name: 'Priya Sharma',
    customer_mobile: '9887766554',
    fare_per_km: 12,
    distance_km: 120,
    total_fare: 1440,
    status: 'available'
  },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const { balance } = useWallet();
  const { colors } = useTheme();
  const router = useRouter();
  const [showDrawer, setShowDrawer] = useState(false);
  const [bookings, setBookings] = useState(dummyBookings);
  const [currentTrip, setCurrentTrip] = useState(null);

  const canAcceptBookings = balance >= 1000;

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
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuButton: {
      padding: 8,
    },
    balanceContainer: {
      alignItems: 'center',
    },
    welcomeText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
      marginBottom: 4,
    },
    balanceLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    balanceAmount: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    walletButton: {
      padding: 8,
    },
    warningBanner: {
      backgroundColor: '#FEF3C7',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    warningText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: '#92400E',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    welcomeBanner: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 20,
      marginTop: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    welcomeBannerTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 8,
      textAlign: 'center',
    },
    welcomeBannerSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 4,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    statNumber: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    currentTripSection: {
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 16,
    },
    currentTripCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    tripHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    tripStatus: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.success,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.success,
    },
    tripDetails: {
      marginBottom: 20,
    },
    tripRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    tripText: {
      marginLeft: 12,
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    endTripButton: {
      backgroundColor: colors.error,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    endTripButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    bookingsSection: {
      marginTop: 20,
    },
    noBookings: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 40,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    noBookingsText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    noBookingsSubtext: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
  });
  const handleAcceptBooking = (booking) => {
    if (!canAcceptBookings) {
      Alert.alert(
        'Insufficient Balance',
        'Your wallet balance is below ₹1000. Please add money to continue receiving bookings.',
        [{ text: 'Add Money', onPress: () => router.push('/(tabs)/wallet') }]
      );
      return;
    }

    Alert.alert(
      'Accept Booking',
      `Accept trip from ${booking.pickup} to ${booking.drop}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: () => acceptBooking(booking) }
      ]
    );
  };

  const acceptBooking = (booking) => {
    setCurrentTrip({ ...booking, status: 'accepted' });
    setBookings(prev => prev.filter(b => b.booking_id !== booking.booking_id));
    
    // Simulate SMS sending
    Alert.alert(
      'Booking Accepted',
      `SMS sent to customer: "DropCars: Your driver ${user?.name} (${user?.cars?.[0]?.name} - ${user?.cars?.[0]?.registration}) has accepted your booking."`
    );
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => setShowDrawer(true)} style={dynamicStyles.menuButton}>
          <Menu color={colors.text} size={24} />
        </TouchableOpacity>
        
        <View style={dynamicStyles.balanceContainer}>
          <Text style={dynamicStyles.welcomeText}>Welcome back, {user?.name}!</Text>
          <Text style={dynamicStyles.balanceLabel}>Available Balance</Text>
          <Text style={dynamicStyles.balanceAmount}>₹{balance}</Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/(tabs)/wallet')} style={dynamicStyles.walletButton}>
          <Wallet color={colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      {!canAcceptBookings && (
        <View style={dynamicStyles.warningBanner}>
          <Text style={dynamicStyles.warningText}>
            Wallet balance below ₹1000. Add money to receive bookings.
          </Text>
        </View>
      )}

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner */}
        <View style={dynamicStyles.welcomeBanner}>
          <Text style={dynamicStyles.welcomeBannerTitle}>
            🚗 Welcome to Drop Cars, {user?.name}!
          </Text>
          <Text style={dynamicStyles.welcomeBannerSubtitle}>
            Your {user?.cars?.[0]?.name} is ready for service. Start earning today!
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={dynamicStyles.statsContainer}>
          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statNumber}>₹{balance}</Text>
            <Text style={dynamicStyles.statLabel}>Wallet Balance</Text>
          </View>
          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statNumber}>{user?.cars?.length || 0}</Text>
            <Text style={dynamicStyles.statLabel}>Vehicles</Text>
          </View>
          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statNumber}>{user?.languages?.length || 0}</Text>
            <Text style={dynamicStyles.statLabel}>Languages</Text>
          </View>
        </View>

        {currentTrip ? (
          <View style={dynamicStyles.currentTripSection}>
            <Text style={dynamicStyles.sectionTitle}>Current Trip</Text>
            <View style={dynamicStyles.currentTripCard}>
              <View style={dynamicStyles.tripHeader}>
                <Text style={dynamicStyles.tripStatus}>Trip In Progress</Text>
                <View style={dynamicStyles.statusDot} />
              </View>
              
              <View style={dynamicStyles.tripDetails}>
                <View style={dynamicStyles.tripRow}>
                  <MapPin color={colors.success} size={16} />
                  <Text style={dynamicStyles.tripText}>{currentTrip.pickup}</Text>
                </View>
                <View style={dynamicStyles.tripRow}>
                  <MapPin color={colors.error} size={16} />
                  <Text style={dynamicStyles.tripText}>{currentTrip.drop}</Text>
                </View>
                <View style={dynamicStyles.tripRow}>
                  <User color={colors.textSecondary} size={16} />
                  <Text style={dynamicStyles.tripText}>{currentTrip.customer_name}</Text>
                </View>
                <View style={dynamicStyles.tripRow}>
                  <Phone color={colors.textSecondary} size={16} />
                  <Text style={dynamicStyles.tripText}>{currentTrip.customer_mobile}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={dynamicStyles.endTripButton}
                onPress={() => router.push('/trip/end')}
              >
                <Text style={dynamicStyles.endTripButtonText}>End Trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={dynamicStyles.bookingsSection}>
            <Text style={dynamicStyles.sectionTitle}>Available Bookings</Text>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingCard
                  key={booking.booking_id}
                  booking={booking}
                  onAccept={handleAcceptBooking}
                  disabled={!canAcceptBookings}
                />
              ))
            ) : (
              <View style={dynamicStyles.noBookings}>
                <Text style={dynamicStyles.noBookingsText}>No bookings available</Text>
                <Text style={dynamicStyles.noBookingsSubtext}>New bookings will appear here</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <DrawerNavigation 
        visible={showDrawer} 
        onClose={() => setShowDrawer(false)} 
      />
    </SafeAreaView>
  );
}