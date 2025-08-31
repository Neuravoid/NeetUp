import axios from 'axios';
import type { ApiResponse } from '../types/index.js';

// Centralized error handling utility
export const handleApiError = (error: any): { success: false; error: string } => {
  return {
    success: false,
    error: error.response?.data?.error || error.response?.data?.detail || 'İstek sırasında bir hata oluştu',
  };
};

// API temel URL'i
const API_URL = 'http://localhost:8080/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek interceptor'ı - auth token'ını ekler
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı - hata durumlarını işler
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 hatasında kullanıcıyı çıkış yaptır
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API fonksiyonları
export const apiService = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await api.get(endpoint);
      
      // Handle different response formats
      if (response.data.success !== undefined) {
        // New format: {success, data, error}
        return response.data;
      } else {
        // Direct data response (for endpoints that return data directly)
        return {
          success: true,
          data: response.data
        };
      }
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  post: async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post(endpoint, data);
      
      // Backend now returns {success, data, error} format directly, so we can return it as is.
      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  put: async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.put<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'İstek sırasında bir hata oluştu',
      };
    }
  },

  patch: async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.patch<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await api.delete<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'İstek sırasında bir hata oluştu',
      };
    }
  },
};

export default api;
