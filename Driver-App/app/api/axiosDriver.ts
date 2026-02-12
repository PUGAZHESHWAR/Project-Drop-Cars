import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { emitSessionExpired } from '@/utils/session';
// const API_BASE_URL = 'http://10.153.75.247:8000/';
// // Use same API base as VO
const API_BASE_URL = 'https://drop-cars-api-1049299844333.asia-south2.run.app';

const axiosDriver = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Reduced from 60s to 30s
  headers: {
    'Accept': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

axiosDriver.interceptors.request.use(
  async (config: any) => {
    // Skip token validation for login and registration endpoints
    const isAuthEndpoint = config.url?.includes('/login') || 
                          config.url?.includes('/register') || 
                          config.url?.includes('/signup') ||
                          config.url?.includes('/auth/') ||
                          config.url?.includes('/driver/login');
    
    if (!isAuthEndpoint) {
      // Check for valid token before making request (only for non-auth endpoints)
      const token = await SecureStore.getItemAsync('driverAuthToken');
      if (!token) {
        console.log('❌ No driver auth token found, emitting session expired');
        emitSessionExpired('No driver authentication token found');
        return Promise.reject(new Error('No driver authentication token found. Please login first.'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // For auth endpoints, try to attach token if available (for refresh scenarios)
      const token = await SecureStore.getItemAsync('driverAuthToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // Quick self-check
    console.log('🚗 Driver request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      authAttached: !!config.headers.Authorization,
      contentType: config.headers['Content-Type'],
    });
    return config;
  },
  (error) => Promise.reject(error)
);

axiosDriver.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Driver API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    });
    
    // Handle all axios errors as potential session expiration
    console.log('❌ Driver axios error detected, treating as potential session expiration');
    
    // Clear tokens and emit session expired for ANY axios error
    try { 
      SecureStore.deleteItemAsync('driverAuthToken'); 
      console.log('🗑️ Cleared driverAuthToken');
    } catch (e) { 
      console.error('Error clearing driverAuthToken:', e); 
    }
    try { 
      SecureStore.deleteItemAsync('driverAuthInfo'); 
      console.log('🗑️ Cleared driverAuthInfo');
    } catch (e) { 
      console.error('Error clearing driverAuthInfo:', e); 
    }
    
    // Emit session expired event
    emitSessionExpired('Driver session expired - Network or authentication error');
    
    return Promise.reject(error);
  }
);

export default axiosDriver;


