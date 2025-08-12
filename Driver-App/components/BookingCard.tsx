import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPin, Clock, IndianRupee, User, Phone } from 'lucide-react-native';

interface Booking {
  booking_id: string;
  pickup: string;
  drop: string;
  customer_name: string;
  customer_mobile: string;
  fare_per_km: number;
  distance_km: number;
  total_fare: number;
}

interface BookingCardProps {
  booking: Booking;
  onAccept: (booking: Booking) => void;
  disabled?: boolean;
}

export default function BookingCard({ booking, onAccept, disabled }: BookingCardProps) {
  const { colors } = useTheme();

  const dynamicStyles = StyleSheet.create({
    card: {
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
    disabledCard: {
      opacity: 0.6,
    },
    header: {
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
    fareContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#D1FAE5',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    totalFare: {
      marginLeft: 4,
      fontSize: 16,
      fontFamily: 'Inter-Bold',
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
    detailsContainer: {
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    detailText: {
      marginLeft: 8,
      fontSize: 13,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    tripInfo: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 8,
      marginBottom: 16,
    },
    tripInfoText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      textAlign: 'center',
    },
    acceptButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    acceptButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    disabledButton: {
      backgroundColor: '#9CA3AF',
    },
    disabledButtonText: {
      color: '#E5E7EB',
    },
  });
  return (
    <View style={[dynamicStyles.card, disabled && dynamicStyles.disabledCard]}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.bookingId}>#{booking.booking_id}</Text>
        <View style={dynamicStyles.fareContainer}>
          <IndianRupee color={colors.success} size={16} />
          <Text style={dynamicStyles.totalFare}>₹{booking.total_fare}</Text>
        </View>
      </View>

      <View style={dynamicStyles.routeContainer}>
        <View style={dynamicStyles.routeRow}>
          <MapPin color={colors.success} size={16} />
          <Text style={dynamicStyles.routeText}>{booking.pickup}</Text>
        </View>
        <View style={dynamicStyles.routeLine} />
        <View style={dynamicStyles.routeRow}>
          <MapPin color={colors.error} size={16} />
          <Text style={dynamicStyles.routeText}>{booking.drop}</Text>
        </View>
      </View>

      <View style={dynamicStyles.detailsContainer}>
        <View style={dynamicStyles.detailRow}>
          <User color={colors.textSecondary} size={14} />
          <Text style={dynamicStyles.detailText}>{booking.customer_name}</Text>
        </View>
        <View style={dynamicStyles.detailRow}>
          <Phone color={colors.textSecondary} size={14} />
          <Text style={dynamicStyles.detailText}>{booking.customer_mobile}</Text>
        </View>
      </View>

      <View style={dynamicStyles.tripInfo}>
        <Text style={dynamicStyles.tripInfoText}>
          {booking.distance_km} km • ₹{booking.fare_per_km}/km
        </Text>
      </View>

      <TouchableOpacity
        style={[
          dynamicStyles.acceptButton,
          disabled && dynamicStyles.disabledButton
        ]}
        onPress={() => onAccept(booking)}
        disabled={disabled}
      >
        <Text style={[dynamicStyles.acceptButtonText, disabled && dynamicStyles.disabledButtonText]}>
          {disabled ? 'Insufficient Balance' : 'Accept Booking'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}