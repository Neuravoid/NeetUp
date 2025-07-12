import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  ChatBubble as ChatIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const EventDetailsDialog = ({ open, onClose, event: initialEvent, onJoin, onLeave, onToggleReminder }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState('details');
  const [event, setEvent] = useState(initialEvent);
  const [comment, setComment] = useState('');
  
  // Format date and time
  const formatDateTime = (dateString) => {
    const date = parseISO(dateString);
    return {
      date: format(date, 'd MMMM yyyy', { locale: tr }),
      day: format(date, 'EEEE', { locale: tr }),
      time: format(date, 'HH:mm', { locale: tr })
    };
  };
  
  const { date: startDate, day: startDay, time: startTime } = formatDateTime(event.startDate);
  const { date: endDate, time: endTime } = formatDateTime(event.endDate);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      // In a real app, this would add the comment to the event
      const newComment = {
        id: `comment-${Date.now()}`,
        user: {
          id: 'current-user',
          name: 'Siz',
          avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
        },
        text: comment,
        timestamp: new Date().toISOString()
      };
      
      setEvent(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));
      
      setComment('');
    }
  };
  
  // Handle joining/leaving event
  const handleJoinLeave = () => {
    if (event.isAttending) {
      onLeave?.(event.id);
      setEvent(prev => ({
        ...prev,
        isAttending: false,
        currentParticipants: Math.max(0, prev.currentParticipants - 1)
      }));
    } else {
      onJoin?.(event.id);
      setEvent(prev => ({
        ...prev,
        isAttending: true,
        currentParticipants: prev.currentParticipants + 1
      }));
    }
  };
  
  // Handle reminder toggle
  const handleReminderToggle = () => {
    onToggleReminder?.(event.id);
    setEvent(prev => ({
      ...prev,
      hasReminder: !prev.hasReminder
    }));
  };
  
  // Sample attendees - in a real app, this would come from the event data
  const attendees = event.attendees || [
    { id: 'user1', name: 'Ahmet Yılmaz', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 'user2', name: 'Ayşe Kaya', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 'user3', name: 'Mehmet Demir', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
  ];
  
  // Sample comments - in a real app, this would come from the event data
  const comments = event.comments || [
    {
      id: 'comment1',
      user: { id: 'user2', name: 'Ayşe Kaya', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      text: 'Bu etkinlik harika görünüyor, kesinlikle katılacağım!',
      timestamp: '2023-05-10T14:30:00Z'
    },
    {
      id: 'comment3',
      user: { id: 'user3', name: 'Mehmet Demir', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
      text: 'Yanımda bir arkadaşımı da getirebilir miyim?',
      timestamp: '2023-05-11T09:15:00Z'
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          height: isMobile ? '100%' : '90vh',
          maxHeight: isMobile ? 'none' : '800px',
          m: 0,
          overflow: 'hidden'
        }
      }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{ 
        p: 2, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}>
        <Box>
          <Typography variant="h6" component="div">
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.organizer.name} tarafından düzenleniyor
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      {/* Dialog Content */}
      <DialogContent sx={{ p: 0, bgcolor: 'background.default', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
          {/* Main Content */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            p: isMobile ? 2 : 3,
            maxWidth: isMobile ? '100%' : '70%'
          }}>
            {/* Event Image */}
            <Box 
              sx={{
                width: '100%',
                height: isMobile ? 180 : 250,
                borderRadius: 2,
                overflow: 'hidden',
                mb: 3,
                bgcolor: 'action.hover',
                position: 'relative',
                backgroundImage: `url(${event.image || 'https://source.unsplash.com/random/800x400/?event'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: 2,
                }}
              >
                <Box>
                  <Chip 
                    label={event.category}
                    color="primary"
                    size="small"
                    sx={{ 
                      mb: 1,
                      color: 'common.white',
                      bgcolor: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  />
                  <Typography 
                    variant="h5" 
                    component="div" 
                    sx={{ 
                      color: 'common.white',
                      fontWeight: 'bold',
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                    }}
                  >
                    {event.title}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab label="Detaylar" value="details" />
                <Tab label="Katılımcılar" value="attendees" />
                <Tab label="Yorumlar" value="comments" />
              </Tabs>
            </Box>
            
            {/* Tab Content */}
            <Box sx={{ mt: 2 }}>
              {activeTab === 'details' && (
                <Box>
                  <Typography variant="body1" paragraph>
                    {event.description}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tarih ve Saat
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon color="action" sx={{ mr: 1 }} />
                      <Typography>
                        {startDay}, {startDate}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
                      <TimeIcon color="action" sx={{ mr: 1 }} />
                      <Typography>
                        {startTime} - {endTime}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Konum
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <LocationIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography>{event.location}</Typography>
                        {event.isOnline ? (
                          <Typography variant="body2" color="primary">
                            Çevrimiçi Etkinlik
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {event.address}
                          </Typography>
                        )}
                        {event.meetingLink && (
                          <Button 
                            variant="text" 
                            size="small" 
                            color="primary"
                            sx={{ mt: 1, p: 0 }}
                            onClick={() => window.open(event.meetingLink, '_blank')}
                          >
                            Toplantıya Katıl
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Etiketler
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {event.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
              
              {activeTab === 'attendees' && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Katılımcılar ({event.currentParticipants}/{event.maxParticipants || '∞'})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.isPublic ? 'Herkese Açık' : 'Sadece Davetliler'}
                    </Typography>
                  </Box>
                  
                  <List>
                    {attendees.map((attendee) => (
                      <ListItem key={attendee.id}>
                        <ListItemAvatar>
                          <Avatar src={attendee.avatar} alt={attendee.name} />
                        </ListItemAvatar>
                        <ListItemText 
                          primary={attendee.name} 
                          secondary={attendee.role || 'Katılımcı'} 
                        />
                        {event.organizer.id === attendee.id && (
                          <Chip 
                            label="Düzenleyici" 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {activeTab === 'comments' && (
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Yorumlar ({comments.length})
                    </Typography>
                    
                    {/* Comment Form */}
                    <Paper 
                      component="form" 
                      onSubmit={handleCommentSubmit}
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2
                      }}
                    >
                      <Avatar 
                        src="https://randomuser.me/api/portraits/lego/1.jpg" 
                        alt="You" 
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Yorum yazın..."
                          size="small"
                          multiline
                          rows={2}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button 
                            type="submit" 
                            variant="contained" 
                            size="small"
                            disabled={!comment.trim()}
                          >
                            Yorum Yap
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                    
                    {/* Comments List */}
                    {comments.length > 0 ? (
                      <List sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
                        {comments.map((comment) => (
                          <Paper key={comment.id} sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Avatar src={comment.user.avatar} alt={comment.user.name} />
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="subtitle2">
                                    {comment.user.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {format(parseISO(comment.timestamp), 'd MMM yyyy HH:mm', { locale: tr })}
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  {comment.text}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <ChatIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.3, mb: 1 }} />
                        <Typography variant="body1" color="text.secondary">
                          Henüz yorum yok. İlk yorumu siz yapın!
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          
          {/* Sidebar - Not shown on mobile */}
          {!isMobile && (
            <Box 
              sx={{ 
                width: 300, 
                borderLeft: `1px solid ${theme.palette.divider}`,
                p: 2,
                overflowY: 'auto',
                bgcolor: 'background.paper'
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Katılım Durumu
                </Typography>
                <Button
                  fullWidth
                  variant={event.isAttending ? 'outlined' : 'contained'}
                  color={event.isAttending ? 'error' : 'primary'}
                  onClick={handleJoinLeave}
                  startIcon={event.isAttending ? <CloseIcon /> : <CheckCircleIcon />}
                  sx={{ mb: 1 }}
                >
                  {event.isAttending ? 'Katılmaktan Vazgeç' : 'Bu Etkinliğe Katıl'}
                </Button>
                
                <Button
                  fullWidth
                  variant={event.hasReminder ? 'contained' : 'outlined'}
                  color="secondary"
                  onClick={handleReminderToggle}
                  startIcon={event.hasReminder ? <NotificationsOffIcon /> : <NotificationsIcon />}
                >
                  {event.hasReminder ? 'Hatırlatıcıyı Kaldır' : 'Hatırlatıcı Ekle'}
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Paylaş
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<ShareIcon />}
                    fullWidth
                  >
                    Paylaş
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={event.hasReminder ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    onClick={() => setEvent(prev => ({ ...prev, hasReminder: !prev.hasReminder }))}
                  >
                    Kaydet
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Düzenleyici
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar 
                    src={event.organizer.avatar} 
                    alt={event.organizer.name}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography variant="subtitle2">
                      {event.organizer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.organizer.role || 'Etkinlik Düzenleyicisi'}
                    </Typography>
                  </Box>
                </Box>
                
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  startIcon={<ChatIcon />}
                  sx={{ mt: 1 }}
                >
                  Mesaj Gönder
                </Button>
              </Box>
              
              {event.isAdmin && (
                <>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Yönetim
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<EditIcon />}
                        fullWidth
                      >
                        Düzenle
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        fullWidth
                      >
                        Sil
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      
      {/* Mobile Actions - Only shown on mobile */}
      {isMobile && (
        <Box 
          sx={{ 
            position: 'sticky', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            bgcolor: 'background.paper',
            borderTop: `1px solid ${theme.palette.divider}`,
            p: 1,
            display: 'flex',
            gap: 1
          }}
        >
          <Button
            variant={event.isAttending ? 'outlined' : 'contained'}
            color={event.isAttending ? 'error' : 'primary'}
            onClick={handleJoinLeave}
            startIcon={event.isAttending ? <CloseIcon /> : <CheckCircleIcon />}
            fullWidth
            size="large"
          >
            {event.isAttending ? 'Ayrıl' : 'Katıl'}
          </Button>
          
          <IconButton 
            color={event.hasReminder ? 'primary' : 'default'}
            onClick={handleReminderToggle}
            sx={{ border: `1px solid ${theme.palette.divider}` }}
          >
            {event.hasReminder ? <NotificationsIcon /> : <NotificationsOffIcon />}
          </IconButton>
          
          <IconButton 
            color="primary"
            sx={{ border: `1px solid ${theme.palette.divider}` }}
          >
            <ShareIcon />
          </IconButton>
        </Box>
      )}
    </Dialog>
  );
};

export default EventDetailsDialog;
