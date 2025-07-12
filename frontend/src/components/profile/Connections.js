import React, { useState } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper, 
  Divider, 
  useTheme, 
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  PersonAdd as AddConnectionIcon,
  Message as MessageIcon,
  ConnectWithoutContact as ConnectIcon,
  PersonRemove as RemoveConnectionIcon,
  Block as BlockIcon,
  Report as ReportIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const ConnectionItem = ({ connection, onAction }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleAction = (action) => {
    onAction(connection.id, action);
    handleMenuClose();
  };
  
  return (
    <Paper 
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        '&:hover': {
          boxShadow: theme.shadows[1],
        },
      }}
    >
      <Box 
        display="flex" 
        alignItems="center" 
        flex={1} 
        width="100%"
        mb={isMobile ? 2 : 0}
      >
        <Avatar 
          src={connection.avatar} 
          alt={connection.name}
          sx={{ 
            width: 56, 
            height: 56, 
            mr: 2,
            fontSize: '1.5rem',
            bgcolor: theme.palette.primary.main
          }}
        >
          {connection.name.charAt(0)}
        </Avatar>
        
        <Box flex={1} minWidth={0}>
          <Typography 
            variant="subtitle1" 
            fontWeight="medium"
            noWrap
            sx={{ 
              display: 'block',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {connection.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            noWrap
            sx={{ 
              display: 'block',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {connection.title}
          </Typography>
          
          {connection.connectedDate && (
            <Typography variant="caption" color="text.secondary">
              {format(new Date(connection.connectedDate), 'MMMM yyyy', { locale: tr })} tarihinde bağlandı
            </Typography>
          )}
        </Box>
      </Box>
      
      <Box 
        display="flex" 
        gap={1}
        width={isMobile ? '100%' : 'auto'}
        sx={{ 
          '& > *': {
            flex: isMobile ? 1 : 'auto',
            whiteSpace: 'nowrap'
          }
        }}
      >
        <Button 
          variant="outlined" 
          size="small"
          startIcon={<MessageIcon />}
          fullWidth={isMobile}
          onClick={() => onAction(connection.id, 'message')}
        >
          {isMobile ? 'Mesaj' : 'Mesaj Gönder'}
        </Button>
        
        <Button 
          variant="contained" 
          size="small"
          color="primary"
          startIcon={<ConnectIcon />}
          fullWidth={isMobile}
          onClick={() => onAction(connection.id, 'connect')}
        >
          {isMobile ? 'Bağlan' : 'Bağlantı Kur'}
        </Button>
        
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{ 
            border: `1px solid ${theme.palette.divider}`,
            ...(isMobile && { display: 'none' })
          }}
        >
          <MoreIcon />
        </IconButton>
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleAction('remove')}>
          <ListItemIcon>
            <RemoveConnectionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Bağlantıyı Kaldır</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('block')}>
          <ListItemIcon>
            <BlockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Engelle</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('report')}>
          <ListItemIcon>
            <ReportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Şikayet Et</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

const Connections = ({ 
  connections = [], 
  totalConnections = 0, 
  connectionRequests = [], 
  connectionSuggestions = [], 
  loading = false, 
  error = null, 
  searchQuery = '', 
  currentFilter = 'all', 
  isOwnProfile = false, 
  onSearch, 
  onFilterChange, 
  onLoadMore, 
  onAccept, 
  onReject, 
  onConnect, 
  onRemove, 
  onBlock, 
  onFollow 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filter, setFilter] = useState('all');
  
  const filteredConnections = connections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connection.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'recent') {
      const connectionDate = new Date(connection.connectedDate);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return matchesSearch && connectionDate > oneMonthAgo;
    }
    
    return matchesSearch;
  });
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  const handleConnectionAction = (connectionId, action) => {
    console.log(`Action '${action}' for connection ${connectionId}`);
    // In a real app, this would dispatch an action to update the connection status
  };
  
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(error)}
        </Alert>
      )}
      <Box 
        display="flex" 
        flexDirection={isMobile ? 'column' : 'row'} 
        justifyContent="space-between" 
        alignItems={isMobile ? 'stretch' : 'center'}
        mb={3}
        gap={2}
      >
        <Box display="flex" alignItems="center">
          <Typography variant="h6" fontWeight="medium">
            Bağlantılar
          </Typography>
          <Chip 
            label={totalConnections} 
            size="small" 
            sx={{ ml: 1 }} 
          />
        </Box>
        
        <Box 
          display="flex" 
          gap={1}
          width={isMobile ? '100%' : 'auto'}
        >
          <TextField
            placeholder="Bağlantı ara..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            fullWidth={isMobile}
          />
          
          <Button 
            variant={filter === 'all' ? 'contained' : 'outlined'} 
            size="small"
            onClick={() => handleFilterChange('all')}
          >
            Tümü
          </Button>
          
          <Button 
            variant={filter === 'recent' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleFilterChange('recent')}
          >
            Son Eklenenler
          </Button>
        </Box>
      </Box>
      
      {connections.length === 0 ? (
        <Box 
          textAlign="center" 
          py={6}
          sx={{
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 2,
            backgroundColor: theme.palette.background.default
          }}
        >
          <ConnectIcon 
            sx={{ 
              fontSize: 48, 
              color: 'text.disabled', 
              opacity: 0.5, 
              mb: 2 
            }} 
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Henüz bağlantınız yok
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            Yeni bağlantılar ekleyerek ağınızı genişletin ve fırsatları keşfedin.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddConnectionIcon />}
          >
            Bağlantı Ekle
          </Button>
        </Box>
      ) : (
        <Box>
          {filteredConnections.length > 0 ? (
            filteredConnections.map(connection => (
              <ConnectionItem 
                key={connection.id} 
                connection={connection} 
                onAction={handleConnectionAction}
              />
            ))
          ) : (
            <Box 
              textAlign="center" 
              py={4}
              sx={{
                border: `1px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: theme.palette.background.default
              }}
            >
              <SearchIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'text.disabled', 
                  opacity: 0.5, 
                  mb: 2 
                }} 
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Sonuç bulunamadı
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Arama kriterlerinize uygun bağlantı bulunamadı.
              </Typography>
            </Box>
          )}
          
          {filteredConnections.length > 0 && (
            <Box mt={3} textAlign="center">
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<AddConnectionIcon />}
                sx={{ minWidth: 200 }}
              >
                Daha Fazla Bağlantı Göster
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Connections;
