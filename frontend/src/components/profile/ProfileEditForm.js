import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import profileService from '../../api/profile';

const ProfileEditForm = ({ profile, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    linkedin: '',
    github: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Initialize form with profile data when it loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        github: profile.github || ''
      });
      
      if (profile.profile_picture_url) {
        setPreviewUrl(profile.profile_picture_url);
      }
    }
  }, [profile]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset messages when user changes input
    setError('');
    setSuccess(false);
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Lütfen sadece JPG, JPEG veya PNG yükleyin.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
    
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // First update profile data
      await profileService.updateProfile(formData);
      
      // Then update profile picture if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await profileService.updateProfilePicture(formData);
      }
      
      setSuccess(true);
      
      // Call parent callback with updated data
      if (onSave) {
        onSave({
          ...formData,
          profile_picture_url: previewUrl
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {getErrorMessage(error)}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profil başarıyla güncellendi.
          </Alert>
        )}
        
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            src={previewUrl}
            sx={{ width: 100, height: 100, mb: 2 }}
            alt={formData.full_name}
          />
          
          <Box sx={{ position: 'relative' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-input"
              type="file"
              onChange={handleFileChange}
              disabled={loading}
            />
            <label htmlFor="profile-picture-input">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                disabled={loading}
              >
                <PhotoCamera />
              </IconButton>
            </label>
            <Typography variant="caption">Profil fotoğrafını değiştir</Typography>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="full_name"
              label="Ad Soyad"
              name="full_name"
              autoComplete="name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
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
              disabled={true} // Email should not be changed here
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin="normal"
              fullWidth
              id="bio"
              label="Hakkımda"
              name="bio"
              multiline
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              fullWidth
              id="location"
              label="Konum"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="Telefon"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              fullWidth
              id="linkedin"
              label="LinkedIn"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://linkedin.com/in/username"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              fullWidth
              id="github"
              label="GitHub"
              name="github"
              value={formData.github}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://github.com/username"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin="normal"
              fullWidth
              id="website"
              label="Web Sitesi"
              name="website"
              value={formData.website}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://example.com"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Değişiklikleri Kaydet'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileEditForm;
