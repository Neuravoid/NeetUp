import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  Timeline as TimelineIcon,
  MenuBook as MenuBookIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Helper functions
const formatDate = (dateStr, formatStr = 'd MMMM yyyy') => {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), formatStr, { locale: tr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
};

const getTimeRemaining = (dueDate) => {
  if (!dueDate) return '';
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (isNaN(diffDays)) return '';
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
  if (!level) return 'default';
  const levelLower = level.toLowerCase();
  if (levelLower.includes('başlangıç') || levelLower.includes('beginner')) return 'success';
  if (levelLower.includes('orta') || levelLower.includes('intermediate')) return 'info';
  if (levelLower.includes('ileri') || levelLower.includes('advanced')) return 'warning';
  if (levelLower.includes('uzman') || levelLower.includes('expert')) return 'error';
  return 'default';
};

const RoadmapDetailDialog = ({ open, onClose, roadmap, onToggleMilestone }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(roadmap?.likeCount || 0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  if (!roadmap) return null;

  // Calculate progress
  const calculateProgress = (items) => {
    if (!items || items.length === 0) return 0;
    const completed = items.filter(item => item.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  const milestonesProgress = calculateProgress(roadmap.milestones || []);
  const nextMilestone = roadmap.milestones?.find(m => !m.completed) || null;
  const progressColor = getProgressColor(milestonesProgress);
  const timeRemaining = nextMilestone ? getTimeRemaining(nextMilestone.dueDate) : '';

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setLikeCount(prev => newLikeStatus ? prev + 1 : prev - 1);
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const getRoadmapIcon = () => {
    if (roadmap.category?.toLowerCase().includes('frontend')) {
      return <CodeIcon fontSize="large" color="primary" />;
    } else if (roadmap.category?.toLowerCase().includes('backend')) {
      return <CodeIcon fontSize="large" color="primary" />;
    } else if (roadmap.category?.toLowerCase().includes('kariyer')) {
      return <WorkIcon fontSize="large" color="primary" />;
    }
    return <SchoolIcon fontSize="large" color="primary" />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : 2,
          height: isMobile ? '100%' : '90vh',
          maxHeight: isMobile ? 'none' : '90vh',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <DialogTitle 
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            {getRoadmapIcon()}
          </Box>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {roadmap.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip 
                label={roadmap.category} 
                size="small" 
                color="primary"
                variant="outlined"
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
              <Chip 
                label={roadmap.level} 
                size="small" 
                color={getLevelColor(roadmap.level)}
                variant="outlined"
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
              {roadmap.isFeatured && (
                <Chip 
                  icon={<StarIcon fontSize="small" />}
                  label="Öne Çıkan"
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ height: 24, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleBookmark} color={isBookmarked ? 'primary' : 'default'}>
            {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
          <IconButton onClick={handleLike} color={isLiked ? 'primary' : 'default'}>
            {isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {likeCount > 0 ? likeCount : ''}
            </Typography>
          </IconButton>
          <IconButton onClick={handleShare} color={showShareOptions ? 'primary' : 'default'}>
            <ShareIcon />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Share Options */}
      {showShareOptions && (
        <Box 
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<ShareIcon />}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShowShareOptions(false);
            }}
          >
            Linki Kopyala
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ShareIcon />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: roadmap.title,
                  text: `${roadmap.title} - ${roadmap.description}`,
                  url: window.location.href,
                }).catch(console.error);
              }
              setShowShareOptions(false);
            }}
            disabled={!navigator.share}
          >
            Paylaş
          </Button>
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': { height: 3 },
            '& .MuiTab-root': { minHeight: 48 },
          }}
        >
          <Tab 
            label="Genel Bakış" 
            icon={<AssessmentIcon />} 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab 
            label="Aşamalar" 
            icon={<TimelineIcon />} 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab 
            label="Kaynaklar" 
            icon={<MenuBookIcon />} 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab 
            label="Topluluk" 
            icon={<GroupIcon />} 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>
      </Box>

      {/* Dialog Content */}
      <DialogContent 
        dividers 
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
            {/* Progress Section */}
            <Paper 
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: 'background.default',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon color="primary" />
                İlerleme Durumu
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={milestonesProgress} 
                    size={120}
                    thickness={4}
                    color={progressColor}
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
                    <Typography variant="h5" component="div" color={progressColor + '.main'} sx={{ fontWeight: 700 }}>
                      {`${milestonesProgress}%`}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {roadmap.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Başlangıç</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(roadmap.createdAt, 'd MMMM yyyy')}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Tahmini Süre</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {roadmap.duration || 'Belirtilmemiş'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Seviye</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {roadmap.level || 'Belirtilmemiş'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              {nextMilestone && (
                <Box 
                  sx={{ 
                    mt: 3, 
                    p: 2, 
                    bgcolor: 'action.hover', 
                    borderRadius: 1,
                    borderLeft: `3px solid ${theme.palette.primary.main}`
                  }}
                >
                  <Typography variant="subtitle2" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlagIcon fontSize="small" />
                    Sıradaki Aşama
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {nextMilestone.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {timeRemaining} • {formatDate(nextMilestone.dueDate, 'd MMMM yyyy')}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
            
            {/* Skills Section */}
            {roadmap.skills && roadmap.skills.length > 0 && (
              <Paper 
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Geliştirilecek Beceriler
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {roadmap.skills.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      size="small"
                      variant="outlined"
                      sx={{ height: 24, fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </Paper>
            )}
            
            {/* Author Section */}
            <Paper 
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'background.default',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Yol Haritası Hakkında
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Avatar 
                  src={roadmap.author?.avatar} 
                  alt={roadmap.author?.name}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {roadmap.author?.name || 'Anonim Kullanıcı'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {roadmap.createdAt && `Oluşturulma: ${formatDate(roadmap.createdAt, 'd MMMM yyyy')}`}
                  </Typography>
                  {roadmap.updatedAt && (
                    <Typography variant="caption" color="text.secondary">
                      Son güncelleme: {formatDate(roadmap.updatedAt, 'd MMMM yyyy')}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
        
        {/* Other tabs would be implemented here */}
        {activeTab !== 0 && (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>Bu sekme yakında eklenecek.</Typography>
          </Box>
        )}
      </DialogContent>
      
      {/* Footer Actions */}
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} color="inherit">
          Kapat
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            // Handle start roadmap
            onClose();
          }}
        >
          Yol Haritasına Başla
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoadmapDetailDialog;
