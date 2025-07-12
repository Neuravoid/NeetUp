import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress,
  Grid, 
  Card,
  CardContent,
  Divider,
  Button,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchResults } from '../../store/slices/personalityTestSlice';

// Sample data for development if API is not ready
const sampleResults = {
  primary_coalition_type: 'Yenilikçi Kaşif',
  secondary_coalition_type: 'Sosyal Lider',
  scores: {
    'Yenilikçi Kaşif': 85,
    'Metodik Uzman': 65,
    'Sosyal Lider': 80,
    'Takım Oyuncusu': 72,
    'Soğukkanlı Stratejist': 68,
    'Hayalperest Sanatçı': 60,
    'Bilimsel Araştırmacı': 70,
    'Pratik Çözümcü': 75,
    'Duyarlı Bakıcı': 55,
    'Macera Tutkunu': 78
  },
  recommended_opportunities: [
    { id: 1, title: 'UX/UI Designer', type: 'job' },
    { id: 2, title: 'Product Management', type: 'course' },
    { id: 3, title: 'Social Media Marketing Campaign', type: 'project' }
  ],
  coalition_type_descriptions: {
    'Yenilikçi Kaşif': 'Yeni fikirler üretmeyi ve keşfetmeyi seven, değişime açık, yaratıcı bireyler.',
    'Metodik Uzman': 'Detaylara dikkat eden, sistemli çalışan, uzmanlık alanlarında derinleşmeyi tercih eden bireyler.',
    'Sosyal Lider': 'İnsanları etkileme ve yönlendirme becerisi yüksek, iletişimi güçlü, liderlik vasıfları olan bireyler.',
    'Takım Oyuncusu': 'İş birliğine yatkın, uyumlu, grup çalışmasında başarılı olan bireyler.',
    'Soğukkanlı Stratejist': 'Analitik düşünen, planlama yeteneği güçlü, mantık odaklı bireyler.',
    'Hayalperest Sanatçı': 'Estetik algısı yüksek, duygusal, yaratıcı süreçlerde başarılı olan bireyler.',
    'Bilimsel Araştırmacı': 'Meraklı, sorgulayan, keşfetmeyi seven, analitik düşünce yapısına sahip bireyler.',
    'Pratik Çözümcü': 'Hızlı ve etkili çözümler üreten, pratik düşünen, sonuç odaklı bireyler.',
    'Duyarlı Bakıcı': 'Empati yeteneği yüksek, yardımsever, başkalarının ihtiyaçlarına duyarlı bireyler.',
    'Macera Tutkunu': 'Risk almayı seven, heyecan arayan, yeni deneyimlere açık bireyler.'
  }
};

const TestResultsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { results, loading, error } = useSelector(state => state.personalityTest);
  
  // Fetch results if not already loaded
  useEffect(() => {
    if (!results) {
      dispatch(fetchResults())
        .unwrap()
        .catch(err => {
          console.error('Failed to fetch results:', err);
          // Use sample data for development
        });
    }
  }, [dispatch, results]);
  
  // Use actual results if available, otherwise use sample data
  const displayData = results || sampleResults;
  
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };
  
  const handleRetakeTest = () => {
    navigate('/personality-test');
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Kişilik Değerlendirmesi Sonuçları
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {getErrorMessage(error)}
          </Alert>
        )}
        
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Baskın Koalisyon Tipiniz
            </Typography>
            <Typography variant="h3" color="primary" gutterBottom>
              {displayData.primary_coalition_type}
            </Typography>
            <Typography variant="body1" paragraph>
              {displayData.coalition_type_descriptions[displayData.primary_coalition_type]}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              İkincil Koalisyon Tipiniz: <strong>{displayData.secondary_coalition_type}</strong>
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="h5" gutterBottom>
            Koalisyon Tipi Skorlarınız
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {Object.entries(displayData.scores).map(([type, score]) => (
              <Grid item xs={12} sm={6} md={4} key={type}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%',
                    bgcolor: type === displayData.primary_coalition_type ? 'primary.light' : 'background.paper',
                    color: type === displayData.primary_coalition_type ? 'primary.contrastText' : 'text.primary'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {type}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                        <CircularProgress
                          variant="determinate"
                          value={score}
                          size={60}
                          thickness={4}
                          color={type === displayData.primary_coalition_type ? 'inherit' : 'primary'}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" component="div">
                            {`${score}%`}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2">
                        {displayData.coalition_type_descriptions[type].substring(0, 60)}...
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Size Önerilen Fırsatlar
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {displayData.recommended_opportunities.map((opportunity) => (
              <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography 
                      variant="caption" 
                      color="primary" 
                      sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                    >
                      {opportunity.type === 'job' ? 'İş Fırsatı' : 
                        opportunity.type === 'course' ? 'Kurs' : 'Proje'}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {opportunity.title}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => navigate(`/opportunities/${opportunity.type}/${opportunity.id}`)}
                    >
                      Detayları Gör
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleDashboardClick}
            >
              Dashboard'a Git
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleRetakeTest}
            >
              Testi Tekrar Yap
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TestResultsPage;
