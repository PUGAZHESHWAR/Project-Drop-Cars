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

export default function QuickLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [quickId, setQuickId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();

  const handleQuickLogin = async () => {
    if (!phoneNumber || !quickId) {
      Alert.alert('Error', 'Please enter both phone number and Quick ID');
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (quickId.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit Quick ID');
      return;
    }

    setLoading(true);

    try {
      // Test credentials for quick driver
      if (phoneNumber === '9876543211' && quickId === '1234') {
        const quickDriverUser = {
          id: '2',
          name: 'Kumar (Quick Driver)',
          mobile: '9876543211',
          address: 'Chennai, Tamil Nadu',
          languages: ['Tamil', 'English'],
          cars: [{
            id: '2',
            name: 'Maruti Swift',
            type: 'Hatchback',
            registration: 'TN11AB5678',
            isDefault: true
          }],
          isQuickDriver: true,
          assignedOrder: {
            booking_id: 'B125',
            pickup: 'Adyar',
            drop: 'Velachery',
            customer_name: 'Lakshmi Devi',
            customer_mobile: '9988776655',
            fare_per_km: 12,
            distance_km: 25,
            total_fare: 300,
            status: 'assigned'
          }
        };
        
        await login(quickDriverUser, 'quick-driver-jwt-token');
        router.replace('/quick-dashboard');
      } else {
        Alert.alert('Error', 'Invalid credentials. Use test credentials: 9876543211 / 1234');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Quick Driver</Text>
            <Text style={styles.subtitle}>Login with assigned credentials</Text>
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
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Lock color="#6B7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Enter 4-digit Quick ID"
                placeholderTextColor="#9CA3AF"
                value={quickId}
                onChangeText={setQuickId}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleQuickLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing In...' : 'Quick Login'}
              </Text>
              <ArrowRight color="#FFFFFF" size={20} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setPhoneNumber('9876543211');
              setQuickId('1234');
            }} style={styles.testButton}>
              <Text style={styles.testButtonText}>Use Test Credentials</Text>
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
  testButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});