import apiClient from './client';

/**
 * Profile service for handling user profile operations
 */
const profileService = {
  /**
   * Get current user profile
   * @returns {Promise} Promise with API response
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise} Promise with API response
   */
  getUserProfile: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update current user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Promise with API response
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.patch('/users/me', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile picture
   * @param {FormData} formData - Form data with file
   * @returns {Promise} Promise with API response
   */
  updateProfilePicture: async (formData) => {
    try {
      const response = await apiClient.post('/users/me/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user skills
   * @param {string} [userId] - Optional user ID to get skills for another user
   * @returns {Promise} Promise with API response
   */
  getUserSkills: async (userId) => {
    try {
      const endpoint = userId ? `/users/${userId}/skills` : '/users/me/skills';
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user skills
   * @param {Array} skills - Array of skill objects
   * @returns {Promise} Promise with API response
   */
  updateUserSkills: async (skills) => {
    try {
      const response = await apiClient.put('/users/me/skills', { skills });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== CONNECTIONS =====
  
  /**
   * Get user connections
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise} Promise with API response
   */
  getConnections: async (params = {}) => {
    try {
      const response = await apiClient.get('/users/me/connections', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get connection requests
   * @returns {Promise} Promise with API response
   */
  getConnectionRequests: async () => {
    try {
      const response = await apiClient.get('/users/me/connection-requests');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send connection request
   * @param {string} userId - ID of the user to connect with
   * @returns {Promise} Promise with API response
   */
  sendConnectionRequest: async (userId) => {
    try {
      const response = await apiClient.post(`/users/me/connections/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Accept connection request
   * @param {string} requestId - ID of the connection request
   * @returns {Promise} Promise with API response
   */
  acceptConnectionRequest: async (requestId) => {
    try {
      const response = await apiClient.patch(`/users/me/connection-requests/${requestId}/accept`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reject connection request
   * @param {string} requestId - ID of the connection request
   * @returns {Promise} Promise with API response
   */
  rejectConnectionRequest: async (requestId) => {
    try {
      const response = await apiClient.patch(`/users/me/connection-requests/${requestId}/reject`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Remove connection
   * @param {string} userId - ID of the user to disconnect from
   * @returns {Promise} Promise with API response
   */
  removeConnection: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/me/connections/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== EXPERIENCE =====
  
  /**
   * Get user experiences
   * @param {string} [userId] - Optional user ID to get experiences for another user
   * @returns {Promise} Promise with API response
   */
  getExperiences: async (userId) => {
    try {
      const endpoint = userId ? `/users/${userId}/experiences` : '/users/me/experiences';
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add experience
   * @param {Object} experienceData - Experience data
   * @returns {Promise} Promise with API response
   */
  addExperience: async (experienceData) => {
    try {
      const response = await apiClient.post('/users/me/experiences', experienceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update experience
   * @param {string} experienceId - Experience ID
   * @param {Object} experienceData - Updated experience data
   * @returns {Promise} Promise with API response
   */
  updateExperience: async (experienceId, experienceData) => {
    try {
      const response = await apiClient.patch(`/users/me/experiences/${experienceId}`, experienceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete experience
   * @param {string} experienceId - Experience ID
   * @returns {Promise} Promise with API response
   */
  deleteExperience: async (experienceId) => {
    try {
      const response = await apiClient.delete(`/users/me/experiences/${experienceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== EDUCATION =====
  
  /**
   * Get user education
   * @param {string} [userId] - Optional user ID to get education for another user
   * @returns {Promise} Promise with API response
   */
  getEducation: async (userId) => {
    try {
      const endpoint = userId ? `/users/${userId}/education` : '/users/me/education';
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add education
   * @param {Object} educationData - Education data
   * @returns {Promise} Promise with API response
   */
  addEducation: async (educationData) => {
    try {
      const response = await apiClient.post('/users/me/education', educationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update education
   * @param {string} educationId - Education ID
   * @param {Object} educationData - Updated education data
   * @returns {Promise} Promise with API response
   */
  updateEducation: async (educationId, educationData) => {
    try {
      const response = await apiClient.patch(`/users/me/education/${educationId}`, educationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete education
   * @param {string} educationId - Education ID
   * @returns {Promise} Promise with API response
   */
  deleteEducation: async (educationId) => {
    try {
      const response = await apiClient.delete(`/users/me/education/${educationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== ACTIVITY FEED =====
  
  /**
   * Get user activity feed
   * @param {Object} params - Query parameters (page, limit, etc.)
   * @returns {Promise} Promise with API response
   */
  getActivityFeed: async (params = {}) => {
    try {
      const response = await apiClient.get('/users/me/activity-feed', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's connection suggestions
   * @returns {Promise} Promise with API response
   */
  getConnectionSuggestions: async () => {
    try {
      const response = await apiClient.get('/users/connections/suggestions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Follow a user
   * @param {string} userId - ID of the user to follow
   * @returns {Promise} Promise with API response
   */
  followUser: async (userId) => {
    try {
      const response = await apiClient.post(`/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Unfollow a user
   * @param {string} userId - ID of the user to unfollow
   * @returns {Promise} Promise with API response
   */
  unfollowUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default profileService;
