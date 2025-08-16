import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { testSignupConnection } from '@/services/signupService';

export default function ConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');

  const testConnection = async () => {
    setTesting(true);
    setLastResult('');
    
    try {
      console.log('🧪 Starting connection test...');
      const result = await testSignupConnection();
      
      if (result) {
        setLastResult('✅ Connection successful!');
        Alert.alert('Success', 'API connection test passed!');
      } else {
        setLastResult('❌ Connection failed!');
        Alert.alert('Error', 'API connection test failed. Check console for details.');
      }
    } catch (error: any) {
      setLastResult(`❌ Error: ${error.message}`);
      Alert.alert('Test Error', error.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      <Text style={styles.subtitle}>
        Test if your backend server is accessible
      </Text>
      
      <TouchableOpacity 
        style={[styles.testButton, testing && styles.testButtonDisabled]} 
        onPress={testConnection}
        disabled={testing}
      >
        <Text style={styles.testButtonText}>
          {testing ? 'Testing...' : 'Test Connection'}
        </Text>
      </TouchableOpacity>
      
      {lastResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{lastResult}</Text>
        </View>
      ) : null}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Debugging Tips:</Text>
        <Text style={styles.infoText}>• Check if backend server is running on port 8000</Text>
        <Text style={styles.infoText}>• Verify server URL in axiosInstance.tsx</Text>
        <Text style={styles.infoText}>• Check console logs for detailed error info</Text>
        <Text style={styles.infoText}>• Ensure firewall allows connections</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  testButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  resultContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  infoContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
});


