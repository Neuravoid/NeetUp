import { apiService } from './api';

export interface CareerPath {
  id: string;
  title: string;
  description?: string;
  skills_required?: string;
  avg_salary?: number;
  created_at: string;
  updated_at: string;
}

export interface RoadmapStep {
  id: string;
  roadmap_id: string;
  title: string;
  description?: string;
  order: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoadmap {
  id: string;
  user_id: string;
  career_path_id: string;
  created_date: string;
  completion_percentage: number;
  career_path: CareerPath;
  steps: RoadmapStep[];
}

export interface RecentActivity {
  id: string;
  type: 'course_completed' | 'step_completed' | 'test_taken';
  title: string;
  description: string;
  timestamp: string;
  icon_type: 'success' | 'progress' | 'info';
}

export const roadmapService = {
  // Get user's personal roadmap
  getPersonalRoadmap: async (): Promise<UserRoadmap | null> => {
    try {
      const response = await apiService.get<UserRoadmap>('/roadmaps/personal');
      return response.data || null;
    } catch (error) {
      console.error('Error fetching personal roadmap:', error);
      return null;
    }
  },

  // Get recent activities (this would need a new backend endpoint)
  getRecentActivities: async (limit: number = 5): Promise<RecentActivity[]> => {
    try {
      const response = await apiService.get<RecentActivity[]>(`/users/activities?limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Return mock data as fallback for now
      return [
        {
          id: '1',
          type: 'course_completed',
          title: 'React Temelleri',
          description: 'kursunu tamamladınız. Tebrikler!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          icon_type: 'success'
        },
        {
          id: '2',
          type: 'step_completed',
          title: 'JavaScript Fundamentals',
          description: 'adımını tamamladınız.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          icon_type: 'progress'
        },
        {
          id: '3',
          type: 'test_taken',
          title: 'Kişilik Testi',
          description: 'testini tamamladınız.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          icon_type: 'info'
        }
      ];
    }
  },

  // Get upcoming deadlines from roadmap steps
  getUpcomingDeadlines: async (): Promise<Array<{
    id: string;
    title: string;
    date: string;
    progress: number;
    type: 'course' | 'step';
  }>> => {
    try {
      const roadmap = await roadmapService.getPersonalRoadmap();
      if (!roadmap) return [];

      // Convert roadmap steps to deadline format
      const upcomingSteps = roadmap.steps
        .filter(step => step.status !== 'completed')
        .slice(0, 3) // Get first 3 upcoming steps
        .map((step, index) => ({
          id: step.id,
          title: step.title,
          date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          progress: step.status === 'in_progress' ? Math.floor(Math.random() * 80) + 10 : 0,
          type: 'step' as const
        }));

      return upcomingSteps;
    } catch (error) {
      console.error('Error fetching upcoming deadlines:', error);
      return [];
    }
  },

  // Update roadmap step status
  updateStepStatus: async (stepId: string, status: 'not_started' | 'in_progress' | 'completed'): Promise<boolean> => {
    try {
      await apiService.put(`/roadmaps/steps/${stepId}`, { status });
      return true;
    } catch (error) {
      console.error('Error updating step status:', error);
      return false;
    }
  }
};
