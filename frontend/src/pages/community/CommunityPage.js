import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Container, Box, Tabs, Tab, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatInterface from '../../components/community/ChatInterface';
import RoadmapView from '../../components/community/RoadmapView';
import CommunityHeader from '../../components/community/CommunityHeader';
import { fetchCommunityData } from '../../store/slices/communitySlice';

const CommunityPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get community data from Redux store
  const { user, loading, error } = useSelector((state) => state.community);
  
  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname.split('/').pop();
    return path === 'roadmap' ? 1 : 0;
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTab());
  
  // Fetch community data when component mounts
  useEffect(() => {
    dispatch(fetchCommunityData());
  }, [dispatch]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(newValue === 0 ? '/community/chat' : '/community/roadmap');
  };
  
  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Community Header */}
      <CommunityHeader />
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, py: 4, bgcolor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <Paper 
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              mb: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? 'fullWidth' : 'standard'}
              indicatorColor="primary"
              textColor="primary"
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                '& .MuiTabs-flexContainer': {
                  justifyContent: isMobile ? 'space-between' : 'flex-start',
                },
              }}
            >
              <Tab 
                label="Topluluk Sohbeti" 
                iconPosition="start"
                sx={{
                  minHeight: 64,
                  fontWeight: 600,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <Tab 
                label="Yol Haritası" 
                iconPosition="start"
                sx={{
                  minHeight: 64,
                  fontWeight: 600,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Tabs>
            
            {/* Tab Content */}
            <Box sx={{ p: isMobile ? 2 : 3 }}>
              {activeTab === 0 ? (
                <ChatInterface />
              ) : (
                <RoadmapView />
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default CommunityPage;
