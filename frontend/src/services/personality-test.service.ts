import api from './api';

export interface PersonalityAnswer {
  question_id: string;
  answer_value: number;
}

export interface CompetencyAnswer {
  question_id: string;
  answer_value: number;
  answer_text?: string;
}

export interface PersonalityQuestion {
  id: string;
  text: string;
  category: string;
  trait?: string;
  subcategory?: string;
}

export interface PersonalityQuestionsPage {
  questions: PersonalityQuestion[];
  current_page: number;
  total_pages: number;
  page_title: string;
}

export interface CompetencyQuestion {
  id: string;
  text: string;
  category: string;
  coalition_type: string;
}

export interface CompetencyQuestionsResponse {
  questions: CompetencyQuestion[];
  coalition: string;
  coalition_description: string;
}

export interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface CoalitionMatch {
  name: string;
  description: string;
  match_percentage: number;
  reason: string;
}

export interface CareerRecommendation {
  title: string;
  description: string;
  match_reason?: string;
  skills_needed?: string[];
  salary_range?: string;
  match_percentage?: number;
  score?: number;
  all_scores?: Record<string, number>;
  compatibility_level?: string;
  normalized_score?: number;
}

export interface CourseRecommendation {
  title: string;
  description: string;
  difficulty: string;
  duration?: string;
  provider?: string;
}

export interface PersonalityTestResult {
  test_id: string;
  user_id: string;
  personality_scores: PersonalityScores;
  top_coalitions: CoalitionMatch[];
  personality_comment: string;
  career_recommendations: CareerRecommendation[];
  course_recommendations: CourseRecommendation[];
  strengths: string[];
  areas_to_improve: string[];
  tactical_suggestions: string[];
  completion_date: string;
}

export interface PersonalityTestStart {
  test_id: string;
  title: string;
  description: string;
  instructions: string;
  total_questions: number;
  estimated_duration: number;
}

export interface PersonalityTestResponse {
  success: boolean;
  message: string;
  test_id?: string;
  data?: any;
}

export const personalityTestService = {
  // Start a new personality test
  startTest: async (): Promise<PersonalityTestStart> => {
    try {
      const response = await api.post('/personality-test/start');
      return response.data;
    } catch (error) {
      console.error('Error starting personality test:', error);
      throw error;
    }
  },

  // Get questions for a specific page
  getQuestions: async (page: number): Promise<PersonalityQuestionsPage> => {
    try {
      const response = await api.get(`/personality-test/questions/${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  // Submit answers for personality questions
  submitAnswers: async (testId: string, answers: PersonalityAnswer[]): Promise<PersonalityTestResponse> => {
    try {
      const response = await api.post(`/personality-test/answers/${testId}`, answers);
      return response.data;
    } catch (error) {
      console.error('Error submitting answers:', error);
      throw error;
    }
  },

  // Get competency questions based on personality type
  getCompetencyQuestions: async (testId: string): Promise<CompetencyQuestionsResponse> => {
    try {
      const response = await api.get(`/personality-test/competency/${testId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching competency questions:', error);
      throw error;
    }
  },

  // Submit competency answers
  submitCompetencyAnswers: async (testId: string, answers: CompetencyAnswer[]): Promise<PersonalityTestResponse> => {
    try {
      const response = await api.post(`/personality-test/competency/${testId}`, answers);
      return response.data;
    } catch (error) {
      console.error('Error submitting competency answers:', error);
      throw error;
    }
  },

  // Get test results
  getResults: async (testId: string): Promise<PersonalityTestResult> => {
    try {
      const response = await api.get(`/personality-test/results/${testId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }
  },

  // Check if user needs to take personality test (for roadmap creation)
  checkTestRequired: async (): Promise<boolean> => {
    try {
      const response = await api.get('/personality-test/check-required');
      return response.data?.required || false;
    } catch (error) {
      console.error('Error checking test requirement:', error);
      return false;
    }
  }
};
