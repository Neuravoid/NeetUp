import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load components for better performance
const OpportunitiesPage = lazy(() => import('../pages/opportunities/OpportunitiesPage'));
const OpportunityDetailPage = lazy(() => import('../pages/opportunities/OpportunityDetailPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));

// Auth components
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const EmailVerificationPage = lazy(() => import('../pages/auth/EmailVerificationPage'));

// Public routes that don't require authentication
const publicRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/verify-email',
    element: <EmailVerificationPage />,
  },
];

// Protected routes that require authentication
const protectedRoutes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/opportunities',
    element: <OpportunitiesPage />,
  },
  {
    path: '/opportunities/:type/:id',
    element: <OpportunityDetailPage />,
  },
];

export { publicRoutes, protectedRoutes };
