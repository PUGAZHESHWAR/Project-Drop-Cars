import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Smartphone, Lock, ArrowRight } from 'lucide-react-native';
import WelcomeScreen from '@/components/WelcomeScreen';
import AccountVerificationScreen from '@/components/AccountVerificationScreen';
import axiosInstance from '@/app/api/axiosInstance';
import { extractUserIdFromJWT } from '@/utils/jwtDecoder';
import * as SecureStore from 'expo-secure-store'; 

// Helper function to validate Indian mobile numbers
const validateIndianMobile = (phone: string): boolean => {
  // Remove +91 prefix if present
  const cleanPhone = phone.replace(/^\+91/, '');
  
  // Check if it's exactly 10 digits and starts with 6, 7, 8, or 9
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

// Helper function to format phone number for backend
const formatForBackend = (phone: string) => {
  const digitsOnly = (phone || '').replace(/^\+91/, '').replace(/\D/g, '');
  const ten = digitsOnly.slice(-10);
  return { ten }; // Only return 10 digits, no +91
};

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAccountVerification, setShowAccountVerification] = useState(false);
  const [accountStatus, setAccountStatus] = useState<string>('');
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please enter both phone number and password');
      return;
    }

    // Validate phone number format
    if (!validateIndianMobile(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid mobile number starting with 6, 7, 8, or 9');
      return;
    }

    setLoading(true);

    try {
      // Build backend format (10 digits only)
      const { ten } = formatForBackend(phoneNumber);
      
      const payload = {
        mobile_number: ten, // Send 10 digits only
        primary_number: ten, // Send 10 digits only
        password: password,
      } as any;

      console.log('🔐 Attempting login with payload:', { ...payload, password: '***' });

      // Make actual API call to backend
      const response = await axiosInstance.post('/api/users/vehicleowner/login', payload);

      console.log('✅ Login successful:', response.data);

      // Extract user ID from JWT token
      const token = response.data.access_token;
      let userId = extractUserIdFromJWT(token);
      
      if (!userId) {
        console.warn('⚠️ Could not extract user ID from JWT, using fallback ID');
        userId = 'e5b9edb1-b4bb-48b8-a662-f7fd00abb6eb'; // Use the UUID from your Postman
      } else {
        console.log('🔍 Extracted user ID from JWT:', userId);
      }
      
      // Create user object from response
      const userData = {
        id: userId,
        fullName: response.data.full_name || 'Driver',
        primaryMobile: phoneNumber,
        password: password,
        address: response.data.address || '',
        aadharNumber: response.data.aadhar_number || '',
        organizationId: response.data.organization_id || 'org_001',
        languages: response.data.languages || ['English'],
        documents: {}
      };

      // Login with the user data and token
      await login(userData, response.data.access_token);

      // Check account status first
      const accountStatus = response.data.account_status;
      const carCount = response.data.car_details_count ?? 0;
      const driverCount = response.data.car_driver_count ?? 0;
      
      console.log('🔍 Account status:', accountStatus);
      console.log('🔍 Car count:', carCount);
      console.log('🔍 Driver count:', driverCount);
      console.log('🔍 Full response data:', response.data);
      
      // FIRST: Check if user has uploaded any documents
      // Priority: Car first, then Driver
      if (carCount === 0) {
        // No cars uploaded - redirect to add car
        console.log('🚗 No cars uploaded, redirecting to add car page');
        router.replace('/add-car');
        return;
      }
      
      if (driverCount === 0) {
        // No drivers uploaded - redirect to add driver
        console.log('👤 No drivers uploaded, redirecting to add driver page');
        router.replace('/add-driver');
        return;
      }
      
      // SECOND: Now check account status (only if documents are uploaded)
      if (accountStatus?.toLowerCase() !== 'active') {
        // Documents uploaded but account is not active
        console.log('⏳ Documents uploaded, but account status is:', accountStatus);
        setAccountStatus(accountStatus);
        setShowAccountVerification(true);
        return;
      }
      
      // THIRD: If documents are uploaded and account is active, proceed to dashboard
      console.log('✅ Documents uploaded and account active, proceeding to dashboard');
      setShowWelcome(true);

    } catch (error: any) {
      console.error('❌ Login failed:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = error.response?.data?.detail || 'Invalid mobile number or password.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Invalid data provided. Please check your input.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };




  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    router.replace('/(tabs)');
  };

  const handleRefreshStatus = async () => {
    try {
      setLoading(true);
      const { ten } = formatForBackend(phoneNumber);
      // Make a request to check current account status
      const response = await axiosInstance.post('/api/users/vehicleowner/login', {
        mobile_number: ten,
        primary_number: ten,
        password: password
      });
      
      const newStatus = response.data.account_status;
      const carCount = response.data.car_details_count ?? 0;
      const driverCount = response.data.car_driver_count ?? 0;
      
      setAccountStatus(newStatus);
      
      // Use the same logic as login
      // FIRST: Check if user has uploaded any documents
      // Priority: Car first, then Driver
      if (carCount === 0) {
        // No cars uploaded - redirect to add car
        console.log('🚗 No cars uploaded, redirecting to add car page');
        setShowAccountVerification(false);
        router.replace('/add-car');
        return;
      }
      
      if (driverCount === 0) {
        // No drivers uploaded - redirect to add driver
        console.log('👤 No drivers uploaded, redirecting to add driver page');
        setShowAccountVerification(false);
        router.replace('/add-driver');
        return;
      }
      
      // SECOND: Now check account status (only if documents are uploaded)
      if (newStatus?.toLowerCase() !== 'active') {
        // Documents uploaded but account is not active
        console.log('⏳ Documents uploaded, but account status is:', newStatus);
        setAccountStatus(newStatus);
        return;
      }
      
      // THIRD: If documents are uploaded and account is active, proceed to dashboard
      console.log('✅ Documents uploaded and account active, proceeding to dashboard');
      setShowAccountVerification(false);
      setShowWelcome(true);
    } catch (error) {
      console.error('❌ Failed to refresh status:', error);
      Alert.alert('Error', 'Failed to refresh account status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear any stored data
      setShowAccountVerification(false);
      setAccountStatus('');
      // You can add more logout logic here if needed
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  if (showAccountVerification) {
    return (
      <AccountVerificationScreen
        accountStatus={accountStatus}
        onRefresh={handleRefreshStatus}
        onLogout={handleLogout}
        isLoading={loading}
      />
    );
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <LinearGradient colors={['#3B82F6', '#1E40AF']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Drop Cars</Text>
            <Text style={styles.subtitle}>Driver Partner</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Smartphone color="#6B7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number (10 digits)"
                placeholderTextColor="#9CA3AF"
                value={phoneNumber}
                onChangeText={(text) => {
                  // Allow only digits, max 10 digits
                  const cleanText = text.replace(/\D/g, '');
                  if (cleanText.length <= 10) {
                    setPhoneNumber(cleanText);
                  }
                }}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            <Text style={styles.helperText}>Enter 10-digit mobile number starting with 6, 7, 8, or 9</Text>
            {phoneNumber && !validateIndianMobile(phoneNumber) && (
              <Text style={styles.errorText}>Must start with 6, 7, 8, or 9</Text>
            )}

            <View style={styles.inputGroup}>
              <Lock color="#6B7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
              <ArrowRight color="#FFFFFF" size={20} />
            </TouchableOpacity>


            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.signupText}>
                New Driver? <Text style={styles.signupLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={async () => {
              // Clear any existing owner data before switching to driver login
              try {
                await SecureStore.deleteItemAsync('authToken');
                await SecureStore.deleteItemAsync('userData');
                console.log('✅ Cleared owner data before switching to driver login');
              } catch (error) {
                console.log('ℹ️ No owner data to clear');
              }
              router.push('/quick-login');
            }} style={styles.quickDriverButton}>
              <Text style={styles.quickDriverText}>Quick Driver Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  signupLink: {
    color: '#3B82F6',
    fontFamily: 'Inter-SemiBold',
  },
  quickDriverButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  quickDriverText: {
    color: '#3B82F6',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginLeft: 44,
    marginBottom: 8
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginLeft: 44
  },
});