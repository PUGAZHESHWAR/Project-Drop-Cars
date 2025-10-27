import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, Clock, MapPin, DollarSign, TrendingUp, Users, Search, ListFilter as Filter, X, CircleCheck as CheckCircle, Circle as XCircle, User, Calendar } from 'lucide-react-native';
import api from '../api/api'; // Adjust the path as necessary
const { width } = Dimensions.get('window');

interface VendorData {
  id: string;
  full_name: string;
  primary_number: string;
  account_status: string;
  branch_name: string;
}

interface Order {
  id: number;
  source: string;
  source_order_id: number;
  vendor_id: string;
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
  order_accept_status: boolean;
  Driver_assigned: boolean;
  Car_assigned: boolean;
}

const ORDERS_DATA: Order[] = [];

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    tripType: 'all',
    carType: 'all',
    acceptStatus: 'all'
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (refreshing) {
      fetchOrders();
    }
  }, [refreshing]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadVendorData(),
        fetchOrders()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVendorData = async () => {
    // try {
    //   const response = await api.get('/vendor/profile');
    //   setVendorData(response.data);
    // } catch (err: any) {
      // console.error('Error fetching vendor data:', err);
      // Fallback to mock data if API fails
      setVendorData({
        id: '1',
        full_name: 'Drop Cars Pvt Ltd',
        primary_number: '+91 98765 43210',
        account_status: 'Active',
        branch_name: 'Drop Cars',
      });
    // }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/pending/vendor');
      const ordersData: Order[] = response.data;
      
      // For now, using static data - replace with API call when ready
      // const ordersData: Order[] = ORDERS_DATA;
      
      // Sort orders by creation date (latest first)
      const sortedOrders = ordersData.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setOrders(sortedOrders);
      console.log("Fetched orders:", sortedOrders.length);
    } catch (err: any) {
      console.error("Error fetching vendor orders:", err);
      // Fallback to static data on error
      setOrders(ORDERS_DATA);
    } finally {
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const acceptedOrders = orders.filter(order => order.order_accept_status === true).length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.vendor_price, 0);

    return {
      totalOrders,
      acceptedOrders,
      totalRevenue,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.pickup_drop_location['0'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.pickup_drop_location['1'] && order.pickup_drop_location['1'].toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.customer_number.includes(searchQuery)
      );
    }

    // Status filter
    if (selectedFilters.status !== 'all') {
      filtered = filtered.filter(order => order.trip_status === selectedFilters.status);
    }

    // Trip type filter
    if (selectedFilters.tripType !== 'all') {
      filtered = filtered.filter(order => order.trip_type === selectedFilters.tripType);
    }

    // Car type filter
    if (selectedFilters.carType !== 'all') {
      filtered = filtered.filter(order => order.car_type === selectedFilters.carType);
    }

    // Accept status filter
    if (selectedFilters.acceptStatus !== 'all') {
      const isAccepted = selectedFilters.acceptStatus === 'accepted';
      filtered = filtered.filter(order => order.order_accept_status === isAccepted);
    }

    return filtered;
  }, [orders, searchQuery, selectedFilters]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadVendorData(), fetchOrders()]);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return '#F59E0B';
      case 'ACCEPTED': return '#10B981';
      case 'COMPLETED': return '#3B82F6';
      case 'CANCELLED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const formatDuration = (tripTime: string) => {
    if (tripTime.includes('hour')) {
      return tripTime;
    }
    return `${tripTime} hours`;
  };

  const clearFilters = () => {
    setSelectedFilters({
      status: 'all',
      tripType: 'all',
      carType: 'all',
      acceptStatus: 'all'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  if (!vendorData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Unable to load vendor data</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadInitialData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.companyName}>{vendorData.branch_name}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileInitial}>D</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Compact Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.compactStatsGrid}>
            <View style={styles.compactStatCard}>
              <View style={styles.statIconContainer}>
                <Car size={20} color="#6366F1" />
              </View>
              <Text style={styles.compactStatValue}>{stats.totalOrders}</Text>
              <Text style={styles.compactStatLabel}>Total Orders</Text>
            </View>
            
            <View style={styles.compactStatCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#D1FAE5' }]}>
                <Users size={20} color="#10B981" />
              </View>
              <Text style={styles.compactStatValue}>{stats.acceptedOrders}</Text>
              <Text style={styles.compactStatLabel}>Accepted</Text>
            </View>
            
            <View style={styles.compactStatCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <TrendingUp size={20} color="#F59E0B" />
              </View>
              <Text style={styles.compactStatValue}>₹{stats.totalRevenue.toLocaleString()}</Text>
              <Text style={styles.compactStatLabel}>Bookings</Text>
            </View>
          </View>
        </View>

        {/* Search and Filter Section */}
        <View style={styles.searchFilterSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by customer, location, or phone..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearch}>
                <X size={16} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Orders Section */}
        <View style={styles.ordersSection}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.sectionTitle}>All Orders</Text>
              <Text style={styles.sectionSubtitle}>
                {filteredOrders.length} of {orders.length} orders
              </Text>
            </View>
          </View>

          {filteredOrders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <View style={styles.customerInfo}>
                  <View style={styles.customerAvatar}>
                    <Text style={styles.customerInitial}>
                      {order.customer_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.customerDetails}>
                    <Text style={styles.customerName}>{order.customer_name}</Text>
                    <Text style={styles.customerPhone}>{order.customer_number}</Text>
                    <Text style={styles.orderTime}>{formatTime(order.created_at)}</Text>
                  </View>
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.trip_status)}15` }]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.trip_status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(order.trip_status) }]}>
                    {order.trip_status}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.locationContainer}>
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

                {/* Status Information */}
                <View style={styles.statusInfoContainer}>
                  <View style={styles.statusInfoRow}>
                    <View style={styles.statusItem}>
                      <CheckCircle size={16} color={order.order_accept_status ? '#10B981' : '#9CA3AF'} />
                      <Text style={[styles.statusItemText, { color: order.order_accept_status ? '#10B981' : '#9CA3AF' }]}>
                        Order {order.order_accept_status ? 'Accepted' : 'Pending'}
                      </Text>
                    </View>
           
                    <View style={styles.statusItem}>
                      <Car size={16} color={order.Car_assigned ? '#10B981' : '#9CA3AF'} />
                      <Text style={[styles.statusItemText, { color: order.Car_assigned ? '#10B981' : '#9CA3AF' }]}>
                        Car {order.Car_assigned ? 'Assigned' : 'Not Assigned'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.statusInfoRow}>
                    <View style={styles.statusItem}>
                      <User size={16} color={order.Driver_assigned ? '#10B981' : '#9CA3AF'} />
                      <Text style={[styles.statusItemText, { color: order.Driver_assigned ? '#10B981' : '#9CA3AF' }]}>
                        Driver {order.Driver_assigned ? 'Assigned' : 'Not Assigned'}
                      </Text>
                    </View>
                    
                    <View style={styles.statusItem}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.statusItemText}>
                        Duration: {formatDuration(order.trip_time)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.orderMeta}>
                  <View style={styles.metaGroup}>
                    <View style={styles.metaItem}>
                      <Car size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{order.car_type}</Text>
                    </View>
                    {order.trip_distance && (
                      <View style={styles.metaItem}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.metaText}>{order.trip_distance} km</Text>
                      </View>
                    )}
                    <View style={styles.metaItem}>
                      <Calendar size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{order.trip_type}</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Text style={styles.metaText}>ID:</Text>
                      <Text style={styles.metaText}>{order.id}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.priceText}>₹{order.vendor_price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Orders</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterOptions}>
              {/* Status Filter */}


              {/* Trip Type Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Trip Type</Text>
                <View style={styles.filterButtons}>
                  {['all', 'Oneway', 'Hourly Rental'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterButton,
                        selectedFilters.tripType === type && styles.filterButtonActive
                      ]}
                      onPress={() => setSelectedFilters(prev => ({ ...prev, tripType: type }))}
                    >
                      <Text style={[
                        styles.filterButtonText,
                        selectedFilters.tripType === type && styles.filterButtonTextActive
                      ]}>
                        {type === 'all' ? 'All' : type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Accept Status Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Accept Status</Text>
                <View style={styles.filterButtons}>
                  {['all', 'accepted', 'pending'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.filterButton,
                        selectedFilters.acceptStatus === status && styles.filterButtonActive
                      ]}
                      onPress={() => setSelectedFilters(prev => ({ ...prev, acceptStatus: status }))}
                    >
                      <Text style={[
                        styles.filterButtonText,
                        selectedFilters.acceptStatus === status && styles.filterButtonTextActive
                      ]}>
                        {status === 'all' ? 'All' : status === 'accepted' ? 'Accepted' : 'Pending'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton} 
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6366F1',
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  compactStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  compactStatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  compactStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  compactStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  searchFilterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearSearch: {
    padding: 4,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ordersSection: {
    marginBottom: 30,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    gap: 12,
  },
  locationContainer: {
    gap: 8,
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
  statusInfoContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  statusInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statusItemText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterOptions: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButtonActive: {
    backgroundColor: '#6366F1',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});