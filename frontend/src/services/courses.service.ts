import { apiService } from './api';

export interface Course {
  id: string;
  title: string;
  description?: string;
  provider?: string;
  url?: string;
  duration_hours?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  skills_covered?: string;
  created_at: string;
  updated_at: string;
}

export interface UserCourse {
  id: string;
  user_id: string;
  course_id: string;
  enrollment_date: string;
  completion_date?: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  course: Course;
}

export interface CourseStats {
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  success_rate: number;
}

export const coursesService = {
  // Get recommended courses for the user
  getRecommendedCourses: async (): Promise<Course[]> => {
    const response = await apiService.get<Course[]>('/recommendations/courses');
    return response.data || [];
  },

  // Get all available courses
  getAllCourses: async (skip: number = 0, limit: number = 100): Promise<Course[]> => {
    const response = await apiService.get<Course[]>(`/courses/all?skip=${skip}&limit=${limit}`);
    return response.data || [];
  },

  // Get course details by ID
  getCourseDetails: async (courseId: string): Promise<Course | null> => {
    const response = await apiService.get<Course>(`/courses/${courseId}`);
    return response.data || null;
  },

  // Get user's enrolled courses (this would need a new backend endpoint)
  getUserCourses: async (): Promise<UserCourse[]> => {
    try {
      const response = await apiService.get<UserCourse[]>('/users/courses');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user courses:', error);
      return [];
    }
  },

  // Calculate course statistics for dashboard
  getCourseStats: async (): Promise<CourseStats> => {
    try {
      const userCourses = await coursesService.getUserCourses();
      
      const total_courses = userCourses.length;
      const completed_courses = userCourses.filter(uc => uc.status === 'completed').length;
      const in_progress_courses = userCourses.filter(uc => uc.status === 'in_progress').length;
      const success_rate = total_courses > 0 ? Math.round((completed_courses / total_courses) * 100) : 0;

      return {
        total_courses,
        completed_courses,
        in_progress_courses,
        success_rate
      };
    } catch (error) {
      console.error('Error calculating course stats:', error);
      return {
        total_courses: 0,
        completed_courses: 0,
        in_progress_courses: 0,
        success_rate: 0
      };
    }
  }
};
