import React, { useState } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Paper,
  Link,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import authService from '../../api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('E-posta adresi gerekli');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Geçerli bir e-posta adresi giriniz');
      return;
    }
    
    setLoading(true);
    
    try {
      await authService.resetPassword(email);
      setSuccess(true);
      setError('');
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Şifre sıfırlama e-postası gönderilemedi. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Şifremi Unuttum
      </Typography>
      
      {success ? (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>
            Şifre sıfırlama talimatları e-posta adresinize gönderildi.
          </Alert>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            E-postanızı kontrol edin ve şifrenizi sıfırlamak için gelen linke tıklayın.
          </Typography>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Giriş sayfasına dön
            </Link>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="body1" gutterBottom align="center" sx={{ mb: 3 }}>
            Şifrenizi sıfırlamak için kayıtlı e-posta adresinizi girin
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {getErrorMessage(error)}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
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
              {loading ? <CircularProgress size={24} /> : 'Şifre Sıfırlama Bağlantısı Gönder'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Giriş sayfasına dön
              </Link>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ForgotPassword;
