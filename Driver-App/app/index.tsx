import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { onSessionExpired } from '@/utils/session';
import { useCarDriver } from '@/contexts/CarDriverContext';

export default function IndexScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { signout } = useCarDriver();
  const [userRole, setUserRole] = useState<'owner' | 'driver' | null>(null);

  useEffect(() => {
    checkAuthStatus();
    const off = onSessionExpired(async () => {
      try { Alert.alert('Session expired', 'Please login again.'); } catch {}
      
      // Clear data based on current role
      if (userRole === 'owner') {
        try { await SecureStore.deleteItemAsync('authToken'); } catch {}
        try { await SecureStore.deleteItemAsync('userData'); } catch {}
      } else if (userRole === 'driver') {
        try { await signout(); } catch {}
      }
      
      setUserRole(null);
      router.replace('/login');
    });
    return off;
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check for Vehicle Owner authentication first
      const voToken = await SecureStore.getItemAsync('authToken');
      const voUserData = await SecureStore.getItemAsync('userData');
      
      // Check for Quick Driver authentication
      const driverToken = await SecureStore.getItemAsync('driverAuthToken');
      const driverUserData = await SecureStore.getItemAsync('driverAuthInfo');
      
      if (voToken && voUserData) {
        // Vehicle Owner logged in
        console.log('✅ Vehicle Owner authentication found');
        setUserRole('owner');
        setUser(JSON.parse(voUserData));
        router.replace('/(tabs)');
      } else if (driverToken && driverUserData) {
        // Quick Driver logged in
        console.log('✅ Quick Driver authentication found');
        setUserRole('driver');
        const driverInfo = JSON.parse(driverUserData);
        setUser(driverInfo);
        router.replace('/quick-dashboard');
      } else {
        // No authentication found
        console.log('❌ No authentication found');
        setUserRole(null);
        router.replace('/login');
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setUserRole(null);
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Loading screen - could add a logo/spinner here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B82F6',
  },
});