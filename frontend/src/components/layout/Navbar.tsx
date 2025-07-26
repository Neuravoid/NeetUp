import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import PersonalityTestModal from '../PersonalityTestModal';
import { type PersonalityTestResult } from '../../services/personality-test.service';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPersonalityTest, setShowPersonalityTest] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handlePersonalityTestClick = () => {
    setShowPersonalityTest(true);
  };

  const handleTestComplete = async (_result: PersonalityTestResult) => {
    setShowPersonalityTest(false);
    // Navigate to roadmap page after test completion
    navigate('/roadmap');
  };
  
  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                NeetUp
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-primary/20 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
                </svg>
                <span>Dashboard</span>
              </Link>
              <Link to="/roadmap" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-primary/20 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Kariyer Yolları</span>
              </Link>
              <Link to="/skills" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-primary/20 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Beceriler</span>
              </Link>
              <Link to="/courses" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-primary/20 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Kurslar</span>
              </Link>
              {isAuthenticated && (
                <button 
                  onClick={handlePersonalityTestClick}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Envanter Testi</span>
                </button>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onBlur={(e) => {
                      // Only close if clicking outside the dropdown
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setTimeout(() => setIsDropdownOpen(false), 150);
                      }
                    }}
                  >
                    <span>{user?.firstName} {user?.lastName}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profil
                        </Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-600">
                  Giriş Yap
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-600">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              Dashboard
            </Link>
            <Link to="/roadmap" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              Kariyer Yolları
            </Link>
            <Link to="/skills" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              Beceriler
            </Link>
            <Link to="/courses" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              Kurslar
            </Link>
            {isAuthenticated && (
              <button 
                onClick={handlePersonalityTestClick}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Envanter Testi
              </button>
            )}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
              <div className="px-2 py-3 space-y-1">
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
                  Profil
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="px-2 py-3 space-y-1">
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
                  Giriş Yap
                </Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary-600 py-2 px-3 rounded-md">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Personality Test Modal */}
      {showPersonalityTest && (
        <PersonalityTestModal
          isOpen={showPersonalityTest}
          onClose={() => setShowPersonalityTest(false)}
          onComplete={handleTestComplete}
        />
      )}
    </nav>
  );
};

export default Navbar;
