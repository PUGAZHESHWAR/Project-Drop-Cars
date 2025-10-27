import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin,
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  IndianRupee,
  Send,
  X,
  FileText,
  Mountain,
  ChevronDown,
  Truck,
  Route,
  Timer
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const cities = [
  'Chennai',
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Vellore',
  'Salem',
  'Coimbatore',
  'Madurai',
  'Trichy',
  'Polur',
  'Tiruvannamalai'
];

interface QuoteReviewProps {
  visible: boolean;
  onClose: () => void;
  quoteData: any;
  onConfirmOrder: (sendTo: string, nearCity?: string) => Promise<void>;
  isLoading: boolean;
}

export default function QuoteReview({
  visible,
  onClose,
  quoteData,
  onConfirmOrder,
  isLoading
}: QuoteReviewProps) {
  const [showSendToPicker, setShowSendToPicker] = useState(false);
  const [showNearCityPicker, setShowNearCityPicker] = useState(false);
  const [sendTo, setSendTo] = useState<'ALL' | 'NEAR_CITY'>('ALL');
  const [nearCity, setNearCity] = useState('');
  console.log('Quote Data:', quoteData);
  const handleConfirmOrder = async () => {
    if (sendTo === 'NEAR_CITY' && !nearCity) {
      Alert.alert('Error', 'Please select a near city when sending to NEAR_CITY');
      return;
    }

    try {
      await onConfirmOrder(sendTo, nearCity);
    } catch (error) {
      Alert.alert('Error', 'Failed to create order. Please try again.');
    }
  };

  const formatDateTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
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

  if (!quoteData) return null;

  const isHourlyRental = quoteData.echo?.trip_type === 'Hourly Rental';

  const getLocationEntries = () => {
    return Object.entries(quoteData.echo.pickup_drop_location)
      .sort(([a], [b]) => parseInt(a) - parseInt(b));
  };
  console.log('Data For Houry Rental :',quoteData);
  console.log('Trip Type :',isHourlyRental);
  const getLocationLabel = (index: string, isLast: boolean, tripType: string) => {
    const position = parseInt(index);
    if (tripType === 'Hourly Rental') return 'Pickup Location';
    if (position === 0) return 'Pickup Location';
    if (tripType === 'Round Trip' && isLast) return 'Return to Pickup';
    if (isLast) return 'Final Destination';
    return `Stop ${position}`;
  };

  const locations = getLocationEntries();
  const tripType = quoteData.echo.trip_type;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {/* Enhanced Header with Trip Type Colors */}
        <LinearGradient
          colors={
            tripType === 'Hourly Rental'
              ? ['#8B5A3C', '#A0522D', '#CD853F']
              : tripType === 'Round Trip' 
              ? ['#cc80d1ff', '#b123caff', '#C084FC']
              : tripType === 'Multy City'
              ? ['#1d83b3ff', '#4d749dff', '#4075d8ff'] 
              : ['#1E40AF', '#3B82F6', '#60A5FA']
          }
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.headerTitle, tripType === 'Hourly Rental' && { color: '#e9e1dcff' }]}>
                Quote Review
              </Text>
              <Text style={[styles.headerSubtitle, tripType === 'Hourly Rental' && { color: '#e9e1dcff' }]}>
                {tripType} Journey
              </Text>
            </View>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Customer Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={24} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} />
              <Text style={styles.sectionTitle}>Customer Details</Text>
            </View>
            
            <View style={styles.card}>
              <View style={styles.detailRow}>
                <User size={20} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} style={styles.detailIcon} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Customer Name</Text>
                  <Text style={styles.detailValue}>{quoteData.echo.customer_name}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Phone size={20} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} style={styles.detailIcon} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Phone Number</Text>
                  <Text style={styles.detailValue}>{quoteData.echo.customer_number}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Trip Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Car size={24} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} />
              <Text style={styles.sectionTitle}>Trip Details</Text>
            </View>
            
            <View style={styles.card}>
              <View style={styles.detailRow}>
                <Car size={20} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} style={styles.detailIcon} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Car Type</Text>
                  <Text style={styles.detailValue}>{quoteData.echo.car_type}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Calendar size={20} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} style={styles.detailIcon} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Journey Date</Text>
                  <Text style={styles.detailValue}>{formatDateTime(quoteData.echo.start_date_time).date}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Clock size={20} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} style={styles.detailIcon} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Departure Time</Text>
                  <Text style={styles.detailValue}>{formatDateTime(quoteData.echo.start_date_time).time}</Text>
                </View>
              </View>

              {isHourlyRental && (
                <View style={styles.detailRow}>
                  <Timer size={20} color="#8B5A3C" style={styles.detailIcon} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Package Hours</Text>
                    <Text style={styles.detailValue}>{quoteData.echo.package_hours?.hours || 0} hours ({quoteData.echo.package_hours?.km_range || 0} km)</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Enhanced Route Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Route size={24} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} />
              <Text style={styles.sectionTitle}>Route Details</Text>
              <View style={styles.routeBadge}>
                <Text style={styles.routeBadgeText}>{locations.length} stop{locations.length > 1 ? 's' : ''}</Text>
              </View>
            </View>
            
            <View style={styles.card}>
              {locations.map(([index, location], position) => (
                <View key={index} style={[styles.routeItem, position === locations.length - 1 && styles.lastRouteItem]}>
                  <View style={styles.routeIndicator}>
                    <View style={[
                      styles.routeDot,
                      position === 0 ? styles.routeDotStart : 
                      position === locations.length - 1 ? styles.routeDotEnd : styles.routeDotMiddle
                    ]} />
                    {position < locations.length - 1 && <View style={styles.routeLine} />}
                  </View>
                  <View style={styles.routeContent}>
                    <Text style={styles.routeLabel}>
                      {getLocationLabel(index, position === locations.length - 1, tripType)}
                    </Text>
                    <Text style={styles.routeLocation}>{String(location)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Trip Summary Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              {isHourlyRental ? (
                <Timer size={24} color="#8B5A3C" />
              ) : (
                <Truck size={24} color="#1E40AF" />
              )}
              <Text style={styles.sectionTitle}>Trip Summary</Text>
            </View>
            
            <View style={styles.summaryCard}>
              {isHourlyRental ? (
                <>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Package Hours</Text>
                    <Text style={styles.summaryValue}>{quoteData.echo.package_hours?.hours || 0} hours ({quoteData.echo.package_hours?.km_range || 0} km)</Text>
                  </View>
{/*                   
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Cost per Hour</Text>
                    <Text style={styles.summaryValue}>₹{quoteData.echo.cost_per_hour}</Text>
                  </View> */}

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Max Time(Report Details)</Text>
                    <Text style={styles.summaryValue}>{quoteData.echo.max_time_to_assign_order} Min</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Driver(Update Toll)</Text>
                    <Text style={styles.summaryValue}>{quoteData.echo.toll_charge_update ? "YES" : "NO"}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Distance</Text>
                    <Text style={styles.summaryValue}>{quoteData.fare.total_km} km</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Estimated Time</Text>
                    <Text style={styles.summaryValue}>{quoteData.fare.trip_time || 'Calculating...'}</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Max Time(Report Details)</Text>
                    <Text style={styles.summaryValue}>{quoteData.echo.max_time_to_assign_order} Min</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Driver(Update Toll)</Text>
                    <Text style={styles.summaryValue}>{quoteData.echo.toll_charge_update ? "YES" : "NO"}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Pricing Breakdown Section Vendor */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IndianRupee size={24} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} />
              <Text style={styles.sectionTitle}>Customer Pricing</Text>
            </View>
            
            <View style={styles.priceCard}>
              {isHourlyRental ? (
                <>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Customer Amount (₹{(quoteData.echo.cost_per_hour+ quoteData.echo.extra_cost_per_hour)} X {quoteData.echo.package_hours.hours} )</Text>
                    <Text style={styles.priceValue}>₹{quoteData.fare.vendor_amount}</Text>
                  </View>

                  {quoteData.echo.extra_cost_per_hour > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Maximum Km</Text>
                      <Text style={styles.priceValue}>{quoteData.echo.package_hours.km_range} KM</Text>
                    </View>
                  )}

                  {quoteData.echo.extra_cost_per_hour > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Extra Price (Addon KM)</Text>
                      <Text style={styles.priceValue}>₹{(quoteData.echo.cost_for_addon_km+quoteData.echo.extra_cost_for_addon_km)}</Text>
                    </View>
                  )}

                  {/* {quoteData.echo.extra_additional_cost_per_hour > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Extra Additional Cost per Hour</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.extra_additional_cost_per_hour}</Text>
                    </View>
                  )} */}

                  <View style={[styles.priceRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Estimate Price</Text>
                    <Text style={styles.totalValue}>₹{quoteData.fare.vendor_amount}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Customer Amount ({quoteData.fare.total_km} km × ₹{quoteData.echo.cost_per_km+quoteData.echo.extra_cost_per_km})</Text>
                    <Text style={styles.priceValue}>₹{quoteData.fare.base_km_amount+Math.round(quoteData.fare.total_km * quoteData.echo.extra_cost_per_km)}</Text>
                  </View>
                
                  {quoteData.echo.driver_allowance > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Driver Allowance</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.driver_allowance+quoteData.echo.extra_driver_allowance}</Text>
                    </View>
                  )}

                  
                  {quoteData.echo.permit_charges > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Permit Charges</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.permit_charges+quoteData.echo.extra_permit_charges}</Text>
                    </View>
                  )}
                  
                  {quoteData.echo.hill_charges > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Hill Charges</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.hill_charges}</Text>
                    </View>
                  )}

                  {quoteData.echo.toll_charges > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Toll Charges</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.toll_charges}</Text>
                    </View>
                  )}
                  
                  <View style={[styles.priceRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>₹{quoteData.fare.total_amount}</Text>
                  </View>
                  
                </>
              )}
            </View>
          </View>


          {/* Pricing Breakdown Section Driver */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IndianRupee size={24} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} />
              <Text style={styles.sectionTitle}>Driver Pricing</Text>
            </View>
            
            <View style={styles.priceCard}>
              {isHourlyRental ? (
                <>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Driver Amount (₹{(quoteData.echo.cost_per_hour)} X {quoteData.echo.package_hours.hours} )</Text>
                    <Text style={styles.priceValue}>₹{quoteData.fare.estimate_price}</Text>
                  </View>

                  {quoteData.echo.extra_cost_per_hour > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Maximum Km</Text>
                      <Text style={styles.priceValue}>{quoteData.echo.package_hours.km_range} KM</Text>
                    </View>
                  )}

                  {quoteData.echo.cost_for_addon_km > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Cost for Addon KM</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.cost_for_addon_km}</Text>
                    </View>
                  )}

                  {/* {quoteData.echo.extra_cost_for_addon_km > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Extra Cost for Addon KM</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.extra_cost_for_addon_km}</Text>
                    </View>
                  )} */}

                  {/* {quoteData.echo.extra_additional_cost_per_hour > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Extra Additional Cost per Hour</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.extra_additional_cost_per_hour}</Text>
                    </View>
                  )} */}

                  <View style={[styles.priceRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Estimate Price</Text>
                    <Text style={styles.totalValue}>₹{quoteData.fare.estimate_price}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Driver Amount ({quoteData.fare.total_km} km × ₹{quoteData.echo.cost_per_km})</Text>
                    <Text style={styles.priceValue}>₹{quoteData.fare.base_km_amount}</Text>
                  </View>
                  
                  {quoteData.echo.driver_allowance > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Driver Allowance</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.driver_allowance}</Text>
                    </View>
                  )}
                  
                  {quoteData.echo.permit_charges > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Permit Charges</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.permit_charges}</Text>
                    </View>
                  )}
                  
                  {quoteData.echo.hill_charges > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Hill Charges</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.hill_charges}</Text>
                    </View>
                  )}

                  {quoteData.echo.toll_charges > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Toll Charges</Text>
                      <Text style={styles.priceValue}>₹{quoteData.echo.toll_charges}</Text>
                    </View>
                  )}
                  
                  <View style={[styles.priceRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>₹{quoteData.fare.base_km_amount+quoteData.fare.driver_allowance+quoteData.fare.permit_charges+quoteData.fare.hill_charges+quoteData.fare.toll_charges}</Text>
                  </View>
                  {quoteData.echo.toll_charges > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Vendor Basic Commessions</Text>
                      {/* <Text style={styles.priceValue}>₹{Math.round((quoteData.fare.base_km_amount)*quoteData.fare.Commission_percent/100)}</Text> */}
                      <Text style={[styles.priceValue, { color: 'red' }]}>
                        ₹{Math.round((quoteData.fare.base_km_amount) * quoteData.fare.Commission_percent / 100)}
                      </Text>
                      {/* <Text style={styles.priceValue}>₹{100}</Text> */}
                    </View>
                  )}
                  <View style={[styles.priceRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Driver Net Amount</Text>
                    <Text style={styles.totalValue}>₹{quoteData.fare.base_km_amount+quoteData.fare.driver_allowance+quoteData.fare.permit_charges+quoteData.fare.hill_charges+quoteData.fare.toll_charges-(Math.round((quoteData.fare.base_km_amount)*quoteData.fare.Commission_percent/100))}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Driver Assignment */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Send size={24} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} />
              <Text style={styles.sectionTitle}>Driver Assignment</Text>
            </View>
            
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowSendToPicker(true)}
            >
              <Send size={20} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} style={styles.pickerIcon} />
              <Text style={styles.pickerText}>
                {sendTo === 'NEAR_CITY' ? `NEAR CITY - ${nearCity || 'Select City'}` : 'ALL DRIVERS'}
              </Text>
              <ChevronDown size={20} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} />
            </TouchableOpacity>

            {sendTo === 'NEAR_CITY' && (
              <TouchableOpacity
                style={[styles.pickerButton, { marginTop: 12 }]}
                onPress={() => setShowNearCityPicker(true)}
              >
                <MapPin size={20} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} style={styles.pickerIcon} />
                <Text style={[styles.pickerText, !nearCity && styles.pickerPlaceholder]}>
                  {nearCity || 'Select Near City'}
                </Text>
                <ChevronDown size={20} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} />
              </TouchableOpacity>
            )}
          </View>

          {quoteData.echo.pickup_notes && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FileText size={24} color={tripType === 'Hourly Rental' ? "#8B5A3C" : "#1E40AF"} />
                <Text style={styles.sectionTitle}>Additional Notes</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.notesText}>{quoteData.echo.pickup_notes}</Text>
              </View>
            </View>
          )}

          {/* Confirm Button */}
          <TouchableOpacity 
            style={[styles.confirmButton, isLoading && styles.disabledButton]} 
            onPress={handleConfirmOrder}
            disabled={isLoading}
          >
            <LinearGradient
              colors={
                tripType === 'Hourly Rental'
                  ? ['#8B5A3C', '#A0522D']
                  : tripType === 'Round Trip' 
                  ? ['#7C3AED', '#A855F7']
                  : tripType === 'Multy City'
                  ? ['#5196dfff', '#4357cdff'] 
                  : ['#059669', '#10B981']
              }
              style={styles.gradientButton}
            >
              <Send size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Order...' : 'Confirm & Create Order'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Send To Picker Modal */}
        <Modal
          visible={showSendToPicker}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Driver Assignment</Text>
              <TouchableOpacity
                onPress={() => setShowSendToPicker(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#5F6368" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={[styles.modalOption, sendTo === 'ALL' && styles.modalOptionActive]}
                onPress={() => {
                  setSendTo('ALL');
                  setNearCity('');
                  setShowSendToPicker(false);
                }}
              >
                <Send size={20} color={sendTo === 'ALL' ? "#1E40AF" : "#6B7280"} />
                <View style={styles.modalOptionContent}>
                  <Text style={[styles.modalOptionText, sendTo === 'ALL' && styles.modalOptionTextActive]}>
                    ALL DRIVERS
                  </Text>
                  <Text style={styles.modalOptionSubtext}>
                    Send to all available drivers
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalOption, sendTo === 'NEAR_CITY' && styles.modalOptionActive]}
                onPress={() => {
                  setSendTo('NEAR_CITY');
                  setShowSendToPicker(false);
                }}
              >
                <MapPin size={20} color={sendTo === 'NEAR_CITY' ? "#1E40AF" : "#6B7280"} />
                <View style={styles.modalOptionContent}>
                  <Text style={[styles.modalOptionText, sendTo === 'NEAR_CITY' && styles.modalOptionTextActive]}>
                    NEAR CITY
                  </Text>
                  <Text style={styles.modalOptionSubtext}>
                    Send to drivers near specific city
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Near City Picker Modal */}
        <Modal
          visible={showNearCityPicker}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Near City</Text>
              <TouchableOpacity
                onPress={() => setShowNearCityPicker(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#5F6368" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[styles.modalOption, nearCity === city && styles.modalOptionActive]}
                  onPress={() => {
                    setNearCity(city);
                    setShowNearCityPicker(false);
                  }}
                >
                  <MapPin size={20} color={nearCity === city ? "#1E40AF" : "#6B7280"} />
                  <Text style={[styles.modalOptionText, nearCity === city && styles.modalOptionTextActive]}>
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e9eeffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e9eeffff',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#e9eeffff',
    borderRadius: 20,
  },
  placeholder: {
    width: 40,
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
  routeBadge: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  routeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  detailIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#5F6368',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#202124',
    fontWeight: '600',
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  lastRouteItem: {
    marginBottom: 0,
  },
  routeIndicator: {
    alignItems: 'center',
    marginRight: 16,
    width: 24,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
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
    height: 32,
    backgroundColor: '#D1D5DB',
    position: 'absolute',
    top: 12,
  },
  routeContent: {
    flex: 1,
    paddingTop: -4,
  },
  routeLabel: {
    fontSize: 14,
    color: '#5F6368',
    fontWeight: '500',
    marginBottom: 4,
  },
  routeLocation: {
    fontSize: 16,
    color: '#202124',
    fontWeight: '600',
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E8F4FD',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#5F6368',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '600',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E8EAED',
    backgroundColor: '#F8FDF9',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#5F6368',
    fontWeight: '500',
    flex: 1,
  },
  priceValue: {
    fontSize: 16,
    color: '#202124',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 18,
    color: '#202124',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 22,
    color: '#059669',
    fontWeight: 'bold',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pickerIcon: {
    marginRight: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
    fontWeight: '500',
  },
  pickerPlaceholder: {
    color: '#9AA0A6',
  },
  notesText: {
    fontSize: 16,
    color: '#202124',
    lineHeight: 24,
  },
  confirmButton: {
    marginVertical: 32,
    borderRadius: 16,
    overflow: 'hidden',
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
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#202124',
  },
  modalCloseButton: {
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
  modalOptionContent: {
    flex: 1,
    marginLeft: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  modalOptionTextActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  modalOptionSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});