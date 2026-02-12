import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, MapPin, Clock, IndianRupee, User, Phone, Car, Navigation, DollarSign } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getDriverAssignedOrderReport } from '@/services/driver/carDriverService';
import LoadingOverlay from '@/components/LoadingOverlay';

interface TripReport {
  order_id: number;
  trip_status: string;
  customer_name: string;
  customer_number: string;
  pickup_drop_location: Record<string, string>;
  start_date_time: string;
  trip_type: string;
  car_type: string;
  trip_time: string;
  trip_distance: number;
  toll_charges: number;
  customer_price: number;
  package_hours?: Record<string, any>;
  cost_per_hour?: number;
  cost_per_km: number;
  driver_allowance: number;
  permit_charges: number;
  hill_charges: number;
  pickup_notes: string;
  assigned_at: string;
  created_at: string;
  completed_at: string;
  total_km: number;
  updated_toll_charge?: number;
}

export default function TripReportScreen() {
  const [report, setReport] = useState<TripReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ order_id?: string }>();

  const orderId = parseInt(String(params.order_id || '0'));

  useEffect(() => {
    fetchTripReport();
  }, []);

  const fetchTripReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching trip report for order:', orderId);
      const reportData = await getDriverAssignedOrderReport(orderId);
      
      if (Array.isArray(reportData) && reportData.length > 0) {
        setReport(reportData[0]);
        console.log('✅ Trip report fetched successfully:', reportData[0]);
      } else {
        setError('No trip report data found');
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch trip report:', err);
      setError(err.message || 'Failed to fetch trip report');
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    router.replace('/quick-dashboard');
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch {
      return { date: 'N/A', time: 'N/A' };
    }
  };

  const getPickupDropLocations = (pickupDropLocation: Record<string, string>) => {
    if (!pickupDropLocation) return { pickup: 'Unknown', drop: 'Unknown' };
    
    const locations = Object.values(pickupDropLocation);
    return {
      pickup: locations[0] || 'Unknown',
      drop: locations[1] || 'Unknown'
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingOverlay visible={true} message="Loading trip report..." />
      </SafeAreaView>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Trip Report</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error || 'No report data available'}
          </Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={fetchTripReport}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const locations = getPickupDropLocations(report.pickup_drop_location);
  const startDateTime = formatDateTime(report.start_date_time);
  const completedDateTime = formatDateTime(report.completed_at);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Trip Report</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={[styles.successHeader, { backgroundColor: colors.success + '20' }]}>
          <CheckCircle color={colors.success} size={32} />
          <Text style={[styles.successTitle, { color: colors.success }]}>Trip Completed Successfully!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
            Order #{report.order_id}
          </Text>
        </View>

        {/* Customer Information */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Customer Details</Text>
          
          <View style={styles.detailRow}>
            <User size={20} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{report.customer_name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Phone size={20} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{report.customer_number}</Text>
          </View>
        </View>

        {/* Trip Route */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trip Route</Text>
          
          <View style={styles.routeContainer}>
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.locationText, { color: colors.text }]}>{locations.pickup}</Text>
            </View>
            
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, { backgroundColor: colors.error }]} />
              <Text style={[styles.locationText, { color: colors.text }]}>{locations.drop}</Text>
            </View>
          </View>
        </View>

        {/* Trip Details */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trip Details</Text>
          
          <View style={styles.detailRow}>
            <Car size={20} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {report.car_type} • {report.trip_type}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Navigation size={20} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              Distance: {report.total_km} km
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={20} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              Duration: {report.trip_time}
            </Text>
          </View>
        </View>

        {/* Financial Summary */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Financial Summary</Text>
          
          <View style={styles.financialRow}>
            <DollarSign size={20} color={colors.success} />
            <Text style={[styles.financialLabel, { color: colors.text }]}>Customer Price:</Text>
            <Text style={[styles.financialAmount, { color: colors.success }]}>₹{report.customer_price}</Text>
          </View>
          
          {report.updated_toll_charge && report.updated_toll_charge > 0 && (
            <View style={styles.financialRow}>
              <IndianRupee size={20} color={colors.primary} />
              <Text style={[styles.financialLabel, { color: colors.text }]}>Updated Toll:</Text>
              <Text style={[styles.financialAmount, { color: colors.primary }]}>₹{report.updated_toll_charge}</Text>
            </View>
          )}
          
          {report.driver_allowance > 0 && (
            <View style={styles.financialRow}>
              <IndianRupee size={20} color={colors.primary} />
              <Text style={[styles.financialLabel, { color: colors.text }]}>Driver Allowance:</Text>
              <Text style={[styles.financialAmount, { color: colors.primary }]}>₹{report.driver_allowance}</Text>
            </View>
          )}
          
          {report.permit_charges > 0 && (
            <View style={styles.financialRow}>
              <IndianRupee size={20} color={colors.textSecondary} />
              <Text style={[styles.financialLabel, { color: colors.text }]}>Permit Charges:</Text>
              <Text style={[styles.financialAmount, { color: colors.textSecondary }]}>₹{report.permit_charges}</Text>
            </View>
          )}
          
          {report.hill_charges > 0 && (
            <View style={styles.financialRow}>
              <IndianRupee size={20} color={colors.textSecondary} />
              <Text style={[styles.financialLabel, { color: colors.text }]}>Hill Charges:</Text>
              <Text style={[styles.financialAmount, { color: colors.textSecondary }]}>₹{report.hill_charges}</Text>
            </View>
          )}
        </View>

        {/* Trip Timeline */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trip Timeline</Text>
          
          <View style={styles.timelineRow}>
            <Clock size={20} color={colors.primary} />
            <Text style={[styles.timelineLabel, { color: colors.text }]}>Started:</Text>
            <Text style={[styles.timelineText, { color: colors.textSecondary }]}>
              {startDateTime.date} at {startDateTime.time}
            </Text>
          </View>
          
          <View style={styles.timelineRow}>
            <CheckCircle size={20} color={colors.success} />
            <Text style={[styles.timelineLabel, { color: colors.text }]}>Completed:</Text>
            <Text style={[styles.timelineText, { color: colors.textSecondary }]}>
              {completedDateTime.date} at {completedDateTime.time}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {report.pickup_notes && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
            <Text style={[styles.notesText, { color: colors.textSecondary }]}>
              {report.pickup_notes}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Exit Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.exitButton, { backgroundColor: colors.primary }]} onPress={handleExit}>
          <Text style={styles.exitButtonText}>Exit to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  successHeader: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginVertical: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  successSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  routeContainer: {
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  locationText: {
    fontSize: 14,
    flex: 1,
  },
  financialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  financialLabel: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  financialAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineLabel: {
    fontSize: 14,
    marginLeft: 12,
    width: 80,
  },
  timelineText: {
    fontSize: 14,
    flex: 1,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  exitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
