import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API URL
// PC is on the 130.1.55.136 network (Wi-Fi)
// If your phone is on the SAME Wi-Fi network (130.1.x.x), use this IP
const API_URL = 'http://130.1.55.136:5000/api';

console.log('🔧 API Configuration:');
console.log('API_URL:', API_URL);
console.log('Make sure your phone is on the same Wi-Fi: 130.1.x.x network');

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('🔐 Token from storage:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Authorization header set with token');
      } else {
        console.warn('⚠️ NO TOKEN FOUND - Request will fail if endpoint requires auth');
      }
    } catch (error) {
      console.error('❌ Error getting token:', error);
    }
    console.log('📤 Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response successful:', response.status);
    return response;
  },
  async (error) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
      fullError: error.message
    });
    
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized - Clearing storage and logging out');
      // Token expired or invalid, clear storage
      await AsyncStorage.multiRemove(['token', 'user']);
    }
    return Promise.reject(error);
  }
);

export default api;
