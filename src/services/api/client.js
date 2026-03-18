import axios from 'axios';
import { generateMockStoreSummary, generateMockHourlyData } from '../../utils/mockData';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock interceptor for demo
apiClient.interceptors.request.use(config => {
  // Mock dashboard summary
  if (config.url === '/dashboard/summary') {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...config,
          mockResponse: {
            data: {
              summary: generateMockStoreSummary(),
              hourlyData: generateMockHourlyData()
            }
          }
        });
      }, 500);
    });
  }

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Mock response interceptor
apiClient.interceptors.response.use(response => {
  if (response.mockResponse) {
    return response.mockResponse;
  }
  return response;
}, error => {
  if (error.response?.status === 401) {
    // Handle unauthorized access
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default apiClient;
