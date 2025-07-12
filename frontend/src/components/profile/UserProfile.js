import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Avatar, 
  Button, 
  IconButton, 
  Divider, 
  useTheme, 
  useMediaQuery,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Message as MessageIcon,
  ConnectWithoutContact as ConnectIcon,
  MoreVert as MoreIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { fetchUserProfile } from '../../api/profile';
import { setCurrentProfile } from '../../features/profile/profileSlice';
import ActivityFeed from './ActivityFeed';
import Connections from './Connections';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { currentUser } = useSelector((state) => state.auth);
  const { currentProfile, loading, error } = useSelector((state) => state.profile);
  
  const [activeTab, setActiveTab] = useState('activity');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would fetch from the API
        // For now, we'll use mock data
        const mockProfile = {
          id: userId || 'current-user',
          name: 'Ahmet Yılmaz',
          headline: 'Frontend Developer @TechCorp',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          coverImage: 'https://source.unsplash.com/random/1200x300/?tech',
          location: 'İstanbul, Türkiye',
          connections: 342,
          isConnected: false,
          isFollowing: true,
          about: 'Merhaba! Ben Ahmet. 5 yılı aşkın süredir frontend geliştirici olarak çalışıyorum. React, TypeScript ve modern web teknolojileri konusunda deneyimliyim. Açık kaynak projelere katkıda bulunmayı ve yeni teknolojiler öğrenmeyi seviyorum.',
          skills: [
            { name: 'JavaScript', level: 90 },
            { name: 'React', level: 85 },
            { name: 'TypeScript', level: 80 },
            { name: 'Node.js', level: 75 },
            { name: 'CSS/SCSS', level: 85 },
            { name: 'Redux', level: 80 },
          ],
          experience: [
            {
              id: 1,
              title: 'Frontend Developer',
              company: 'TechCorp',
              location: 'İstanbul, Türkiye',
              startDate: '2020-01-01',
              endDate: null,
              current: true,
              description: 'Frontend ekip lideri olarak görev yapıyorum. React ve TypeScript kullanarak ölçeklenebilir web uygulamaları geliştiriyorum.'
            },
            {
              id: 2,
              title: 'Frontend Developer',
              company: 'WebSolutions',
              location: 'Ankara, Türkiye',
              startDate: '2018-03-15',
              endDate: '2019-12-31',
              current: false,
              description: 'Müşteri odaklı web uygulamaları geliştirdim. React ve Redux kullanarak kullanıcı arayüzleri oluşturdum.'
            }
          ],
          education: [
            {
              id: 1,
              school: 'Boğaziçi Üniversitesi',
              degree: 'Bilgisayar Mühendisliği',
              field: 'Yazılım Mühendisliği',
              startDate: '2014-09-01',
              endDate: '2018-06-30',
              description: 'Lisans derecesi'
            }
          ],
          recentActivity: [
            {
              id: 1,
              type: 'post',
              title: 'React 18 Yenilikleri',
              content: 'React 18 ile gelen Concurrent Rendering ve Automatic Batching gibi özellikleri inceledim.',
              date: '2023-06-15T14:30:00Z',
              likes: 24,
              comments: 5,
              shares: 3
            },
            {
              id: 2,
              type: 'event',
              title: 'JavaScript Konferansı 2023',
              content: 'JavaScript Konferansı 2023\'e katıldım. Harika konuşmalar ve workshoplar vardı!',
              date: '2023-05-20T10:00:00Z',
              eventDate: '2023-05-19T09:00:00Z',
              location: 'İstanbul, Türkiye',
              attendees: 150
            },
            {
              id: 3,
              type: 'certification',
              title: 'Advanced React Patterns',
              content: 'Advanced React Patterns sertifikasını aldım!',
              date: '2023-04-10T16:45:00Z',
              issuer: 'Frontend Masters'
            }
          ],
          connectionsList: [
            {
              id: 'user2',
              name: 'Ayşe Kaya',
              title: 'UI/UX Designer',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
              connectedDate: '2023-01-15T11:30:00Z'
            },
            {
              id: 'user3',
              name: 'Mehmet Demir',
              title: 'Backend Developer',
              avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
              connectedDate: '2022-11-05T14:20:00Z'
            },
            {
              id: 'user4',
              name: 'Zeynep Yıldız',
              title: 'Full Stack Developer',
              avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
              connectedDate: '2022-09-20T09:15:00Z'
            }
          ]
        };
        
        dispatch(setCurrentProfile(mockProfile));
        setIsOwnProfile(userId === currentUser?.id || !userId);
        setIsConnected(mockProfile.isConnected || false);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [userId, dispatch, currentUser]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleConnect = () => {
    // In a real app, this would call an API
    setIsConnected(!isConnected);
  };
  
  const handleMessage = () => {
    // Navigate to messages with this user
    navigate('/messages', { state: { userId: currentProfile.id } });
  };
  
  const handleEditProfile = () => {
    navigate('/profile/edit');
  };
  
  if (isLoading || !currentProfile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error loading profile: {getErrorMessage(error)}</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 2, mb: 4 }}>
      {/* Cover Photo */}
      <Paper 
        elevation={0} 
        sx={{ 
          position: 'relative',
          height: 200,
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
          bgcolor: 'grey.100'
        }}
      >
        {currentProfile.coverImage && (
          <Box
            component="img"
            src={currentProfile.coverImage}
            alt="Cover"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}
        
        {/* Profile Info */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: isMobile ? -60 : -80,
            left: isMobile ? 16 : 32,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            width: isMobile ? 'calc(100% - 32px)' : 'auto',
          }}
        >
          <Avatar 
            src={currentProfile.avatar} 
            alt={currentProfile.name}
            sx={{
              width: isMobile ? 100 : 160,
              height: isMobile ? 100 : 160,
              border: '4px solid white',
              bgcolor: 'primary.main',
              fontSize: isMobile ? 40 : 60,
              mb: isMobile ? 1 : 0,
              mr: isMobile ? 0 : 3
            }}
          >
            {currentProfile.name.charAt(0)}
          </Avatar>
          
          <Box sx={{ 
            mt: isMobile ? 8 : 0,
            textAlign: isMobile ? 'center' : 'left',
            width: isMobile ? '100%' : 'auto'
          }}>
            <Typography variant="h4" fontWeight="bold">
              {currentProfile.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {currentProfile.headline}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {currentProfile.location && (
                <Chip 
                  icon={<LocationIcon fontSize="small" />} 
                  label={currentProfile.location} 
                  size="small" 
                  variant="outlined"
                />
              )}
              <Chip 
                icon={<PeopleIcon fontSize="small" />} 
                label={`${currentProfile.connections} bağlantı`} 
                size="small" 
                variant="outlined"
                onClick={() => setActiveTab('connections')}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          </Box>
          
          {/* Action Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1, 
              mt: isMobile ? 2 : 0,
              ml: isMobile ? 0 : 'auto',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            {isOwnProfile ? (
              <Button 
                variant="contained" 
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
                fullWidth={isMobile}
              >
                Profili Düzenle
              </Button>
            ) : (
              <>
                <Button 
                  variant={isConnected ? "outlined" : "contained"} 
                  startIcon={isConnected ? <CheckCircleIcon /> : <ConnectIcon />}
                  onClick={handleConnect}
                  fullWidth={isMobile}
                >
                  {isConnected ? 'Bağlı' : 'Bağlan'}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<MessageIcon />}
                  onClick={handleMessage}
                  fullWidth={isMobile}
                >
                  Mesaj Gönder
                </Button>
              </>
            )}
            <IconButton>
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
      
      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3, mt: isMobile ? 10 : 8 }}>
        {/* Left Sidebar */}
        <Box sx={{ width: isMobile ? '100%' : 300, flexShrink: 0 }}>
          <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Hakkında
            </Typography>
            <AboutSection about={currentProfile.about} />
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Yetkinlikler
            </Typography>
            <SkillsSection skills={currentProfile.skills} isOwnProfile={isOwnProfile} />
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Deneyim
            </Typography>
            <ExperienceSection experiences={currentProfile.experience} isOwnProfile={isOwnProfile} />
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Eğitim
            </Typography>
            <EducationSection education={currentProfile.education} isOwnProfile={isOwnProfile} />
          </Paper>
        </Box>
        
        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                '& .MuiTabs-flexContainer': {
                  px: 2
                }
              }}
            >
              <Tab 
                value="activity" 
                label="Aktivite" 
                icon={<EventIcon fontSize="small" />} 
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab 
                value="posts" 
                label="Gönderiler" 
                icon={<ArticleIcon fontSize="small" />} 
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab 
                value="connections" 
                label={`Bağlantılar (${currentProfile.connections})`} 
                icon={<PeopleIcon fontSize="small" />} 
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab 
                value="reviews" 
                label="Değerlendirmeler" 
                icon={<StarIcon fontSize="small" />} 
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
            </Tabs>
            
            <Box sx={{ p: 2 }}>
              {activeTab === 'activity' && (
                <ActivityFeed activities={currentProfile.recentActivity} />
              )}
              
              {activeTab === 'posts' && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ArticleIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Henüz gönderi yok
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {isOwnProfile 
                      ? 'Profilinizde paylaşımlarınızı görebilirsiniz.' 
                      : 'Bu kullanıcı henüz hiç gönderi paylaşmamış.'}
                  </Typography>
                </Box>
              )}
              
              {activeTab === 'connections' && (
                <Connections 
                  connections={currentProfile.connectionsList} 
                  totalConnections={currentProfile.connections}
                />
              )}
              
              {activeTab === 'reviews' && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <StarIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Henüz değerlendirme yok
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 400, mx: 'auto' }}>
                    {isOwnProfile 
                      ? 'Profiliniz hakkındaki değerlendirmeleri burada görebilirsiniz.' 
                      : 'Bu kullanıcı hakkında henüz değerlendirme yapılmamış.'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
