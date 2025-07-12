import React, { useMemo } from 'react';
import { format, parseISO, isToday, isSameDay, addHours } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Chip, 
  Divider, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import { 
  LocationOn as LocationIcon, 
  AccessTime as TimeIcon, 
  Event as EventIcon,
  Group as GroupIcon,
  Public as PublicIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const DayView = ({ date, events, onEventClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isCurrentDay = isToday(date);
  
  // Generate time slots for the day (8:00 - 22:00)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour,
        display: `${hour}:00`
      });
    }
    return slots;
  }, []);
  
  // Group events by hour for the selected day
  const eventsByHour = useMemo(() => {
    const grouped = {};
    timeSlots.forEach(slot => {
      grouped[slot.hour] = [];
    });
    
    events.forEach(event => {
      const eventDate = parseISO(event.startDate);
      const hour = eventDate.getHours();
      if (grouped[hour] !== undefined) {
        grouped[hour].push(event);
      }
    });
    
    return grouped;
  }, [events, timeSlots]);

  // Check if there are any events for the day
  const hasEvents = events.length > 0;

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Day Header */}
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" component="h2">
            {format(date, 'd MMMM yyyy', { locale: tr })}
          </Typography>
          {isCurrentDay && (
            <Chip 
              label="Bugün" 
              color="primary" 
              size="small" 
              sx={{ ml: 1, fontWeight: 'medium' }} 
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {format(date, 'EEEE', { locale: tr })}
        </Typography>
      </Box>
      
      {/* Events List */}
      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.default' }}>
        {hasEvents ? (
          timeSlots.map((slot, index) => {
            const hourEvents = eventsByHour[slot.hour] || [];
            const hasEventsInSlot = hourEvents.length > 0;
            
            return (
              <Box key={index}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    bgcolor: 'background.default',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 80, 
                      p: 1, 
                      textAlign: 'center',
                      borderRight: `1px solid ${theme.palette.divider}`,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Typography variant="subtitle2">
                      {slot.display}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minHeight: 60 }}>
                    {hasEventsInSlot ? (
                      hourEvents.map((event, eventIndex) => (
                        <Box 
                          key={eventIndex}
                          onClick={() => onEventClick(event)}
                          sx={{
                            p: 1.5,
                            m: 1,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            borderLeft: `3px solid ${theme.palette.primary.main}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: theme.shadows[2],
                              transform: 'translateX(2px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 'medium',
                                flex: 1,
                              }}
                            >
                              {event.title}
                            </Typography>
                            <Chip 
                              label={event.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <TimeIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                            <Typography variant="caption" color="text.secondary">
                              {event.startTime} - {event.endTime}
                            </Typography>
                            
                            {event.isOnline ? (
                              <>
                                <Box sx={{ mx: 1, color: 'divider' }}>•</Box>
                                <Typography variant="caption" color="primary">
                                  Çevrimiçi
                                </Typography>
                              </>
                            ) : (
                              <>
                                <Box sx={{ mx: 1, color: 'divider' }}>•</Box>
                                <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {event.location}
                                </Typography>
                              </>
                            )}
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={event.organizer.avatar} 
                              alt={event.organizer.name}
                              sx={{ width: 20, height: 20, mr: 0.5 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {event.organizer.name}
                            </Typography>
                            
                            <Box sx={{ mx: 1, color: 'divider' }}>•</Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <GroupIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                              <Typography variant="caption" color="text.secondary">
                                {event.currentParticipants}/{event.maxParticipants || '∞'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ height: 60, p: 1 }} />
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              p: 4,
              textAlign: 'center'
            }}
          >
            <EventIcon 
              sx={{ 
                fontSize: 64, 
                color: 'text.disabled',
                opacity: 0.3,
                mb: 2 
              }} 
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Bugün için etkinlik bulunmuyor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 2 }}>
              Bu tarih için planlanmış herhangi bir etkinlik bulunmamaktadır. Yeni bir etkinlik oluşturmak ister misiniz?
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default DayView;
