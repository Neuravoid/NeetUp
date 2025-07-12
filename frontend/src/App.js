import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Provider, useSelector } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import tr from 'date-fns/locale/tr';

// Import store and theme
import { store } from './store/store';
import theme from './theme';

// Import routes
import { publicRoutes, protectedRoutes } from './routes';

// Lazy load layout components
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));

// Create theme instance
const appTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'light', // or 'dark'
  },
});

// Loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div>Loading...</div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  
  if (isLoading) {
    return <Loading />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
        <EmotionThemeProvider theme={appTheme}>
          <ThemeProvider theme={appTheme}>
            <SnackbarProvider 
              maxSnack={3} 
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              autoHideDuration={3000}
            >
              <CssBaseline />
              <Suspense fallback={<Loading />}>
                <Router>
                  <Routes>
                    {/* Auth routes */}
                    <Route element={<AuthLayout />}>
                      {publicRoutes.map((route, index) => (
                        <Route 
                          key={index} 
                          path={route.path} 
                          element={route.element} 
                        />
                      ))}
                    </Route>
                    
                    {/* Protected routes */}
                    <Route 
                      element={
                        <ProtectedRoute>
                          <MainLayout />
                        </ProtectedRoute>
                      }
                    >
                      {protectedRoutes.map((route, index) => (
                        <Route 
                          key={index} 
                          path={route.path} 
                          element={route.element} 
                        />
                      ))}
                    </Route>
                    
                    {/* 404 route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Router>
              </Suspense>
            </SnackbarProvider>
          </ThemeProvider>
        </EmotionThemeProvider>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
