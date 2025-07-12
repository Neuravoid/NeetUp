import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../../store/slices/authSlice';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading } = useSelector(state => state.auth);
  
  // Get email from location state or localStorage
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, try to get from localStorage or redirect back
      const storedEmail = localStorage.getItem('verification_email');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        navigate('/register');
      }
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Doğrulama kodu gerekli');
      return;
    }
    
    try {
      await dispatch(verifyEmail({ email, verification_code: verificationCode })).unwrap();
      setSuccess(true);
      
      // Remove stored email from localStorage
      localStorage.removeItem('verification_email');
      
      // Redirect to login after successful verification
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.detail || 'Doğrulama başarısız. Lütfen tekrar deneyiniz.');
    }
  };

  const handleResendCode = () => {
    // API call to resend verification code
    // This would typically be implemented in your auth service
    // For now, just show a message
    alert('Yeni doğrulama kodu gönderildi!');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        E-posta Doğrulama
      </Typography>
      
      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          E-posta adresiniz başarıyla doğrulandı! Giriş sayfasına yönlendiriliyorsunuz...
        </Alert>
      ) : (
        <>
          <Typography variant="body1" gutterBottom align="center" sx={{ mb: 3 }}>
            <strong>{email}</strong> adresine gönderilen doğrulama kodunu giriniz
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {getErrorMessage(error)}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="verification_code"
              label="Doğrulama Kodu"
              name="verification_code"
              autoFocus
              value={verificationCode}
              onChange={handleChange}
              disabled={loading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Doğrula'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                variant="text" 
                onClick={handleResendCode}
                disabled={loading}
              >
                Kodu tekrar gönder
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default EmailVerification;
