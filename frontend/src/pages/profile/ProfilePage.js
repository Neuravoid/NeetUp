import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { useSelector } from 'react-redux';
import ProfileEditForm from '../../components/profile/ProfileEditForm';
import SkillsEditor from '../../components/profile/SkillsEditor';
import profileService from '../../api/profile';

// Sample profile data for development if API isn't ready
const SAMPLE_PROFILE = {
  full_name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@example.com',
  bio: 'Yazılım geliştirme tutkunu, sürekli öğrenmeyi seven bir bilgisayar mühendisi.',
  location: 'İstanbul, Türkiye',
  phone: '+90 555 123 4567',
  website: 'https://ahmetyilmaz.com',
  linkedin: 'https://linkedin.com/in/ahmetyilmaz',
  github: 'https://github.com/ahmetyilmaz',
  profile_picture_url: null
};

// Tab panel component for profile sections
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Load user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const profileData = await profileService.getProfile();
        setProfile(profileData);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Profil bilgileri yüklenirken bir hata oluştu.');
        
        // Use sample data for development if API fails
        setProfile(SAMPLE_PROFILE);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle profile update
  const handleProfileUpdate = (updatedProfile) => {
    setProfile({
      ...profile,
      ...updatedProfile
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profil
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {getErrorMessage(error)}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Profil Bilgileri" id="profile-tab-0" aria-controls="profile-tabpanel-0" />
            <Tab label="Beceriler" id="profile-tab-1" aria-controls="profile-tabpanel-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <ProfileEditForm profile={profile} onSave={handleProfileUpdate} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <SkillsEditor />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
