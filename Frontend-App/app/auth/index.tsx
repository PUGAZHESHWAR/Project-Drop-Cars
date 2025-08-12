import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Car, User, Phone, Lock } from 'lucide-react-native';
import { SafeArea } from '@/components/SafeArea';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'vendor' | 'driver'>('vendor');
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [mpin, setMpin] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    if (!phone || !mpin || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(phone, mpin, activeTab);
      } else {
        success = await signup(phone, name, mpin, activeTab);
      }

      if (success) {
        if (activeTab === 'vendor') {
          router.replace('/(vendor)/(tabs)');
        } else {
          router.replace('/(driver)/(tabs)');
        }
      } else {
        Alert.alert('Error', 'Invalid credentials. Try MPIN: 1234 or 0000 for testing');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeArea style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <Car color="#FFFFFF" size={48} strokeWidth={2} />
            <Text style={styles.title}>Drop Cars</Text>
            <Text style={styles.subtitle}>Your Reliable Transport Partner</Text>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'vendor' && styles.activeTab]}
              onPress={() => setActiveTab('vendor')}
            >
              <User color={activeTab === 'vendor' ? '#3B82F6' : '#FFFFFF'} size={20} />
              <Text style={[styles.tabText, activeTab === 'vendor' && styles.activeTabText]}>
                MyTrip
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'driver' && styles.activeTab]}
              onPress={() => setActiveTab('driver')}
            >
              <Car color={activeTab === 'driver' ? '#3B82F6' : '#FFFFFF'} size={20} />
              <Text style={[styles.tabText, activeTab === 'driver' && styles.activeTabText]}>
                Driver
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Phone color="#6B7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <User color="#6B7280" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Lock color="#6B7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="MPIN (4 digits)"
                placeholderTextColor="#9CA3AF"
                value={mpin}
                onChangeText={setMpin}
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchButtonText}>
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
              </Text>
            </TouchableOpacity>

            <View style={styles.testInfo}>
              <Text style={styles.testInfoText}>
                Test MPIN: 1234 or 0000 (quick login)
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
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
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabText: {
    color: '#3B82F6',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchButtonText: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  testInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  testInfoText: {
    color: '#E5E7EB',
    fontSize: 12,
    textAlign: 'center',
  },
});