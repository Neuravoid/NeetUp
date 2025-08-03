import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import PersonalityTest from '../tests/PersonalityTest';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPersonalityTest, setShowPersonalityTest] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handlePersonalityTestClick = () => {
    setShowPersonalityTest(true);
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
              <Link to="/skills" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Beceriler</span>
              </Link>
              <Link to="/courses" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Kurslar</span>
              </Link>
              <Link to="/jobs" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>İş İlanları</span>
              </Link>
              <Link to="/weekly-plan" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Haftalık Plan</span>
              </Link>
              <Link to="/study-plan" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Çalışmalarım</span>
              </Link>
              <Link to="/chat" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <span className="text-lg">✨</span>
                <span>NeetUp Spark</span>
              </Link>
              <Link to="/analytics" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Analitik Panelim</span>
              </Link>
              {isAuthenticated && (
                <button 
                  onClick={handlePersonalityTestClick}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
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
                        <Link 
                          to="/study-plan" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Çalışmalarım
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
            <Link to="/roadmap" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              Kariyer Yolları
            </Link>
            <Link to="/skills" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              Beceriler
            </Link>
            <Link to="/courses" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              Kurslar
            </Link>
            <Link to="/jobs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              İş İlanları
            </Link>
            <Link to="/weekly-plan" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              Haftalık Plan
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
       <PersonalityTest
       isOpen={showPersonalityTest}
       onClose={() => setShowPersonalityTest(false)}
     />
      )}
    </nav>
  );
};

export default Navbar;
