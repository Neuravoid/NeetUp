import React from 'react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  Divider, 
  IconButton, 
  useTheme, 
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  ThumbUp as LikeIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  MoreHoriz as MoreIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Article as ArticleIcon
} from '@mui/icons-material';

const ActivityItem = ({ activity }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'post':
        return <ArticleIcon color="primary" />;
      case 'event':
        return <EventIcon color="secondary" />;
      case 'certification':
        return <SchoolIcon color="success" />;
      default:
        return <ArticleIcon color="primary" />;
    }
  };
  
  const getActivityTitle = () => {
    switch (activity.type) {
      case 'post':
        return 'Gönderi Paylaştı';
      case 'event':
        return 'Bir Etkinliğe Katıldı';
      case 'certification':
        return 'Yeni Sertifika Aldı';
      default:
        return 'Yeni Aktivite';
    }
  };
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: theme.palette.primary.light,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1.5,
            color: theme.palette.primary.contrastText
          }}
        >
          {getActivityIcon()}
        </Box>
        <Box flex={1}>
          <Typography variant="subtitle2" fontWeight="medium">
            {getActivityTitle()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(parseISO(activity.date), 'd MMMM yyyy HH:mm', { locale: tr })}
          </Typography>
        </Box>
        <IconButton size="small">
          <MoreIcon />
        </IconButton>
      </Box>
      
      <Box pl={6}>
        <Typography variant="h6" gutterBottom>
          {activity.title}
        </Typography>
        
        {activity.content && (
          <Typography variant="body1" paragraph>
            {activity.content}
          </Typography>
        )}
        
        {activity.type === 'event' && (
          <Box 
            sx={{ 
              bgcolor: theme.palette.action.hover, 
              p: 2, 
              borderRadius: 1,
              mb: 2
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <EventIcon color="action" fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {format(parseISO(activity.eventDate), 'd MMMM yyyy, EEEE', { locale: tr })}
              </Typography>
            </Box>
            {activity.location && (
              <Box display="flex" alignItems="center">
                <Box sx={{ width: 20, height: 20, mr: 1, display: 'flex', alignItems: 'center' }}>
                  <LocationIcon fontSize="small" color="action" />
                </Box>
                <Typography variant="body2">
                  {activity.location}
                </Typography>
              </Box>
            )}
            {activity.attendees && (
              <Box display="flex" alignItems="center" mt={1}>
                <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {activity.attendees} katılımcı
                </Typography>
              </Box>
            )}
          </Box>
        )}
        
        {activity.type === 'certification' && activity.issuer && (
          <Box 
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: theme.palette.success.light,
              color: theme.palette.success.contrastText,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              mb: 2
            }}
          >
            <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {activity.issuer} tarafından verildi
            </Typography>
          </Box>
        )}
        
        <Box display="flex" alignItems="center" mt={2}>
          <Box display="flex" alignItems="center" mr={2}>
            <IconButton size="small" color="primary">
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {activity.likes || 0}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" mr={2}>
            <IconButton size="small" color="primary">
              <CommentIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {activity.comments || 0}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center">
            <IconButton size="small" color="primary">
              <ShareIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {activity.shares || 0}
            </Typography>
          </Box>
          
          <Box ml="auto">
            <IconButton size="small">
              <BookmarkIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

const ActivityFeed = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <EventIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.3, mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Henüz aktivite yok
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Yeni etkinlikleriniz burada görünecektir.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </Box>
  );
};

export default ActivityFeed;
