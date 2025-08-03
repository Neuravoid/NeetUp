import { apiService } from './api';

export interface Track {
  id: number;
  name: string;
  icon: string;
  color: string;
  stages: Stage[];
}

export interface Stage {
  id: number;
  name: string;
  topics: string[];
}

export interface SubTask {
  text: string;
  completed: boolean;
}

export interface UserTask {
  id: number;
  user_id: number;
  track_name: string;
  stage_name: string;
  ai_summary: string;
  sub_tasks: SubTask[];
  progress: number;
}

export interface UserTaskCreate {
  track_name: string;
  stage_name: string;
  answers: string[];
}

export interface UserTaskUpdate {
  sub_task_index: number;
  completed: boolean;
}

export const myWorkService = {
  getTracks: () => apiService.get<Track[]>('/my-work/tracks'),
  getUserTasks: () => apiService.get<UserTask[]>('/my-work/tasks'),
  createUserTask: (data: UserTaskCreate) => apiService.post<UserTask>('/my-work/tasks', data),
  updateUserTaskProgress: (taskId: number, data: UserTaskUpdate) => 
    apiService.patch<UserTask>(`/my-work/tasks/${taskId}`, data),
};
