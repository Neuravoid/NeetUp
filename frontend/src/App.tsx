import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './hooks/reduxHooks';
import { Toaster } from 'react-hot-toast';

// Layout
import Layout from './components/layout/Layout.tsx';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext.tsx';

// Pages
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage.tsx';
import MyWorkPage from './pages/study-plan/MyWorkPage.tsx';
import RoadmapPage from './pages/roadmap/RoadmapPage.tsx';
import SkillsPage from './pages/skills/SkillsPage.tsx';
import CoursesPage from './pages/courses/CoursesPage.tsx';
import ProfilePage from './pages/profile/ProfilePage.tsx';
import KnowledgeTestPage from './pages/KnowledgeTestPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import UnauthorizedPage from './pages/UnauthorizedPage.tsx';
import JobListingsPage from './pages/jobs/JobListingsPage.tsx';
import WeeklyPlanPage from './pages/WeeklyPlanPage.tsx';
import ChatPage from './pages/ChatPage.tsx';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage.tsx';

// Protected Route
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

// This component handles the root route logic
const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Toaster position="top-right" />
        <Router>
          <Routes>
            {/* Public Routes & Root Handler */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/study-plan" element={<MyWorkPage />} />

              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/jobs" element={<JobListingsPage />} />
              <Route path="/weekly-plan" element={<WeeklyPlanPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/analytics" element={<AnalyticsDashboardPage />} />
              
              {/* Knowledge Test Route */}
              <Route path="/knowledge-test/:testId" element={<KnowledgeTestPage />} />
              
              {/* Admin routes - Example */}
              {/* <Route path="admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } /> */}
              
              {/* Error pages */}
              <Route path="unauthorized" element={<UnauthorizedPage />} />
              <Route path="404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
