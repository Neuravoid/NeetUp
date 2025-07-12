import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Business as CompanyIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Language as WebsiteIcon,
  People as PeopleIcon,
  Category as IndustryIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOpportunityById } from '../../store/slices/opportunitiesSlice';
import ApplicationDialog from '../../components/opportunities/ApplicationDialog';

// Sample data for development
const SAMPLE_OPPORTUNITY = {
  id: '1',
  type: 'job',
  title: 'Senior Frontend Developer',
  company: 'TechCorp',
  location: 'İstanbul, Türkiye (Hybrid)',
  description: 'We are looking for an experienced Frontend Developer to join our team. In this role, you will be responsible for building user interfaces and implementing features using modern web technologies.',
  responsibilities: [
    'Develop new user-facing features using React.js',
    'Build reusable components and front-end libraries',
    'Translate designs and wireframes into high-quality code',
    'Optimize components for maximum performance across devices and browsers',
    'Collaborate with cross-functional teams to define, design, and ship new features'
  ],
  requirements: [
    '3+ years of experience with React.js',
    'Strong proficiency in JavaScript, including DOM manipulation',
    'Experience with popular React workflows (such as Redux)',
    'Familiarity with modern front-end build pipelines and tools',
    'Experience with common front-end development tools'
  ],
  benefits: [
    'Competitive salary',
    'Flexible working hours',
    'Health insurance',
    'Remote work options',
    'Learning and development budget'
  ],
  skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'HTML5', 'CSS3', 'RESTful APIs'],
  matchScore: 92,
  isApplied: false,
  isSaved: false,
  salary: '30.000 - 45.000 ₺',
  experience: '3+ years',
  workType: 'Full-time',
  deadline: '2025-08-15T00:00:00',
  postedAt: '2025-07-01T10:00:00',
  companyInfo: {
    name: 'TechCorp',
    logo: 'https://via.placeholder.com/100',
    description: 'Leading technology company specializing in innovative software solutions for businesses worldwide. We believe in creating products that make a difference.',
    website: 'https://techcorp.com',
    size: '201-500 employees',
    industry: 'Software Development',
    founded: 2010
  },
  similarOpportunities: [
    {
      id: '2',
      type: 'job',
      title: 'Frontend Developer',
      company: 'WebSolutions',
      location: 'Remote',
      matchScore: 85,
      salary: '28.000 - 40.000 ₺',
      isApplied: false,
      skills: ['React', 'JavaScript', 'CSS', 'Redux']
    },
    {
      id: '3',
      type: 'job',
      title: 'React Developer',
      company: 'DigitalAgency',
      location: 'Ankara, Turkey',
      matchScore: 78,
      salary: '25.000 - 38.000 ₺',
      isApplied: false,
      skills: ['React', 'TypeScript', 'CSS', 'Redux']
    }
  ]
};

const OpportunityDetailPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { currentOpportunity, loading, error } = useSelector(state => state.opportunities);
  const [activeTab, setActiveTab] = useState(0);
  const [isApplyDialogOpen, setApplyDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [applyError, setApplyError] = useState(null);
  
  // For development, we'll use sample data
  const opportunity = SAMPLE_OPPORTUNITY;
  // In production, we would fetch the opportunity from the API:
  // const opportunity = currentOpportunity || SAMPLE_OPPORTUNITY;
  
  useEffect(() => {
    // In production, we would fetch the opportunity data here
    // dispatch(fetchOpportunityById({ type, id }));
  }, [type, id, dispatch]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleSaveOpportunity = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaved(!isSaved);
      setIsSaving(false);
    }, 500);
  };
  
  const handleApply = async (coverLetter) => {
    setIsSaving(true);
    setApplyError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would dispatch an action to submit the application
      // await dispatch(applyForJob({ jobId: id, applicationData: { coverLetter } }));
      
      // Show success state
      setApplyDialogOpen(false);
    } catch (error) {
      setApplyError(error.message || 'An error occurred while submitting your application');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: opportunity.title,
        text: `Check out this ${opportunity.type} opportunity on NeetUp`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  const getTypeIcon = () => {
    switch(opportunity.type) {
      case 'job': return <WorkIcon color="primary" />;
      case 'course': return <SchoolIcon color="secondary" />;
      case 'project': return <AssignmentIcon color="success" />;
      default: return null;
    }
  };
  
  if (loading && !opportunity) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {getErrorMessage(error)}
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Back to Opportunities
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          to="/opportunities" 
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: 'none' }}
        >
          Back to Opportunities
        </Button>
        <Typography color="text.primary">
          {opportunity.title}
        </Typography>
      </Breadcrumbs>
      
      {/* Main content */}
      <Grid container spacing={4}>
        {/* Left column - Main content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', mb: 3 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getTypeIcon()}
                  <Typography variant="h4" component="h1" sx={{ ml: 1 }}>
                    {opportunity.title}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip 
                    icon={<CompanyIcon />} 
                    label={opportunity.company} 
                    variant="outlined" 
                    size="small" 
                  />
                  <Chip 
                    icon={<LocationIcon />} 
                    label={opportunity.location} 
                    variant="outlined" 
                    size="small" 
                  />
                  <Chip 
                    icon={<TimeIcon />} 
                    label={`Son başvuru: ${new Date(opportunity.deadline).toLocaleDateString('tr-TR')}`} 
                    variant="outlined" 
                    size="small" 
                    color="error"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {opportunity.skills.slice(0, 4).map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  ))}
                  {opportunity.skills.length > 4 && (
                    <Chip 
                      label={`+${opportunity.skills.length - 4} more`} 
                      size="small" 
                      variant="outlined" 
                    />
                  )}
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                mt: isMobile ? 2 : 0,
                justifyContent: isMobile ? 'flex-start' : 'flex-end'
              }}>
                <IconButton 
                  onClick={handleSaveOpportunity} 
                  color={isSaved ? 'primary' : 'default'}
                  disabled={isSaving}
                  aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
                >
                  {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
                <IconButton onClick={handleShare} aria-label="Share">
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>
            
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="opportunity details tabs"
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons="auto"
              >
                <Tab label="Overview" id="tab-0" />
                <Tab label="Company" id="tab-1" />
                <Tab label="Similar" id="tab-2" />
              </Tabs>
            </Box>
            
            {/* Tab content */}
            <Box sx={{ pt: 2 }}>
              {/* Overview tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Job Description</Typography>
                  <Typography paragraph>{opportunity.description}</Typography>
                  
                  <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Responsibilities</Typography>
                  <List dense>
                    {opportunity.responsibilities.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon color="primary" sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Requirements</Typography>
                  <List dense>
                    {opportunity.requirements.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon color="primary" sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Benefits</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {opportunity.benefits.map((benefit, index) => (
                      <Chip 
                        key={index} 
                        label={benefit} 
                        color="success" 
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Company tab */}
              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3, mb: 4 }}>
                    <Box sx={{ flexShrink: 0, textAlign: 'center' }}>
                      <Avatar 
                        src={opportunity.companyInfo.logo} 
                        alt={opportunity.companyInfo.name}
                        sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                      />
                      <Button 
                        href={opportunity.companyInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        variant="outlined"
                        startIcon={<WebsiteIcon />}
                        fullWidth={isMobile}
                      >
                        Visit Website
                      </Button>
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>About {opportunity.companyInfo.name}</Typography>
                      <Typography paragraph>{opportunity.companyInfo.description}</Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PeopleIcon color="action" />
                          <Typography variant="body2">
                            <strong>Company Size:</strong> {opportunity.companyInfo.size}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IndustryIcon color="action" />
                          <Typography variant="body2">
                            <strong>Industry:</strong> {opportunity.companyInfo.industry}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon color="action" />
                          <Typography variant="body2">
                            <strong>Founded:</strong> {opportunity.companyInfo.founded}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              
              {/* Similar opportunities tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Similar Opportunities</Typography>
                  <Typography color="text.secondary" paragraph>
                    Here are some similar opportunities that might interest you:
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {opportunity.similarOpportunities.map((item) => (
                      <Grid item xs={12} key={`${item.type}-${item.id}`}>
                        <Paper variant="outlined" sx={{ p: 2, '&:hover': { borderColor: 'primary.main' } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="subtitle1" component="h3" gutterBottom>
                                {item.title}
                              </Typography>
                              <Typography color="text.secondary" paragraph sx={{ mb: 1 }}>
                                {item.company} • {item.location}
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                {item.skills.map((skill, idx) => (
                                  <Chip key={idx} label={skill} size="small" variant="outlined" />
                                ))}
                              </Box>
                              <Typography variant="body2" color="primary" fontWeight="medium">
                                {item.salary}
                              </Typography>
                            </Box>
                            <Button 
                              variant="outlined" 
                              size="small"
                              component={Link}
                              to={`/opportunities/${item.type}/${item.id}`}
                            >
                              View
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Right column - Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', mb: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>Job Details</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                <Typography>{opportunity.experience}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Work Type</Typography>
                <Typography>{opportunity.workType}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Salary</Typography>
                <Typography>{opportunity.salary}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Posted</Typography>
                <Typography>
                  {new Date(opportunity.postedAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Match Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 8, 
                      bgcolor: 'grey.200',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: `${opportunity.matchScore}%`, 
                        height: '100%', 
                        bgcolor: 'primary.main' 
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="primary">
                    {opportunity.matchScore}%
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                variant="contained" 
                size="large" 
                fullWidth
                onClick={() => setApplyDialogOpen(true)}
                disabled={opportunity.isApplied}
                sx={{ py: 1.5 }}
              >
                {opportunity.isApplied ? 'Applied' : 'Apply Now'}
              </Button>
              
              <Button 
                variant="outlined" 
                size="large" 
                fullWidth
                startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={handleSaveOpportunity}
                disabled={isSaving}
                sx={{ py: 1.5 }}
              >
                {isSaved ? 'Saved' : 'Save for Later'}
              </Button>
              
              <Button 
                variant="outlined" 
                size="large" 
                fullWidth
                startIcon={<ShareIcon />}
                onClick={handleShare}
                sx={{ py: 1.5 }}
              >
                Share
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>About {opportunity.company}</Typography>
            <Typography variant="body2" paragraph>
              {opportunity.companyInfo.description.substring(0, 150)}...
            </Typography>
            <Button 
              component={Link}
              to={`/companies/${opportunity.company.toLowerCase().replace(/\s+/g, '-')}`}
              variant="text"
              size="small"
              sx={{ mt: 1 }}
            >
              View company profile
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Application Dialog */}
      <ApplicationDialog
        open={isApplyDialogOpen}
        onClose={() => setApplyDialogOpen(false)}
        onApply={handleApply}
        opportunity={opportunity}
        loading={isSaving}
        error={applyError}
      />
    </Container>
  );
};

export default OpportunityDetailPage;
