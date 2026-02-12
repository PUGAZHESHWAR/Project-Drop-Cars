import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard, FutureRide } from '@/contexts/DashboardContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useRouter } from 'expo-router';
import { Menu, Wallet, MapPin, Clock, User, Phone, Car, RefreshCw } from 'lucide-react-native';
import BookingCard from '@/components/BookingCard';
import DrawerNavigation from '@/components/DrawerNavigation';
import WelcomeScreen from '@/components/WelcomeScreen';
import { fetchDashboardData, DashboardData, forceRefreshDashboardData } from '@/services/orders/dashboardService';
import { getPendingOrders, PendingOrder } from '@/services/orders/assignmentService';
import axiosInstance from '@/app/api/axiosInstance';
import { getAuthHeaders } from '@/services/auth/authService';

interface Booking {
  booking_id: string;
  pickup: string;
  drop: string;
  customer_name: string;
  customer_mobile: string;
  fare_per_km: number;
  distance_km: number;
  total_fare: number;
  status?: string; // Make status optional to match both interfaces
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const { balance } = useWallet();
  const { colors } = useTheme();
  const { dashboardData, loading, error, fetchData, refreshData, futureRides } = useDashboard();
  const { sendNewOrderNotification, sendOrderAssignedNotification } = useNotifications();
  const router = useRouter();
  const [showDrawer, setShowDrawer] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  // Remove currentTrip concept from owner dashboard
  const [refreshing, setRefreshing] = useState(false);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  // Available Bookings filters
  const [availableTab, setAvailableTab] = useState<'all' | 'nearcity'>('all');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [citySearch, setCitySearch] = useState('');

  const CITY_STORAGE_KEY = 'vo_nearcity_selected_cities';

  // Master list of cities (can be moved to a separate module later)
  const MASTER_CITIES: string[] = [
    'Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Tiruppur','Vellore','Erode','Thoothukudi','Dindigul','Thanjavur','Hosur','Nagercoil','Avadi','Kancheepuram','Kumbakonam','Cuddalore','Karaikudi','Sivakasi','Ariyalur','Jayankondam','Varadarajanpettai','Udayarpalayam','Chengalpattu','Madurantakam','Mamallapuram','Tirukalukundram','Acharapakkam','Mettupalayam','Pollachi','Valparai','Annur','Karamadai','Sulur','Kinathukadavu','Chidambaram','Virudhachalam','Panruti','Nellikuppam','Parangipettai','Bhuvanagiri','Dharmapuri','Harur','Palacode','Pennagaram','Karimangalam','Palani','Kodaikanal','Oddanchatram','Nilakottai','Vedasandur','Batlagundu','Gobichettipalayam','Sathyamangalam','Bhavani','Perundurai','Anthiyur','Kallakurichi','Sankarapuram','Chinnasalem','Thiagadurgam','Sriperumbudur','Uthiramerur','Walajabad','Colachel','Kuzhithurai','Padmanabhapuram','Anjugramam','Tiruvannamalai','Tiruvannamalai District','Katpadi','Jolarpettai','Nagapattinam','Kanchipuram','Rameswaram','Villupuram','Gingee'
  ];

  // Compute available balance after reserving future rides' estimated totals
  const reservedForFuture = (futureRides || []).reduce((sum, r) => sum + Number((r as any).total_fare ?? 0), 0);
  const currentWallet = Number(dashboardData?.user_info?.wallet_balance ?? balance ?? 0);
  const availableBalance = Math.max(0, currentWallet - reservedForFuture);
  const canAcceptOrder = (order: PendingOrder) => availableBalance >= Number(order.estimated_price ?? 0);

  // Helper function to extract pickup and drop locations from the API response
  const getPickupDropLocations = (pickupDropLocation: any) => {
    if (!pickupDropLocation) return { pickup: 'Unknown', drop: '' };
    if (typeof pickupDropLocation === 'object') {
      // Numeric-key shape
      const has0 = Object.prototype.hasOwnProperty.call(pickupDropLocation, '0');
      const has1 = Object.prototype.hasOwnProperty.call(pickupDropLocation, '1');
      if (has0 && has1) {
        return { pickup: String(pickupDropLocation['0'] || 'Unknown'), drop: String(pickupDropLocation['1'] || '') };
      }
      if (has0) {
        return { pickup: String(pickupDropLocation['0'] || 'Unknown'), drop: '' };
      }
      // Named-key shape
      if (pickupDropLocation.pickup || pickupDropLocation.drop) {
        return { pickup: String(pickupDropLocation.pickup || 'Unknown'), drop: String(pickupDropLocation.drop || '') };
      }
    }
    return { pickup: 'Unknown', drop: '' };
  };

  // Debug logging
  useEffect(() => {
    console.log('🔍 DashboardScreen mounted with:', {
      user: user ? { id: user.id, fullName: user.fullName, primaryMobile: user.primaryMobile } : null,
      dashboardData: dashboardData ? {
        user_info: dashboardData.user_info,
        carCount: dashboardData.cars?.length || 0,
        driverCount: dashboardData.drivers?.length || 0
      } : null,
      loading,
      error,
      pendingOrders: pendingOrders.length
    });
  }, [user, dashboardData, loading, error, pendingOrders]);

  // Auto-load data when user is available after login
  useEffect(() => {
    if (user && !loading && !dashboardData) {
      console.log('🔄 User available, auto-loading dashboard data...');
      fetchData();
      fetchPendingOrdersData();
    }
  }, [user, loading, dashboardData]);

  // Also load data when user changes (login/logout)
  useEffect(() => {
    if (user) {
      console.log('👤 User changed, refreshing dashboard data...');
      fetchData();
      fetchPendingOrdersData();
    }
  }, [user?.id]); // Only trigger when user ID changes (login/logout)

  // Set up periodic refresh for new bookings
  useEffect(() => {
    if (!user) return;

    console.log('⏰ Setting up periodic refresh for new bookings...');
    const interval = setInterval(() => {
      console.log('🔄 Periodic refresh: checking for new bookings...');
      fetchPendingOrdersData();
    }, 30000); // Check every 30 seconds for new bookings

    return () => {
      console.log('⏰ Clearing periodic refresh interval');
      clearInterval(interval);
    };
  }, [user]);

  // Check for new orders and send notifications
  useEffect(() => {
    if (pendingOrders.length > 0 && previousOrderCount === 0) {
      // First time loading orders, just update count
      setPreviousOrderCount(pendingOrders.length);
    } else if (pendingOrders.length > previousOrderCount && previousOrderCount > 0) {
      // New orders received
          const newOrders = pendingOrders.slice(previousOrderCount);
          newOrders.forEach(order => {
            const locations = getPickupDropLocations(order.pickup_drop_location);
            sendNewOrderNotification({
              orderId: order.order_id.toString(),
              pickup: locations.pickup,
              drop: locations.drop,
              customerName: 'Hidden',
              customerMobile: 'Hidden',
              distance: order.trip_distance,
              fare: (order.cost_per_km * order.trip_distance) + order.driver_allowance + order.permit_charges + order.hill_charges + order.toll_charges,
              orderType: 'new'
            });
          });
      setPreviousOrderCount(pendingOrders.length);
    } else if (pendingOrders.length !== previousOrderCount) {
      // Update count if it changed
      setPreviousOrderCount(pendingOrders.length);
    }
  }, [pendingOrders, previousOrderCount, sendNewOrderNotification]);

  const fetchPendingOrdersData = async () => {
    try {
      setOrdersLoading(true);
      console.log('📋 Fetching pending orders for dashboard...');
      
      const orders = await getPendingOrders();
      console.log('✅ Pending orders loaded:', orders.length);
      
      setPendingOrders(orders);
    } catch (error) {
      console.error('❌ Failed to fetch pending orders:', error);
      // Don't show error alert, just log it
    } finally {
      setOrdersLoading(false);
    }
  };

  // nearcity city list derived from pending orders (exclude 'ALL')
  const nearcityOptions = Array.from(
    new Set([
      ...MASTER_CITIES,
      ...pendingOrders
        .map(o => ((o.pick_near_city || o.near_city || '').trim()))
        .filter(city => city && city.toUpperCase() !== 'ALL')
    ])
  ).sort();

  const toggleCitySelection = (city: string) => {
    setSelectedCities(prev => {
      const exists = prev.includes(city);
      if (exists) {
        return prev.filter(c => c !== city);
      }
      if (prev.length >= 5) {
        return prev; // limit to 5
      }
      return [...prev, city];
    });
  };

  // Persist selected cities
  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(CITY_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setSelectedCities(parsed);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await SecureStore.setItemAsync(CITY_STORAGE_KEY, JSON.stringify(selectedCities));
      } catch {}
    })();
  }, [selectedCities]);

  const isTripTypenearcity = (t: any) => {
    const val = String(t || '').toLowerCase();
    return val.includes('multi'); // handles 'Multy City', 'nearcity', etc.
  };

  const getNearCity = (o: PendingOrder) => (o.pick_near_city || o.near_city || '').toUpperCase();
  const isNearCityMode = (o: PendingOrder) => String((o as any).send_to || '').toUpperCase() === 'NEAR_CITY';
  const hasCityTarget = (o: PendingOrder) => {
    const city = getNearCity(o);
    return city !== '' && city !== 'ALL';
  };

  const filteredOrders: PendingOrder[] = (() => {
    if (availableTab === 'all') {
      return pendingOrders.filter(o => {
        const isMulti = isTripTypenearcity(o.trip_type) || isNearCityMode(o) || hasCityTarget(o);
        const pickCity = getNearCity(o);
        // Hide nearcity orders unless pick_near_city is 'ALL'
        if (isMulti && pickCity !== 'ALL') return false;
        return true;
      });
    }
    // nearcity tab
    const onlynearcity = pendingOrders.filter(o => isTripTypenearcity(o.trip_type) || isNearCityMode(o) || hasCityTarget(o));
    if (selectedCities.length === 0) return [];
    const setSel = new Set(selectedCities.map(c => c.toUpperCase()));
    return onlynearcity.filter(o => setSel.has(getNearCity(o)));
  })();

  // Tab counts
  const allTabCount = pendingOrders.filter(o => {
    const isMulti = isTripTypenearcity(o.trip_type) || isNearCityMode(o) || hasCityTarget(o);
    const pickCity = getNearCity(o);
    if (isMulti && pickCity !== 'ALL') return false;
    return true;
  }).length;
  
  // nearcity count should only show selected cities
  const multiTabCount = (() => {
    if (selectedCities.length === 0) return 0;
    const onlynearcity = pendingOrders.filter(o => isTripTypenearcity(o.trip_type) || isNearCityMode(o) || hasCityTarget(o));
    const setSel = new Set(selectedCities.map(c => c.toUpperCase()));
    return onlynearcity.filter(o => setSel.has(getNearCity(o))).length;
  })();

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      console.log('🔄 Manual refresh triggered...');
      
      // Force refresh dashboard data to get latest cars and drivers
      await forceRefreshDashboardData();
      await refreshData();
      await fetchPendingOrdersData(); // Also refresh orders
      
      console.log('✅ Manual refresh completed successfully');
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

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
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    refreshButton: {
      padding: 8,
      marginRight: 8,
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    debugButton: {
      backgroundColor: colors.error,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginLeft: 8,
    },
    debugButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    debugSection: {
      backgroundColor: '#F3F4F6',
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
      marginBottom: 16,
    },
    debugTitle: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: '#374151',
      marginBottom: 8,
    },
    debugText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: '#6B7280',
      marginBottom: 4,
    },
    termsButton: {
      marginTop: 12,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 20,
      alignSelf: 'center',
    },
    termsButtonText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
    },
  });
  const handleAcceptBooking = (order: PendingOrder) => {
    if (processingOrderId && processingOrderId !== order.order_id.toString()) return;
    if (!canAcceptOrder(order)) {
      Alert.alert(
        'Insufficient Balance',
        'Not enough available balance after reserving for your future rides. Add money to accept this booking.',
        [{ text: 'Add Money', onPress: () => router.push('/(tabs)/wallet') }]
      );
      return;
    }

    const locations = getPickupDropLocations(order.pickup_drop_location);
    Alert.alert(
      'Accept Booking',
      `Accept trip from ${locations.pickup} to ${locations.drop}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: () => acceptBooking(order) }
      ]
    );
  };

  const { addFutureRide } = useDashboard();

  // Just-in-time order availability check (VO token)
  const isOrderFree = async (orderId: number): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const res = await axiosInstance.get(`/api/assignments/order/${orderId}`, { headers });
      const list = Array.isArray(res.data) ? res.data : [];
      const active = list.some((a: any) => a?.assignment_status && a.assignment_status !== 'CANCELLED');
      return !active;
    } catch (e) {
      console.warn('isOrderFree check failed', e);
      return false;
    }
  };

  const acceptBooking = async (order: PendingOrder) => {
    try {
      // Show loading state for this specific order
      setProcessingOrderId(order.order_id.toString());
      // Pre-check order availability just-in-time
      const free = await isOrderFree(Number(order.order_id));
      if (!free) {
        setPendingOrders(prev => prev.filter(o => o.order_id !== order.order_id));
        await fetchPendingOrdersData();
        Alert.alert('Order Already Taken', 'Refreshing orders...');
        return;
      }
      
      // Accept with VO token
      const headers = await getAuthHeaders();
      const acceptResponse = await axiosInstance.post('/api/assignments/acceptorder', { order_id: Number(order.order_id) }, { headers });

      if (acceptResponse && (acceptResponse.data?.success === true || acceptResponse.data?.id || acceptResponse.data)) {
        // Remove order from pending list
        setPendingOrders(prev => prev.filter(o => o.order_id !== order.order_id));
        await fetchPendingOrdersData();

        const locations = getPickupDropLocations(order.pickup_drop_location);
        
        // Get the assignment ID from the API response
        const assignmentId = acceptResponse.data?.id || acceptResponse.data?.assignment_id || `B${order.order_id}`;
        
        console.log('🔍 Accept order response data:', acceptResponse.data);
        console.log('🔍 Using assignment ID:', assignmentId);
        console.log('🔍 Original order ID:', order.order_id);
        
        const ride: FutureRide = {
          id: assignmentId, // Use the assignment ID as the main ID
          booking_id: `B${order.order_id}`, // Keep the B-prefixed booking ID
          assignment_id: assignmentId, // Set the assignment_id for assignment operations
          pickup: locations.pickup,
          drop: locations.drop,
          customer_name: order.customer_name,
          customer_mobile: order.customer_number,
          date: new Date().toISOString().slice(0, 10),
          time: new Date().toTimeString().slice(0,5),
          distance: order.trip_distance,
          fare_per_km: order.cost_per_km,
          total_fare: order.estimated_price,
          status: 'confirmed',
          assigned_driver: null,
          assigned_vehicle: null,
        };

        addFutureRide(ride);

        // Send notification for accepted order
        sendOrderAssignedNotification({
          orderId: order.order_id.toString(),
          pickup: locations.pickup,
          drop: locations.drop,
          customerName: order.customer_name,
          customerMobile: order.customer_number,
          distance: order.trip_distance,
          fare: (order.cost_per_km * order.trip_distance) + order.driver_allowance + order.permit_charges + order.hill_charges + order.toll_charges,
          orderType: 'assigned'
        });

        Alert.alert(
          'Booking Accepted',
          'Order accepted successfully! Check Future rides to assign the car and driver within 10 minutes.'
        );
      } else {
        console.log('❌ Accept order response:', acceptResponse);
        Alert.alert('Error', 'Failed to accept order. Please try again.');
        return;
      }
    } catch (error: any) {
      console.error('❌ Error accepting order:', error);
      const backendMsg = error?.response?.data?.detail || error?.response?.data?.message || '';

      // Treat backend "already has an active assignment" as already taken
      const alreadyTaken = (
        error?.message?.includes('already been accepted') ||
        error?.message?.includes('already assigned') ||
        error?.message?.includes('active assignment') ||
        backendMsg?.includes('already been accepted') ||
        backendMsg?.includes('already assigned') ||
        backendMsg?.includes('active assignment')
      );

      if (alreadyTaken) {
        Alert.alert(
          'Order Already Taken',
          'This order already has an active assignment. Refreshing available orders...',
          [
            {
              text: 'OK',
              onPress: () => {
                // Remove locally and refresh list
                setPendingOrders(prev => prev.filter(o => o.order_id !== order.order_id));
                fetchPendingOrdersData();
              }
            }
          ]
        );
      } else if (backendMsg?.toLowerCase?.().includes('insufficient balance')) {
        Alert.alert('Insufficient Balance', 'Please top up your wallet.');
      } else {
        Alert.alert('Error', backendMsg || error.message || 'Failed to accept order. Please try again.');
      }
    } finally {
      setProcessingOrderId(null);
    }
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => setShowDrawer(true)} style={dynamicStyles.menuButton}>
          <Menu color={colors.text} size={24} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={dynamicStyles.balanceContainer}
        >
          <Text style={dynamicStyles.welcomeText}>
            Welcome back, {dashboardData?.user_info?.full_name || user?.fullName || 'Vehicle Owner'}!
          </Text>
          <Text style={dynamicStyles.balanceLabel}>Available Balance</Text>
          <Text style={dynamicStyles.balanceAmount}>₹{Math.round(Number(dashboardData?.user_info?.wallet_balance || balance || 0))}</Text>
        </TouchableOpacity>

        <View style={dynamicStyles.headerRight}>
          <TouchableOpacity onPress={handleRefresh} style={dynamicStyles.refreshButton} disabled={refreshing}>
            <RefreshCw color={colors.primary} size={20} style={refreshing ? { transform: [{ rotate: '180deg' }] } : {}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/wallet')} style={dynamicStyles.walletButton}>
            <Wallet color={colors.primary} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {availableBalance < 1000 && (
        <View style={dynamicStyles.warningBanner}>
          <Text style={dynamicStyles.warningText}>
            Wallet balance below ₹1000. Add money to receive bookings.
          </Text>
        </View>
      )}

      <ScrollView 
        style={dynamicStyles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <View style={dynamicStyles.loadingContainer}>
            <Text style={dynamicStyles.loadingText}>Loading your dashboard...</Text>
          </View>
        ) : error ? (
          <View style={dynamicStyles.loadingContainer}>
            <Text style={dynamicStyles.loadingText}>Error: {error}</Text>
            <TouchableOpacity 
              style={[dynamicStyles.endTripButton, { marginTop: 16 }]}
              onPress={fetchData}
            >
              <Text style={dynamicStyles.endTripButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Welcome Banner */}
            <View style={dynamicStyles.welcomeBanner}>
              <Text style={dynamicStyles.welcomeBannerTitle}>
                🚗 Welcome to Drop Cars, {dashboardData?.user_info?.full_name || user?.fullName || 'Vehicle Owner'}!
              </Text>
              <Text style={dynamicStyles.welcomeBannerSubtitle}>
                {dashboardData?.cars && dashboardData.cars.length > 0 
                  ? `Your ${dashboardData.cars[0].car_brand || 'Vehicle'} ${dashboardData.cars[0].car_model || ''} (${dashboardData.cars[0].car_number || 'Number'}) is ready for service. Start earning today!`
                  : 'Complete your profile setup to start earning!'
                }
              </Text>
              <TouchableOpacity 
                style={dynamicStyles.termsButton}
                onPress={() => Alert.alert(
                  'Terms and Conditions',
                  'By using Drop Cars, you agree to our Terms and Conditions. Please review them in Settings > Privacy & Security.',
                  [{ text: 'OK' }]
                )}
              >
                <Text style={dynamicStyles.termsButtonText}>
                  Terms and Conditions
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={dynamicStyles.statsContainer}>
              <View style={dynamicStyles.statCard}>
                <Text style={dynamicStyles.statNumber}>₹{Math.round(Number(dashboardData?.user_info?.wallet_balance || balance || 0))}</Text>
                <Text style={dynamicStyles.statLabel}>Wallet Balance</Text>
              </View>
              <View style={dynamicStyles.statCard}>
                <Text style={dynamicStyles.statNumber}>{dashboardData?.cars?.length || 0}</Text>
                <Text style={dynamicStyles.statLabel}>Vehicles</Text>
              </View>
              <View style={dynamicStyles.statCard}>
                <Text style={dynamicStyles.statNumber}>{dashboardData?.drivers?.length || 0}</Text>
                <Text style={dynamicStyles.statLabel}>Drivers</Text>
              </View>
            </View>


            {
              <View style={dynamicStyles.bookingsSection}>
                <Text style={dynamicStyles.sectionTitle}>Available Bookings</Text>

                {/* Tabs: All | nearcity */}
                <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                  <TouchableOpacity onPress={() => setAvailableTab('all')} style={{ marginRight: 12 }}>
                    <Text style={{
                      fontFamily: 'Inter-SemiBold',
                      color: availableTab === 'all' ? colors.primary : colors.textSecondary
                    }}>All ({allTabCount})</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setAvailableTab('nearcity')}>
                    <Text style={{
                      fontFamily: 'Inter-SemiBold',
                      color: availableTab === 'nearcity' ? colors.primary : colors.textSecondary
                    }}>Near City ({multiTabCount})</Text>
                  </TouchableOpacity>
                </View>

                {/* City search for nearcity tab */}
                {availableTab === 'nearcity' && (
                  <>
                    {/* Selected cities count display */}
                    {selectedCities.length > 0 && (
                      <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        marginBottom: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        backgroundColor: colors.primary + '20',
                        borderRadius: 8,
                      }}>
                        <Text style={{ 
                          color: colors.primary, 
                          fontFamily: 'Inter-SemiBold',
                          fontSize: 14 
                        }}>
                          {selectedCities.length} cities selected
                        </Text>
                        <TouchableOpacity 
                          onPress={() => setSelectedCities([])} 
                          style={{ marginLeft: 8 }}
                        >
                          <Text style={{ 
                            color: colors.error,
                            fontFamily: 'Inter-Medium',
                            fontSize: 12 
                          }}>Clear All</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Search input */}
                    <View style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      marginBottom: 8,
                      backgroundColor: colors.surface,
                    }}>
                      <TextInput
                        placeholder="Search and select cities..."
                        placeholderTextColor={colors.textSecondary}
                        value={citySearch}
                        onChangeText={setCitySearch}
                        style={{ color: colors.text }}
                      />
                    </View>

                    {/* Options list (filtered) - only show when searching */}
                    {citySearch.length > 0 && (
                      <View style={{ 
                        flexDirection: 'row', 
                        flexWrap: 'wrap', 
                        marginBottom: 12,
                        maxHeight: 200,
                        backgroundColor: colors.surface,
                        borderRadius: 8,
                        padding: 8,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}>
                        {nearcityOptions
                          .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
                          .slice(0, 20) // Limit to 20 results for performance
                          .map((city) => {
                            const selected = selectedCities.includes(city);
                            return (
                              <TouchableOpacity key={city} onPress={() => toggleCitySelection(city)} style={{
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 16,
                                marginRight: 8,
                                marginBottom: 8,
                                backgroundColor: selected ? colors.primary : colors.background,
                                borderWidth: 1,
                                borderColor: selected ? colors.primary : colors.border,
                              }}>
                                <Text style={{ 
                                  color: selected ? '#FFFFFF' : colors.text,
                                  fontSize: 12,
                                  fontFamily: 'Inter-Medium'
                                }}>{city}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        {nearcityOptions.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).length === 0 && (
                          <Text style={{ 
                            color: colors.textSecondary, 
                            fontFamily: 'Inter-Medium',
                            textAlign: 'center',
                            padding: 20 
                          }}>
                            No cities found
                          </Text>
                        )}
                      </View>
                    )}
                  </>
                )}
                {ordersLoading ? (
                  <View style={dynamicStyles.loadingContainer}>
                    <Text style={dynamicStyles.loadingText}>Loading pending orders...</Text>
                  </View>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const locations = getPickupDropLocations(order.pickup_drop_location);
                    return (
                      <BookingCard
                        key={order.order_id}
                        booking={{
                          order_id: Number(order.order_id),
                          pickup: locations.pickup,
                          drop: locations.drop,
                          customer_name: undefined as any,
                          customer_number: undefined as any,
                          estimated_price: Number(order.estimated_price),
                          trip_distance: Number(order.trip_distance ?? 0),
                          fare_per_km: Number(order.cost_per_km ?? 0),
                          car_type: String(order.car_type || ''),
                          trip_type: String(order.trip_type || ''),
                          pick_near_city: String((order as any).pick_near_city || (order as any).near_city || ''),
                          start_date_time: String(order.start_date_time || ''),
                          trip_time: String(((order as any).trip_time) || ''),
                          // Add the timer fields explicitly
                          created_at: String((order as any).created_at || ''),
                          max_time_to_assign_order: String((order as any).max_time_to_assign_order || ''),
                          expires_at: String((order as any).expires_at || ''),
                          charges_to_deduct: Number((order as any).charges_to_deduct || 0),
                        }}
                        onAccept={() => handleAcceptBooking(order)}
                        disabled={!canAcceptOrder(order) || processingOrderId === order.order_id.toString()}
                        loading={processingOrderId === order.order_id.toString()}
                      />
                    );
                  })
                ) : (
                  <View style={dynamicStyles.noBookings}>
                    <Text style={dynamicStyles.noBookingsText}>No pending bookings available</Text>
                    <Text style={dynamicStyles.noBookingsSubtext}>New bookings will appear here</Text>
                  </View>
                )}
              </View>
            }
          </>
        )}
      </ScrollView>

      <DrawerNavigation 
        visible={showDrawer} 
        onClose={() => setShowDrawer(false)} 
      />
    </SafeAreaView>
  );
}