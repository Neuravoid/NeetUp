// Global type definitions

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export const UserRole = {
  USER: "user",
  ADMIN: "admin"
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface UserProfile {
  bio?: string;
  currentPosition?: string;
  yearsOfExperience?: number;
  skills?: string[];
  interests?: string[];
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  questions: TestQuestion[];
}

export interface TestQuestion {
  id: string;
  text: string;
  options: TestQuestionOption[];
  correctOptionId?: string;
}

export interface TestQuestionOption {
  id: string;
  text: string;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  score: number;
  skillsAssessment: Record<string, number>;
  recommendedPaths: string[];
  completedAt: string;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  avgSalary: number;
}

export interface UserRoadmap {
  id: string;
  userId: string;
  careerPathId: string;
  careerPath: CareerPath;
  startDate: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  progressPercentage: number;
  steps: RoadmapStep[];
}

export interface RoadmapStep {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  order: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completionDate?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  provider: string;
  url: string;
  durationHours: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  skillsCovered: string[];
}

export interface UserCourse {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  enrollmentDate: string;
  progressPercentage: number;
  completionDate?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
