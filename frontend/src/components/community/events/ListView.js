import React from 'react';
import { format, parseISO, isToday, isTomorrow, isThisWeek, isAfter, isBefore } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Chip, 
  Divider, 
  Button, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import { 
  LocationOn as LocationIcon, 
  AccessTime as TimeIcon, 
  Event as EventIcon,
  Group as GroupIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const ListView = ({ events, onEventClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Group events by date
  const groupedEvents = React.useMemo(() => {
    const groups = {
      today: { title: 'Bugün', events: [] },
      tomorrow: { title: 'Yarın', events: [] },
      thisWeek: { title: 'Bu Hafta', events: [] },
      upcoming: { title: 'Yaklaşan Etkinlikler', events: [] },
      past: { title: 'Geçmiş Etkinlikler', events: [] }
    };
    
    const now = new Date();
    
    events.forEach(event => {
      const eventDate = parseISO(event.startDate);
      const isPast = isBefore(eventDate, now);
      
      if (isToday(eventDate)) {
        groups.today.events.push(event);
      } else if (isTomorrow(eventDate)) {
        groups.tomorrow.events.push(event);
      } else if (isThisWeek(eventDate, { weekStartsOn: 1 })) {
        groups.thisWeek.events.push(event);
      } else if (isAfter(eventDate, now)) {
        groups.upcoming.events.push(event);
      } else {
        groups.past.events.push(event);
      }
    });
    
    // Filter out empty groups
    return Object.entries(groups)
      .filter(([_, group]) => group.events.length > 0)
      .map(([key, group]) => ({
        key,
        title: group.title,
        events: group.events.sort((a, b) => 
          new Date(a.startDate) - new Date(b.startDate)
        )
      }));
  }, [events]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return {
      day: format(date, 'd', { locale: tr }),
      month: format(date, 'MMM', { locale: tr }),
      weekday: format(date, 'EEE', { locale: tr })
    };
  };

  // Check if there are any events
  const hasEvents = groupedEvents.some(group => group.events.length > 0);

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
      {/* Header */}
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
        <Typography variant="h6" component="h2">
          Tüm Etkinlikler
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Toplam {events.length} etkinlik bulundu
        </Typography>
      </Box>
      
      {/* Events List */}
      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.default' }}>
        {hasEvents ? (
          groupedEvents.map((group, groupIndex) => (
            <Box key={group.key} sx={{ mb: 3 }}>
              {/* Group Header */}
              <Box 
                sx={{ 
                  p: 1.5, 
                  bgcolor: 'background.paper',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {group.title}
                </Typography>
              </Box>
              
              {/* Events in Group */}
              {group.events.map((event, eventIndex) => {
                const { day, month, weekday } = formatDate(event.startDate);
                const isPast = isBefore(parseISO(event.startDate), new Date());
                
                return (
                  <Box 
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    sx={{
                      display: 'flex',
                      p: 2,
                      bgcolor: 'background.paper',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      opacity: isPast ? 0.7 : 1,
                    }}
                  >
                    {/* Date Box */}
                    <Box 
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        bgcolor: isPast ? 'action.disabledBackground' : 'primary.light',
                        color: isPast ? 'text.secondary' : 'primary.contrastText',
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {day}
                      </Typography>
                      <Typography variant="caption" sx={{ lineHeight: 1, mt: -0.5 }}>
                        {month}
                      </Typography>
                    </Box>
                    
                    {/* Event Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            flex: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textDecoration: isPast ? 'line-through' : 'none',
                          }}
                        >
                          {event.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          {event.isPublic ? (
                            <PublicIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          ) : (
                            <LockIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {event.category}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <TimeIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="caption" color="text.secondary">
                          {event.startTime} - {event.endTime} • {weekday}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {event.location}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <GroupIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                          <Typography variant="caption" color="text.secondary">
                            {event.currentParticipants}/{event.maxParticipants || '∞'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Action Button */}
                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        color={isPast ? 'inherit' : 'primary'}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        {isPast ? 'Detaylar' : 'Katıl'}
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ))
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
              Henüz etkinlik bulunmuyor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 2 }}>
              Şu anda görüntülenecek etkinlik bulunmamaktadır. Yeni bir etkinlik oluşturarak başlayabilirsiniz.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<CalendarIcon />}
              onClick={() => {}}
            >
              Etkinlik Oluştur
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ListView;
