import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FileText, Calendar, Car, User, ArrowRight, Clock, MapPin, DollarSign, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

interface Order {
  id: number;
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
  created_at: string;
}

export default function OrdersComponent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    // Use the provided data
    const ordersData: Order[] = [
      {
        id: 59,
        trip_type: "Hourly Rental",
        car_type: "Sedan",
        pickup_drop_location: {
          "0": "Tiruvannamalai, Tamil Nadu, India"
        },
        start_date_time: "2025-09-22T19:11:30.629000Z",
        customer_name: "HOUR A",
        customer_number: "9585984449",
        trip_status: "PENDING",
        pick_near_city: "ALL",
        trip_distance: null,
        trip_time: "8",
        estimated_price: 500,
        vendor_price: 540,
        platform_fees_percent: 10,
        created_at: "2025-09-22T19:12:13.393793Z"
      },
      {
        id: 58,
        trip_type: "Hourly Rental",
        car_type: "Sedan",
        pickup_drop_location: {
          "0": "Tiruvannamalai, Tamil Nadu, India"
        },
        start_date_time: "2025-09-22T18:31:25.600000Z",
        customer_name: "PUGAZHESHWAR D",
        customer_number: "9600048429",
        trip_status: "PENDING",
        pick_near_city: "ALL",
        trip_distance: null,
        trip_time: "8",
        estimated_price: 5000,
        vendor_price: 5200,
        platform_fees_percent: 10,
        created_at: "2025-09-22T18:32:20.564570Z"
      },
      {
        id: 57,
        trip_type: "Oneway",
        car_type: "Sedan",
        pickup_drop_location: {
          "0": "Tiruvannamalai, Tamil Nadu, India",
          "1": "Vellore, Tamil Nadu, India"
        },
        start_date_time: "2025-09-22T18:25:00.179000Z",
        customer_name: "PUGAZH",
        customer_number: "9600048429",
        trip_status: "PENDING",
        pick_near_city: "ALL",
        trip_distance: 88,
        trip_time: "1 hour 57 mins",
        estimated_price: 1682,
        vendor_price: 2008,
        platform_fees_percent: 10,
        created_at: "2025-09-22T18:31:15.285065Z"
      },
      {
        id: 56,
        trip_type: "Hourly Rental",
        car_type: "Sedan",
        pickup_drop_location: {
          "0": "Tiruvannamalai, Tamil Nadu, India"
        },
        start_date_time: "2025-09-21T07:56:55.171000Z",
        customer_name: "RAVI M",
        customer_number: "9585984449",
        trip_status: "CONFIRMED",
        pick_near_city: "Delhi",
        trip_distance: null,
        trip_time: "8",
        estimated_price: 1000,
        vendor_price: 1400,
        platform_fees_percent: 10,
        created_at: "2025-09-21T08:08:24.316075Z"
      },
      {
        id: 55,
        trip_type: "Oneway",
        car_type: "Sedan",
        pickup_drop_location: {
          "0": "Tiruvannamalai, Tamil Nadu, India",
          "1": "Vellore, Tamil Nadu, India"
        },
        start_date_time: "2025-09-20T09:56:33.914000Z",
        customer_name: "PUGAZH ONE WAY",
        customer_number: "9585984449",
        trip_status: "TRIP_COMPLETED",
        pick_near_city: "ALL",
        trip_distance: 88,
        trip_time: "1 hour 57 mins",
        estimated_price: 1832,
        vendor_price: 2208,
        platform_fees_percent: 10,
        created_at: "2025-09-20T09:57:59.485787Z"
      },
      {
        id: 54,
        trip_type: "Hourly Rental",
        car_type: "Sedan",
        pickup_drop_location: {
          "0": "Chennai, Tamil Nadu, India"
        },
        start_date_time: "2025-09-18T18:01:44.771000Z",
        customer_name: "PUGAZHESHWAR D",
        customer_number: "9600048429",
        trip_status: "DRIVER_ASSIGNED",
        pick_near_city: "ALL",
        trip_distance: null,
        trip_time: "8",
        estimated_price: 1000,
        vendor_price: 2500,
        platform_fees_percent: 10,
        created_at: "2025-09-18T18:02:34.531625Z"
      },
    ];
    
    // Sort orders by creation date (latest first)
    const sortedOrders = ordersData.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    setOrders(sortedOrders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
      case 'CONFIRMED': return <AlertCircle size={16} color="#F59E0B" />;
      case 'DRIVER_ASSIGNED': return <Car size={16} color="#3B82F6" />;
      case 'TRIP_STARTED': return <CheckCircle size={16} color="#10B981" />;
      case 'TRIP_COMPLETED': return <CheckCircle size={16} color="#059669" />;
      case 'CANCELLED': return <AlertCircle size={16} color="#DC2626" />;
      case 'PENDING': return <Clock size={16} color="#6B7280" />;
      default: return <AlertCircle size={16} color="#6B7280" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const getLocationEntries = (locations: { [key: string]: string }) => {
    return Object.entries(locations || {}).sort(([a], [b]) => parseInt(a) - parseInt(b));
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const locations = getLocationEntries(item.pickup_drop_location);
    const status = item.trip_status;

    return (
      <TouchableOpacity style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdText}>#{item.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(status)}20` }]}>
              {getStatusIcon(status)}
              <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                {status.replace('_', ' ')}
              </Text>
            </View>
          </View>
          <ArrowRight size={20} color="#9CA3AF" />
        </View>

        <View style={styles.orderContent}>
          <View style={styles.customerInfo}>
            <User size={16} color="#1E40AF" />
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <Text style={styles.customerPhone}>• {item.customer_number}</Text>
          </View>

          <View style={styles.tripInfo}>
            <View style={styles.tripTypeContainer}>
              <Car size={16} color="#6B7280" />
              <Text style={styles.tripTypeText}>
                {item.trip_type} • {item.car_type}
              </Text>
            </View>

            <View style={styles.dateTimeContainer}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.dateTimeText}>
                {formatDate(item.start_date_time)} at {formatTime(item.start_date_time)}
              </Text>
            </View>
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.routeItem}>
              <View style={[styles.routeDot, styles.routeDotStart]} />
              <Text style={styles.routeText} numberOfLines={1}>
                {locations[0]?.[1] || 'Pickup Location'}
              </Text>
            </View>

            {locations.length > 2 && (
              <View style={styles.routeItem}>
                <View style={[styles.routeDot, styles.routeDotMiddle]} />
                <Text style={styles.routeText} numberOfLines={1}>
                  +{locations.length - 2} more stops
                </Text>
              </View>
            )}

            {locations.length > 1 && (
              <View style={styles.routeItem}>
                <View style={[styles.routeDot, styles.routeDotEnd]} />
                <Text style={styles.routeText} numberOfLines={1}>
                  {locations[locations.length - 1]?.[1] || 'Drop Location'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.fareInfo}>
            {item.trip_distance && (
              <View style={styles.fareItem}>
                <Text style={styles.fareLabel}>Distance</Text>
                <Text style={styles.fareValue}>{item.trip_distance} km</Text>
              </View>
            )}
            <View style={styles.fareItem}>
              <Text style={styles.fareLabel}>
                {item.trip_type === 'Hourly Rental' ? 'Duration' : 'Time'}
              </Text>
              <Text style={styles.fareValue}>
                {item.trip_type === 'Hourly Rental' ? `${item.trip_time} hrs` : item.trip_time}
              </Text>
            </View>
            <View style={styles.fareItem}>
              <Text style={styles.fareLabel}>Total Fare</Text>
              <Text style={styles.fareValue}>₹{item.vendor_price}</Text>
            </View>
          </View>

          <View style={styles.profitInfo}>
            <View style={styles.profitRow}>
              <Text style={styles.profitLabel}>Your Earning: </Text>
              <Text style={styles.profitValue}>₹{item.vendor_price - item.estimated_price}</Text>
            </View>
            <View style={styles.profitRow}>
              <Text style={styles.platformFeeLabel}>Platform Fee ({item.platform_fees_percent}%): </Text>
              <Text style={styles.platformFeeValue}>-₹{Math.round((item.vendor_price * item.platform_fees_percent) / 100)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0d5464ff', '#0d5464ff', '#0d5464ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <FileText size={32} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>My Orders</Text>
            <Text style={styles.headerSubtitle}>{orders.length} total bookings</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ordersList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  ordersList: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202124',
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  orderContent: {
    gap: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 8,
  },
  customerPhone: {
    fontSize: 14,
    color: '#5F6368',
    marginLeft: 4,
  },
  tripInfo: {
    gap: 8,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripTypeText: {
    fontSize: 14,
    color: '#5F6368',
    marginLeft: 6,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#5F6368',
    marginLeft: 6,
  },
  routeInfo: {
    paddingVertical: 8,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
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
  routeText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  fareInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
  },
  fareItem: {
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 4,
  },
  fareValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  profitInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  profitLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  profitValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  platformFeeLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  platformFeeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
});