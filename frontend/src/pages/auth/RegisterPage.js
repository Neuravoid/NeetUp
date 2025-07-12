import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Link,
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { register, clearError } from '../../store/slices/authSlice';

// Custom text input with icon
const CustomTextField = ({ icon, error, helperText, ...props }) => (
  <TextField
    fullWidth
    margin="normal"
    variant="outlined"
    error={!!error}
    helperText={error || helperText}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          {icon}
        </InputAdornment>
      ),
    }}
    {...props}
  />
);

const RegisterPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  const steps = ['Account', 'Profile', 'Interests'];
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    title: 'student',
    organization: '',
    interests: [],
    skills: [],
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [backendError, setBackendError] = useState(null);
  const [currentInterest, setCurrentInterest] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle backend errors
  useEffect(() => {
    if (error) {
      if (Array.isArray(error)) {
        // Handle validation errors from backend
        const newErrors = {};
        error.forEach(err => {
          const field = err.loc?.[1] || 'general';
          newErrors[field] = formatErrorMessage(err.msg || 'Invalid input');
        });
        setFormErrors(newErrors);
      } else if (typeof error === 'string') {
        setBackendError(error);
      } else if (error.message) {
        setBackendError(error.message);
      }
    }
  }, [error]);

  // Format error messages to be more user-friendly
  const formatErrorMessage = (message) => {
    if (!message) return 'An error occurred';
    
    // Map common validation messages
    const messageMap = {
      'field required': 'This field is required',
      'string_too_short': 'Value is too short',
      'string_too_long': 'Value is too long',
      'string_pattern_mismatch': 'Invalid format',
      'email': 'Please enter a valid email address',
      'passwords do not match': 'Passwords do not match',
    };
    
    // Check for common patterns and replace with friendly messages
    for (const [key, value] of Object.entries(messageMap)) {
      if (message.toLowerCase().includes(key)) {
        return value;
      }
    }
    
    // Default: capitalize first letter and add period if missing
    return message.charAt(0).toUpperCase() + message.slice(1).replace(/\.?$/, '');
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      // Validate email
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      // Validate password
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      // Validate confirm password
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (step === 1) {
      if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
      if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        // On final step, submit the form
        const registrationData = {
          email: formData.email,
          password: formData.password,
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          title: formData.title || null,
          organization: formData.organization || null,
          interests: formData.interests.length > 0 ? formData.interests.join(', ') : null,
          skills: formData.skills.length > 0 ? formData.skills.join(', ') : null
        };
        
        try {
          const result = await dispatch(register(registrationData)).unwrap();
          // If we get here, registration was successful
          navigate('/verify-email');
        } catch (error) {
          // Handle different error formats
          if (error.errors) {
            const apiErrors = {};
            error.errors.forEach(err => {
              const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : 'general';
              apiErrors[field] = err.msg || 'Invalid input';
            });
            setFormErrors(apiErrors);
          } else if (error.message) {
            setBackendError(error.message);
          } else {
            setBackendError('Registration failed. Please try again.');
          }
        }
      } else {
        handleNext();
      }
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    
    // Clear field error when user types
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: null });
    }
    
    // Clear general backend error when any field changes
    if (backendError) {
      setBackendError(null);
    }
  };

  const handleAddInterest = () => {
    if (currentInterest.trim() && !formData.interests.includes(currentInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, currentInterest.trim()]
      });
      setCurrentInterest('');
    }
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interestToRemove)
    });
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        alignItems: 'center',
        py: 4
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, md: 4 },
            width: '100%',
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            overflow: 'hidden',
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }
          }}
        >
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography component="h1" variant="h4" sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1
              }}>
                Create Your Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join our community of professionals and students
              </Typography>
            </Box>
            
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel 
              sx={{ 
                mb: 4,
                '& .MuiStepIcon-root.Mui-active': {
                  color: theme.palette.primary.main,
                },
                '& .MuiStepIcon-root.Mui-completed': {
                  color: theme.palette.success.main,
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel 
                    StepIconProps={{
                      sx: {
                        '&.Mui-active': {
                          color: theme.palette.primary.main,
                        },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {backendError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 1,
                  alignItems: 'center',
                }}
              >
                {backendError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <Box>
                  <CustomTextField
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    icon={<EmailIcon color={formErrors.email ? 'error' : 'action'} />}
                  />
                  
                  <CustomTextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    error={!!formErrors.password}
                    helperText={formErrors.password || 'At least 8 characters'}
                    icon={<LockIcon color={formErrors.password ? 'error' : 'action'} />}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <CustomTextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    icon={<LockIcon color={formErrors.confirmPassword ? 'error' : 'action'} />}
                  />
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        error={!!formErrors.firstName}
                        helperText={formErrors.firstName}
                        icon={<PersonIcon color={formErrors.firstName ? 'error' : 'action'} />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        error={!!formErrors.lastName}
                        helperText={formErrors.lastName}
                        icon={<PersonIcon color={formErrors.lastName ? 'error' : 'action'} />}
                      />
                    </Grid>
                  </Grid>

                  <FormControl fullWidth margin="normal">
                    <InputLabel id="title-label">I am a</InputLabel>
                    <Select
                      labelId="title-label"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange('title')}
                      label="I am a"
                      startAdornment={
                        <InputAdornment position="start" sx={{ mr: 1 }}>
                          <WorkIcon />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="professional">Professional</MenuItem>
                      <MenuItem value="educator">Educator</MenuItem>
                      <MenuItem value="researcher">Researcher</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>

                  <CustomTextField
                    id="organization"
                    name="organization"
                    label={formData.title === 'student' ? 'School/University' : 'Company/Organization'}
                    value={formData.organization}
                    onChange={handleInputChange('organization')}
                    icon={<SchoolIcon />}
                  />
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      What are you interested in?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="e.g. Machine Learning, Web Development"
                        value={currentInterest}
                        onChange={(e) => setCurrentInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FavoriteIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button 
                                variant="contained" 
                                size="small"
                                onClick={handleAddInterest}
                                disabled={!currentInterest.trim()}
                              >
                                Add
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40, mt: 1 }}>
                      {formData.interests.map((interest, index) => (
                        <Chip
                          key={index}
                          label={interest}
                          onDelete={() => handleRemoveInterest(interest)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Your skills
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="e.g. Python, React, Project Management"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CodeIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button 
                                variant="contained" 
                                size="small"
                                onClick={handleAddSkill}
                                disabled={!currentSkill.trim()}
                              >
                                Add
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40, mt: 1 }}>
                      {formData.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={() => handleRemoveSkill(skill)}
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`
              }}>
                <Button
                  disabled={activeStep === 0 || loading}
                  onClick={handleBack}
                  sx={{ minWidth: 100 }}
                  variant="outlined"
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        minWidth: 180,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        '&:hover': {
                          boxShadow: theme.shadows[4],
                        },
                      }}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={loading}
                      sx={{
                        minWidth: 100,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        '&:hover': {
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center', pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/login" 
                  color="primary"
                  sx={{ fontWeight: 500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
