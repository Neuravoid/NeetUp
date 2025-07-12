import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Container, 
  CssBaseline, 
  Typography, 
  Paper, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CssBaseline />
      
      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 3,
          px: { xs: 2, sm: 4 },
          backgroundColor: 'background.paper',
          boxShadow: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="img"
                src="/logo.png" // Replace with your logo path
                alt="NeetUp"
                sx={{
                  height: 40,
                  mr: 2,
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                NeetUp
              </Typography>
            </Box>
            
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Already have an account?{' '}
                <Typography 
                  component="a" 
                  href="/login"
                  color="primary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign In
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {/* Left side - Illustration/Content */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                maxWidth: isMobile ? '100%' : '50%',
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  lineHeight: 1.2,
                  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Find Your Perfect Career Path
              </Typography>
              
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Join thousands of professionals who have found their dream jobs, courses, and projects through our platform.
              </Typography>
              
              <Box
                component="ul"
                sx={{
                  pl: 2,
                  mb: 4,
                  '& li': {
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '& svg': {
                    color: 'success.main',
                    mr: 1.5,
                  },
                }}
              >
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                  <span>Personalized job recommendations</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                  <span>Skill development courses</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                  <span>Connect with industry experts</span>
                </li>
              </Box>
              
              <Box
                component="img"
                src="/auth-illustration.svg" // Replace with your illustration path
                alt="Career growth illustration"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  mt: 'auto',
                  alignSelf: 'center',
                  display: { xs: 'none', md: 'block' },
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </Box>
            
            {/* Right side - Form */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, sm: 4, md: 6 },
                borderRadius: 4,
                width: '100%',
                maxWidth: 500,
                mx: 'auto',
                backgroundColor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                },
              }}
            >
              <Outlet />
            </Paper>
          </Box>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          backgroundColor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} NeetUp. All rights reserved.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, mt: { xs: 2, sm: 0 } }}>
              <Typography 
                component="a" 
                href="/privacy" 
                variant="body2" 
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Privacy Policy
              </Typography>
              <Typography 
                component="a" 
                href="/terms" 
                variant="body2" 
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Terms of Service
              </Typography>
              <Typography 
                component="a" 
                href="/contact" 
                variant="body2" 
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Contact Us
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;
