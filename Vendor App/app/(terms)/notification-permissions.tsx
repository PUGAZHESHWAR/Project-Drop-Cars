import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../api/api';
import { Bell, Shield, MessageCircle, CheckCircle } from 'lucide-react-native';

export default function NotificationPermissionsScreen() {
  const [permissions, setPermissions] = useState({
    permission1: true, // Default true
    permission2: true, // Default true
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const expoPushToken = params.expoPushToken as string;

  useEffect(() => {
    if (!expoPushToken) {
      Alert.alert('Error', 'Push token not available. Please go back and try again.');
      router.back();
    }
  }, [expoPushToken]);

  const handleAllowNotifications = async () => {
    if (!expoPushToken) {
      Alert.alert('Error', 'Push token not available.');
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        permission1: permissions.permission1,
        permission2: permissions.permission2,
        token: expoPushToken
      };

      console.log('Sending notification permissions:', requestBody);

      const response = await api.post('/notifications', requestBody);
      
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Notification preferences saved successfully!', [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)')
          }
        ]);
      }
    } catch (error: any) {
      console.error('Error saving notification permissions:', error);
      Alert.alert(
        'Error', 
        'Failed to save notification preferences. Please try again.',
        [{ text: 'Try Again' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Notifications',
      'You can enable notifications later in settings. Are you sure you want to skip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          style: 'destructive',
          onPress: () => router.replace('/(tabs)')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Bell size={28} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Enable Notifications</Text>
        <Text style={styles.headerSubtitle}>
          Stay updated with important information
        </Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <Text style={styles.sectionTitle}>
          Notification Preferences
        </Text>
        
        <Text style={styles.description}>
          You'll receive these notifications to stay informed about your account activities.
        </Text>

        {/* Permission 1 */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeader}>
            <View style={styles.permissionIcon}>
              <MessageCircle size={18} color="#1E40AF" />
            </View>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Order Updates</Text>
              <Text style={styles.permissionDescription}>
                Real-time updates about your orders, trip status, and important changes
              </Text>
            </View>
          </View>
          <CheckCircle size={20} color="#10B981" />
        </View>

        {/* Permission 2 */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeader}>
            <View style={styles.permissionIcon}>
              <Shield size={18} color="#1E40AF" />
            </View>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Feature Updates</Text>
              <Text style={styles.permissionDescription}>
                Important Features updates and account activities
              </Text>
            </View>
          </View>
          <CheckCircle size={20} color="#10B981" />
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            You can modify these settings in the app's notification settings later.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.allowButton, loading && styles.allowButtonDisabled]}
          onPress={handleAllowNotifications}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.allowButtonText}>Allow Notifications</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={loading}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0F2FE',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 10, // Reduced bottom padding to prevent hiding
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  illustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0F2FE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  permissionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  noteContainer: {
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  noteText: {
    fontSize: 12,
    color: '#1E40AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    padding: 20,
    paddingBottom: 30, // Added extra bottom padding for safety
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  allowButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  allowButtonDisabled: {
    opacity: 0.6,
  },
  allowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});