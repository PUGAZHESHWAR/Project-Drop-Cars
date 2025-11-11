import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Platform,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  Route,
  Truck,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  Timer,
} from 'lucide-react-native';
import { publicApi } from '../api/api';

interface FormData {
  vendor_id: string;
  trip_type: string;
  car_type: string;
  pickup_drop_location: { [key: string]: string };
  start_date_time: Date;
  customer_name: string;
  customer_number: string;
  max_time_hours: string;
  max_time_minutes: string;
  toll_charge_update: boolean;
  cost_per_km: string;
  extra_cost_per_km: string;
  driver_allowance: string;
  extra_driver_allowance: string;
  permit_charges: string;
  extra_permit_charges: string;
  hill_charges: string;
  toll_charges: string;
  package_hours: { hours: number; km_range: number } | null;
  cost_per_hour: string;
  extra_cost_per_hour: string;
  cost_for_addon_km: string;
  extra_cost_for_addon_km: string;
  pickup_notes: string;
  send_to: string;
  near_city: string;
  night_charges: string;
}

const carTypes = [
  'HATCHBACK',
  'SEDAN_4_PLUS_1',
  'NEW_SEDAN_2022_MODEL',
  'ETIOS_4_PLUS_1',
  'SUV',
  'SUV_6_PLUS_1',
  'SUV_7_PLUS_1',
  'INNOVA',
  'INNOVA_6_PLUS_1',
  'INNOVA_7_PLUS_1',
  'INNOVA_CRYSTA',
  'INNOVA_CRYSTA_6_PLUS_1',
  'INNOVA_CRYSTA_7_PLUS_1'
];

const tripTypes = [
  { value: 'Oneway', label: 'One Way', minLocations: 2, maxLocations: 2, icon: Car },
  { value: 'Round Trip', label: 'Round Trip', minLocations: 3, maxLocations: 10, icon: Route },
  { value: 'Multy City', label: 'Multi City', minLocations: 3, maxLocations: 10, icon: Truck },
  { value: 'Hourly Rental', label: 'Hourly Rental', minLocations: 1, maxLocations: 1, icon: Timer },
];

// const packageHoursOptions = [
//   { hours: 4, km_range: 40 },
//   { hours: 8, km_range: 80 },
//   { hours: 12, km_range: 120 },
//   { hours: 24, km_range: 240 },
// ];


const mockLocations = [
  'Mumbai Airport',
  'Delhi Railway Station',
  'Bangalore IT Park',
  'Chennai Marina Beach',
  'Hyderabad Hi-Tech City',
  'Pune Station',
  'Kolkata Airport',
  'Goa Beach Resort',
];

export default function CreateOrderScreen() {
  const [formData, setFormData] = useState<FormData>({
    vendor_id: '83a93a3f-2f6e-4bf6-9f78-1c3f9f42b7b1',
    trip_type: 'Oneway',
    car_type: 'HATCHBACK',
    pickup_drop_location: { '0': '', '1': '' },
    start_date_time: new Date(),
    customer_name: '',
    customer_number: '',
    max_time_hours: '0',
    max_time_minutes: '10',
    toll_charge_update: true,
    cost_per_km: '',
    extra_cost_per_km: '',
    driver_allowance: '',
    extra_driver_allowance: '',
    permit_charges: '',
    extra_permit_charges: '',
    hill_charges: '',
    toll_charges: '',
    package_hours: null,
    cost_per_hour: '',
    extra_cost_per_hour: '',
    cost_for_addon_km: '',
    extra_cost_for_addon_km: '',
    pickup_notes: '',
    send_to: 'ALL',
    near_city: '',
    night_charges: '',
  });

  const [showCarTypePicker, setShowCarTypePicker] = useState(false);
  const [showTripTypePicker, setShowTripTypePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showPackageHoursPicker, setShowPackageHoursPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeLocationField, setActiveLocationField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [packageHoursOptions,setPackageHoursOptions] = useState([{hours: 12, km_range: 120 }])

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

  const fetchPackageHours = async () => {
    try {
      const response = await publicApi.get('/orders/rental_hrs_data');
      setPackageHoursOptions(response.data);
      console.log('Fetched package hours:', response.data);
    } catch (error) {
      console.error('Failed to fetch package hours:', error);
    }
  };

  useEffect(() => {
    fetchPackageHours();
  }, []);

  const handleTripTypeChange = (tripType: string) => {
    const newTripType = tripTypes.find(type => type.value === tripType)!;
    let newLocations: { [key: string]: string } = {};
    
    if (newTripType.value === 'Hourly Rental') {
      newLocations = { '0': '' };
    } else if (newTripType.value === 'Round Trip') {
      newLocations = { '0': '', '1': '', '2': '' };
    } else if (newTripType.value === 'Multy City') {
      newLocations = { '0': '', '1': '', '2': '' };
    } else {
      newLocations = { '0': '', '1': '' };
    }
    
    setFormData(prev => ({
      ...prev,
      trip_type: tripType,
      pickup_drop_location: newLocations
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string | Date | boolean | { hours: number; km_range: number } | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (index: string, value: string) => {
    const newLocations = { ...formData.pickup_drop_location, [index]: value };
    
    if (formData.trip_type === 'Round Trip' && index === '0') {
      const keys = getLocationKeys();
      const lastIndex = (keys.length - 1).toString();
      if (keys.length > 1) {
        newLocations[lastIndex] = value;
      }
    }
    
    setFormData(prev => ({ ...prev, pickup_drop_location: newLocations }));
  };

  const openLocationPicker = (index: string) => {
    const keys = getLocationKeys();
    const position = keys.indexOf(index);
    if (formData.trip_type === 'Round Trip' && position === keys.length - 1) {
      Alert.alert('Info', 'Return location is automatically set to pickup location for round trip');
      return;
    }
    
    setActiveLocationField(index);
    setShowLocationPicker(true);
  };

  const addLocation = () => {
    const keys = getLocationKeys();
    const nextIndex = keys.length.toString();
    const maxLocations = getCurrentTripType().maxLocations;
    
    if (keys.length < maxLocations) {
      const newLocations = { ...formData.pickup_drop_location, [nextIndex]: '' };
      
      if (formData.trip_type === 'Round Trip' && formData.pickup_drop_location['0']) {
        const lastIndex = keys.length.toString();
        newLocations[lastIndex] = formData.pickup_drop_location['0'];
      }
      
      setFormData(prev => ({ ...prev, pickup_drop_location: newLocations }));
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

    if (formData.trip_type === 'Round Trip' && reindexed['0']) {
      const lastIndex = (Object.keys(reindexed).length - 1).toString();
      reindexed[lastIndex] = reindexed['0'];
    }

    setFormData(prev => ({ ...prev, pickup_drop_location: reindexed }));
  };

  const canReorderLocations = () => {
    const tripType = getCurrentTripType();
    return tripType.value === 'Round Trip' || tripType.value === 'Multy City';
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDateTime = new Date(formData.start_date_time);
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
      handleInputChange('start_date_time', newDateTime);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(formData.start_date_time);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      handleInputChange('start_date_time', newDateTime);
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

  const getTripTypeColors = (): [ColorValue, ColorValue, ...ColorValue[]] => {
    if (formData.trip_type === 'Hourly Rental') {
      return ['#8B5A3C', '#A0522D', '#CD853F'];
    }
    return ['#1E40AF', '#3B82F6', '#60A5FA'];
  };

  const getQuote = async () => {
    if (!formData.customer_name.trim()) {
      Alert.alert('Error', 'Please enter customer name');
      return;
    }
    if (!formData.customer_number.trim()) {
      Alert.alert('Error', 'Please enter customer number');
      return;
    }

    setIsLoading(true);
    
    try {
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Quote generated successfully!');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating quote:', error);
      Alert.alert('Error', 'Failed to generate quote. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create {formData.trip_type} Order</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Type Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Route size={20} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Trip Type</Text>
          </View>
          
          <Text style={styles.fieldLabel}>Select Trip Type</Text>
          <View style={styles.inputContainer}>
            <Route size={18} color="#6B7280" style={styles.inputIcon} />
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowTripTypePicker(true)}
            >
              <Text style={[styles.pickerButtonText, formData.trip_type ? styles.pickerButtonTextActive : styles.pickerButtonTextPlaceholder]}>
                {getCurrentTripType().label}
              </Text>
              <ChevronDown size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Customer Details</Text>
          </View>
          
          <Text style={styles.fieldLabel}>Customer Name *</Text>
          <View style={styles.inputContainer}>
            <User size={18} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter customer name"
              value={formData.customer_name}
              onChangeText={(value) => handleInputChange('customer_name', value)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Text style={styles.fieldLabel}>Customer Mobile Number *</Text>
          <View style={styles.inputContainer}>
            <Phone size={18} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              value={formData.customer_number}
              onChangeText={(value) => handleInputChange('customer_number', value)}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Order Configuration */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Order Configuration</Text>
          </View>
          
          <Text style={styles.fieldLabel}>Max Time to Assign Order</Text>
          <View style={styles.timeInputRow}>
            <View style={[styles.inputContainer, styles.timeInput]}>
              <Clock size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Hours"
                value={formData.max_time_hours}
                onChangeText={(value) => handleInputChange('max_time_hours', value)}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.timeUnit}>hrs</Text>
            </View>
            
            <View style={[styles.inputContainer, styles.timeInput]}>
              <Clock size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Minutes"
                value={formData.max_time_minutes}
                onChangeText={(value) => handleInputChange('max_time_minutes', value)}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.timeUnit}>min</Text>
            </View>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <IndianRupee size={18} color="#6B7280" />
              <Text style={styles.switchText}>Toll Charge Update</Text>
            </View>
            <Switch
              value={formData.toll_charge_update}
              onValueChange={(value) => handleInputChange('toll_charge_update', value)}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={formData.toll_charge_update ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Trip Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Car size={20} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Trip Details</Text>
          </View>
          
          <Text style={styles.fieldLabel}>Car Type *</Text>
          <View style={styles.inputContainer}>
            <Car size={18} color="#6B7280" style={styles.inputIcon} />
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCarTypePicker(true)}
            >
              <Text style={[styles.pickerButtonText, formData.car_type ? styles.pickerButtonTextActive : styles.pickerButtonTextPlaceholder]}>
                {formData.car_type || 'Select car type'}
              </Text>
              <ChevronDown size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.halfWidth, { marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>Start Date *</Text>
              <View style={styles.inputContainer}>
                <Calendar size={18} color="#6B7280" style={styles.inputIcon} />
                <TouchableOpacity 
                  style={styles.pickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.pickerButtonText}>
                    {formatDateTime(formData.start_date_time).date}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.halfWidth, { marginLeft: 8 }]}>
              <Text style={styles.fieldLabel}>Start Time *</Text>
              <View style={styles.inputContainer}>
                <Clock size={18} color="#6B7280" style={styles.inputIcon} />
                <TouchableOpacity 
                  style={styles.pickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.pickerButtonText}>
                    {formatDateTime(formData.start_date_time).time}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Locations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Locations ({getLocationKeys().length})</Text>
            {canReorderLocations() && (
              <Text style={styles.reorderHint}>Use ↑↓ to reorder</Text>
            )}
          </View>
          
          {getLocationKeys().map((index, position) => (
            <View key={index}>
              <Text style={styles.fieldLabel}>{getLocationLabel(index)} *</Text>
              <View style={styles.locationItem}>
                <View style={styles.locationNumberContainer}>
                  <Text style={styles.locationNumber}>{parseInt(index) + 1}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.locationInputContainer}
                  onPress={() => openLocationPicker(index)}
                >
                  <View style={styles.locationTextContainer}>
                    <Text style={[
                      styles.locationInputText, 
                      formData.pickup_drop_location[index] ? styles.locationInputTextActive : styles.locationInputTextPlaceholder
                    ]}>
                      {formData.pickup_drop_location[index] || 'Tap to select location'}
                    </Text>
                  </View>
                  <MapPin size={18} color="#1E40AF" />
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
                      <ChevronUp size={14} color={parseInt(index) === 0 ? "#9CA3AF" : "#6B7280"} />
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
                      <ChevronDownIcon size={14} color={parseInt(index) === getLocationKeys().length - 1 ? "#9CA3AF" : "#6B7280"} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
          
          {getLocationKeys().length < getCurrentTripType().maxLocations && (
            <TouchableOpacity onPress={addLocation} style={styles.addLocationButton}>
              <Text style={styles.addLocationText}>+ Add Stop</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pricing Section */}
        {formData.trip_type === 'Hourly Rental' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Timer size={20} color="#8B5A3C" />
              <Text style={styles.sectionTitle}>Hourly Rental Pricing</Text>
            </View>
            
            <Text style={styles.fieldLabel}>Package Hours *</Text>
            <View style={styles.inputContainer}>
              <Timer size={18} color="#6B7280" style={styles.inputIcon} />
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowPackageHoursPicker(true)}
              >
                <Text style={[styles.pickerButtonText, formData.package_hours ? styles.pickerButtonTextActive : styles.pickerButtonTextPlaceholder]}>
                  {formData.package_hours ? `${formData.package_hours.hours} hrs (${formData.package_hours.km_range} km)` : 'Select package hours'}
                </Text>
                <ChevronDown size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={[styles.halfWidth, { marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>Cost per Hour *</Text>
                <View style={styles.inputContainer}>
                  <IndianRupee size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter cost per hour"
                    value={formData.cost_per_hour}
                    onChangeText={(value) => handleInputChange('cost_per_hour', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={[styles.halfWidth, { marginLeft: 8 }]}>
                <Text style={styles.fieldLabel}>Extra Cost per Hour</Text>
                <View style={styles.inputContainer}>
                  <IndianRupee size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter extra cost"
                    value={formData.extra_cost_per_hour}
                    onChangeText={(value) => handleInputChange('extra_cost_per_hour', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.halfWidth, { marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>Cost for Addon KM</Text>
                <View style={styles.inputContainer}>
                  <IndianRupee size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter addon km cost"
                    value={formData.cost_for_addon_km}
                    onChangeText={(value) => handleInputChange('cost_for_addon_km', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={[styles.halfWidth, { marginLeft: 8 }]}>
                <Text style={styles.fieldLabel}>Extra Cost for Addon KM</Text>
                <View style={styles.inputContainer}>
                  <IndianRupee size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter extra addon cost"
                    value={formData.extra_cost_for_addon_km}
                    onChangeText={(value) => handleInputChange('extra_cost_for_addon_km', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IndianRupee size={20} color="#1E40AF" />
              <Text style={styles.sectionTitle}>Pricing Details</Text>
            </View>
            
            <View style={styles.row}>
              <View style={[styles.halfWidth, { marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>Cost per KM *</Text>
                <View style={styles.inputContainer}>
                  <IndianRupee size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter cost per km"
                    value={formData.cost_per_km}
                    onChangeText={(value) => handleInputChange('cost_per_km', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={[styles.halfWidth, { marginLeft: 8 }]}>
                <Text style={styles.fieldLabel}>Extra Cost per KM</Text>
                <View style={styles.inputContainer}>
                  <IndianRupee size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter extra cost"
                    value={formData.extra_cost_per_km}
                    onChangeText={(value) => handleInputChange('extra_cost_per_km', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.halfWidth, { marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>Driver Allowance</Text>
                <View style={styles.inputContainer}>
                  <Car size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter driver allowance"
                    value={formData.driver_allowance}
                    onChangeText={(value) => handleInputChange('driver_allowance', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={[styles.halfWidth, { marginLeft: 8 }]}>
                <Text style={styles.fieldLabel}>Extra Driver Allowance</Text>
                <View style={styles.inputContainer}>
                  <Car size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter extra allowance"
                    value={formData.extra_driver_allowance}
                    onChangeText={(value) => handleInputChange('extra_driver_allowance', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.halfWidth, { marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>Permit Charges</Text>
                <View style={styles.inputContainer}>
                  <FileText size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter permit charges"
                    value={formData.permit_charges}
                    onChangeText={(value) => handleInputChange('permit_charges', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={[styles.halfWidth, { marginLeft: 8 }]}>
                <Text style={styles.fieldLabel}>Extra Permit Charges</Text>
                <View style={styles.inputContainer}>
                  <FileText size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter extra charges"
                    value={formData.extra_permit_charges}
                    onChangeText={(value) => handleInputChange('extra_permit_charges', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.halfWidth, { marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>Hill Charges</Text>
                <View style={styles.inputContainer}>
                  <Mountain size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter hill charges"
                    value={formData.hill_charges}
                    onChangeText={(value) => handleInputChange('hill_charges', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={[styles.halfWidth, { marginLeft: 8 }]}>
                <Text style={styles.fieldLabel}>Night Charges</Text>
                <View style={styles.inputContainer}>
                  <IndianRupee size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter night charges"
                    value={formData.night_charges}
                    onChangeText={(value) => handleInputChange('night_charges', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {!formData.toll_charge_update && (
              <>
                <Text style={styles.fieldLabel}>Toll Charges</Text>
                <View style={styles.inputContainer}>
                  <IndianRupee size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter toll charges"
                    value={formData.toll_charges}
                    onChangeText={(value) => handleInputChange('toll_charges', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </>
            )}
          </View>
        )}

        {/* Additional Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Additional Notes</Text>
          </View>
          
          <Text style={styles.fieldLabel}>Pickup Notes (Optional)</Text>
          <View style={styles.inputContainer}>
            <FileText size={18} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter any special instructions"
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
            <Calculator size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>
              {isLoading ? 'Generating Quote...' : 'Get Quote'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.start_date_time}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={formData.start_date_time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}

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
              <X size={22} color="#5F6368" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            {tripTypes.map((type) => (
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
                <type.icon size={18} color={formData.trip_type === type.value ? "#1E40AF" : "#6B7280"} />
                <Text style={[
                  styles.modalOptionText,
                  formData.trip_type === type.value && styles.modalOptionTextActive
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

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
              <X size={22} color="#5F6368" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {carTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.modalOption,
                    formData.car_type === type && styles.modalOptionActive
                  ]}
                  onPress={() => {
                    handleInputChange("car_type", type);
                    setShowCarTypePicker(false);
                  }}
                >
                  <Car
                    size={18}
                    color={formData.car_type === type ? "#1E40AF" : "#6B7280"}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      formData.car_type === type && styles.modalOptionTextActive
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Package Hours Picker Modal */}
      <Modal
        visible={showPackageHoursPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Package Hours</Text>
            <TouchableOpacity
              onPress={() => setShowPackageHoursPicker(false)}
              style={styles.closeButton}
            >
              <X size={22} color="#5F6368" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            {packageHoursOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalOption,
                  formData.package_hours?.hours === option.hours && formData.package_hours?.km_range === option.km_range && styles.modalOptionActive
                ]}
                onPress={() => {
                  handleInputChange('package_hours', option);
                  setShowPackageHoursPicker(false);
                }}
              >
                <Timer size={18} color={formData.package_hours?.hours === option.hours && formData.package_hours?.km_range === option.km_range ? "#8B5A3C" : "#6B7280"} />
                <Text style={[
                  styles.modalOptionText,
                  formData.package_hours?.hours === option.hours && formData.package_hours?.km_range === option.km_range && styles.modalOptionTextActive
                ]}>
                  {option.hours} hours ({option.km_range} km range)
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {activeLocationField ? `Select ${getLocationLabel(activeLocationField)}` : 'Select Location'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowLocationPicker(false)}
              style={styles.closeButton}
            >
              <X size={22} color="#5F6368" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {mockLocations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    if (activeLocationField) {
                      handleLocationChange(activeLocationField, location);
                    }
                    setShowLocationPicker(false);
                  }}
                >
                  <MapPin size={18} color="#6B7280" />
                  <Text style={styles.modalOptionText}>{location}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 8,
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
    marginLeft: 4,
  },
  reorderHint: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  addLocationButton: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#1E40AF',
    borderStyle: 'dashed',
  },
  addLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  locationNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  locationInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#202124',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  halfWidth: {
    flex: 1,
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    width: '48%',
  },
  timeUnit: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  pickerButtonText: {
    fontSize: 14,
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
  locationInputText: {
    fontSize: 14,
  },
  locationInputTextActive: {
    color: '#202124',
    fontWeight: '500',
  },
  locationInputTextPlaceholder: {
    color: '#9AA0A6',
  },
  quoteButton: {
    marginVertical: 24,
    borderRadius: 14,
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
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
    fontSize: 18,
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
    paddingVertical: 14,
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
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
});