import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Link,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { verifyEmail, resendVerificationEmail } from '../../store/slices/authSlice';

const EmailVerificationPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, error, user } = useSelector((state) => state.auth);
  
  const [verificationStatus, setVerificationStatus] = useState({
    verified: false,
    loading: false,
    error: null,
  });
  const [resendStatus, setResendStatus] = useState({
    sent: false,
    loading: false,
    error: null
  });

  // Extract token from URL query params if present
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    
    if (token) {
      verifyWithToken(token);
    }
  }, [location]);

  const verifyWithToken = async (token) => {
    setVerificationStatus({ ...verificationStatus, loading: true, error: null });
    
    try {
      const result = await dispatch(verifyEmail({ token })).unwrap();
      setVerificationStatus({ 
        verified: true, 
        loading: false, 
        error: null
      });
    } catch (error) {
      setVerificationStatus({ 
        verified: false, 
        loading: false, 
        error: error.message || 'Verification failed. Please try again.'
      });
    }
  };

  const handleResendVerification = async () => {
    setResendStatus({ ...resendStatus, loading: true, error: null });
    
    try {
      const result = await dispatch(resendVerificationEmail({ email: user?.email })).unwrap();
      setResendStatus({ 
        sent: true, 
        loading: false, 
        error: null
      });
    } catch (error) {
      setResendStatus({ 
        sent: false, 
        loading: false, 
        error: error.message || 'Failed to resend verification email. Please try again.'
      });
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Email Verification
        </Typography>
        
        {verificationStatus.error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {verificationStatus.error}
          </Alert>
        )}
        
        {verificationStatus.verified ? (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Your email has been successfully verified!
            </Alert>
            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
              Thank you for verifying your email address. You can now access all features of the platform.
            </Typography>
            <Button 
              component={RouterLink} 
              to="/login"
              variant="contained" 
              sx={{ mt: 2 }}
            >
              Continue to Login
            </Button>
          </Box>
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
              Please verify your email address to complete your registration.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We've sent a verification link to your email address. Click the link in the email to verify your account.
            </Typography>
            
            {resendStatus.sent ? (
              <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                Verification email has been resent. Please check your inbox.
              </Alert>
            ) : (
              <Box>
                {resendStatus.error && (
                  <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                    {resendStatus.error}
                  </Alert>
                )}
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Didn't receive an email?
                </Typography>
                
                <Button
                  variant="outlined"
                  onClick={handleResendVerification}
                  disabled={resendStatus.loading}
                  sx={{ mb: 3 }}
                >
                  {resendStatus.loading ? <CircularProgress size={24} /> : 'Resend Verification Email'}
                </Button>
              </Box>
            )}
            
            <Box sx={{ mt: 3 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Return to Login
              </Link>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default EmailVerificationPage;
