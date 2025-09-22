import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Search, Filter, Calendar, MapPin, Clock, DollarSign, ArrowRight, Eye, CircleCheck as CheckCircle, TrendingUp, Car } from 'lucide-react-native';

interface Order {
  id: number;
  trip_type: string;
  car_type: string;
  pickup_drop_location: {
    [key: string]: string;
  };
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

interface VendorData {
  id: string;
  full_name: string;
  primary_number: string;
  account_status: string;
  branch_name: string;
}

export default function DashboardScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newOrderNotification, setNewOrderNotification] = useState(false);

  useEffect(() => {
    loadVendorData();
    loadOrders();
  }, []);

  const loadVendorData = () => {
    // Mock vendor data
    setVendorData({
      id: '1',
      full_name: 'Vendor Name',
      primary_number: '9876543210',
      account_status: 'Active',
      branch_name: 'Drop Cars',
    });
  };

  const loadOrders = () => {
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
        trip_status: "PENDING",
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
        trip_status: "PENDING",
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
        trip_status: "PENDING",
        pick_near_city: "ALL",
        trip_distance: null,
        trip_time: "8",
        estimated_price: 1000,
        vendor_price: 2500,
        platform_fees_percent: 10,
        created_at: "2025-09-18T18:02:34.531625Z"
      },
      {
        id: 53,
        trip_type: "Oneway",
        car_type: "Sedan",
        pickup_drop_location: {
          "0": "Tiruvannamalai, Tamil Nadu, India",
          "1": "Vellore, Tamil Nadu, India"
        },
        start_date_time: "2025-09-18T18:00:17.074000Z",
        customer_name: "PUGAZHESHWAR D",
        customer_number: "9600048429",
        trip_status: "PENDING",
        pick_near_city: "ALL",
        trip_distance: 88,
        trip_time: "1 hour 57 mins",
        estimated_price: 1732,
        vendor_price: 2108,
        platform_fees_percent: 10,
        created_at: "2025-09-18T18:01:35.259842Z"
      },
      {
        id: 52,
        trip_type: "Hourly Rental",
        car_type: "Sedan",
        pickup_drop_location: {
          "0": "Chennai"
        },
        start_date_time: "2025-08-13T12:00:00Z",
        customer_name: "Arun",
        customer_number: "9876543210",
        trip_status: "PENDING",
        pick_near_city: "TVM",
        trip_distance: null,
        trip_time: "8",
        estimated_price: 300,
        vendor_price: 400,
        platform_fees_percent: 10,
        created_at: "2025-09-18T15:53:08.360109Z"
      }
    ];
    
    // Sort orders by creation date (latest first)
    const sortedOrders = ordersData.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    setOrders(sortedOrders);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadVendorData(), loadOrders()]);
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#F59E0B';
      case 'ACCEPTED': return '#3B82F6';
      case 'IN_PROGRESS': return '#8B5CF6';
      case 'COMPLETED': return '#10B981';
      case 'CANCELLED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'IN_PROGRESS': return 'In Progress';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={16} color="#F59E0B" />;
      case 'ACCEPTED': return <Calendar size={16} color="#3B82F6" />;
      case 'IN_PROGRESS': return <MapPin size={16} color="#8B5CF6" />;
      case 'COMPLETED': return <DollarSign size={16} color="#10B981" />;
      case 'CANCELLED': return <Eye size={16} color="#EF4444" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return '1 day ago';
    return date.toLocaleDateString();
  };

  const calculateTotalProfit = () => {
    return orders.reduce((total, order) => {
      if (order.estimated_price && order.vendor_price) {
        return total + (order.vendor_price - order.estimated_price);
      }
      return total;
    }, 0);
  };

  const calculateTotalRevenue = () => {
    return orders.reduce((total, order) => {
      if (order.vendor_price) {
        return total + order.vendor_price;
      }
      return total;
    }, 0);
  };

  const getPendingOrdersCount = () => {
    return orders.filter(order => order.trip_status === 'PENDING').length;
  };

  if (!vendorData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.branchSection}>
            <Text style={styles.branchName}>{vendorData.branch_name}</Text>
            <Text style={styles.accountStatus}>
              {vendorData.account_status === 'Active' ? '● Active' : '● Pending Verification'}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* New Order Notification */}
      {newOrderNotification && (
        <View style={styles.newOrderBanner}>
          <CheckCircle size={20} color="#10B981" />
          <Text style={styles.newOrderText}>New order received successfully!</Text>
        </View>
      )}

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Car size={24} color="#3B82F6" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{orders.length}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Clock size={24} color="#F59E0B" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{getPendingOrdersCount()}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#D1FAE5' }]}>
              <TrendingUp size={24} color="#10B981" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>₹{calculateTotalProfit()}</Text>
              <Text style={styles.statLabel}>Total Profit</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#E0E7FF' }]}>
              <DollarSign size={24} color="#6366F1" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>₹{calculateTotalRevenue()}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
          </View>
        </View>

        {/* Orders */}
        <View style={styles.ordersContainer}>
          <View style={styles.ordersHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <Text style={styles.sectionSubtitle}>Manage your car bookings</Text>
            </View>
            <View style={styles.ordersActions}>
              <TouchableOpacity style={styles.actionIcon}>
                <Search size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon}>
                <Filter size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {orders.slice(0, 8).map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.customerInfo}>
                  <View style={styles.customerAvatar}>
                    <Text style={styles.customerInitial}>
                      {order.customer_name.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.customerName}>{order.customer_name}</Text>
                    <Text style={styles.orderTime}>{formatTime(order.created_at)}</Text>
                  </View>
                </View>
                <View style={styles.orderStatus}>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.trip_status)}20` }]}>
                    {getStatusIcon(order.trip_status)}
                    <Text style={[styles.orderStatusText, { color: getStatusColor(order.trip_status) }]}>
                      {getStatusText(order.trip_status)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.locationRow}>
                  <View style={styles.locationItem}>
                    <View style={[styles.locationDot, { backgroundColor: '#3B82F6' }]} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {order.pickup_drop_location['0']}
                    </Text>
                  </View>
                  {order.pickup_drop_location['1'] && (
                    <View style={styles.locationItem}>
                      <View style={[styles.locationDot, { backgroundColor: '#10B981' }]} />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {order.pickup_drop_location['1']}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.orderMeta}>
                  {order.trip_distance && (
                    <View style={styles.metaItem}>
                      <MapPin size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{order.trip_distance} km</Text>
                    </View>
                  )}
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.metaText}>
                      {order.trip_type === 'Hourly Rental' ? `${order.trip_time} hours` : order.trip_time}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <DollarSign size={14} color="#6B7280" />
                    <Text style={styles.metaText}>₹{order.vendor_price}</Text>
                  </View>
                </View>

                {/* Price and Profit Information */}
                <View style={styles.priceInfo}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Estimated Price:</Text>
                    <Text style={styles.estimatedPrice}>₹{order.estimated_price}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Your Price:</Text>
                    <Text style={styles.vendorPrice}>₹{order.vendor_price}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Profit:</Text>
                    <Text style={styles.profitText}>₹{order.vendor_price - order.estimated_price}</Text>
                  </View>
                </View>

                <View style={styles.carInfo}>
                  <Text style={styles.carTypeText}>{order.car_type} • {order.trip_type}</Text>
                </View>

                <View style={styles.orderActions}>
                  <TouchableOpacity style={styles.viewButton}>
                    <Eye size={16} color="#3B82F6" />
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.viewAllOrdersButton}>
            <Text style={styles.viewAllOrdersText}>View All Orders</Text>
            <ArrowRight size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchSection: {
    flex: 1,
  },
  branchName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  accountStatus: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  newOrderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    borderLeftWidth: 5,
    borderLeftColor: '#10B981',
  },
  newOrderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  ordersContainer: {
    marginBottom: 30,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  ordersActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    gap: 16,
  },
  locationRow: {
    gap: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  orderMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  estimatedPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  vendorPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  profitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  carInfo: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  carTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  orderActions: {
    alignItems: 'flex-end',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  viewAllOrdersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  viewAllOrdersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginRight: 8,
  },
});