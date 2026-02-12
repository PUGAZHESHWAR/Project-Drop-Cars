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
import { User, Phone, MapPin, ArrowRight, Lock, Hash } from 'lucide-react-native';

interface PersonalDetailsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}



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
  // Remove any non-digit characters and +91 prefix
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  
  // Return only 10 digits (no +91 prefix)
  if (cleanPhone.length === 10) {
    return cleanPhone;
  }
  
  // If it's more than 10 digits, return the last 10
  if (cleanPhone.length > 10) {
    return cleanPhone.slice(-10);
  }
  
  // Otherwise return the cleaned number
  return cleanPhone;
};

export default function PersonalDetailsStep({ data, onUpdate, onNext }: PersonalDetailsStepProps) {
  const [fullName, setFullName] = useState(data.fullName || '');
  const [primaryMobile, setPrimaryMobile] = useState(data.primaryMobile || '');
  const [secondaryMobile, setSecondaryMobile] = useState(data.secondaryMobile || '');
  const [password, setPassword] = useState(data.password || '');
  const [address, setAddress] = useState(data.address || '');
  const [aadharNumber, setAadharNumber] = useState(data.aadharNumber || '');
  const [organizationId, setOrganizationId] = useState(data.organizationId || 'org_001');




  const handleNext = () => {
    // Remove blocking client-side validations to allow signup without constraints
    const personalData = {
      fullName,
      primaryMobile,
      secondaryMobile,
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
            placeholderTextColor="#9CA3AF"
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
            placeholderTextColor="#9CA3AF"
            value={primaryMobile}
            onChangeText={(text) => {
              // Allow only digits, max 10 digits
              const cleanText = text.replace(/\D/g, '');
              if (cleanText.length <= 10) {
                setPrimaryMobile(cleanText);
              }
            }}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
        {/* Helper/error hints removed to avoid blocking UX */}

        {/* Secondary Mobile */}
        <View style={styles.inputGroup}>
          <Phone color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Secondary Mobile Number (Optional)"
            placeholderTextColor="#9CA3AF"
            value={secondaryMobile}
            onChangeText={(text) => {
              // Allow only digits, max 10 digits
              const cleanText = text.replace(/\D/g, '');
              if (cleanText.length <= 10) {
                setSecondaryMobile(cleanText);
              }
            }}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Lock color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
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
            placeholderTextColor="#9CA3AF"
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
            placeholderTextColor="#9CA3AF"
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
            placeholderTextColor="#9CA3AF"
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
    color: '#1F2937',
    textAlign: 'left'
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
