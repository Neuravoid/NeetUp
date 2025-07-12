import apiClient from './client';

/**
 * Personality test service
 */
export const personalityTestService = {
  /**
   * Get all personality test questions
   * @returns {Promise} Promise with API response
   */
  getQuestions: async () => {
    try {
      const response = await apiClient.get('/tests/questions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit personality test answers
   * @param {Object} answers - Test answers object
   * @returns {Promise} Promise with API response
   */
  submitAnswers: async (answers) => {
    try {
      const response = await apiClient.post('/tests/submit', answers);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get personality test results for the current user
   * @returns {Promise} Promise with API response
   */
  getResults: async () => {
    try {
      const response = await apiClient.get('/tests/results');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all coalition types with descriptions
   * @returns {Promise} Promise with API response
   */
  getCoalitionTypes: async () => {
    try {
      const response = await apiClient.get('/tests/coalition-types');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default personalityTestService;
