import React, { useState } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { forgotPassword } from '../../store/slices/authSlice';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(forgotPassword({ email }));
    if (!result.error) {
      setSubmitted(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Reset Your Password
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{getErrorMessage(error)}</Alert>}
        
        {submitted ? (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Password reset instructions have been sent to your email address.
            </Alert>
            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
              Please check your inbox and follow the instructions to reset your password.
            </Typography>
            <Button 
              component={RouterLink} 
              to="/login"
              variant="contained" 
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleChange}
              helperText="Enter the email address associated with your account"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !email}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Remember your password? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
