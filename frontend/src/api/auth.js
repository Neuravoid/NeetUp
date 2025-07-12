import apiClient from './client';

/**
 * User authentication service
 */
export const authService = {
  /**
   * Login user
   * @param {Object} credentials - User login credentials
   * @returns {Promise} Promise with API response
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data && response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with API response
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify user email
   * @param {Object} verificationData - Email and verification code
   * @returns {Promise} Promise with API response
   */
  verifyEmail: async (verificationData) => {
    try {
      const response = await apiClient.post('/auth/verify-email', verificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request password reset (forgot password)
   * @param {string} email - User email
   * @returns {Promise} Promise with API response
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resend verification email
   * @param {string} email - User email
   * @returns {Promise} Promise with API response
   */
  resendVerificationEmail: async (email) => {
    try {
      const response = await apiClient.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Promise with API response
   */
  resetPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current authenticated user
   * @returns {Promise} Promise with API response
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Log out user
   */
  logout: () => {
    localStorage.removeItem('auth_token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return localStorage.getItem('auth_token') !== null;
  }
};

export default authService;
