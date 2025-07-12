import React, { useState, useEffect, useRef } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOpportunities, setFilters } from '../../store/slices/opportunitiesSlice';
import OpportunityCard from '../../components/opportunities/OpportunityCard';

// Common skills for filter
const SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'CSS', 'HTML', 'TypeScript',
  'SQL', 'MongoDB', 'Redux', 'GraphQL', 'Docker', 'AWS', 'Git', 'Express.js', 
  'Java', 'C#', 'PHP', 'Angular', 'Vue.js'
];

// Filter options
const OPPORTUNITY_TYPES = [
  { value: 'all', label: 'Tüm Fırsatlar' },
  { value: 'job', label: 'İş İlanları' },
  { value: 'course', label: 'Kurslar' },
  { value: 'project', label: 'Projeler' }
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'deadline', label: 'Son Başvuru Tarihi' },
  { value: 'match', label: 'Uyum Oranı' }
];

const LOCATION_OPTIONS = [
  { value: 'any', label: 'Tüm Konumlar' },
  { value: 'remote', label: 'Uzaktan' },
  { value: 'istanbul', label: 'İstanbul' },
  { value: 'ankara', label: 'Ankara' },
  { value: 'izmir', label: 'İzmir' }
];

// Sample data for development if API isn't ready
const SAMPLE_OPPORTUNITIES = [
  {
    id: '1',
    type: 'job',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'İstanbul',
    createdAt: '2025-07-01T10:00:00',
    matchScore: 92,
    isApplied: false,
    skills: ['React', 'JavaScript', 'CSS', 'TypeScript'],
    deadline: '2025-08-01T00:00:00',
    salary: '30.000 - 45.000 ₺',
  },
  {
    id: '2',
    type: 'job',
    title: 'Backend Developer',
    company: 'Software Solutions',
    location: 'Uzaktan',
    createdAt: '2025-07-03T14:30:00',
    matchScore: 85,
    isApplied: true,
    skills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
    deadline: '2025-07-25T00:00:00',
    salary: '35.000 - 50.000 ₺',
  },
  {
    id: '3',
    type: 'course',
    title: 'React ve Redux ile Modern Web Uygulamaları',
    provider: 'Online Akademi',
    location: 'Çevrimiçi',
    createdAt: '2025-07-05T09:15:00',
    matchScore: 88,
    isEnrolled: false,
    skills: ['React', 'Redux', 'JavaScript'],
    duration: '8 Hafta'
  },
  {
    id: '4',
    type: 'project',
    title: 'E-ticaret Web Sitesi Geliştirme',
    client: 'ShopTurkey',
    location: 'Ankara',
    createdAt: '2025-07-06T16:45:00',
    matchScore: 90,
    hasJoined: false,
    skills: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
    deadline: '2025-09-30T00:00:00',
    duration: '3 Ay'
  },
  {
    id: '5',
    type: 'course',
    title: 'Python ve Django ile Backend Geliştirme',
    provider: 'Yazılım Akademisi',
    location: 'Çevrimiçi',
    createdAt: '2025-07-07T11:20:00',
    matchScore: 75,
    isEnrolled: false,
    skills: ['Python', 'Django', 'SQL'],
    duration: '12 Hafta'
  },
  {
    id: '6',
    type: 'project',
    title: 'Mobil Uygulama UI/UX Tasarımı',
    client: 'DesignStudio',
    location: 'İzmir',
    createdAt: '2025-07-09T13:40:00',
    matchScore: 82,
    hasJoined: false,
    skills: ['UI/UX Design', 'Figma', 'Mobile Design'],
    deadline: '2025-08-15T00:00:00',
    duration: '1 Ay'
  }
];

const OpportunitiesPage = () => {
  const dispatch = useDispatch();
  const { 
    jobs, 
    courses, 
    projects, 
    loading, 
    error,
    pagination,
    filters
  } = useSelector(state => state.opportunities);
  
  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [currentType, setCurrentType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [location, setLocation] = useState('any');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Get current type based on tab
  const getOpportunityTypeFromTab = (tabIndex) => {
    switch (tabIndex) {
      case 1: return 'job';
      case 2: return 'course';
      case 3: return 'project';
      default: return 'all';
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const type = getOpportunityTypeFromTab(newValue);
    setCurrentType(type);
    setPage(1); // Reset page when changing tabs
  };

  // Load opportunities on component mount and when filters change
  useEffect(() => {
    // In a production app, we would dispatch the fetchOpportunities action
    // For development, we'll use sample data
    
    // Uncomment this when API is ready:
    // dispatch(fetchOpportunities({
    //   type: currentType,
    //   page,
    //   filters: {
    //     search: searchQuery,
    //     sort: sortBy,
    //     location,
    //     skills: selectedSkills.join(',')
    //   }
    // }));
    
    // For now, just simulate loading state
    // This would be handled by the Redux slice in production
  }, [currentType, page, searchQuery, sortBy, location, selectedSkills]);

  // Apply filters
  const applyFilters = () => {
    setPage(1);
    setFilterDrawerOpen(false);
    
    // Update filters in Redux
    dispatch(setFilters({
      type: currentType,
      filters: {
        search: searchQuery,
        sort: sortBy,
        location,
        skills: selectedSkills
      }
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSortBy('newest');
    setLocation('any');
    setSelectedSkills([]);
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle skill selection
  const handleSkillToggle = (skill) => {
    const currentIndex = selectedSkills.indexOf(skill);
    const newSelectedSkills = [...selectedSkills];

    if (currentIndex === -1) {
      newSelectedSkills.push(skill);
    } else {
      newSelectedSkills.splice(currentIndex, 1);
    }

    setSelectedSkills(newSelectedSkills);
  };

  // Filter drawer
  const filterDrawer = (
    <Drawer
      anchor="right"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
    >
      <Box sx={{ width: 300, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filtreleme Seçenekleri</Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Sıralama</InputLabel>
          <Select
            value={sortBy}
            label="Sıralama"
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Konum</InputLabel>
          <Select
            value={location}
            label="Konum"
            onChange={(e) => setLocation(e.target.value)}
          >
            {LOCATION_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Yetkinlikler
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {SKILLS.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              clickable
              color={selectedSkills.includes(skill) ? "primary" : "default"}
              onClick={() => handleSkillToggle(skill)}
            />
          ))}
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={resetFilters}>
            Filtreleri Temizle
          </Button>
          <Button variant="contained" onClick={applyFilters}>
            Uygula
          </Button>
        </Box>
      </Box>
    </Drawer>
  );

  // Get opportunities based on current type
  const getOpportunities = () => {
    // In production, this would come from Redux state
    // For now, we'll filter the sample data
    if (currentType === 'all') {
      return SAMPLE_OPPORTUNITIES;
    }
    
    return SAMPLE_OPPORTUNITIES.filter(opp => opp.type === currentType);
  };

  // Current opportunities
  const opportunities = getOpportunities();

  // Render loading state
  if (loading && opportunities.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Fırsatlar
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {OPPORTUNITY_TYPES.map((type, index) => (
            <Tab key={type.value} label={type.label} />
          ))}
        </Tabs>
      </Paper>
      
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Fırsat ara..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setFilterDrawerOpen(true)}
        >
          Filtrele
        </Button>
        
        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <IconButton 
            color={viewMode === 'grid' ? 'primary' : 'default'} 
            onClick={() => setViewMode('grid')}
          >
            <GridViewIcon />
          </IconButton>
          <IconButton 
            color={viewMode === 'list' ? 'primary' : 'default'} 
            onClick={() => setViewMode('list')}
          >
            <ViewListIcon />
          </IconButton>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {getErrorMessage(error)}
        </Alert>
      )}
      
      {selectedSkills.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedSkills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              onDelete={() => handleSkillToggle(skill)}
              color="primary"
              variant="outlined"
            />
          ))}
          
          <Button 
            size="small" 
            onClick={resetFilters} 
            sx={{ ml: 1 }}
          >
            Temizle
          </Button>
        </Box>
      )}
      
      {opportunities.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Hiç sonuç bulunamadı
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Farklı filtreler deneyebilir veya arama kriterlerinizi değiştirebilirsiniz.
          </Typography>
          <Button 
            variant="contained" 
            onClick={resetFilters} 
            sx={{ mt: 2 }}
          >
            Filtreleri Temizle
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {opportunities.map((opportunity) => (
              <Grid 
                item 
                key={`${opportunity.type}-${opportunity.id}`} 
                xs={12} 
                sm={viewMode === 'list' ? 12 : 6} 
                md={viewMode === 'list' ? 12 : 4}
              >
                <OpportunityCard 
                  opportunity={opportunity} 
                  showActions={true} 
                  showMatch={true} 
                />
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={pagination[currentType]?.totalPages || 1} 
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
      
      {filterDrawer}
    </Container>
  );
};

export default OpportunitiesPage;
