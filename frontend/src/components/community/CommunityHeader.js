import React from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Avatar, 
  Badge,
  Tooltip,
  Button,
  useMediaQuery
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Forum as ForumIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CommunityHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Sample user data - in a real app, this would come from Redux
  const user = {
    name: 'Ahmet Yılmaz',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    notificationCount: 3,
    messageCount: 2
  };

  return (
    <AppBar 
      position="static" 
      color="default"
      elevation={1}
      sx={{
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
        {/* Logo / Brand */}
        <Box 
          component={Link} 
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            mr: 3
          }}
        >
          <Box 
            component="img"
            src="/logo.png"
            alt="NeetUp"
            sx={{ 
              height: 40, 
              width: 'auto',
              mr: 1.5 
            }}
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            NeetUp
          </Typography>
        </Box>
        
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Search Bar - Hidden on mobile */}
        {!isMobile && (
          <Box 
            sx={{
              position: 'relative',
              borderRadius: 20,
              bgcolor: theme.palette.action.hover,
              width: '100%',
              maxWidth: 400,
              mr: 2,
              '&:hover': {
                bgcolor: theme.palette.action.selected,
              },
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon color="action" />
            </Box>
            <input
              type="text"
              placeholder="Toplulukta ara..."
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: '0.875rem',
                padding: theme.spacing(1.5, 1.5, 1.5, 6),
                border: 'none',
                background: 'transparent',
                width: '100%',
                '&:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        )}
        
        {/* Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile ? (
            <IconButton color="inherit" aria-label="search">
              <SearchIcon />
            </IconButton>
          ) : null}
          
          <Tooltip title="Bildirimler">
            <IconButton color="inherit" aria-label="notifications">
              <Badge badgeContent={user.notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Mesajlar">
            <IconButton color="inherit" aria-label="messages">
              <Badge badgeContent={user.messageCount} color="error">
                <ForumIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                display: { xs: 'none', sm: 'flex' },
                mr: 1.5
              }}
            >
              Yeni Gönderi
            </Button>
            
            <Tooltip title="Profil">
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
                sx={{ p: 0.5 }}
              >
                <Avatar 
                  alt={user.name} 
                  src={user.avatar}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
            </Tooltip>
            
            {isMobile && (
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                sx={{ ml: 0.5 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Toolbar>
      
      {/* Community Navigation */}
      <Box 
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          px: { xs: 2, md: 4 },
          py: 1,
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <Button 
          component={Link} 
          to="/community" 
          sx={{
            mr: 2,
            color: 'text.primary',
            fontWeight: 600,
            textTransform: 'none',
            minWidth: 'auto',
            px: 1.5,
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main',
            },
          }}
        >
          Ana Sayfa
        </Button>
        
        <Button 
          component={Link} 
          to="/community/chat" 
          sx={{
            mr: 2,
            color: 'text.primary',
            textTransform: 'none',
            minWidth: 'auto',
            px: 1.5,
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main',
            },
          }}
        >
          Sohbet
        </Button>
        
        <Button 
          component={Link} 
          to="/community/roadmap" 
          sx={{
            mr: 2,
            color: 'text.primary',
            textTransform: 'none',
            minWidth: 'auto',
            px: 1.5,
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main',
            },
          }}
        >
          Yol Haritası
        </Button>
        
        <Button 
          component={Link} 
          to="/community/groups" 
          sx={{
            mr: 2,
            color: 'text.primary',
            textTransform: 'none',
            minWidth: 'auto',
            px: 1.5,
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main',
            },
          }}
        >
          Gruplar
        </Button>
        
        <Button 
          component={Link} 
          to="/community/events" 
          sx={{
            mr: 2,
            color: 'text.primary',
            textTransform: 'none',
            minWidth: 'auto',
            px: 1.5,
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main',
            },
          }}
        >
          Etkinlikler
        </Button>
      </Box>
    </AppBar>
  );
};

export default CommunityHeader;
