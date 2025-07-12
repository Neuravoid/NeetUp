import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Paper,
  Link,
  CircularProgress,
  Grid
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector(state => state.auth);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.full_name.trim()) {
      errors.full_name = 'Ad Soyad gerekli';
    }
    
    if (!formData.email) {
      errors.email = 'E-posta gerekli';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    if (!formData.password) {
      errors.password = 'Şifre gerekli';
    } else if (formData.password.length < 8) {
      errors.password = 'Şifre en az 8 karakter olmalıdır';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registrationData } = formData;
    
    try {
      await dispatch(register(registrationData)).unwrap();
      // Redirect to email verification page
      navigate('/verify-email', { state: { email: formData.email }});
    } catch (err) {
      // Error will be handled by the Redux slice and shown in the UI
      console.error('Registration failed:', err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Kayıt Ol
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'object' ? error.detail || 'Kayıt başarısız' : error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="full_name"
          label="Ad Soyad"
          name="full_name"
          autoComplete="name"
          autoFocus
          value={formData.full_name}
          onChange={handleChange}
          error={!!formErrors.full_name}
          helperText={formErrors.full_name}
          disabled={loading}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="E-posta Adresi"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          disabled={loading}
        />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Şifreyi Onayla"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              disabled={loading}
            />
          </Grid>
        </Grid>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Kayıt Ol'}
        </Button>
        
        <Box sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            Zaten hesabın var mı? Giriş yap
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default RegisterForm;
