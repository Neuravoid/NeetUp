import React, { useMemo } from 'react';
import { format, isSameDay, isToday, isSameMonth, eachDayOfInterval, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Box, Typography, Paper, Chip, useTheme, useMediaQuery } from '@mui/material';

const MonthView = ({ currentDate, selectedDate, onDateClick, events, onEventClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get the first and last day of the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Generate all days in the month
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Group events by day for quick lookup
  const eventsByDay = useMemo(() => {
    const grouped = {};
    events.forEach(event => {
      const eventDate = format(parseISO(event.startDate), 'yyyy-MM-dd');
      if (!grouped[eventDate]) {
        grouped[eventDate] = [];
      }
      grouped[eventDate].push(event);
    });
    return grouped;
  }, [events]);

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
      {/* Weekday Headers */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
          <Box 
            key={index}
            sx={{ 
              py: 1, 
              textAlign: 'center',
              fontWeight: 'medium',
              color: index === 0 ? theme.palette.error.main : 'text.primary',
            }}
          >
            {day}
          </Box>
        ))}
      </Box>
      
      {/* Calendar Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridAutoRows: '1fr',
        flex: 1,
        bgcolor: theme.palette.background.default,
        minHeight: isMobile ? '60vh' : '70vh',
      }}>
        {daysInMonth.map((day, index) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDay[dayKey] || [];
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);
          
          return (
            <Box 
              key={index}
              onClick={() => onDateClick(day)}
              sx={{
                p: 1,
                border: `1px solid ${theme.palette.divider}`,
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                minHeight: isMobile ? '80px' : '120px',
                bgcolor: isSelected 
                  ? theme.palette.action.selected 
                  : isDayToday 
                    ? theme.palette.action.hover 
                    : 'transparent',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
                opacity: isCurrentMonth ? 1 : 0.5,
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 0.5
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: isDayToday ? 'bold' : 'normal',
                    color: isDayToday ? 'primary.main' : 'text.primary',
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                {dayEvents.length > 0 && (
                  <Box 
                    sx={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'common.white',
                      fontSize: '0.6rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {dayEvents.length}
                  </Box>
                )}
              </Box>
              
              {/* Event indicators */}
              <Box sx={{ 
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5
              }}>
                {dayEvents.slice(0, isMobile ? 1 : 2).map((event, idx) => (
                  <Chip
                    key={idx}
                    label={event.title}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    sx={{
                      maxWidth: '100%',
                      height: 20,
                      fontSize: '0.6rem',
                      justifyContent: 'flex-start',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      '& .MuiChip-label': {
                        p: 0,
                        pl: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }
                    }}
                  />
                ))}
                {dayEvents.length > (isMobile ? 1 : 2) && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      textAlign: 'center',
                      fontSize: '0.6rem'
                    }}
                  >
                    +{dayEvents.length - (isMobile ? 1 : 2)} daha
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default MonthView;
