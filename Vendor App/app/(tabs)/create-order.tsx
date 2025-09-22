import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import publicApi from '../api/api';

import { LinearGradient } from 'expo-linear-gradient';
import type { ColorValue } from 'react-native';
import { 
  User, 
  Phone, 
  MapPin, 
  IndianRupee,
  Car,
  Mountain,
  FileText,
  Calendar,
  Clock,
  X,
  ChevronDown,
  Calculator,
  Send,
  Route,
  Truck,
  GripVertical,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  Timer
} from 'lucide-react-native';
import LocationPicker from '../../components/LocationPicker';
import QuoteReview from '../../components/QuoteReview';
import OrderSuccess from '../../components/OrderSuccess';
import { getHourlyQuote, confirmHourlyOrder, getQuote as getQuoteAPI, confirmOrder as confirmOrderAPI, formatOrderData, formatHourlyOrderData } from '../../services/orderService';
import { Picker } from '@react-native-picker/picker';
const { width } = Dimensions.get('window');

interface FormData {
  vendor_id: string;
  trip_type: string;
  car_type: string;
  pickup_drop_location: { [key: string]: string };
  start_date_time: Date;
  customer_name: string;
  customer_number: string;
  // Regular trip fields
  cost_per_km: string;
  extra_cost_per_km: string;
  driver_allowance: string;
  extra_driver_allowance: string;
  permit_charges: string;
  extra_permit_charges: string;
  hill_charges: string;
  toll_charges: string;
  // Hourly rental fields
  package_hours: string;
  cost_per_pack: string;
  extra_cost_per_pack: string;
  additional_cost_per_hour: string;
  extra_additional_cost_per_hour: string;
  pickup_notes: string;
  send_to: string;
  near_city: string;
}

const carTypes = [
  'Hatchback',
  'Sedan', 
  'New Sedan',
  'SUV',
  'Innova',
  'Innova Crysta'
];

const tripTypes = [
  { value: 'Oneway', label: 'One Way', minLocations: 2, maxLocations: 2, icon: Car },
  { value: 'Round Trip', label: 'Round Trip', minLocations: 3, maxLocations: 10, icon: Route },
  { value: 'Multy City', label: 'Multi City', minLocations: 3, maxLocations: 10, icon: Truck },
  { value: 'Hourly Rental', label: 'Hourly Rental', minLocations: 1, maxLocations: 1, icon: Timer },
];

export default function CreateOrderScreen() {
  const [formData, setFormData] = useState<FormData>({
    vendor_id: '83a93a3f-2f6e-4bf6-9f78-1c3f9f42b7b1',
    trip_type: 'Oneway',
    car_type: 'Sedan',
    pickup_drop_location: { '0': '' },
    start_date_time: new Date(),
    customer_name: '',
    customer_number: '',
    // Regular trip fields
    cost_per_km: '',
    extra_cost_per_km: '',
    driver_allowance: '',
    extra_driver_allowance: '',
    permit_charges: '',
    extra_permit_charges: '',
    hill_charges: '',
    toll_charges: '',
    // Hourly rental fields
    package_hours: '',
    cost_per_pack: '',
    extra_cost_per_pack: '',
    additional_cost_per_hour: '',
    extra_additional_cost_per_hour: '',
    pickup_notes: '',
    send_to: 'ALL',
    near_city: ''
  });

  const [showCarTypePicker, setShowCarTypePicker] = useState(false);
  const [showTripTypePicker, setShowTripTypePicker] = useState(false);
  const [activeLocationField, setActiveLocationField] = useState<string | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<any | null>(null);
  const [orderResponse, setOrderResponse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showQuoteReview, setShowQuoteReview] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [options, setOptions] = useState({});

    const fetchPackageHours = async () => {
    try {
      const response = await publicApi.get('/orders/rental_hrs_data');; // replace with actual IP if using on device
      setOptions(response.data);
      console.log('Fetched package hours:', response.data);
    } catch (error) {
      console.error('Failed to fetch package hours:', error);
    }
  };

  useEffect(() => {
    fetchPackageHours();
  }, []);

  const getCurrentTripType = () => {
    return tripTypes.find(type => type.value === formData.trip_type) || tripTypes[0];
  };

  const getLocationKeys = () => {
    return Object.keys(formData.pickup_drop_location).sort((a, b) => parseInt(a) - parseInt(b));
  };

  const getLocationLabel = (index: string) => {
    const keys = getLocationKeys();
    const position = keys.indexOf(index);
    const tripType = getCurrentTripType();
    
    if (tripType.value === 'Hourly Rental') return 'Pickup Location';
    if (position === 0) return 'Pickup Location';
    if (tripType.value === 'Round Trip' && position === keys.length - 1) return 'Return to Pickup';
    if (position === keys.length - 1) return 'Final Destination';
    return `Stop ${position}`;
  };

  const addLocation = () => {
    const keys = getLocationKeys();
    const nextIndex = keys.length.toString();
    const maxLocations = getCurrentTripType().maxLocations;
    
    if (keys.length < maxLocations) {
      setFormData(prev => ({
        ...prev,
        pickup_drop_location: {
          ...prev.pickup_drop_location,
          [nextIndex]: ''
        }
      }));
    }
  };

  const removeLocation = (index: string) => {
    const keys = getLocationKeys();
    if (keys.length > getCurrentTripType().minLocations) {
      const newLocations = { ...formData.pickup_drop_location };
      delete newLocations[index];
      
      // Reindex remaining locations
      const remaining = Object.entries(newLocations)
        .sort(([a], [b]) => parseInt(a) - parseInt(b));
      
      const reindexed: { [key: string]: string } = {};
      remaining.forEach(([, value], i) => {
        reindexed[i.toString()] = value;
      });

      setFormData(prev => ({
        ...prev,
        pickup_drop_location: reindexed
      }));
    }
  };

  const moveLocation = (fromIndex: number, toIndex: number) => {
    const keys = getLocationKeys();
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= keys.length || toIndex >= keys.length) {
      return;
    }

    const newKeys = [...keys];
    const [movedKey] = newKeys.splice(fromIndex, 1);
    newKeys.splice(toIndex, 0, movedKey);

    const reindexed: { [key: string]: string } = {};
    newKeys.forEach((key, i) => {
      reindexed[i.toString()] = formData.pickup_drop_location[key];
    });

    setFormData(prev => ({
      ...prev,
      pickup_drop_location: reindexed
    }));
  };

  const canReorderLocations = () => {
    const tripType = getCurrentTripType();
    return tripType.value === 'Round Trip' || tripType.value === 'Multy City';
  };

  const handleTripTypeChange = (tripType: string) => {
    const newTripType = tripTypes.find(type => type.value === tripType)!;
    // let newLocations = { '0': '', '1': '' };
    let newLocations: { [key: string]: string } = {};
    if (newTripType.value === 'Hourly Rental') {
      newLocations = { '0': ''};
    }else if (newTripType.value === 'Round Trip') {
      newLocations = { '0': '', '1': ''};
    } else if (newTripType.value === 'Multicity') {
      newLocations = { '0': '', '1': ''};
    }else{
      newLocations = { '0': '', '1': ''};
    }
    
    setFormData(prev => ({
      ...prev,
      trip_type: tripType,
      pickup_drop_location: newLocations
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (index: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pickup_drop_location: {
        ...prev.pickup_drop_location,
        [index]: value
      }
    }));
  };

  const openLocationPicker = (index: string) => {
    setActiveLocationField(index);
    setShowLocationPicker(true);
  };

  const getQuote = async () => {
    // Validation
    if (!formData.customer_name.trim()) {
      Alert.alert('Error', 'Please enter customer name');
      return;
    }
    if (!formData.customer_number.trim()) {
      Alert.alert('Error', 'Please enter customer number');
      return;
    }
    
    const locationKeys = getLocationKeys();
    for (const key of locationKeys) {
      if (!formData.pickup_drop_location[key]) {
        Alert.alert('Error', `Please enter ${getLocationLabel(key).toLowerCase()}`);
        return;
      }
    }
    
    // Different validation for hourly rental vs regular trips
    if (formData.trip_type === 'Hourly Rental') {
      if (!formData.package_hours) {
        Alert.alert('Error', 'Please enter package hours');
        return;
      }
      if (!formData.cost_per_pack) {
        Alert.alert('Error', 'Please enter cost per package');
        return;
      }
    } else {
      if (!formData.cost_per_km) {
        Alert.alert('Error', 'Please enter cost per km');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      let quoteResponse;
      
      if (formData.trip_type === 'Hourly Rental') {
        // Use hourly rental API
        console.log('Fetching hourly rental quote...',formData);
        const apiData = formatHourlyOrderData(formData);
        console.log('Formatted Hourly API Data:', apiData);
        quoteResponse = await getHourlyQuote(apiData);
      } else {
        // Use regular trip API
        const apiData = formatOrderData(formData);
        console.log('Formatted Regular API Data:', apiData);
        quoteResponse = await getQuoteAPI(apiData);
      }
      
      setQuoteResponse(quoteResponse);
      setShowQuoteReview(true);
    } catch (error: any) {
      console.error('Error creating quote:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      Alert.alert('Error', `Failed to generate quote: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmOrder = async (sendTo: string, nearCity?: string) => {
    setIsLoading(true);
    
    try {
      let orderResponse;
      
      if (formData.trip_type === 'Hourly Rental') {
        // Use hourly rental confirm API
        const apiData = formatHourlyOrderData(formData, sendTo, nearCity);
        orderResponse = await confirmHourlyOrder(apiData);
      } else {
        // Use regular trip confirm API
        const apiData = formatOrderData(formData, sendTo, nearCity);
        orderResponse = await confirmOrderAPI(apiData);
      }
      
      setOrderResponse(orderResponse);
      setShowQuoteReview(false);
      setShowOrderSuccess(true);
      
    } catch (error: any) {
      console.error('Error confirming order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      Alert.alert('Error', `Failed to create order: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const getTripTypeIcon = () => {
    const tripType = getCurrentTripType();
    const IconComponent = tripType.icon;
    return <IconComponent size={32} color="#FFFFFF" />;
  };

  const getTripTypeColors = (): [ColorValue, ColorValue, ...ColorValue[]] => {
    if (formData.trip_type === 'Hourly Rental') {
      return ['#8B5A3C', '#A0522D', '#CD853F'];
    }
    // All other trip types use the same blue color scheme
    return ['#1E40AF', '#3B82F6', '#60A5FA'];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create {formData.trip_type} Order</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Type Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Route size={24} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Trip Type</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Route size={20} color="#6B7280" style={styles.inputIcon} />
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowTripTypePicker(true)}
            >
              <Text style={[styles.pickerButtonText, formData.trip_type ? styles.pickerButtonTextActive : styles.pickerButtonTextPlaceholder]}>
                {getCurrentTripType().label}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={24} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Customer Details</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <User size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Customer Name"
              value={formData.customer_name}
              onChangeText={(value) => handleInputChange('customer_name', value)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Phone size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Customer Mobile Number"
              value={formData.customer_number}
              onChangeText={(value) => handleInputChange('customer_number', value)}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Trip Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Car size={24} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Trip Details</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Car size={20} color="#6B7280" style={styles.inputIcon} />
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCarTypePicker(true)}
            >
              <Text style={[styles.pickerButtonText, formData.car_type ? styles.pickerButtonTextActive : styles.pickerButtonTextPlaceholder]}>
                {formData.car_type || 'Select Car Type'}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Calendar size={20} color="#6B7280" style={styles.inputIcon} />
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {}}
              >
                <Text style={styles.pickerButtonText}>
                  {formatDateTime(formData.start_date_time).date}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Clock size={20} color="#6B7280" style={styles.inputIcon} />
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {}}
              >
                <Text style={styles.pickerButtonText}>
                  {formatDateTime(formData.start_date_time).time}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Enhanced Dynamic Locations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={24} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Locations ({getLocationKeys().length})</Text>
            {canReorderLocations() && (
              <Text style={styles.reorderHint}>Use ↑↓ to reorder</Text>
            )}
          </View>
          
          {getLocationKeys().map((index, position) => (
            <View key={index} style={styles.locationItem}>
              <View style={styles.locationNumberContainer}>
                <Text style={styles.locationNumber}>{parseInt(index) + 1}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.locationInputContainer}
                onPress={() => openLocationPicker(index)}
              >
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabelText}>
                    {getLocationLabel(index)}
                  </Text>
                  <Text style={[
                    styles.locationInputText, 
                    formData.pickup_drop_location[index] ? styles.locationInputTextActive : styles.locationInputTextPlaceholder
                  ]}>
                    {formData.pickup_drop_location[index] || 'Tap to select location'}
                  </Text>
                </View>
                <MapPin size={20} color="#1E40AF" />
              </TouchableOpacity>

              {canReorderLocations() && (
                <View style={styles.reorderControls}>
                  <TouchableOpacity 
                    style={[styles.reorderButton, parseInt(index) === 0 && styles.disabledReorderButton]}
                    onPress={() => {
                      const currentIndex = parseInt(index);
                      if (currentIndex > 0) {
                        moveLocation(currentIndex, currentIndex - 1);
                      }
                    }}
                    disabled={parseInt(index) === 0}
                  >
                    <ChevronUp size={16} color={parseInt(index) === 0 ? "#9CA3AF" : "#6B7280"} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.reorderButton, parseInt(index) === getLocationKeys().length - 1 && styles.disabledReorderButton]}
                    onPress={() => {
                      const currentIndex = parseInt(index);
                      const keys = getLocationKeys();
                      if (currentIndex < keys.length - 1) {
                        moveLocation(currentIndex, currentIndex + 1);
                      }
                    }}
                    disabled={parseInt(index) === getLocationKeys().length - 1}
                  >
                    <ChevronDownIcon size={16} color={parseInt(index) === getLocationKeys().length - 1 ? "#9CA3AF" : "#6B7280"} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          
          {getLocationKeys().length < getCurrentTripType().maxLocations && (
            <TouchableOpacity onPress={addLocation} style={styles.addLocationButton}>
              <Text style={styles.addLocationText}>+ Add Stop</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Conditional Pricing Section */}
        {formData.trip_type === 'Hourly Rental' ? (
          /* Hourly Rental Pricing */
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Timer size={24} color="#8B5A3C" />
              <Text style={styles.sectionTitle}>Hourly Rental Pricing</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Timer size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Package Hours"
                value={formData.package_hours}
                onChangeText={(value) => handleInputChange('package_hours', value)}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <IndianRupee size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Cost per Package"
                  value={formData.cost_per_pack}
                  onChangeText={(value) => handleInputChange('cost_per_pack', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <IndianRupee size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Extra Cost per Package"
                  value={formData.extra_cost_per_pack}
                  onChangeText={(value) => handleInputChange('extra_cost_per_pack', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <IndianRupee size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Additional Cost per Hour"
                  value={formData.additional_cost_per_hour}
                  onChangeText={(value) => handleInputChange('additional_cost_per_hour', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <IndianRupee size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Extra Additional Cost per Hour"
                  value={formData.extra_additional_cost_per_hour}
                  onChangeText={(value) => handleInputChange('extra_additional_cost_per_hour', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        ) : (
          /* Regular Trip Pricing */
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IndianRupee size={24} color="#1E40AF" />
              <Text style={styles.sectionTitle}>Pricing Details</Text>
            </View>
            
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <IndianRupee size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Cost per KM"
                  value={formData.cost_per_km}
                  onChangeText={(value) => handleInputChange('cost_per_km', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <IndianRupee size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Extra Cost per KM"
                  value={formData.extra_cost_per_km}
                  onChangeText={(value) => handleInputChange('extra_cost_per_km', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Car size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Driver Allowance"
                  value={formData.driver_allowance}
                  onChangeText={(value) => handleInputChange('driver_allowance', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Car size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Extra Driver Allowance"
                  value={formData.extra_driver_allowance}
                  onChangeText={(value) => handleInputChange('extra_driver_allowance', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <FileText size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Permit Charges"
                  value={formData.permit_charges}
                  onChangeText={(value) => handleInputChange('permit_charges', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <FileText size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Extra Permit Charges"
                  value={formData.extra_permit_charges}
                  onChangeText={(value) => handleInputChange('extra_permit_charges', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Mountain size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Hill Charges"
                  value={formData.hill_charges}
                  onChangeText={(value) => handleInputChange('hill_charges', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <IndianRupee size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Toll Charges"
                  value={formData.toll_charges}
                  onChangeText={(value) => handleInputChange('toll_charges', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        )}

        {/* Additional Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={24} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Additional Notes</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <FileText size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Pickup Notes (Optional)"
              value={formData.pickup_notes}
              onChangeText={(value) => handleInputChange('pickup_notes', value)}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Quote Button */}
        <TouchableOpacity 
          style={[styles.quoteButton, isLoading && styles.disabledButton]} 
          onPress={getQuote}
          disabled={isLoading}
        >
          <LinearGradient
            colors={getTripTypeColors()}
            style={styles.gradientButton}
          >
            <Calculator size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>
              {isLoading ? 'Generating Quote...' : 'Get Quote'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Car Type Picker Modal */}
      <Modal
        visible={showCarTypePicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Car Type</Text>
            <TouchableOpacity
              onPress={() => setShowCarTypePicker(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#5F6368" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            {carTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.modalOption,
                  formData.car_type === type && styles.modalOptionActive
                ]}
                onPress={() => {
                  handleInputChange('car_type', type);
                  setShowCarTypePicker(false);
                }}
              >
                <Car size={20} color={formData.car_type === type ? "#1E40AF" : "#6B7280"} />
                <Text style={[
                  styles.modalOptionText,
                  formData.car_type === type && styles.modalOptionTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Trip Type Picker Modal */}
      <Modal
        visible={showTripTypePicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Trip Type</Text>
            <TouchableOpacity
              onPress={() => setShowTripTypePicker(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#5F6368" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            {tripTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.modalOption,
                    formData.trip_type === type.value && styles.modalOptionActive
                  ]}
                  onPress={() => {
                    handleTripTypeChange(type.value);
                    setShowTripTypePicker(false);
                  }}
                >
                  <IconComponent size={20} color={formData.trip_type === type.value ? "#1E40AF" : "#6B7280"} />
                  <Text style={[
                    styles.modalOptionText,
                    formData.trip_type === type.value && styles.modalOptionTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Location Picker */}
      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={(location) => {
          if (activeLocationField) {
            handleLocationChange(activeLocationField, location);
          }
          setShowLocationPicker(false);
        }}
        title={activeLocationField ? `Select ${getLocationLabel(activeLocationField)}` : 'Select Location'}
        placeholder="Search for a location..."
        initialValue={activeLocationField ? formData.pickup_drop_location[activeLocationField] : ''}
      />

      {/* Quote Review */}
      <QuoteReview
        visible={showQuoteReview}
        onClose={() => setShowQuoteReview(false)}
        quoteData={quoteResponse}
        onConfirmOrder={confirmOrder}
        isLoading={isLoading}
      />

      {/* Order Success */}
      <OrderSuccess
        visible={showOrderSuccess}
        onClose={() => {
          setShowOrderSuccess(false);
          // Reset form
          setFormData({
            vendor_id: '83a93a3f-2f6e-4bf6-9f78-1c3f9f42b7b1',
            trip_type: 'Oneway',
            car_type: 'Sedan',
            pickup_drop_location: { '0': '' },
            start_date_time: new Date(),
            customer_name: '',
            customer_number: '',
            cost_per_km: '',
            extra_cost_per_km: '',
            driver_allowance: '',
            extra_driver_allowance: '',
            permit_charges: '',
            extra_permit_charges: '',
            hill_charges: '',
            toll_charges: '',
            package_hours: '',
            cost_per_pack: '',
            extra_cost_per_pack: '',
            additional_cost_per_hour: '',
            extra_additional_cost_per_hour: '',
            pickup_notes: '',
            send_to: 'ALL',
            near_city: ''
          });
          setQuoteResponse(null);
          setOrderResponse(null);
        }}
        orderData={orderResponse}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 12,
    flex: 1,
  },
  reorderHint: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  addLocationButton: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#1E40AF',
    borderStyle: 'dashed',
  },
  addLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dragHandle: {
    padding: 8,
    marginLeft: 8,
  },
  reorderControls: {
    flexDirection: 'column',
    marginLeft: 8,
  },
  reorderButton: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginVertical: 1,
  },
  disabledReorderButton: {
    backgroundColor: '#F9FAFB',
  },
  locationNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  locationInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  inputIcon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#202124',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 35,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#202124',
    fontWeight: '500',
  },
  pickerButtonTextActive: {
    color: '#202124',
  },
  pickerButtonTextPlaceholder: {
    color: '#9AA0A6',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabelText: {
    fontSize: 12,
    color: '#5F6368',
    fontWeight: '500',
    marginBottom: 4,
  },
  locationInputText: {
    fontSize: 16,
  },
  locationInputTextActive: {
    color: '#202124',
    fontWeight: '500',
  },
  locationInputTextPlaceholder: {
    color: '#9AA0A6',
  },
  quoteButton: {
    marginVertical: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#202124',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalOptionActive: {
    backgroundColor: '#F0F7FF',
    borderColor: '#1E40AF',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
});