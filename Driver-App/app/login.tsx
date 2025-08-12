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

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mpin, setMpin] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!phoneNumber || !mpin) {
      Alert.alert('Error', 'Please enter both phone number and MPIN');
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Test credentials: 9876543210 / 0000
      if (phoneNumber === '9876543210' && mpin === '0000') {
        const dummyUser = {
          id: '1',
          name: 'Riaz',
          mobile: '9876543210',
          address: 'Chennai, Tamil Nadu',
          languages: ['Tamil', 'English'],
          cars: [{
            id: '1',
            name: 'Tata Nexon',
            type: 'SUV',
            registration: 'TN10BZ1234',
            isDefault: true
          }]
        };
        
        await login(dummyUser, 'dummy-jwt-token');
        setShowWelcome(true);
      } else {
        Alert.alert('Error', 'Invalid credentials. Use test credentials: 9876543210 / 0000');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const autoFillTestCredentials = () => {
    setPhoneNumber('9876543210');
    setMpin('0000');
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
                placeholder="Enter 4-digit MPIN"
                placeholderTextColor="#9CA3AF"
                value={mpin}
                onChangeText={setMpin}
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
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
});