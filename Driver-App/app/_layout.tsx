import { useEffect } from 'react';
import '@/utils/quietConsole';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { CarDriverProvider } from '@/contexts/CarDriverContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

// Initialize Firebase early
import '@/services/firebase/firebaseConfig';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <WalletProvider>
            <DashboardProvider>
              <NotificationProvider>
                <CarDriverProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="signup" />
                    <Stack.Screen name="quick-login" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="car-driver" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style="auto" />
                </CarDriverProvider>
              </NotificationProvider>
            </DashboardProvider>
          </WalletProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}