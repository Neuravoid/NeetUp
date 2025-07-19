import { apiService } from './api';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from '../types/index.js';

export const authService = {
  /**
   * Kullanıcı kaydı yapar
   */
  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    return response;
  },

  /**
   * Kullanıcı girişi yapar
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    return response;
  },

  /**
   * Kullanıcı çıkışı yapar
   */
  logout: () => {
    localStorage.removeItem('token');
  },

  /**
   * Mevcut kullanıcının bilgilerini getirir
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return await apiService.get<User>('/users/me');
  },

  /**
   * Kullanıcının giriş yapmış olup olmadığını kontrol eder
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
