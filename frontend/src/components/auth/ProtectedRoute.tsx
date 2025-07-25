import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'user' }) => {
  const { isAuthenticated, isLoading, user } = useAppSelector(state => state.auth);
  const location = useLocation();

  // Eğer yükleniyorsa, yükleniyor göster
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rol kontrolü gerekliyse ve kullanıcının yetkisi yoksa, yetki hatası sayfasına yönlendir
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Tüm kontroller başarılıysa, çocuk bileşenleri render et
  return <>{children}</>;
};

export default ProtectedRoute;
