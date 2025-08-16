import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// For React Native, use machine IP instead of localhost
const API_BASE_URL = 'http://10.136.40.145:8000'; // Physical Emulator


console.log('🔧 API Config:', { baseURL: API_BASE_URL });

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor with logging
axiosInstance.interceptors.request.use(
  async (config: any) => {
    console.log('🚀 Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data instanceof FormData ? 'FormData (file upload)' : config.data,
      contentType: config.headers['Content-Type']
    });

    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't override Content-Type if it's already set (for FormData)
    if (config.data instanceof FormData && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor with error logging
axiosInstance.interceptors.response.use(
  (response: any) => {
    console.log('✅ Response:', { status: response.status, data: response.data });
    return response;
  },
  (error: any) => {
    console.error('❌ API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
