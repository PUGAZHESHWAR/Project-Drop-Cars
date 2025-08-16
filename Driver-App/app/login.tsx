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
import axiosInstance from '@/app/api/axiosInstance';

// Helper function to validate Indian mobile numbers
const validateIndianMobile = (phone: string): boolean => {
  // Remove +91 prefix if present
  const cleanPhone = phone.replace(/^\+91/, '');
  
  // Check if it's exactly 10 digits and starts with 6, 7, 8, or 9
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

// Helper function to format phone number for backend
const formatPhoneForBackend = (phone: string): string => {
  if (!phone) return '';
  // Remove +91 prefix if present and ensure it's properly formatted
  const cleanPhone = phone.replace(/^\+91/, '');
  // Add +91 prefix back
  return `+91${cleanPhone}`;
};

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
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
      // Format phone number for backend (add +91 prefix)
      const formattedPhone = formatPhoneForBackend(phoneNumber);
      
      console.log('🔐 Attempting login with:', {
        mobile_number: formattedPhone,
        password: password
      });

      // Make actual API call to backend
      const response = await axiosInstance.post('/api/users/vehicleowner/login', {
        mobile_number: formattedPhone,
        password: password
      });

      console.log('✅ Login successful:', response.data);

      // Create user object from response
      const userData = {
        id: response.data.user_id || 'temp_id',
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
      setShowWelcome(true);

    } catch (error: any) {
      console.error('❌ Login failed:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid mobile number or password.';
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

  const autoFillTestCredentials = () => {
    setPhoneNumber('9876543210');
    setPassword('secret123');
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    router.replace('/(tabs)');
  };

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
                  // Allow only digits and +91 prefix
                  const cleanText = text.replace(/[^\d+]/g, '');
                  if (cleanText.startsWith('+91') || cleanText.length <= 10) {
                    setPhoneNumber(cleanText);
                  }
                }}
                keyboardType="phone-pad"
                maxLength={13}
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

            <TouchableOpacity onPress={autoFillTestCredentials} style={styles.testButton}>
              <Text style={styles.testButtonText}>Use Test Credentials</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.signupText}>
                New Driver? <Text style={styles.signupLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/quick-login')} style={styles.quickDriverButton}>
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
  testButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
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