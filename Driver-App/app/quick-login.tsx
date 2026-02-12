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
import { Smartphone, Lock, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { loginDriver } from '@/services/driver/driverService';

export default function QuickLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();

  const isValidPhone = (value: string) => {
    const digits = (value || '').replace(/\D/g, '');
    return digits.length === 10 || /^\+91\d{10}$/.test(value);
  };

  const handleQuickLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please enter both phone number and password');
      return;
    }

    if (!isValidPhone(phoneNumber)) {
      Alert.alert('Error', 'Enter a 10-digit number or +91 followed by 10 digits');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Please enter a valid password (minimum 6 characters)');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Attempting driver login...');
      
      // Call the real driver login API
      const loginResponse = await loginDriver(phoneNumber, password);
      
      if (loginResponse.access_token) {
        console.log('✅ Driver login successful, checking account status...');
        
        // Check driver status before proceeding
        const driverStatus = loginResponse.driver_status || loginResponse.status;
        console.log('🔍 Driver status:', driverStatus);
        
        // If driver status is PROCESSING, redirect to account verification
        if (driverStatus === 'PROCESSING') {
          console.log('⏳ Driver account is under verification, redirecting to verification screen');
          
          // Create minimal driver user object for verification screen
          const driverUser = {
            id: loginResponse.driver_id,
            fullName: loginResponse.full_name,
            primaryMobile: phoneNumber,
            secondaryMobile: undefined,
            password: password,
            address: 'Driver Address',
            aadharNumber: '',
            organizationId: 'driver_org',
            languages: ['English'],
            documents: {},
            driver_status: driverStatus,
            account_status: 'inactive' // Map PROCESSING to inactive for AccountVerificationScreen
          };
          
          // Login with the driver user data and token
          await login(driverUser, loginResponse.access_token);
          
          // Redirect to verification screen instead of dashboard
          router.replace('/verification');
          return;
        }
        
        // Check if driver status allows login (ONLINE, OFFLINE, DRIVING are allowed)
        const allowedStatuses = ['ONLINE', 'OFFLINE', 'DRIVING', 'online', 'offline', 'driving'];
        if (!allowedStatuses.includes(driverStatus)) {
          throw new Error(`Driver account status is ${driverStatus}. Please contact support for assistance.`);
        }
        
        // Create driver user object from login response
        const driverUser = {
          id: loginResponse.driver_id,
          fullName: loginResponse.full_name,
          primaryMobile: phoneNumber,
          secondaryMobile: undefined,
          password: password,
          address: 'Driver Address', // This could be fetched separately if needed
          aadharNumber: '', // Drivers don't have Aadhar in this context
          organizationId: 'driver_org', // Default organization for drivers
          languages: ['English'], // Default language
          documents: {}, // No documents needed for quick login
          driver_status: driverStatus // Include driver status from login response
        };
        
        // Login with the driver user data and token
        await login(driverUser, loginResponse.access_token);
        
        console.log('✅ Driver logged in successfully, redirecting to dashboard...');
        router.replace('/quick-dashboard');
      } else {
        throw new Error('No access token received from server');
      }
    } catch (error: any) {
      console.error('❌ Driver login failed:', error);
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#3B82F6', '#1E40AF']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <TouchableOpacity onPress={async () => {
            // Clear any existing driver data before going back to owner login
            try {
              await SecureStore.deleteItemAsync('driverAuthToken');
              await SecureStore.deleteItemAsync('driverAuthInfo');
              console.log('✅ Cleared driver data before switching to owner login');
            } catch (error) {
              console.log('ℹ️ No driver data to clear');
            }
            router.back();
          }} style={styles.backButton}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Quick Driver</Text>
            <Text style={styles.subtitle}>Login with your driver credentials</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Smartphone color="#6B7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                placeholderTextColor="#9CA3AF"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={13}
              />
            </View>

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
              onPress={handleQuickLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing In...' : 'Driver Login'}
              </Text>
              <ArrowRight color="#FFFFFF" size={20} />
            </TouchableOpacity>

            {/* Test credentials button removed - now using real driver authentication */}
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    padding: 8,
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
  // Test button styles removed - no longer needed
});