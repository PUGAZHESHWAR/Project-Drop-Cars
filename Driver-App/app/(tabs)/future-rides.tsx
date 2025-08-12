import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Clock, IndianRupee, User, Phone, Car, UserPlus, X } from 'lucide-react-native';

const dummyFutureRides = [
  {
    id: '1',
    booking_id: 'B125',
    pickup: 'Adyar',
    drop: 'Velachery',
    customer_name: 'Lakshmi Devi',
    customer_mobile: '9988776655',
    date: '2025-01-21',
    time: '10:00',
    distance: 25,
    fare_per_km: 12,
    total_fare: 300,
    status: 'confirmed',
    assigned_driver: null
  },
  {
    id: '2',
    booking_id: 'B126',
    pickup: 'T Nagar',
    drop: 'Tambaram',
    customer_name: 'Ravi Shankar',
    customer_mobile: '9876543210',
    date: '2025-01-22',
    time: '14:30',
    distance: 35,
    fare_per_km: 10,
    total_fare: 350,
    status: 'confirmed',
    assigned_driver: null
  },
];

const dummyDrivers = [
  { id: '1', name: 'Kumar', mobile: '9876543211' },
  { id: '2', name: 'Suresh', mobile: '9876543212' },
  { id: '3', name: 'Raj', mobile: '9876543213' },
];

export default function FutureRidesScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [rides, setRides] = useState(dummyFutureRides);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [drivers, setDrivers] = useState(dummyDrivers);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverMobile, setNewDriverMobile] = useState('');

  const generateQuickId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const assignDriver = (ride, driver) => {
    const quickId = generateQuickId();
    
    const updatedRides = rides.map(r => 
      r.id === ride.id 
        ? { ...r, assigned_driver: { ...driver, quickId }, status: 'assigned' }
        : r
    );
    
    setRides(updatedRides);
    setShowAssignModal(false);
    setSelectedRide(null);
    
    Alert.alert(
      'Driver Assigned',
      `${driver.name} has been assigned to trip ${ride.booking_id}\n\nQuick ID: ${quickId}\nMobile: ${driver.mobile}\n\nThe driver can now login using Quick Driver mode.`
    );
  };

  const addNewDriver = () => {
    if (!newDriverName || !newDriverMobile) {
      Alert.alert('Error', 'Please enter driver name and mobile number');
      return;
    }

    if (newDriverMobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    const newDriver = {
      id: Date.now().toString(),
      name: newDriverName,
      mobile: newDriverMobile,
    };

    setDrivers([...drivers, newDriver]);
    setNewDriverName('');
    setNewDriverMobile('');
    
    Alert.alert('Success', 'Driver added successfully');
  };

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
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    assignedBadge: {
      backgroundColor: colors.success,
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
      marginBottom: 12,
    },
    customerName: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    assignButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
    },
    assignButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
    },
    assignedInfo: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
    },
    assignedText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    driverCard: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    driverInfo: {
      flex: 1,
    },
    driverName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    driverMobile: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    selectButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    selectButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
    },
    addDriverSection: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
      marginTop: 16,
    },
    addDriverTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 12,
    },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    input: {
      flex: 1,
      marginLeft: 12,
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    addButton: {
      backgroundColor: colors.success,
      borderRadius: 12,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 8,
    },
  });

  const RideCard = ({ ride }) => (
    <View style={dynamicStyles.rideCard}>
      <View style={dynamicStyles.rideHeader}>
        <Text style={dynamicStyles.bookingId}>#{ride.booking_id}</Text>
        <View style={[
          dynamicStyles.statusBadge,
          ride.status === 'assigned' && dynamicStyles.assignedBadge
        ]}>
          <Text style={dynamicStyles.statusText}>
            {ride.status === 'assigned' ? 'ASSIGNED' : 'CONFIRMED'}
          </Text>
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
          <Text style={dynamicStyles.detailText}>₹{ride.total_fare}</Text>
        </View>
      </View>

      <View style={dynamicStyles.customerInfo}>
        <Text style={dynamicStyles.customerName}>{ride.customer_name}</Text>
      </View>

      {ride.assigned_driver ? (
        <View style={dynamicStyles.assignedInfo}>
          <Text style={dynamicStyles.assignedText}>
            Assigned to: {ride.assigned_driver.name} ({ride.assigned_driver.mobile})
          </Text>
          <Text style={dynamicStyles.assignedText}>
            Quick ID: {ride.assigned_driver.quickId}
          </Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={dynamicStyles.assignButton}
          onPress={() => {
            setSelectedRide(ride);
            setShowAssignModal(true);
          }}
        >
          <Text style={dynamicStyles.assignButtonText}>Assign Driver</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Future Rides</Text>
        <Text style={dynamicStyles.headerSubtitle}>Welcome back, {user?.name}! • Upcoming bookings</Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </ScrollView>

      <Modal
        visible={showAssignModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Assign Driver</Text>
              <TouchableOpacity 
                onPress={() => setShowAssignModal(false)}
                style={dynamicStyles.closeButton}
              >
                <X color={colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {drivers.map((driver) => (
                <View key={driver.id} style={dynamicStyles.driverCard}>
                  <View style={dynamicStyles.driverInfo}>
                    <Text style={dynamicStyles.driverName}>{driver.name}</Text>
                    <Text style={dynamicStyles.driverMobile}>{driver.mobile}</Text>
                  </View>
                  <TouchableOpacity
                    style={dynamicStyles.selectButton}
                    onPress={() => assignDriver(selectedRide, driver)}
                  >
                    <Text style={dynamicStyles.selectButtonText}>Select</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={dynamicStyles.addDriverSection}>
                <Text style={dynamicStyles.addDriverTitle}>Add New Driver</Text>
                
                <View style={dynamicStyles.inputGroup}>
                  <User color={colors.textSecondary} size={16} />
                  <TextInput
                    style={dynamicStyles.input}
                    placeholder="Driver Name"
                    value={newDriverName}
                    onChangeText={setNewDriverName}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={dynamicStyles.inputGroup}>
                  <Phone color={colors.textSecondary} size={16} />
                  <TextInput
                    style={dynamicStyles.input}
                    placeholder="Mobile Number"
                    value={newDriverMobile}
                    onChangeText={setNewDriverMobile}
                    keyboardType="phone-pad"
                    maxLength={10}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <TouchableOpacity style={dynamicStyles.addButton} onPress={addNewDriver}>
                  <UserPlus color="#FFFFFF" size={16} />
                  <Text style={dynamicStyles.addButtonText}>Add Driver</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}