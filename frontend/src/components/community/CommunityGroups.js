import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Avatar,
  Button,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  Event as EventIcon,
  ChatBubble as ChatBubbleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Sample data - in a real app, this would come from an API
const sampleGroups = [
  {
    id: 'group1',
    name: 'Frontend Geliştiriciler',
    description: 'Frontend teknolojileri üzerine bilgi paylaşımı ve projeler',
    avatar: 'https://source.unsplash.com/random/400x300?tech',
    memberCount: 128,
    isPublic: true,
    isMember: true,
    isAdmin: false,
    lastActivity: '2023-05-15T14:30:00Z',
    tags: ['React', 'JavaScript', 'CSS', 'UI/UX']
  },
  {
    id: 'group2',
    name: 'Veri Bilimi Topluluğu',
    description: 'Veri bilimi, makine öğrenmesi ve yapay zeka konularında tartışma grubu',
    avatar: 'https://source.unsplash.com/random/400x300?data',
    memberCount: 87,
    isPublic: true,
    isMember: false,
    isAdmin: false,
    lastActivity: '2023-05-14T09:15:00Z',
    tags: ['Python', 'Machine Learning', 'Data Analysis', 'AI']
  },
  {
    id: 'group3',
    name: 'Mobil Uygulama Geliştiricileri',
    description: 'Mobil uygulama geliştirme üzerine uzman topluluğu',
    avatar: 'https://source.unsplash.com/random/400x300?mobile',
    memberCount: 64,
    isPublic: false,
    isMember: true,
    isAdmin: true,
    lastActivity: '2023-05-16T16:45:00Z',
    tags: ['React Native', 'Flutter', 'iOS', 'Android']
  },
  {
    id: 'group4',
    name: 'Yazılım Mimarisi',
    description: 'Temiz kod, tasarım desenleri ve yazılım mimarisi üzerine tartışmalar',
    avatar: 'https://source.unsplash.com/random/400x300?architecture',
    memberCount: 42,
    isPublic: true,
    isMember: false,
    isAdmin: false,
    lastActivity: '2023-05-13T11:20:00Z',
    tags: ['Design Patterns', 'Clean Code', 'Microservices', 'Docker']
  },
  {
    id: 'group5',
    name: 'Blockchain Geliştiricileri',
    description: 'Blockchain teknolojileri ve akıllı kontrat geliştirme',
    avatar: 'https://source.unsplash.com/random/400x300?blockchain',
    memberCount: 53,
    isPublic: true,
    isMember: true,
    isAdmin: false,
    lastActivity: '2023-05-16T10:05:00Z',
    tags: ['Ethereum', 'Solidity', 'Smart Contracts', 'Web3']
  }
];

const CommunityGroups = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [groups, setGroups] = useState(sampleGroups);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    isPublic: true,
    tags: ''
  });

  // Filter groups based on active tab and search query
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'my-groups') {
      return matchesSearch && group.isMember;
    } else if (activeTab === 'admin') {
      return matchesSearch && group.isAdmin;
    } else if (activeTab === 'public') {
      return matchesSearch && group.isPublic;
    } else if (activeTab === 'private') {
      return matchesSearch && !group.isPublic;
    }
    
    return matchesSearch;
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle join/leave group
  const handleGroupMembership = (groupId, join) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return { ...group, isMember: join };
      }
      return group;
    }));
  };

  // Handle create new group
  const handleCreateGroup = (e) => {
    e.preventDefault();
    const newGroupObj = {
      id: `group${groups.length + 1}`,
      name: newGroup.name,
      description: newGroup.description,
      avatar: `https://source.unsplash.com/random/400x300?${Math.floor(Math.random() * 1000)}`,
      memberCount: 1,
      isPublic: newGroup.isPublic,
      isMember: true,
      isAdmin: true,
      lastActivity: new Date().toISOString(),
      tags: newGroup.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    setGroups([newGroupObj, ...groups]);
    setOpenCreateDialog(false);
    setNewGroup({
      name: '',
      description: '',
      isPublic: true,
      tags: ''
    });
  };

  // Format date
  const formatDate = (dateStr) => {
    return format(new Date(dateStr), 'd MMMM yyyy HH:mm', { locale: tr });
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Topluluk Grupları
          </Typography>
          <Typography variant="body1" color="text.secondary">
            İlgi alanlarınıza göre gruplara katılın ve toplulukla etkileşime geçin
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ minWidth: 'fit-content' }}
        >
          Yeni Grup Oluştur
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          placeholder="Grup ara..."
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
        
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
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
          <Tab label="Tümü" value="all" />
          <Tab label="Gruplarım" value="my-groups" />
          <Tab label="Yöneticisi Olduklarım" value="admin" />
          <Tab label="Herkese Açık" value="public" />
          <Tab label="Özel Gruplar" value="private" />
        </Tabs>
      </Box>

      {/* Groups Grid */}
      <Grid container spacing={3}>
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Grid item xs={12} sm={6} lg={4} key={group.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardActionArea 
                  component="div"
                  onClick={() => {/* Navigate to group detail */}}
                  sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 140,
                      backgroundImage: `url(${group.avatar})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
                      },
                    }}
                  >
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16,
                      zIndex: 1,
                    }}>
                      {group.isPublic ? (
                        <Tooltip title="Herkese Açık Grup">
                          <PublicIcon sx={{ color: 'common.white' }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Özel Grup">
                          <LockIcon sx={{ color: 'common.white' }} />
                        </Tooltip>
                      )}
                    </Box>
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 16, 
                      left: 16, 
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Avatar 
                        src={group.avatar} 
                        alt={group.name}
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          border: '3px solid white',
                          boxShadow: theme.shadows[2]
                        }}
                      />
                      <Box>
                        <Typography 
                          variant="h6" 
                          component="div" 
                          sx={{ 
                            color: 'common.white',
                            fontWeight: 600,
                            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                          }}
                        >
                          {group.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <PeopleIcon fontSize="small" sx={{ color: 'common.white', opacity: 0.8 }} />
                          <Typography variant="caption" sx={{ color: 'common.white', opacity: 0.9 }}>
                            {group.memberCount} üye
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardMedia>
                  
                  <CardContent sx={{ width: '100%', flex: 1, p: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {group.description.length > 100 
                        ? `${group.description.substring(0, 100)}...` 
                        : group.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {group.tags.slice(0, 3).map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.6rem',
                            height: 20,
                            '& .MuiChip-label': { px: 1 },
                          }}
                        />
                      ))}
                      {group.tags.length > 3 && (
                        <Chip 
                          label={`+${group.tags.length - 3}`} 
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.6rem',
                            height: 20,
                            '& .MuiChip-label': { px: 0.5 },
                          }}
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary">
                        Son etkinlik: {formatDate(group.lastActivity)}
                      </Typography>
                      {group.isAdmin && (
                        <Chip 
                          label="Yönetici" 
                          size="small" 
                          color="primary"
                          sx={{ height: 20, fontSize: '0.6rem' }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
                
                <Divider />
                
                <Box sx={{ p: 1.5, display: 'flex', gap: 1 }}>
                  {group.isMember ? (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        startIcon={<ChatBubbleIcon fontSize="small" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to group chat
                        }}
                      >
                        Sohbet
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGroupMembership(group.id, false);
                        }}
                        sx={{ minWidth: 'fit-content' }}
                      >
                        Ayrıl
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      fullWidth
                      startIcon={<PersonAddIcon fontSize="small" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGroupMembership(group.id, true);
                      }}
                    >
                      Katıl
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', py: 6, px: 2 }}>
            <GroupIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {activeTab === 'my-groups' 
                ? 'Henüz hiç gruba katılmamışsınız' 
                : 'Uygun grup bulunamadı'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              {activeTab === 'my-groups'
                ? 'İlgi alanlarınıza uygun gruplara göz atın ve topluluğa katılın veya yeni bir grup oluşturun.'
                : 'Arama kriterlerinize uygun grup bulunamadı. Farklı bir arama terimi deneyin veya yeni bir grup oluşturun.'}
            </Typography>
            {activeTab === 'my-groups' && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateDialog(true)}
              >
                Yeni Grup Oluştur
              </Button>
            )}
          </Box>
        )}
      </Grid>

      {/* Create Group Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Yeni Grup Oluştur</DialogTitle>
        <form onSubmit={handleCreateGroup}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Grup Adı"
                type="text"
                fullWidth
                variant="outlined"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                required
              />
              
              <TextField
                margin="dense"
                label="Açıklama"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                required
              />
              
              <FormControl fullWidth margin="dense">
                <InputLabel>Grup Görünürlüğü</InputLabel>
                <Select
                  value={newGroup.isPublic ? 'public' : 'private'}
                  onChange={(e) => setNewGroup({...newGroup, isPublic: e.target.value === 'public'})}
                  label="Grup Görünürlüğü"
                >
                  <MenuItem value="public">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PublicIcon fontSize="small" />
                      <span>Herkese Açık</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="private">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LockIcon fontSize="small" />
                      <span>Özel Grup</span>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                margin="dense"
                label="Etiketler (virgülle ayırın)"
                type="text"
                fullWidth
                variant="outlined"
                value={newGroup.tags}
                onChange={(e) => setNewGroup({...newGroup, tags: e.target.value})}
                placeholder="Örnek: React, JavaScript, Frontend"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button onClick={() => setOpenCreateDialog(false)}>İptal</Button>
            <Button type="submit" variant="contained" color="primary">
              Grup Oluştur
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CommunityGroups;
