import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  Divider, 
  Tabs, 
  Tab, 
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Avatar,
  LinearProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Fab,
  Zoom
} from '@mui/material';
import RoadmapDetailDialog from './RoadmapDetailDialog';
import {
  Add as AddIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon
} from '@mui/icons-material';
import { format, addMonths, isAfter, isBefore, isToday, isWithinInterval } from 'date-fns';
import { tr } from 'date-fns/locale';

// Sample data - in a real app, this would come from an API
const sampleRoadmaps = {
  learning: [
    {
      id: 'frontend-2023',
      title: 'Frontend Geliştirme Yol Haritası',
      description: 'Modern web geliştirme için eksiksiz frontend yol haritası',
      category: 'Frontend',
      level: 'Başlangıç',
      duration: '6 ay',
      progress: 65,
      isFeatured: true,
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Redux', 'TypeScript'],
      milestones: [
        { id: 'html-css', title: 'HTML & CSS Temelleri', completed: true, dueDate: '2023-01-15' },
        { id: 'javascript', title: 'JavaScript Temelleri', completed: true, dueDate: '2023-02-28' },
        { id: 'react-basics', title: 'React Temelleri', completed: true, dueDate: '2023-03-31' },
        { id: 'react-advanced', title: 'İleri Seviye React', completed: true, dueDate: '2023-04-30' },
        { id: 'state-management', title: 'State Yönetimi (Redux/Context)', completed: false, dueDate: '2023-05-31' },
        { id: 'typescript', title: 'TypeScript ile React', completed: false, dueDate: '2023-06-30' },
        { id: 'testing', title: 'Test Yazma (Jest, React Testing Library)', completed: false, dueDate: '2023-07-31' },
        { id: 'final-project', title: 'Bitirme Projesi', completed: false, dueDate: '2023-08-31' }
      ],
      resources: [
        { id: 'r1', title: 'HTML & CSS Dersleri', type: 'course', url: '#', completed: true },
        { id: 'r2', title: 'JavaScript: The Complete Guide', type: 'book', url: '#', completed: true },
        { id: 'r3', title: 'React - The Complete Guide', type: 'course', url: '#', completed: true },
        { id: 'r4', title: 'Redux Fundamentals', type: 'course', url: '#', completed: false },
        { id: 'r5', title: 'TypeScript Handbook', type: 'book', url: '#', completed: false }
      ],
      createdAt: '2023-01-01',
      updatedAt: '2023-04-15',
      isPublic: true,
      author: {
        id: 'user1',
        name: 'Ahmet Yılmaz',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      }
    },
    // More learning roadmaps...
  ],
  career: [
    // Career roadmaps...
  ]
};

// Helper functions...
const calculateProgress = (milestones) => {
  if (!milestones || milestones.length === 0) return 0;
  const completed = milestones.filter(m => m.completed).length;
  return Math.round((completed / milestones.length) * 100);
};

const getNextMilestone = (milestones) => {
  if (!milestones) return null;
  const now = new Date();
  return milestones.find(milestone => !milestone.completed && new Date(milestone.dueDate) > now) || null;
};

const formatDate = (dateStr, formatStr = 'd MMMM yyyy') => {
  return format(new Date(dateStr), formatStr, { locale: tr });
};

const getTimeRemaining = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Süre doldu';
  if (diffDays === 0) return 'Bugün son gün';
  if (diffDays === 1) return 'Yarın son gün';
  if (diffDays < 7) return `${diffDays} gün kaldı`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta kaldı`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay kaldı`;
  return `${Math.floor(diffDays / 365)} yıl kaldı`;
};

const getProgressColor = (progress) => {
  if (progress >= 75) return 'success';
  if (progress >= 50) return 'info';
  if (progress >= 25) return 'warning';
  return 'error';
};

const getLevelColor = (level) => {
  switch(level.toLowerCase()) {
    case 'başlangıç':
      return 'success';
    case 'orta seviye':
      return 'info';
    case 'ileri seviye':
      return 'warning';
    case 'uzman':
      return 'error';
    default:
      return 'default';
  }
};

const RoadmapView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [roadmaps, setRoadmaps] = useState(sampleRoadmaps);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle open roadmap dialog
  const handleOpenRoadmapDialog = (roadmap) => {
    setSelectedRoadmap(roadmap);
    setOpenDialog(true);
  };
  
  // Handle close roadmap dialog
  const handleCloseRoadmapDialog = () => {
    setOpenDialog(false);
    // Small delay to allow dialog animation to complete
    setTimeout(() => setSelectedRoadmap(null), 300);
  };
  
  // Toggle milestone completion
  const toggleMilestoneCompletion = (roadmapId, milestoneId) => {
    const updatedRoadmaps = { ...roadmaps };
    const roadmapType = activeTab === 0 ? 'learning' : 'career';
    const roadmapIndex = updatedRoadmaps[roadmapType].findIndex(r => r.id === roadmapId);
    
    if (roadmapIndex !== -1) {
      const milestoneIndex = updatedRoadmaps[roadmapType][roadmapIndex].milestones.findIndex(
        m => m.id === milestoneId
      );
      
      if (milestoneIndex !== -1) {
        updatedRoadmaps[roadmapType][roadmapIndex].milestones[milestoneIndex].completed = 
          !updatedRoadmaps[roadmapType][roadmapIndex].milestones[milestoneIndex].completed;
        
        // Recalculate progress
        updatedRoadmaps[roadmapType][roadmapIndex].progress = calculateProgress(
          updatedRoadmaps[roadmapType][roadmapIndex].milestones
        );
        
        setRoadmaps(updatedRoadmaps);
      }
    }
  };
  
  // Get filtered roadmaps based on active tab and filters
  const getFilteredRoadmaps = () => {
    const roadmapType = activeTab === 0 ? 'learning' : 'career';
    let filtered = [...roadmaps[roadmapType]];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(roadmap => 
        roadmap.title.toLowerCase().includes(query) ||
        roadmap.description.toLowerCase().includes(query) ||
        roadmap.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (filter === 'in-progress') {
      filtered = filtered.filter(roadmap => roadmap.progress > 0 && roadmap.progress < 100);
    } else if (filter === 'completed') {
      filtered = filtered.filter(roadmap => roadmap.progress === 100);
    } else if (filter === 'featured') {
      filtered = filtered.filter(roadmap => roadmap.isFeatured);
    }
    
    return filtered;
  };
  
  const currentRoadmaps = getFilteredRoadmaps();
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with title and actions */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          mb: 3,
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" gutterBottom={!isMobile}>
            {activeTab === 0 ? 'Öğrenme Yol Haritaları' : 'Kariyer Yol Haritaları'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0 
              ? 'Yeni beceriler öğrenmek için adım adım rehberler' 
              : 'Kariyer hedeflerinize ulaşmak için planlar'}
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1.5,
            flexWrap: 'wrap',
            width: isMobile ? '100%' : 'auto',
            mt: isMobile ? 2 : 0
          }}
        >
          <TextField
            size="small"
            placeholder="Ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
              },
              flexGrow: isMobile ? 1 : 0,
              order: isMobile ? 3 : 'initial'
            }}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          
          <Select
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            displayEmpty
            sx={{
              minWidth: 140,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              '& .MuiSelect-select': {
                py: 0.875,
              },
              order: isMobile ? 1 : 'initial'
            }}
          >
            <MenuItem value="all">Tümü</MenuItem>
            <MenuItem value="in-progress">Devam Edenler</MenuItem>
            <MenuItem value="completed">Tamamlananlar</MenuItem>
            <MenuItem value="featured">Öne Çıkanlar</MenuItem>
          </Select>
          
          <Box 
            sx={{ 
              display: 'flex', 
              border: `1px solid ${theme.palette.divider}`, 
              borderRadius: 2,
              overflow: 'hidden',
              order: isMobile ? 2 : 'initial'
            }}
          >
            <IconButton 
              size="small" 
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
              sx={{ 
                borderRadius: 0,
                bgcolor: viewMode === 'grid' ? theme.palette.action.selected : 'transparent',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0.5, width: 20, height: 20 }}>
                {[...Array(4)].map((_, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      width: '100%', 
                      height: '100%', 
                      bgcolor: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
                      borderRadius: 0.5
                    }} 
                  />
                ))}
              </Box>
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton 
              size="small" 
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
              sx={{ 
                borderRadius: 0,
                bgcolor: viewMode === 'list' ? theme.palette.action.selected : 'transparent',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: 20, height: 20 }}>
                {[...Array(3)].map((_, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      width: '100%', 
                      height: 4, 
                      bgcolor: viewMode === 'list' ? 'primary.main' : 'text.secondary',
                      borderRadius: 1
                    }} 
                  />
                ))}
              </Box>
            </IconButton>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              order: isMobile ? 4 : 'initial',
              width: isMobile ? '100%' : 'auto',
              mt: isMobile ? 1 : 0
            }}
          >
            Yeni Yol Haritası
          </Button>
        </Box>
      </Box>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="roadmap tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon fontSize="small" />
                <span>Öğrenme Yol Haritaları</span>
              </Box>
            } 
            sx={{ textTransform: 'none', py: 1.5, minHeight: 'auto' }} 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon fontSize="small" />
                <span>Kariyer Yol Haritaları</span>
              </Box>
            } 
            sx={{ textTransform: 'none', py: 1.5, minHeight: 'auto' }} 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon fontSize="small" />
                <span>İlerleme Takibi</span>
              </Box>
            } 
            sx={{ textTransform: 'none', py: 1.5, minHeight: 'auto' }} 
            disabled
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssessmentIcon fontSize="small" />
                <span>İstatistikler</span>
              </Box>
            } 
            sx={{ textTransform: 'none', py: 1.5, minHeight: 'auto' }} 
            disabled
          />
        </Tabs>
      </Box>
      
      {/* Roadmaps Grid/List View */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {currentRoadmaps.length > 0 ? (
            currentRoadmaps.map((roadmap) => (
              <Grid item xs={12} sm={6} lg={4} key={roadmap.id}>
                <RoadmapCard 
                  roadmap={roadmap} 
                  onClick={() => handleOpenRoadmapDialog(roadmap)}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: theme.palette.background.default,
                  borderRadius: 2,
                  border: `1px dashed ${theme.palette.divider}`
                }}
              >
                <SchoolIcon 
                  sx={{ 
                    color: 'text.secondary',
                    opacity: 0.5,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {activeTab === 0 ? 'Henüz bir öğrenme yol haritanız yok' : 'Henüz bir kariyer yol haritanız yok'}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {activeTab === 0
                    ? 'Yeni bir öğrenme yolculuğuna başlamak için "Yeni Yol Haritası" butonuna tıklayın.'
                    : 'Kariyer hedeflerinizi planlamak için yeni bir yol haritası oluşturun.'}
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ mt: 1 }}>
                  Yeni Yol Haritası Oluştur
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {currentRoadmaps.length > 0 ? (
            currentRoadmaps.map((roadmap) => (
              <RoadmapListItem 
                key={roadmap.id} 
                roadmap={roadmap} 
                onClick={() => handleOpenRoadmapDialog(roadmap)} 
              />
            ))
          ) : (
            <Paper 
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: theme.palette.background.default,
                borderRadius: 2,
                border: `1px dashed ${theme.palette.divider}`
              }}
            >
              <SchoolIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'text.secondary',
                  opacity: 0.5,
                  mb: 2
                }} 
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {activeTab === 0 
                  ? 'Henüz bir öğrenme yol haritanız yok' 
                  : 'Henüz bir kariyer yol haritanız yok'}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {activeTab === 0
                  ? 'Yeni bir öğrenme yolculuğuna başlamak için "Yeni Yol Haritası" butonuna tıklayın.'
                  : 'Kariyer hedeflerinizi planlamak için yeni bir yol haritası oluşturun.'}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                sx={{ mt: 1 }}
              >
                Yeni Yol Haritası Oluştur
              </Button>
            </Paper>
          )}
        </Box>
      )}
      
      {/* Floating Action Button for Mobile */}
      <Zoom in={!isMobile}>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', md: 'none' },
            boxShadow: theme.shadows[8],
            '&:hover': {
              boxShadow: theme.shadows[12],
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>
      
      {/* Roadmap Detail Dialog */}
      <RoadmapDetailDialog 
        open={openDialog} 
        onClose={handleCloseRoadmapDialog} 
        roadmap={selectedRoadmap}
        onToggleMilestone={toggleMilestoneCompletion}
      />
    </Box>
  );
};

export default RoadmapView;
