import { apiService } from './api';

export interface Test {
  id: string;
  title: string;
  description?: string;
  test_type: 'personality' | 'skill_assessment' | 'career_aptitude';
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  test_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'likert_scale' | 'free_text';
  order: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  question_id: string;
  answer_text: string;
  order: number;
  score?: number;
}

export interface TestDetail extends Test {
  questions: Question[];
}

export interface TestSubmission {
  test_id: string;
  answers: Array<{
    question_id: string;
    answer_id?: string;
    answer_text?: string;
  }>;
}

export interface TestResult {
  id: string;
  user_id: string;
  test_id: string;
  completion_date: string;
  score?: number;
  result_data?: string;
  test: Test;
}

export const testsService = {
  // Get all available tests
  getTests: async (skip: number = 0, limit: number = 100): Promise<Test[]> => {
    try {
      const response = await apiService.get<Test[]>(`/tests?skip=${skip}&limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tests:', error);
      return [];
    }
  },

  // Get test details with questions
  getTestDetails: async (testId: string): Promise<TestDetail | null> => {
    try {
      const response = await apiService.get<TestDetail>(`/tests/${testId}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching test details:', error);
      return null;
    }
  },

  // Submit test answers
  submitTest: async (submission: TestSubmission): Promise<TestResult | null> => {
    try {
      const response = await apiService.post<TestResult>(`/tests/${submission.test_id}/submit`, submission);
      return response.data || null;
    } catch (error) {
      console.error('Error submitting test:', error);
      return null;
    }
  },

  // Get user's test result
  getTestResult: async (testId: string): Promise<TestResult | null> => {
    try {
      const response = await apiService.get<TestResult>(`/tests/${testId}/result`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching test result:', error);
      return null;
    }
  },

  // Get user's test history (this would need a new backend endpoint)
  getUserTestHistory: async (): Promise<TestResult[]> => {
    try {
      const response = await apiService.get<TestResult[]>('/users/test-results');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user test history:', error);
      return [];
    }
  }
};
