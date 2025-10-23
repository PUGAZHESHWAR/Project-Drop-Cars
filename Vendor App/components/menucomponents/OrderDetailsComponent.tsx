import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User, Phone, Calendar, Clock, MapPin, Car, DollarSign, Route, FileText, Settings, Gauge, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, Users, CreditCard, Timer, Navigation, Info, X } from 'lucide-react-native';
import api from '../../app/api/api';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface OrderDetail {
  id: number;
  source: string;
  source_order_id: number;
  vendor_id: string;
  trip_type: string;
  car_type: string;
  pickup_drop_location: { [key: string]: string };
  start_date_time: string;
  customer_name: string;
  customer_number: string;
  trip_status: string;
  pick_near_city: string;
  trip_distance: number | null;
  trip_time: string;
  estimated_price: number;
  vendor_price: number;
  platform_fees_percent: number;
  closed_vendor_price: number | null;
  closed_driver_price: number | null;
  commision_amount: number | null;
  created_at: string;
  assignments: Assignment[];
  end_records: EndRecord[];
  assigned_driver_name: string | null;
  assigned_driver_phone: string | null;
  assigned_car_name: string | null;
  assigned_car_number: string | null;
  vehicle_owner_name: string | null;
  vendor_profit : number | null;
  admin_profit : number | null;
}

interface Assignment {
  id: number;
  order_id: number;
  vehicle_owner_id: string;
  driver_id: string;
  car_id: string;
  assignment_status: string;
  assigned_at: string;
  expires_at: string;
  cancelled_at: string | null;
  completed_at: string | null;
  created_at: string;
}

interface EndRecord {
  id: number;
  order_id: number;
  driver_id: string;
  start_km: number;
  end_km: number;
  contact_number: string;
  img_url: string;
  close_speedometer_image: string;
  created_at: string;
  updated_at: string;
}

export default function OrderDetailsComponent() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/orders/vendor/${orderId}`);
      setOrderDetails(response.data);
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!orderDetails) return;

    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelLoading(true);
              const response = await api.patch(`/assignments/vendor/cancel-order/${orderDetails.id}`);
              
              if (response.data) {
                Alert.alert(
                  'Success',
                  'Order cancelled successfully!',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        // Refresh the order details to show updated status
                        fetchOrderDetails();
                      }
                    }
                  ]
                );
              }
            } catch (err: any) {
              console.error('Error cancelling order:', err);
              Alert.alert(
                'Error',
                'Failed to cancel order. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setCancelLoading(false);
            }
          },
        },
      ]
    );
  };

  const makePhoneCall = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Phone dialer not available');
        }
      })
      .catch((err) => console.error('Error opening phone dialer:', err));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return '#F59E0B';
      case 'DRIVER_ASSIGNED': return '#3B82F6';
      case 'TRIP_STARTED': return '#10B981';
      case 'TRIP_COMPLETED': return '#059669';
      case 'CANCELLED': return '#DC2626';
      case 'PENDING': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <AlertCircle size={20} color="#F59E0B" />;
      case 'DRIVER_ASSIGNED': return <Car size={20} color="#3B82F6" />;
      case 'TRIP_STARTED': return <CheckCircle size={20} color="#10B981" />;
      case 'TRIP_COMPLETED': return <CheckCircle size={20} color="#059669" />;
      case 'CANCELLED': return <XCircle size={20} color="#DC2626" />;
      case 'PENDING': return <Clock size={20} color="#6B7280" />;
      default: return <AlertCircle size={20} color="#6B7280" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getLocationEntries = (locations: { [key: string]: string }) => {
    return Object.entries(locations || {}).sort(([a], [b]) => parseInt(a) - parseInt(b));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d5464ff" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error || !orderDetails) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color="#DC2626" />
        <Text style={styles.errorText}>{error || 'Order not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const locations = getLocationEntries(orderDetails.pickup_drop_location);
  const currentAssignment = orderDetails.assignments.find(a => a.assignment_status === 'ASSIGNED' || a.assignment_status === 'COMPLETED');
  const latestEndRecord = orderDetails.end_records[orderDetails.end_records.length - 1];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0d5464ff', '#0d5464ff', '#0d5464ff']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Order #{orderDetails.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(orderDetails.trip_status)}20` }]}>
            {getStatusIcon(orderDetails.trip_status)}
            <Text style={[styles.statusText, { color: getStatusColor(orderDetails.trip_status) }]}>
              {orderDetails.trip_status.replace('_', ' ')}
            </Text>
          </View>
        </View>

        {/* Cancel Button - Only show if trip status is PENDING */}
        {orderDetails.trip_status === 'PENDING' && (
          <TouchableOpacity 
            style={[styles.cancelButton, cancelLoading && styles.cancelButtonDisabled]} 
            onPress={cancelOrder}
            disabled={cancelLoading}
          >
            {cancelLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <X size={18} color="#FFFFFF" />
                <Text style={styles.cancelButtonText}>Cancel Order</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Customer Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#0d5464ff" />
            <Text style={styles.sectionTitle}>Customer Details</Text>
          </View>
          <View style={styles.customerCard}>
            <View style={styles.customerRow}>
              <Text style={styles.customerName}>{orderDetails.customer_name}</Text>
              <TouchableOpacity 
                style={styles.phoneButton}
                onPress={() => makePhoneCall(orderDetails.customer_number)}
              >
                <Phone size={16} color="#FFFFFF" />
                <Text style={styles.phoneButtonText}>{orderDetails.customer_number}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Trip Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color="#0d5464ff" />
            <Text style={styles.sectionTitle}>Trip Information</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Car size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Trip Type:</Text>
              <Text style={styles.infoValue}>{orderDetails.trip_type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Settings size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Car Type:</Text>
              <Text style={styles.infoValue}>{orderDetails.car_type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{formatDate(orderDetails.start_date_time)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Time:</Text>
              <Text style={styles.infoValue}>{formatTime(orderDetails.start_date_time)}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>City:</Text>
              <Text style={styles.infoValue}>{orderDetails.pick_near_city}</Text>
            </View>
            {orderDetails.trip_distance && (
              <View style={styles.infoRow}>
                <Route size={16} color="#6B7280" />
                <Text style={styles.infoLabel}>Distance:</Text>
                <Text style={styles.infoValue}>{orderDetails.trip_distance} km</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Timer size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Duration:</Text>
              <Text style={styles.infoValue}>{orderDetails.trip_time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Timer size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Accepted Status:</Text>
              <Text style={[styles.infoValue,{color: orderDetails.assignments.length == 0? "red" : "#10B981"}]}>{orderDetails.assignments.length == 0?"Waiting to accept":"Order Accepted"}</Text>
            </View>
            {orderDetails.assignments.length > 0?(            
              <>
                <View style={styles.infoRow}>
                <Timer size={16} color="#6B7280" />
                <Text style={styles.infoLabel}>Driver Status:</Text>
                <Text style={[styles.infoValue,{color: orderDetails.assigned_driver_name == null? "red" : "#10B981"}]}>{orderDetails.assigned_driver_name == null?"Not Assigned":"Assigned"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Timer size={16} color="#6B7280" />
                <Text style={styles.infoLabel}>Car Status:</Text>
                <Text style={[styles.infoValue,{color: orderDetails.assigned_car_name == null? "red" : "#10B981"}]}>{orderDetails.assigned_car_name == null?"Not Assigned":"Assigned"}</Text>
              </View>
              </>)
            :null}
          </View>
        </View>

        {/* Route Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Navigation size={20} color="#0d5464ff" />
            <Text style={styles.sectionTitle}>Route Details</Text>
          </View>
          <View style={styles.routeCard}>
            {locations.map((location, index) => (
              <View key={index} style={styles.routeItem}>
                <View style={styles.routeLeft}>
                  <View style={[
                    styles.routeDot,
                    index === 0 ? styles.routeDotStart :
                    index === locations.length - 1 ? styles.routeDotEnd :
                    styles.routeDotMiddle
                  ]} />
                  {index < locations.length - 1 && <View style={styles.routeLine} />}
                </View>
                <View style={styles.routeRight}>
                  <Text style={styles.routeLabel}>
                    {index === 0 ? 'Pickup' : index === locations.length - 1 ? 'Drop' : `Stop ${index}`}
                  </Text>
                  <Text style={styles.routeAddress}>{location[1]}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Assignment Details */}
        {currentAssignment && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color="#0d5464ff" />
              <Text style={styles.sectionTitle}>Assignment Details</Text>
            </View>
            <View style={styles.assignmentCard}>
              {orderDetails.assigned_driver_name && (
                <View style={styles.assignmentRow}>
                  <View style={styles.assignmentItem}>
                    <Text style={styles.assignmentLabel}>Driver</Text>
                    <Text style={styles.assignmentValue}>{orderDetails.assigned_driver_name}</Text>
                    {orderDetails.assigned_driver_phone && (
                      <TouchableOpacity onPress={() => makePhoneCall(orderDetails.assigned_driver_phone!)}>
                        <Text style={[styles.assignmentSubValue, styles.clickablePhone]}>{orderDetails.assigned_driver_phone}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              
              {orderDetails.assigned_car_name && (
                <View style={styles.assignmentRow}>
                  <View style={styles.assignmentItem}>
                    <Text style={styles.assignmentLabel}>Vehicle</Text>
                    <Text style={styles.assignmentValue}>{orderDetails.assigned_car_name}</Text>
                    {orderDetails.assigned_car_number && (
                      <Text style={styles.assignmentSubValue}>{orderDetails.assigned_car_number}</Text>
                    )}
                  </View>
                </View>
              )}

              {orderDetails.vehicle_owner_name && (
                <View style={styles.assignmentRow}>
                  <View style={styles.assignmentItem}>
                    <Text style={styles.assignmentLabel}>Vehicle Owner</Text>
                    <Text style={styles.assignmentValue}>{orderDetails.vehicle_owner_name}</Text>
                  </View>
                </View>
              )}

              <View style={styles.assignmentRow}>
                <View style={styles.assignmentItem}>
                  <Text style={styles.assignmentLabel}>Assignment Status</Text>
                  <Text style={[styles.assignmentValue, { color: getStatusColor(currentAssignment.assignment_status) }]}>
                    {currentAssignment.assignment_status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Financial Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color="#0d5464ff" />
            <Text style={styles.sectionTitle}>Financial Details</Text>
          </View>
          <View style={styles.financialCard}>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Estimated Price</Text>
              <Text style={styles.financialValue}>₹{orderDetails.estimated_price}</Text>
            </View>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Your Quote</Text>
              <Text style={[styles.financialValue, styles.vendorPrice]}>₹{orderDetails.vendor_price}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Your Earning</Text>
              <Text style={[styles.financialValue, styles.profit]}>
                -₹{orderDetails.vendor_profit? orderDetails.vendor_profit : "0"}
                
              </Text>
            </View>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Platform Fee ({orderDetails.platform_fees_percent}%)</Text>
              <Text style={[styles.financialValue, styles.fee]}>
                -₹{orderDetails.admin_profit? orderDetails.admin_profit : "0"}
              </Text>
            </View>
            {orderDetails.closed_vendor_price && (
              <>
                <View style={styles.divider} />
                <View style={styles.financialRow}>
                  <Text style={[styles.financialLabel, styles.finalLabel]}>Final Amount</Text>
                  <Text style={[styles.financialValue, styles.finalValue]}>₹{orderDetails.closed_vendor_price}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* End Records */}
        {latestEndRecord && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Gauge size={20} color="#0d5464ff" />
              <Text style={styles.sectionTitle}>Trip Record</Text>
            </View>
            <View style={styles.endRecordCard}>
              <View style={styles.kmRow}>
                <View style={styles.kmItem}>
                  <Text style={styles.kmLabel}>Start KM</Text>
                  <Text style={styles.kmValue}>{latestEndRecord.start_km}</Text>
                </View>
                <View style={styles.kmItem}>
                  <Text style={styles.kmLabel}>End KM</Text>
                  <Text style={styles.kmValue}>{latestEndRecord.end_km}</Text>
                </View>
                <View style={styles.kmItem}>
                  <Text style={styles.kmLabel}>Total KM</Text>
                  <Text style={[styles.kmValue, styles.totalKm]}>
                    {latestEndRecord.end_km>0? latestEndRecord.end_km - latestEndRecord.start_km:0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#0d5464ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    justifyContent: 'center',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 8,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  phoneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  clickablePhone: {
    color: '#10B981',
    textDecorationLine: 'underline',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  routeItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  routeLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  routeDotStart: {
    backgroundColor: '#10B981',
  },
  routeDotMiddle: {
    backgroundColor: '#F59E0B',
  },
  routeDotEnd: {
    backgroundColor: '#DC2626',
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  routeRight: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  routeAddress: {
    fontSize: 16,
    color: '#202124',
    marginTop: 2,
  },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  assignmentRow: {
    marginBottom: 16,
  },
  assignmentItem: {
    flex: 1,
  },
  assignmentLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  assignmentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  assignmentSubValue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  financialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  financialLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  vendorPrice: {
    color: '#0d5464ff',
  },
  profit: {
    color: '#10B981',
  },
  fee: {
    color: '#DC2626',
  },
  finalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  finalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  endRecordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  kmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  kmItem: {
    alignItems: 'center',
    flex: 1,
  },
  kmLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  kmValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202124',
  },
  totalKm: {
    color: '#10B981',
  },
  imageSection: {
    marginTop: 16,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageContainer: {
    alignItems: 'center',
  },
  speedometerImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  imageCaption: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 24,
  },
});