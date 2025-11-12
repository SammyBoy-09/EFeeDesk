import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API URL
// Using your local IP for both physical devices and emulator compatibility
const API_URL = 'http://192.168.29.217:5000/api';

// Alternative URLs:
// - Android Emulator: http://10.0.2.2:5000/api
// - iOS Simulator: http://localhost:5000/api
// - Physical Device: http://192.168.29.217:5000/api

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await AsyncStorage.multiRemove(['token', 'user']);
    }
    return Promise.reject(error);
  }
);

export default api;
