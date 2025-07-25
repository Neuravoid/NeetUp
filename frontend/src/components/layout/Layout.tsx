import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { getCurrentUser } from '../../store/slices/authSlice';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector(state => state.auth);
  const hasCalledGetCurrentUser = useRef(false);

  // Kullanıcı giriş yapmışsa ve user bilgisi yoksa, kullanıcı bilgilerini yükle (sadece bir kez)
  useEffect(() => {
    if (isAuthenticated && !user && !isLoading && !hasCalledGetCurrentUser.current) {
      hasCalledGetCurrentUser.current = true;
      dispatch(getCurrentUser());
    }
    
    // Kullanıcı çıkış yaptığında ref'i sıfırla
    if (!isAuthenticated) {
      hasCalledGetCurrentUser.current = false;
    }
  }, [dispatch, isAuthenticated, user, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} NeetUp. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
