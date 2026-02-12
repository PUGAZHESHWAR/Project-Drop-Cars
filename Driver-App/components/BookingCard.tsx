import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPin, Clock, IndianRupee, User, Phone, Car, AlertCircle } from 'lucide-react-native';

interface Booking {
  order_id: number;
  pickup: string;
  drop: string;
  customer_name: string;
  customer_number: string;
  estimated_price: number;
  trip_distance?: number;
  fare_per_km?: number;
  car_type?: string;
  trip_type?: string;
  pick_near_city?: string;
  start_date_time?: string;
  trip_time?: string;
  created_at?: string;
  max_time_to_assign_order?: string;
  expires_at?: string;
  charges_to_deduct?: number;
}

interface BookingCardProps {
  booking: Booking;
  onAccept: (booking: Booking) => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function BookingCard({ booking, onAccept, disabled, loading }: BookingCardProps) {
  const { colors } = useTheme();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  console.log('booking data', booking);

  const toNumber = (v: any): number => {
    if (v === null || v === undefined || v === '') return 0;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const safePickLoc = (v: any): Record<string, string> => {
    if (!v) return {};
    if (typeof v === 'string') {
      try { return JSON.parse(v); } catch { return {}; }
    }
    return v;
  };

  // Derive fields robustly in case parent passes raw VO pending order
  const loc = safePickLoc((booking as any).pickup_drop_location);
  const pickupFromLoc = (loc && (loc['0'] || (loc as any).pickup)) || '';
  const dropFromLoc = (loc && (loc['1'] || (loc as any).drop)) || '';
  const pickup = booking.pickup || String(pickupFromLoc);
  const drop = booking.drop || String(dropFromLoc);

  const displayPrice = toNumber((booking as any).estimated_price ?? (booking as any).vendor_price ?? (booking as any).total_fare);
  const customerNumber = (booking as any).customer_number || (booking as any).customer_mobile || '';
  const carType = (booking as any).car_type || booking.car_type || '';
  const tripType = (booking as any).trip_type || booking.trip_type || '';
  const nearCity = (booking as any).pick_near_city || (booking as any).near_city || '';
  const startDateTime = (booking as any).start_date_time || '';
  const estimatedTime = (booking as any).trip_time || booking.trip_time || '';
  const chargesToDeduct = Number(booking.charges_to_deduct || 0);
  const isHourlyRental = String(tripType || '').toLowerCase().includes('hour');
  const createdAt = booking.created_at || '';
  const maxTimeToAssign = booking.max_time_to_assign_order || '';
  const expiresAt = booking.expires_at || '';
  
  const computeDeadline = (): string => {
    try {
      console.log('🕐 Computing deadline:', { 
        createdAt, 
        maxTimeToAssign, 
        expiresAt,
        bookingData: booking 
      });
      
      // If expires_at is provided, use it directly
      if (expiresAt) {
        const d = new Date(expiresAt);
        const deadline = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        console.log('🕐 Using expires_at deadline:', deadline);
        return deadline;
      }
      // If max_time_to_assign_order is provided as a timestamp, use it directly
      if (maxTimeToAssign) {
        const d = new Date(maxTimeToAssign);
        const deadline = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        console.log('🕐 Using max_time_to_assign_order deadline:', deadline);
        return deadline;
      }
      
      console.log('🕐 No deadline data available');
    } catch (error) {
      console.error('Error computing deadline:', error);
    }
    return '';
  };
  const deadlineTime = computeDeadline();

  // Calculate time remaining for assignment
  useEffect(() => {
    const calculateTimeRemaining = () => {
      try {
        const createdAt = booking.created_at;
        const maxTimeToAssign = booking.max_time_to_assign_order;
        
        console.log('⏰ Calculating time remaining:', { 
          createdAt, 
          maxTimeToAssign,
          bookingOrderId: booking.order_id 
        });
        
        if (!createdAt || !maxTimeToAssign) {
          console.log('⏰ Missing data for time calculation');
          setTimeRemaining('');
          return;
        }

        const createdDate = new Date(createdAt);
        const maxAssignDate = new Date(maxTimeToAssign);
        const now = new Date();
        
        console.log('⏰ Date calculations:', {
          createdDate: createdDate.toISOString(),
          maxAssignDate: maxAssignDate.toISOString(),
          now: now.toISOString()
        });
        
        const timeDiff = maxAssignDate.getTime() - now.getTime();
        
        console.log('⏰ Time difference (ms):', timeDiff);
        
        if (timeDiff <= 0) {
          console.log('⏰ Time expired');
          setTimeRemaining('EXPIRED');
          return;
        }
        
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        let timeString = '';
        if (hours > 0) {
          timeString = `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
          timeString = `${minutes}m ${seconds}s`;
        } else {
          timeString = `${seconds}s`;
        }
        
        console.log('⏰ Calculated time remaining:', timeString);
        setTimeRemaining(timeString);
      } catch (error) {
        console.error('Error calculating time remaining:', error);
        setTimeRemaining('');
      }
    };

    calculateTimeRemaining();
    
    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [booking]);

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
    detailRowMatrix: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 6,
    },
    detailCol: {
      flex: 1,
    },
    detailColLabel: {
      color: colors.textSecondary,
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
      flexDirection: 'row',
      justifyContent: 'center',
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
    loadingButton: {
      backgroundColor: colors.primary,
      opacity: 0.8,
    },
    assignmentTimer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FEF2F2',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#FECACA',
    },
    timerText: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: '#DC2626',
      marginLeft: 6,
    },
    expiredTimer: {
      backgroundColor: '#FEE2E2',
      borderColor: '#FCA5A5',
    },
    expiredText: {
      color: '#B91C1C',
    },
  });
  return (
    <View style={[dynamicStyles.card, disabled && dynamicStyles.disabledCard]}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.bookingId}>#{booking.order_id}</Text>
        <View style={dynamicStyles.fareContainer}>
          {/* Avoid double currency symbol; just show the number, UI adds symbol elsewhere if needed */}
          <IndianRupee color={colors.success} size={16} />
          <Text style={dynamicStyles.totalFare}>{displayPrice}</Text>
        </View>
      </View>

      {/* Assignment Timer */}
      {timeRemaining && (
        <View style={[
          dynamicStyles.assignmentTimer,
          timeRemaining === 'EXPIRED' && dynamicStyles.expiredTimer
        ]}>
          <AlertCircle 
            color={timeRemaining === 'EXPIRED' ? '#B91C1C' : '#DC2626'} 
            size={16} 
          />
          <Text style={[
            dynamicStyles.timerText,
            timeRemaining === 'EXPIRED' && dynamicStyles.expiredText
          ]}>
            {timeRemaining === 'EXPIRED' 
              ? 'Assignment time expired!' 
              : `Assign car & driver in ${timeRemaining}`
            }
          </Text>
        </View>
      )}

      <View style={dynamicStyles.routeContainer}>
        <View style={dynamicStyles.routeRow}>
          <MapPin color={colors.success} size={16} />
          <Text style={dynamicStyles.routeText}>{pickup}</Text>
        </View>
        {!isHourlyRental && (
          <>
            <View style={dynamicStyles.routeLine} />
            <View style={dynamicStyles.routeRow}>
              <MapPin color={colors.error} size={16} />
              <Text style={dynamicStyles.routeText}>{drop}</Text>
            </View>
          </>
        )}
      </View>

      <View style={dynamicStyles.detailsContainer}>
        {!!booking.customer_name && (
          <View style={dynamicStyles.detailRow}>
            <User color={colors.textSecondary} size={14} />
            <Text style={dynamicStyles.detailText}>{booking.customer_name}</Text>
          </View>
        )}
        {!!customerNumber && (
          <View style={dynamicStyles.detailRow}>
            <Phone color={colors.textSecondary} size={14} />
            <Text style={dynamicStyles.detailText}>{customerNumber}</Text>
          </View>
        )}
        {(carType || tripType) && (
          <View style={dynamicStyles.detailRowMatrix}>
            <View style={dynamicStyles.detailCol}>
              {!!carType && (
                <Text style={dynamicStyles.detailText}><Text style={dynamicStyles.detailColLabel}>Car:</Text> {carType}</Text>
              )}
            </View>
            <View style={dynamicStyles.detailCol}>
              {!!tripType && (
                <Text style={dynamicStyles.detailText}><Text style={dynamicStyles.detailColLabel}>Trip:</Text> {tripType}</Text>
              )}
            </View>
          </View>
        )}
        {(nearCity || startDateTime) && (
          <View style={dynamicStyles.detailRowMatrix}>
            <View style={dynamicStyles.detailCol}>
              {!!nearCity && (
                <Text style={dynamicStyles.detailText}><Text style={dynamicStyles.detailColLabel}>City:</Text> {nearCity}</Text>
              )}
            </View>
            <View style={dynamicStyles.detailCol}>
              {!!startDateTime && (
                <Text style={dynamicStyles.detailText}><Text style={dynamicStyles.detailColLabel}>Start:</Text> {new Date(startDateTime).toLocaleString()}</Text>
              )}
            </View>
          </View>
        )}
        {(estimatedTime || deadlineTime) && (
          <View style={dynamicStyles.detailRowMatrix}>
            <View style={dynamicStyles.detailCol}>
              {!!estimatedTime && (
                <Text style={dynamicStyles.detailText}><Text style={dynamicStyles.detailColLabel}>ETA:</Text> {estimatedTime}</Text>
              )}
            </View>
            <View style={dynamicStyles.detailCol}>
              {!!deadlineTime && (
                <Text style={dynamicStyles.detailText}><Text style={dynamicStyles.detailColLabel}>Assign by:</Text> {deadlineTime}</Text>
              )}
            </View>
          </View>
        )}
      </View>

      {!!((booking as any).trip_distance || booking.fare_per_km) && (
        <View style={dynamicStyles.tripInfo}>
          <Text style={dynamicStyles.tripInfoText}>
            {(booking as any).trip_distance ?? 0} km {booking.fare_per_km ? `• ₹${booking.fare_per_km}/km` : ''}
          </Text>
        </View>
      )}

      {chargesToDeduct > 0 && (
        <View style={dynamicStyles.tripInfo}>
          <Text style={dynamicStyles.tripInfoText}>Charges to deduct on accept: ₹{chargesToDeduct}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          dynamicStyles.acceptButton,
          disabled && dynamicStyles.disabledButton,
          loading && dynamicStyles.loadingButton
        ]}
        onPress={() => onAccept(booking)}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={dynamicStyles.acceptButtonText}>Accepting...</Text>
          </>
        ) : (
          <Text style={[dynamicStyles.acceptButtonText, disabled && dynamicStyles.disabledButtonText]}>
            {disabled ? 'Insufficient Balance' : 'Accept Booking'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}