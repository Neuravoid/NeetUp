import React, { useState, useMemo } from 'react';
import { format, isBefore, parseISO, isToday, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Today as TodayIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon
} from '@mui/icons-material';

// Import view components (to be created next)
import MonthView from './events/MonthView';
import WeekView from './events/WeekView';
import DayView from './events/DayView';
import ListView from './events/ListView';
import EventDetailsDialog from './events/EventDetailsDialog';

// Sample data - in a real app, this would come from an API
const sampleEvents = [
  {
    id: 'event1',
    title: 'React Geliştirme Atölyesi',
    description: 'React ve Redux kullanarak modern web uygulamaları geliştirme atölyesi.',
    startDate: new Date().setDate(new Date().getDate() + 2),
    endDate: new Date().setDate(new Date().getDate() + 2),
    startTime: '19:00',
    endTime: '21:00',
    location: 'Online - Zoom',
    isOnline: true,
    maxParticipants: 30,
    currentParticipants: 12,
    isPublic: true,
    category: 'Eğitim',
    organizer: {
      id: 'user1',
      name: 'Ahmet Yılmaz',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    tags: ['React', 'Frontend', 'Eğitim'],
    isAttending: true,
    hasReminder: true
  },
  // More sample events...
];

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(sampleEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  // Filter events based on search query and active tab
  const filteredEvents = useMemo(() => {
    return sampleEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const isPastEvent = isBefore(parseISO(event.startDate), new Date());
      const matchesTab = 
        (activeTab === 'upcoming' && !isPastEvent) ||
        (activeTab === 'past' && isPastEvent) ||
        (activeTab === 'my-events' && event.isAttending) ||
        (activeTab === 'saved' && event.hasReminder);
      
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  // Navigation handlers
  const handlePrevPeriod = () => {
    setCurrentDate(view === 'month' ? subMonths(currentDate, 1) : addDays(currentDate, -7));
  };

  const handleNextPeriod = () => {
    setCurrentDate(view === 'month' ? addMonths(currentDate, 1) : addDays(currentDate, 7));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Event action handlers
  const handleOpenEventDialog = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  // Render the appropriate view
  const renderView = () => {
    const viewProps = {
      currentDate,
      selectedDate,
      onDateClick: setSelectedDate,
      events: filteredEvents,
      onEventClick: handleOpenEventDialog
    };

    switch (view) {
      case 'month':
        return <MonthView {...viewProps} />;
      case 'week':
        return <WeekView {...viewProps} />;
      case 'day':
        return <DayView date={selectedDate} events={filteredEvents} onEventClick={handleOpenEventDialog} />;
      case 'list':
      default:
        return <ListView events={filteredEvents} onEventClick={handleOpenEventDialog} />;
    }
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2
        }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Etkinlikler
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Topluluk etkinliklerini keşfedin ve katılın
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Yeni Etkinlik Oluştur
          </Button>
        </Box>

        {/* View Controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['month', 'week', 'day', 'list'].map((viewType) => (
              <Button
                key={viewType}
                variant={view === viewType ? 'contained' : 'outlined'}
                onClick={() => setView(viewType)}
                size="small"
              >
                {viewType === 'month' ? 'Ay' : 
                 viewType === 'week' ? 'Hafta' : 
                 viewType === 'day' ? 'Gün' : 'Liste'}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton onClick={handlePrevPeriod} size="small">
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>
            <Button
              variant="text"
              onClick={handleToday}
              startIcon={<TodayIcon />}
              size="small"
            >
              Bugün
            </Button>
            <Typography variant="subtitle1" sx={{ minWidth: 150, textAlign: 'center' }}>
              {view === 'month' 
                ? format(currentDate, 'MMMM yyyy', { locale: tr })
                : view === 'week'
                ? `${format(startOfWeek(currentDate), 'd MMM', { locale: tr })} - ${format(endOfWeek(currentDate), 'd MMM yyyy', { locale: tr })}`
                : format(selectedDate, 'd MMMM yyyy', { locale: tr })}
            </Typography>
            <IconButton onClick={handleNextPeriod} size="small">
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 2,
          flexWrap: 'wrap'
        }}>
          <TextField
            placeholder="Etkinlik ara..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              flex: 1, 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            size="small"
          >
            Filtrele
          </Button>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-flexContainer': {
              gap: 1,
            },
            '& .MuiTab-root': {
              minHeight: 36,
              height: 36,
              borderRadius: 2,
              px: 2,
              minWidth: 'auto',
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
              },
            },
          }}
        >
          <Tab label="Yaklaşan" value="upcoming" />
          <Tab label="Geçmiş" value="past" />
          <Tab label="Katıldıklarım" value="my-events" />
          <Tab label="Kaydettiklerim" value="saved" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ minHeight: '60vh' }}>
        {renderView()}
      </Box>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <EventDetailsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          event={selectedEvent}
        />
      )}
    </Box>
  );
};

export default Events;
