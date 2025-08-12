import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Clock, IndianRupee, Car } from 'lucide-react-native';

const dummyRideHistory = [
  {
    id: '1',
    booking_id: 'B120',
    pickup: 'Chennai Airport',
    drop: 'Mahabalipuram',
    customer_name: 'Rajesh Kumar',
    date: '2025-01-20',
    time: '14:30',
    distance: 75,
    fare: 750,
    status: 'completed'
  },
  {
    id: '2',
    booking_id: 'B119',
    pickup: 'T Nagar',
    drop: 'Kanchipuram',
    customer_name: 'Meera Devi',
    date: '2025-01-19',
    time: '09:15',
    distance: 65,
    fare: 650,
    status: 'completed'
  },
  {
    id: '3',
    booking_id: 'B118',
    pickup: 'Velachery',
    drop: 'Chengalpattu',
    customer_name: 'Suresh Babu',
    date: '2025-01-18',
    time: '16:45',
    distance: 45,
    fare: 450,
    status: 'completed'
  },
];

export default function RidesScreen() {
  const [rides] = useState(dummyRideHistory);
  const { colors } = useTheme();
  const { user } = useAuth();

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
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 4,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    rideCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    rideHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    bookingId: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    statusBadge: {
      backgroundColor: '#D1FAE5',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: '#065F46',
    },
    routeContainer: {
      marginBottom: 12,
    },
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    routeText: {
      marginLeft: 8,
      fontSize: 14,
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
    rideDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailText: {
      marginLeft: 4,
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    customerInfo: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    customerName: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
  });
  const RideCard = ({ ride }) => (
    <View style={dynamicStyles.rideCard}>
      <View style={dynamicStyles.rideHeader}>
        <Text style={dynamicStyles.bookingId}>#{ride.booking_id}</Text>
        <View style={dynamicStyles.statusBadge}>
          <Text style={dynamicStyles.statusText}>{ride.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={dynamicStyles.routeContainer}>
        <View style={dynamicStyles.routeRow}>
          <MapPin color={colors.success} size={16} />
          <Text style={dynamicStyles.routeText}>{ride.pickup}</Text>
        </View>
        <View style={dynamicStyles.routeLine} />
        <View style={dynamicStyles.routeRow}>
          <MapPin color={colors.error} size={16} />
          <Text style={dynamicStyles.routeText}>{ride.drop}</Text>
        </View>
      </View>

      <View style={dynamicStyles.rideDetails}>
        <View style={dynamicStyles.detailRow}>
          <Clock color={colors.textSecondary} size={14} />
          <Text style={dynamicStyles.detailText}>{ride.date} at {ride.time}</Text>
        </View>
        <View style={dynamicStyles.detailRow}>
          <Car color={colors.textSecondary} size={14} />
          <Text style={dynamicStyles.detailText}>{ride.distance} km</Text>
        </View>
        <View style={dynamicStyles.detailRow}>
          <IndianRupee color={colors.textSecondary} size={14} />
          <Text style={dynamicStyles.detailText}>₹{ride.fare}</Text>
        </View>
      </View>

      <View style={dynamicStyles.customerInfo}>
        <Text style={dynamicStyles.customerName}>{ride.customer_name}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>My Rides</Text>
        <Text style={dynamicStyles.headerSubtitle}>Welcome back, {user?.name}! • Trip History</Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}