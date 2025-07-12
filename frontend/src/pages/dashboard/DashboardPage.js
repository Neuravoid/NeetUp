import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PersonIcon from '@mui/icons-material/Person';
import PieChartIcon from '@mui/icons-material/PieChart';
import profileService from '../../api/profile';
import personalityTestService from '../../api/personality-test';

// Sample data for development if API isn't available
const SAMPLE_PROFILE = {
  full_name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@example.com',
  profile_picture_url: null,
  bio: 'Yazılım geliştirme tutkunu, sürekli öğrenmeyi seven bir bilgisayar mühendisi.',
  location: 'İstanbul, Türkiye',
  role: 'candidate'
};

const SAMPLE_TEST_RESULTS = {
  primary_coalition_type: 'Yenilikçi Kaşif',
  secondary_coalition_type: 'Sosyal Lider',
  completion_date: '2025-07-10T15:42:00',
  scores: {
    'Yenilikçi Kaşif': 85,
    'Sosyal Lider': 80,
    'Pratik Çözümcü': 75
  }
};

const SAMPLE_OPPORTUNITIES = [
  { 
    id: '1', 
    title: 'Frontend Developer', 
    company: 'TechCorp', 
    type: 'job',
    match_score: 92,
    created_at: '2025-07-09T13:00:00'
  },
  { 
    id: '2', 
    title: 'React ve Redux ile Modern Web Uygulamaları', 
    provider: 'Online Akademi', 
    type: 'course',
    match_score: 88,
    created_at: '2025-07-08T09:30:00'
  },
  { 
    id: '3', 
    title: 'E-ticaret Web Sitesi Yenileme', 
    client: 'ShopTurkey', 
    type: 'project',
    match_score: 85,
    created_at: '2025-07-10T17:15:00'
  }
];

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Fetch user profile
        const profileData = await profileService.getProfile().catch(() => SAMPLE_PROFILE);
        setProfile(profileData);
        
        // Fetch personality test results
        const resultsData = await personalityTestService.getResults().catch(() => SAMPLE_TEST_RESULTS);
        setTestResults(resultsData);
        
        // Fetch recent opportunities
        // This would be implemented in an opportunities service
        setOpportunities(SAMPLE_OPPORTUNITIES);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
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
      <Grid container spacing={3}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={profile?.profile_picture_url}
                sx={{ width: 80, height: 80, mb: 2 }}
                alt={profile?.full_name}
              >
                {profile?.full_name?.charAt(0) || <PersonIcon />}
              </Avatar>
              <Typography variant="h5" component="h2" gutterBottom>
                {profile?.full_name || 'Kullanıcı'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {profile?.location || 'Konum belirtilmemiş'}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" paragraph sx={{ px: 1 }}>
              {profile?.bio || 'Henüz bir biyografi eklenmemiş.'}
            </Typography>
            
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button 
                component={RouterLink}
                to="/profile"
                fullWidth
                variant="outlined"
              >
                Profili Düzenle
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Personality Test Results */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PieChartIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6" component="h2">
                Kişilik Testi Sonucu
              </Typography>
            </Box>
            
            {testResults ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Baskın Koalisyon Tipi
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {testResults.primary_coalition_type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    İkincil: {testResults.secondary_coalition_type}
                  </Typography>
                  
                  {testResults.completion_date && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Tamamlanma Tarihi: {formatDate(testResults.completion_date)}
                    </Typography>
                  )}
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  En Yüksek Puanlar
                </Typography>
                
                <List dense>
                  {Object.entries(testResults.scores || {})
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([type, score]) => (
                      <ListItem key={type} disableGutters>
                        <ListItemText 
                          primary={type} 
                          secondary={`${score}%`}
                        />
                      </ListItem>
                    ))}
                </List>
                
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button 
                    component={RouterLink}
                    to="/personality-test/results"
                    fullWidth
                    variant="outlined"
                  >
                    Detaylı Sonuçları Gör
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <Typography variant="body1" gutterBottom>
                  Henüz kişilik testi yapmadınız.
                </Typography>
                <Button 
                  component={RouterLink}
                  to="/personality-test"
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Testi Başlat
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Progress/Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Profiliniz
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" color="primary">
                      5
                    </Typography>
                    <Typography variant="body2">
                      Beceri
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" color="primary">
                      3
                    </Typography>
                    <Typography variant="body2">
                      Başvuru
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" color="primary">
                      2
                    </Typography>
                    <Typography variant="body2">
                      Kurs
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" color="primary">
                      85%
                    </Typography>
                    <Typography variant="body2">
                      Profil Tamamlama
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button 
                component={RouterLink}
                to="/profile/skills"
                fullWidth
                variant="outlined"
                sx={{ mb: 1 }}
              >
                Becerilerini Düzenle
              </Button>
              <Button 
                component={RouterLink}
                to="/opportunities"
                fullWidth
                variant="contained"
              >
                Fırsatları Keşfet
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Opportunities */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Önerilen Fırsatlar
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {opportunities.length > 0 ? opportunities.map((opportunity) => (
                <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ListItemAvatar>
                          {opportunity.type === 'job' ? (
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <WorkIcon />
                            </Avatar>
                          ) : opportunity.type === 'course' ? (
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                              <SchoolIcon />
                            </Avatar>
                          ) : (
                            <Avatar sx={{ bgcolor: 'success.main' }}>
                              <AssignmentIcon />
                            </Avatar>
                          )}
                        </ListItemAvatar>
                        <Box>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                          >
                            {opportunity.type === 'job' ? 'İş Fırsatı' : 
                              opportunity.type === 'course' ? 'Kurs' : 'Proje'}
                          </Typography>
                          <Typography variant="body2">
                            {formatDate(opportunity.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        {opportunity.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {opportunity.company || opportunity.provider || opportunity.client}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <EmojiPeopleIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>{opportunity.match_score}%</strong> Uyumluluk
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={RouterLink}
                        to={`/opportunities/${opportunity.type}/${opportunity.id}`}
                      >
                        Detayları Gör
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )) : (
                <Grid item xs={12}>
                  <Typography variant="body1" align="center" sx={{ py: 4 }}>
                    Henüz önerilen fırsat bulunmamaktadır.
                  </Typography>
                </Grid>
              )}
            </Grid>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                component={RouterLink}
                to="/opportunities"
                variant="contained"
              >
                Tüm Fırsatları Gör
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
