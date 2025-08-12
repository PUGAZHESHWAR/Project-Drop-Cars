import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWallet } from '@/contexts/WalletContext';
import { Camera, ArrowLeft, Check, IndianRupee } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EndTripScreen() {
  const [endKm, setEndKm] = useState('');
  const [odometerPhoto, setOdometerPhoto] = useState<string | null>(null);
  const [thanked, setThanked] = useState(false);
  const { deductMoney } = useWallet();
  const router = useRouter();

  // Dummy trip data - in real app this would come from current trip state
  const startKm = 10230;
  const farePerKm = 10;

  const takeOdometerPhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setOdometerPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const calculateFare = () => {
    if (!endKm) return 0;
    const totalKm = parseInt(endKm) - startKm;
    return totalKm * farePerKm;
  };

  const handleEndTrip = () => {
    if (!endKm || !odometerPhoto || !thanked) {
      Alert.alert('Error', 'Please complete all requirements');
      return;
    }

    const totalKm = parseInt(endKm) - startKm;
    const totalFare = calculateFare();

    if (totalKm <= 0) {
      Alert.alert('Error', 'End KM must be greater than start KM');
      return;
    }

    // Deduct commission
    deductMoney(50, 'Trip Commission');

    Alert.alert(
      'Trip Completed',
      `Trip completed successfully!\n\nDistance: ${totalKm} km\nTotal Fare: ₹${totalFare}\nCommission: ₹50`,
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>End Trip</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Complete Your Trip</Text>
        <Text style={styles.subtitle}>Upload final odometer photo and reading</Text>

        {/* Trip Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trip Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Start KM:</Text>
            <Text style={styles.summaryValue}>{startKm.toLocaleString()}</Text>
          </View>
          {endKm && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>End KM:</Text>
                <Text style={styles.summaryValue}>{parseInt(endKm).toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Distance:</Text>
                <Text style={styles.summaryValue}>{parseInt(endKm) - startKm} km</Text>
              </View>
              <View style={[styles.summaryRow, styles.fareRow]}>
                <Text style={styles.fareLabel}>Total Fare:</Text>
                <View style={styles.fareContainer}>
                  <IndianRupee color="#10B981" size={16} />
                  <Text style={styles.fareValue}>{calculateFare()}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Thank Customer Checkbox */}
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setThanked(!thanked)}
        >
          <View style={[styles.checkbox, thanked && styles.checkedBox]}>
            {thanked && <Check color="#FFFFFF" size={16} />}
          </View>
          <Text style={styles.checkboxText}>Thank your customer for trusting you</Text>
        </TouchableOpacity>

        {/* Odometer Photo */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>End Odometer Photo</Text>
          {odometerPhoto ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: odometerPhoto }} style={styles.photo} />
              <TouchableOpacity style={styles.retakeButton} onPress={takeOdometerPhoto}>
                <Text style={styles.retakeButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.photoButton} onPress={takeOdometerPhoto}>
              <Camera color="#6B7280" size={32} />
              <Text style={styles.photoButtonText}>Take Odometer Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* End KM Input */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Ending Kilometer</Text>
          <TextInput
            style={styles.kmInput}
            placeholder="Enter end KM reading (e.g., 10380)"
            value={endKm}
            onChangeText={setEndKm}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.endButton, (!endKm || !odometerPhoto || !thanked) && styles.disabledButton]}
          onPress={handleEndTrip}
          disabled={!endKm || !odometerPhoto || !thanked}
        >
          <Text style={styles.endButtonText}>Complete Trip</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  fareRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
  },
  fareLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  fareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareValue: {
    marginLeft: 4,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
  },
  photoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  photoButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  photoButtonText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  retakeButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  inputSection: {
    marginBottom: 32,
  },
  kmInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  endButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  endButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});