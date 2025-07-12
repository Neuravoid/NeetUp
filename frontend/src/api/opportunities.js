import apiClient from './client';

/**
 * Service for handling opportunities (jobs, courses, projects)
 */
const opportunitiesService = {
  /**
   * Get all opportunities with optional filters
   * @param {Object} filters - Filter options like type, keyword, etc.
   * @returns {Promise} Promise with API response
   */
  getOpportunities: async (filters = {}) => {
    try {
      const response = await apiClient.get('/opportunities', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get recommended opportunities for the current user
   * @returns {Promise} Promise with API response
   */
  getRecommendedOpportunities: async () => {
    try {
      const response = await apiClient.get('/opportunities/recommended');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a specific opportunity by ID and type
   * @param {string} type - Opportunity type (job, course, project)
   * @param {string} id - Opportunity ID
   * @returns {Promise} Promise with API response
   */
  getOpportunityById: async (type, id) => {
    try {
      const response = await apiClient.get(`/opportunities/${type}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Apply for a job opportunity
   * @param {string} jobId - Job ID
   * @param {Object} applicationData - Application data
   * @returns {Promise} Promise with API response
   */
  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await apiClient.post(`/opportunities/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Enroll in a course
   * @param {string} courseId - Course ID
   * @returns {Promise} Promise with API response
   */
  enrollInCourse: async (courseId) => {
    try {
      const response = await apiClient.post(`/opportunities/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Join a project
   * @param {string} projectId - Project ID
   * @param {Object} joinData - Join request data
   * @returns {Promise} Promise with API response
   */
  joinProject: async (projectId, joinData) => {
    try {
      const response = await apiClient.post(`/opportunities/projects/${projectId}/join`, joinData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get applications/enrollments/participations for the current user
   * @returns {Promise} Promise with API response
   */
  getUserApplications: async () => {
    try {
      const response = await apiClient.get('/opportunities/applications');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default opportunitiesService;
