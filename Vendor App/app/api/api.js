// src/api/api.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

// import ENV from '../../config/'
// Authenticated Axios instance
const api = axios.create({
  // baseURL: "https://drop-cars-api-1049299844333.asia-south2.run.app/api",
  // baseURL: "http://192.168.1.13:8000/api",
  baseURL: "http://172.20.10.7:8000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

const removeAccessToken = async () => {
  const router = useRouter();
  try {
    await AsyncStorage.removeItem('accessToken');
    console.log('Access token removed successfully');
    router.replace('/(auth)/sign-in');// Navigate to login screen after logout

  } catch (error) {
    console.error('Error removing access token:', error);
  }
};
// Attach token from AsyncStorage to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log("Token from AsyncStorage:", token);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      // console.error('Failed to get token from AsyncStorage', error);
      Alert.alert('Session Expired', 'Please Login with your credentials');
      // removeAccessToken()

    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // console.warn('Unauthorized access - maybe redirect to login');
      // console.log(error.response?.detail);
      const errorDetail = error.response.data?.detail || 'Unauthorized access';
      if(errorDetail == "Force Logout Action Raised"){
        Alert.alert('Force Logout', 'Admin Raised Force Logout, Please Login with your credentials');
      }else{
      Alert.alert('Session Expired', 'Please Login with your credentials');
      }
      removeAccessToken();
    }
    return Promise.reject(error);
  }
);

// Public (unauthenticated) Axios instance
const publicApi = axios.create({
  // baseURL: 'https://drop-cars-api-1049299844333.asia-south2.run.app/api',
  // baseURL: "http://192.168.1.13:8000/api",
  baseURL: "http://172.20.10.7:8000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Export both
export default api;        // Use this for authenticated requests
export { publicApi };     // Use this for public requests (e.g. `/data`)
