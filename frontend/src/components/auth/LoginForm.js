import React, { useState } from 'react';
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    try {
      console.log('Dispatching login action...');
      const result = await dispatch(login(formData));
      console.log('Login action result:', result);
      
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('Login successful, token:', result.payload.access_token);
        localStorage.setItem('auth_token', result.payload.access_token);
        console.log('Token saved to localStorage, redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        console.error('Login failed with payload:', result.payload);
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error in handleSubmit:', err);
    }
    return false; // Prevent form submission
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Giriş Yap
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'object' ? error.detail || 'Giriş başarısız' : error}
        </Alert>
      )}
      
      <Box 
        component="form" 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }} 
        noValidate
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="E-posta Adresi"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Şifre"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
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
          {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
        </Button>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            Şifreni mi unuttun?
          </Link>
          <Link component={RouterLink} to="/register" variant="body2">
            Hesabın yok mu? Kayıt ol
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;
