import api from './api';

export interface WeeklyTask {
  id: number;
  day: string;
  text: string;
  category: string;
  completed: boolean;
  owner_id: number;
}

export interface WeeklyTaskCreate {
  day: string;
  text: string;
  category: string;
  completed?: boolean;
}

export interface WeeklyTaskUpdate {
  day?: string;
  text?: string;
  category?: string;
  completed?: boolean;
}

const weeklyPlanService = {
  getTasks: async (): Promise<WeeklyTask[]> => {
    try {
      const response = await api.get('/weekly-plan/');
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (data && Array.isArray(data.data)) {
        return data.data;
      }
      console.warn('API response is not an array:', data);
      return [];
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return [];
    }
  },

  createTask: async (task: WeeklyTaskCreate): Promise<WeeklyTask> => {
    try {
      const response = await api.post('/weekly-plan/', task);
      const data = response.data;
      if (data && typeof data === 'object' && data.id) {
        return data;
      }
      if (data && data.data && typeof data.data === 'object' && data.data.id) {
        return data.data;
      }
      throw new Error('Invalid task data received from server');
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  updateTask: async (id: number, task: WeeklyTaskUpdate): Promise<WeeklyTask> => {
    try {
      if (!id || id === undefined) {
        throw new Error('Task ID is required for update');
      }
      const response = await api.put(`/weekly-plan/${id}`, task);
      const data = response.data;
      if (data && typeof data === 'object' && data.id) {
        return data;
      }
      if (data && data.data && typeof data.data === 'object' && data.data.id) {
        return data.data;
      }
      throw new Error('Invalid task data received from server');
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTask: async (id: number): Promise<void> => {
    try {
      if (!id || id === undefined) {
        throw new Error('Task ID is required for deletion');
      }
      await api.delete(`/weekly-plan/${id}`);
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },
};

export default weeklyPlanService;
