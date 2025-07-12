import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Link as RouterLink } from 'react-router-dom';

const getTypeIcon = (type) => {
  switch (type) {
    case 'job':
      return <WorkIcon color="primary" />;
    case 'course':
      return <SchoolIcon color="secondary" />;
    case 'project':
      return <AssignmentIcon color="success" />;
    default:
      return null;
  }
};

const getTypeLabel = (type) => {
  switch (type) {
    case 'job':
      return 'İş İlanı';
    case 'course':
      return 'Kurs';
    case 'project':
      return 'Proje';
    default:
      return type;
  }
};

const OpportunityCard = ({ opportunity, showActions = true, showMatch = true }) => {
  const theme = useTheme();
  const {
    id,
    type,
    title,
    company,
    provider,
    client,
    location,
    createdAt,
    matchScore,
    isApplied,
    isEnrolled,
    hasJoined,
    skills = [],
    deadline,
    salary,
    duration
  } = opportunity;

  const typeLabel = getTypeLabel(type);
  const TypeIcon = getTypeIcon(type);
  const postedAgo = formatDistanceToNow(new Date(createdAt), { 
    addSuffix: true,
    locale: tr 
  });

  const getActionButton = () => {
    if (isApplied || isEnrolled || hasJoined) {
      return (
        <Button 
          size="small" 
          color="success"
          variant="contained"
          disabled
          fullWidth
        >
          {isApplied && 'Başvuruldu'}
          {isEnrolled && 'Kayıt Olundu'}
          {hasJoined && 'Katılım Sağlandı'}
        </Button>
      );
    }

    return (
      <Button
        component={RouterLink}
        to={`/opportunities/${type}/${id}`}
        variant="contained"
        color="primary"
        size="small"
        fullWidth
      >
        {type === 'job' && 'İncele ve Başvur'}
        {type === 'course' && 'Detayları Gör ve Kayıt Ol'}
        {type === 'project' && 'Projeye Katıl'}
      </Button>
    );
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          {TypeIcon}
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            sx={{ ml: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {typeLabel}
          </Typography>
          
          {showMatch && matchScore && (
            <Chip
              label={`%${matchScore} Uyum`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 'auto' }}
            />
          )}
        </Box>
        
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          color="primary" 
          gutterBottom
          sx={{ fontWeight: 'medium' }}
        >
          {company || provider || client}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon 
            fontSize="small" 
            color="action" 
            sx={{ mr: 0.5, fontSize: '1rem' }} 
          />
          <Typography variant="body2" color="text.secondary">
            {location || 'Uzaktan'}
          </Typography>
        </Box>
        
        {deadline && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTimeIcon 
              fontSize="small" 
              color="action" 
              sx={{ mr: 0.5, fontSize: '1rem' }} 
            />
            <Typography variant="body2" color="text.secondary">
              Son başvuru: {new Date(deadline).toLocaleDateString('tr-TR')}
            </Typography>
          </Box>
        )}
        
        {salary && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {salary}
          </Typography>
        )}
        
        {duration && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {duration}
          </Typography>
        )}
        
        {skills.length > 0 && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Gereken Yetkinlikler:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {skills.slice(0, 3).map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  size="small" 
                  variant="outlined" 
                />
              ))}
              {skills.length > 3 && (
                <Chip 
                  label={`+${skills.length - 3}`} 
                  size="small" 
                  variant="outlined" 
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ p: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {postedAgo}
        </Typography>
        
        {showActions && getActionButton()}
      </CardActions>
    </Card>
  );
};

export default OpportunityCard;
