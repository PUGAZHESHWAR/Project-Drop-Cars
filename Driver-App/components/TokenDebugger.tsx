import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { notificationService } from '@/services/notifications/notificationService';

export default function TokenDebugger() {
  const handleGetTokens = async () => {
    try {
      console.log('🔍 Manual token retrieval triggered...');
      await notificationService.forceTokenRetrieval();
      Alert.alert('Success', 'Check console for tokens');
    } catch (error) {
      console.error('❌ Error getting tokens:', error);
      Alert.alert('Error', 'Failed to get tokens');
    }
  };

  const handlePrintStoredTokens = async () => {
    try {
      await notificationService.printAllTokens();
      Alert.alert('Success', 'Check console for stored tokens');
    } catch (error) {
      console.error('❌ Error printing tokens:', error);
      Alert.alert('Error', 'Failed to print tokens');
    }
  };

  const handleGetExpoTokenOnly = async () => {
    try {
      console.log('🔍 Getting Expo token only...');
      const token = await notificationService.getExpoTokenOnly();
      if (token) {
        Alert.alert('Success', `Expo Token: ${token.substring(0, 20)}...`);
      } else {
        Alert.alert('Error', 'Failed to get Expo token');
      }
    } catch (error) {
      console.error('❌ Error getting Expo token:', error);
      Alert.alert('Error', 'Failed to get Expo token');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Token Debugger</Text>
      <TouchableOpacity style={styles.button} onPress={handleGetTokens}>
        <Text style={styles.buttonText}>Get Tokens</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handlePrintStoredTokens}>
        <Text style={styles.buttonText}>Print Stored Tokens</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGetExpoTokenOnly}>
        <Text style={styles.buttonText}>Get Expo Token Only</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
