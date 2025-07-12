import React, { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Box, Typography, Paper, Chip, useTheme, useMediaQuery } from '@mui/material';

// Event item component
const EventItem = ({ event, onClick }) => {
  const theme = useTheme();
  
  return (
    <Chip
      label={event.title}
      size="small"
      onClick={onClick}
      sx={{
        width: '100%',
        height: 20,
        fontSize: '0.6rem',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        bgcolor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        mb: 0.5,
        '& .MuiChip-label': {
          p: 0,
          pl: 0.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }
      }}
    />
  );
};

const WeekView = ({ currentDate, events, onEventClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get the start and end of the current week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate all days in the week
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  });
  
  // Group events by day for quick lookup
  const eventsByDay = useMemo(() => {
    const grouped = {};
    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      grouped[dayKey] = [];
    });
    
    events.forEach(event => {
      const eventDate = format(parseISO(event.startDate), 'yyyy-MM-dd');
      if (grouped[eventDate]) {
        grouped[eventDate].push(event);
      }
    });
    
    return grouped;
  }, [events, weekDays]);

  // Time slots for the day (8:00 - 22:00)
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

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100%', 
      minHeight: '70vh',
      overflow: 'hidden',
      bgcolor: theme.palette.background.paper,
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`
    }}>
      {/* Time column */}
      <Box sx={{ 
        width: 50, 
        flexShrink: 0, 
        pt: 5,
        borderRight: `1px solid ${theme.palette.divider}`
      }}>
        {timeSlots.map((slot, index) => (
          <Box 
            key={index} 
            sx={{ 
              height: 60, 
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              pr: 1,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {slot.display}
            </Typography>
          </Box>
        ))}
      </Box>
      
      {/* Days */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1, 
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.action.hover,
          borderRadius: '4px',
        },
      }}>
        {weekDays.map((day, dayIndex) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDay[dayKey] || [];
          const isToday = isSameDay(day, new Date());
          
          return (
            <Box 
              key={dayIndex} 
              sx={{ 
                flex: 1, 
                minWidth: isMobile ? 150 : 180,
                borderRight: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                bgcolor: isToday ? theme.palette.action.hover : 'transparent',
              }}
            >
              {/* Day header */}
              <Box 
                sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: isToday ? 'bold' : 'normal',
                    color: isToday ? 'primary.main' : 'text.primary',
                  }}
                >
                  {format(day, 'EEE', { locale: tr })}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: isToday ? 'bold' : 'normal',
                    color: isToday ? 'primary.main' : 'text.primary',
                  }}
                >
                  {format(day, 'd')}
                </Typography>
              </Box>
              
              {/* Time slots */}
              <Box sx={{ position: 'relative', height: 'calc(60px * 14)' }}>
                {timeSlots.map((slot, slotIndex) => (
                  <Box 
                    key={slotIndex}
                    sx={{
                      height: 60,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                      },
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                ))}
                
                {/* Events */}
                {dayEvents.map((event, eventIndex) => {
                  const start = parseISO(event.startDate);
                  const end = parseISO(event.endDate);
                  const startHour = start.getHours() + (start.getMinutes() / 60);
                  const endHour = end.getHours() + (end.getMinutes() / 60);
                  const top = (startHour - 8) * 60; // 8:00 is the start time
                  const height = (endHour - startHour) * 60;
                  
                  return (
                    <Box
                      key={eventIndex}
                      onClick={() => onEventClick(event)}
                      sx={{
                        position: 'absolute',
                        top: `${top}px`,
                        height: `${Math.max(height, 30)}px`,
                        left: '4px',
                        right: '4px',
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                        borderRadius: 1,
                        p: 0.5,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        zIndex: 2,
                        '&:hover': {
                          boxShadow: theme.shadows[2],
                        },
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{
                          fontWeight: 'medium',
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: '0.65rem',
                        }}
                      >
                        {event.title}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{
                          display: 'block',
                          opacity: 0.9,
                          fontSize: '0.55rem',
                        }}
                      >
                        {event.startTime} - {event.endTime}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default WeekView;
