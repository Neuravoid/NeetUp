import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  CircularProgress, 
  Typography,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  RssFeed as ActivityIcon
} from '@mui/icons-material';
import { fetchProfile } from '../store/slices/profileSlice';
import UserProfile from '../components/profile/UserProfile';
import AboutSection from '../components/profile/AboutSection';
import SkillsSection from '../components/profile/SkillsSection';
import ExperienceSection from '../components/profile/ExperienceSection';
import EducationSection from '../components/profile/EducationSection';
import Connections from '../components/profile/Connections';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => ({
  id: `profile-tab-${index}`,
  'aria-controls': `profile-tabpanel-${index}`,
});

const ProfilePage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get profile data from Redux store
  const { 
    profile, 
    loading, 
    error, 
    skills, 
    experiences, 
    education,
    connections
  } = useSelector((state) => state.profile);
  
  // Get current user ID from auth state
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const isOwnProfile = !userId || userId === currentUserId;
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Fetch profile data when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    } else {
      // If no userId in URL, fetch current user's profile
      dispatch(fetchProfile(currentUserId));
    }
  }, [dispatch, userId, currentUserId]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading && !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">
          {error.message || 'Profil yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'}
        </Typography>
      </Box>
    );
  }
  
  if (!profile) {
    return (
      <Box textAlign="center" py={4}>
        <Typography>Profil bulunamadı.</Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Profile Header */}
      <UserProfile 
        user={profile} 
        isOwnProfile={isOwnProfile} 
        connectionCount={connections?.total || 0}
      />
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        {isMobile ? (
          // Mobile view - Tabs
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="profile tabs"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 2
              }}
            >
              <Tab icon={<PersonIcon />} label="Hakkında" {...a11yProps(0)} />
              <Tab icon={<WorkIcon />} label="Deneyim" {...a11yProps(1)} />
              <Tab icon={<SchoolIcon />} label="Eğitim" {...a11yProps(2)} />
              <Tab icon={<PeopleIcon />} label="Bağlantılar" {...a11yProps(3)} />
              <Tab icon={<ActivityIcon />} label="Aktivite" {...a11yProps(4)} />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              <AboutSection about={profile.about} isOwnProfile={isOwnProfile} />
              <SkillsSection skills={skills} isOwnProfile={isOwnProfile} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <ExperienceSection experiences={experiences} isOwnProfile={isOwnProfile} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <EducationSection education={education} isOwnProfile={isOwnProfile} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Connections isOwnProfile={isOwnProfile} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={4}>
              <Box py={4} textAlign="center">
                <Typography>Son etkinlikler burada görünecek</Typography>
              </Box>
            </TabPanel>
          </Box>
        ) : (
          // Desktop view - Sidebar + Main content
          <Box display="flex" gap={4}>
            {/* Left Sidebar */}
            <Box width={280} flexShrink={0}>
              <AboutSection about={profile.about} isOwnProfile={isOwnProfile} />
              <SkillsSection skills={skills} isOwnProfile={isOwnProfile} />
            </Box>
            
            {/* Main Content */}
            <Box flex={1}>
              <ExperienceSection experiences={experiences} isOwnProfile={isOwnProfile} />
              <EducationSection education={education} isOwnProfile={isOwnProfile} />
              <Connections isOwnProfile={isOwnProfile} />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProfilePage;
