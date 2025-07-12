import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  LinearProgress, 
  Avatar, 
  IconButton, 
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Helper function to get the next milestone
const getNextMilestone = (milestones) => {
  if (!milestones) return null;
  const now = new Date();
  return milestones.find(milestone => !milestone.completed && new Date(milestone.dueDate) > now) || null;
};

// Helper function to get time remaining
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

// Helper function to get progress color
const getProgressColor = (progress) => {
  if (progress >= 75) return 'success';
  if (progress >= 50) return 'info';
  if (progress >= 25) return 'warning';
  return 'error';
};

// Helper function to get level color
const getLevelColor = (level) => {
  if (!level) return 'default';
  
  const levelLower = level.toLowerCase();
  if (levelLower.includes('başlangıç') || levelLower.includes('beginner')) return 'success';
  if (levelLower.includes('orta') || levelLower.includes('intermediate')) return 'info';
  if (levelLower.includes('ileri') || levelLower.includes('advanced')) return 'warning';
  if (levelLower.includes('uzman') || levelLower.includes('expert')) return 'error';
  return 'default';
};

const RoadmapCard = ({ roadmap, onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const nextMilestone = getNextMilestone(roadmap.milestones);
  
  // Get icon based on roadmap type
  const getRoadmapIcon = () => {
    if (roadmap.category?.toLowerCase().includes('frontend')) {
      return <CodeIcon sx={{ fontSize: 48, opacity: 0.8 }} />;
    } else if (roadmap.category?.toLowerCase().includes('backend')) {
      return <CodeIcon sx={{ fontSize: 48, opacity: 0.8 }} />;
    } else if (roadmap.category?.toLowerCase().includes('fullstack')) {
      return <CodeIcon sx={{ fontSize: 48, opacity: 0.8 }} />;
    } else if (roadmap.category?.toLowerCase().includes('kariyer') || roadmap.category?.toLowerCase().includes('career')) {
      return <WorkIcon sx={{ fontSize: 48, opacity: 0.8 }} />;
    }
    return <SchoolIcon sx={{ fontSize: 48, opacity: 0.8 }} />;
  };

  return (
    <Card 
      elevation={0}
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          cursor: 'pointer',
        },
      }}
    >
      {/* Featured Badge */}
      {roadmap.isFeatured && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'warning.main',
            color: 'warning.contrastText',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            boxShadow: theme.shadows[1]
          }}
        >
          <StarIcon fontSize="small" />
          <Typography variant="caption" fontWeight={600}>
            Öne Çıkan
          </Typography>
        </Box>
      )}
      
      {/* Header with Icon */}
      <Box sx={{ 
        position: 'relative', 
        height: 120, 
        bgcolor: 'primary.light',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'primary.dark',
        overflow: 'hidden'
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.3) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {getRoadmapIcon()}
        </Box>
        
        {/* Progress Indicator */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: 'divider',
            zIndex: 1,
          }}
        >
          <Box 
            sx={{
              height: '100%',
              width: `${roadmap.progress}%`,
              bgcolor: getProgressColor(roadmap.progress) + '.main',
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      </Box>
      
      {/* Card Content */}
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 3, 
        pb: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100% - 120px)',
      }}>
        {/* Header with Category and Level */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 1.5,
          gap: 1
        }}>
          {roadmap.category && (
            <Chip 
              label={roadmap.category} 
              size="small" 
              color="primary"
              variant="outlined"
              sx={{ 
                fontWeight: 500, 
                fontSize: '0.7rem',
                height: 24
              }}
            />
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {roadmap.level && (
              <Chip 
                label={roadmap.level} 
                size="small" 
                color={getLevelColor(roadmap.level)}
                variant="outlined"
                sx={{ 
                  fontWeight: 500, 
                  fontSize: '0.7rem',
                  height: 24
                }}
              />
            )}
            
            <Tooltip title="Diğer seçenekler">
              <IconButton 
                size="small" 
                sx={{ 
                  ml: 'auto',
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle menu open
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Title */}
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 600, 
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '3.5em', // 2 lines * 1.75 line height
          }}
        >
          {roadmap.title}
        </Typography>
        
        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {roadmap.description}
        </Typography>
        
        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              İlerleme
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {roadmap.progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={roadmap.progress} 
            color={getProgressColor(roadmap.progress)}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
        
        {/* Next Milestone */}
        {nextMilestone && (
          <Box 
            sx={{ 
              bgcolor: theme.palette.action.hover, 
              borderRadius: 1, 
              p: 1.5,
              mb: 2,
              borderLeft: `3px solid ${theme.palette.primary.main}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <AccessTimeIcon color="primary" fontSize="small" />
              <Typography variant="caption" fontWeight={600} color="text.primary">
                Sıradaki Adım
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              {nextMilestone.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getTimeRemaining(nextMilestone.dueDate)}
            </Typography>
          </Box>
        )}
        
        {/* Skills */}
        {roadmap.skills && roadmap.skills.length > 0 && (
          <Box sx={{ mt: 'auto', pt: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Öne Çıkan Beceriler:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxHeight: 60, overflow: 'hidden' }}>
              {roadmap.skills.slice(0, 5).map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.65rem',
                    height: 24,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              ))}
              {roadmap.skills.length > 5 && (
                <Chip 
                  label={`+${roadmap.skills.length - 5}`} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.65rem',
                    height: 24,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
      
      {/* Footer */}
      <Box 
        sx={{ 
          px: 2, 
          py: 1.5, 
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            src={roadmap.author?.avatar} 
            alt={roadmap.author?.name}
            sx={{ width: 28, height: 28 }}
          />
          <Typography variant="caption" color="text.secondary">
            {roadmap.author?.name || 'Anonim'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {roadmap.duration && (
            <Chip 
              icon={<AccessTimeIcon fontSize="small" />}
              label={roadmap.duration}
              size="small"
              variant="outlined"
              sx={{ 
                height: 24,
                '& .MuiChip-icon': {
                  color: 'text.secondary',
                  ml: 0.5,
                },
                '& .MuiChip-label': {
                  px: 0.5,
                  fontSize: '0.7rem',
                },
              }}
            />
          )}
          
          <Chip 
            icon={
              roadmap.progress === 100 ? (
                <CheckCircleIcon fontSize="small" color="success" />
              ) : (
                <RadioButtonUncheckedIcon fontSize="small" color="action" />
              )
            }
            label={`${roadmap.progress}%`}
            size="small"
            variant="outlined"
            sx={{ 
              height: 24,
              '& .MuiChip-icon': {
                ml: 0.5,
              },
              '& .MuiChip-label': {
                px: 0.5,
                fontSize: '0.7rem',
                fontWeight: 600,
                color: theme.palette[getProgressColor(roadmap.progress)].main,
              },
              borderColor: theme.palette[getProgressColor(roadmap.progress)].main,
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default RoadmapCard;
