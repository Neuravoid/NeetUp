import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';

// Layout
import Layout from './components/layout/Layout.tsx';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext.tsx';

// Pages
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import RoadmapPage from './pages/roadmap/RoadmapPage.tsx';
import SkillsPage from './pages/skills/SkillsPage.tsx';
import CoursesPage from './pages/courses/CoursesPage.tsx';
import ProfilePage from './pages/profile/ProfilePage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import UnauthorizedPage from './pages/UnauthorizedPage.tsx';

// Protected Route
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Toaster position="top-right" />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
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
