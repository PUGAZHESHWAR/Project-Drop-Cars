import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { User, Phone, MapPin, ArrowRight, CreditCard, Lock, Hash } from 'lucide-react-native';

interface PersonalDetailsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}


const paymentMethods = ["GPay", "PhonePe"];

// Helper function to validate Indian mobile numbers
const validateIndianMobile = (phone: string): boolean => {
  // Remove +91 prefix if present
  const cleanPhone = phone.replace(/^\+91/, '');
  
  // Check if it's exactly 10 digits and starts with 6, 7, 8, or 9
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

// Helper function to format phone number for display
const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If it's 10 digits, add +91 prefix
  if (cleanPhone.length === 10) {
    return `+91${cleanPhone}`;
  }
  
  // If it already has +91 and 10 digits, return as is
  if (phone.startsWith('+91') && cleanPhone.length === 13) {
    return phone;
  }
  
  // Otherwise return the cleaned number
  return cleanPhone;
};

export default function PersonalDetailsStep({ data, onUpdate, onNext }: PersonalDetailsStepProps) {
  const [fullName, setFullName] = useState(data.fullName || '');
  const [primaryMobile, setPrimaryMobile] = useState(data.primaryMobile || '');
  const [secondaryMobile, setSecondaryMobile] = useState(data.secondaryMobile || '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(data.paymentMethod || '');
  const [paymentNumber, setPaymentNumber] = useState(data.paymentNumber || '');
  const [password, setPassword] = useState(data.password || '');
  const [address, setAddress] = useState(data.address || '');
  const [aadharNumber, setAadharNumber] = useState(data.aadharNumber || '');
  const [organizationId, setOrganizationId] = useState(data.organizationId || 'org_001');




  const handleNext = () => {
    if (!fullName || !primaryMobile || !password || !address || !aadharNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!validateIndianMobile(primaryMobile)) {
      Alert.alert('Error', 'Please enter a valid primary mobile number starting with 6, 7, 8, or 9');
      return;
    }

    if (secondaryMobile && !validateIndianMobile(secondaryMobile)) {
      Alert.alert('Error', 'Please enter a valid secondary mobile number starting with 6, 7, 8, or 9');
      return;
    }

    if (aadharNumber.length !== 12) {
      Alert.alert('Error', 'Please enter a valid 12-digit Aadhar number');
      return;
    }

    if (!selectedPaymentMethod || !paymentNumber) {
      Alert.alert('Error', 'Please select payment method and enter payment number');
      return;
    }

    if (!validateIndianMobile(paymentNumber)) {
      Alert.alert('Error', 'Please enter a valid payment number starting with 6, 7, 8, or 9');
      return;
    }

    const personalData = {
      fullName,
      primaryMobile,
      secondaryMobile,
      paymentMethod: selectedPaymentMethod,
      paymentNumber,
      password,
      address,
      aadharNumber,
      organizationId,

    };

    onUpdate(personalData);
    onNext();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Personal Details</Text>
      <Text style={styles.subtitle}>Let's start with your basic information</Text>

      <View style={styles.form}>
        {/* Full Name */}
        <View style={styles.inputGroup}>
          <User color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Primary Mobile */}
        <View style={styles.inputGroup}>
          <Phone color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Primary Mobile Number (10 digits)"
            value={primaryMobile}
            onChangeText={(text) => {
              // Allow only digits and +91 prefix
              const cleanText = text.replace(/[^\d+]/g, '');
              if (cleanText.startsWith('+91') || cleanText.length <= 10) {
                setPrimaryMobile(cleanText);
              }
            }}
            keyboardType="phone-pad"
            maxLength={13}
          />
        </View>
        <Text style={styles.helperText}>Enter 10-digit mobile number starting with 6, 7, 8, or 9</Text>
        {primaryMobile && !validateIndianMobile(primaryMobile) && (
          <Text style={styles.errorText}>Must start with 6, 7, 8, or 9</Text>
        )}

        {/* Secondary Mobile */}
        <View style={styles.inputGroup}>
          <Phone color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Secondary Mobile Number (Optional)"
            value={secondaryMobile}
            onChangeText={(text) => {
              // Allow only digits and +91 prefix
              const cleanText = text.replace(/[^\d+]/g, '');
              if (cleanText.startsWith('+91') || cleanText.length <= 10) {
                setSecondaryMobile(cleanText);
              }
            }}
            keyboardType="phone-pad"
            maxLength={13}
          />
        </View>
        {secondaryMobile && (
          <Text style={styles.helperText}>Enter 10-digit mobile number starting with 6, 7, 8, or 9</Text>
        )}
        {secondaryMobile && !validateIndianMobile(secondaryMobile) && (
          <Text style={styles.errorText}>Must start with 6, 7, 8, or 9</Text>
        )}

        {/* Payment Method Selection */}
        <Text style={styles.label}>Select Payment Method *</Text>
        <View style={styles.paymentMethodContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentOption, 
                selectedPaymentMethod === method && styles.selectedPayment
              ]}
              onPress={() => setSelectedPaymentMethod(method)}
            >
              <Text style={[
                styles.paymentOptionText,
                selectedPaymentMethod === method && styles.selectedPaymentText
              ]}>
                {selectedPaymentMethod === method ? '✔ ' : ''}{method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Number */}
        <View style={styles.inputGroup}>
          <CreditCard color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder={`${selectedPaymentMethod || 'GPay/PhonePe'} Number *`}
            value={paymentNumber}
            onChangeText={(text) => {
              // Allow only digits and +91 prefix
              const cleanText = text.replace(/[^\d+]/g, '');
              if (cleanText.startsWith('+91') || cleanText.length <= 10) {
                setPaymentNumber(cleanText);
              }
            }}
            keyboardType="phone-pad"
            maxLength={13}
          />
        </View>
        <Text style={styles.helperText}>Enter 10-digit mobile number starting with 6, 7, 8, or 9</Text>
        {paymentNumber && !validateIndianMobile(paymentNumber) && (
          <Text style={styles.errorText}>Must start with 6, 7, 8, or 9</Text>
        )}

        {/* Password */}
        <View style={styles.inputGroup}>
          <Lock color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Address */}
        <View style={styles.inputGroup}>
          <MapPin color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Aadhar Number */}
        <View style={styles.inputGroup}>
          <Hash color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Aadhar Number"
            value={aadharNumber}
            onChangeText={setAadharNumber}
            keyboardType="numeric"
            maxLength={12}
          />
        </View>

        {/* Organization ID */}
        <View style={styles.inputGroup}>
          <Hash color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Organization ID"
            value={organizationId}
            onChangeText={setOrganizationId}
          />
        </View>



        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <ArrowRight color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingBottom: 20,
  },
  title: { 
    fontSize: 24, 
    fontFamily: 'Inter-Bold', 
    color: '#1F2937', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular', 
    color: '#6B7280', 
    marginBottom: 32 
  },
  form: { 
    flex: 1 
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 16, 
    fontFamily: 'Inter-Medium', 
    color: '#1F2937' 
  },
  label: { 
    fontSize: 16, 
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 10,
    marginTop: 8,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  paymentOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  selectedPayment: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  paymentOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedPaymentText: {
    color: '#FFFFFF',
  },

  nextButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  nextButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontFamily: 'Inter-SemiBold', 
    marginRight: 8 
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginLeft: 44
  },
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginLeft: 44,
    marginBottom: 8
  },
});
