import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Divider, 
  Paper, 
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Videocam as VideoCallIcon,
  Info as InfoIcon,
  Mic as MicIcon,
  InsertEmoticon as InsertEmoticonIcon,
  Send as SendMessageIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Sample data - in a real app, this would come from an API
const sampleMessages = [
  {
    id: 1,
    sender: {
      id: 'user1',
      name: 'Ahmet Yılmaz',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isOnline: true
    },
    text: 'Merhaba, bugünkü toplantı için herkes hazır mı?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    isRead: true
  },
  {
    id: 2,
    sender: {
      id: 'user2',
      name: 'Ayşe Kaya',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      isOnline: true
    },
    text: 'Evet, ben hazırım. Sunum dosyalarını da hazırladım.',
    timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
    isRead: true
  },
  {
    id: 3,
    sender: {
      id: 'user3',
      name: 'Mehmet Demir',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      isOnline: false
    },
    text: 'Ben de hazırım. Toplantı linkini atabilir misiniz?',
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
    isRead: true
  },
  {
    id: 4,
    sender: {
      id: 'user4',
      name: 'Zeynep Şahin',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      isOnline: true
    },
    text: 'Tabii, hemen atıyorum: meet.google.com/xyz-123-456',
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    isRead: true
  },
  {
    id: 5,
    sender: {
      id: 'user1',
      name: 'Ahmet Yılmaz',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isOnline: true
    },
    text: 'Teşekkürler Zeynep. Herkes bağlanabiliyor mu?',
    timestamp: new Date(Date.now() - 1000 * 60 * 1), // 1 minute ago
    isRead: false
  }
];

const ChatInterface = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(sampleMessages);
  const messagesEndRef = useRef(null);
  
  // Current user - in a real app, this would come from auth context
  const currentUser = {
    id: 'currentUser',
    name: 'Siz',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    isOnline: true
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: currentUser,
      text: message,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };
  
  // Format message timestamp
  const formatMessageTime = (date) => {
    return format(date, 'HH:mm', { locale: tr });
  };
  
  // Check if message is from the current user
  const isCurrentUser = (senderId) => {
    return senderId === currentUser.id;
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      bgcolor: theme.palette.background.paper,
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      {/* Chat Header */}
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            color="success"
            sx={{
              '& .MuiBadge-badge': {
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
              },
            }}
          >
            <Avatar 
              alt="Topluluk Sohbeti" 
              src="/group-avatar.png"
              sx={{ width: 48, height: 48, mr: 2 }}
            />
          </Badge>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Genel Sohbet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              5 çevrimiçi üye
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <Tooltip title="Sesli arama">
            <IconButton color="primary" sx={{ mr: 1 }}>
              <MicIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Görüntülü arama">
            <IconButton color="primary" sx={{ mr: 1 }}>
              <VideoCallIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Grup bilgileri">
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Messages Area */}
      <Box 
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: theme.palette.background.default,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        }}
      >
        {messages.map((msg) => (
          <Box 
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: isCurrentUser(msg.sender.id) ? 'flex-end' : 'flex-start',
              mb: 2,
              '&:last-child': { mb: 0 }
            }}
          >
            {!isCurrentUser(msg.sender.id) && (
              <Tooltip 
                title={msg.sender.name} 
                placement="left"
                arrow
              >
                <Avatar 
                  alt={msg.sender.name} 
                  src={msg.sender.avatar}
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    mr: 1,
                    alignSelf: 'flex-end',
                    mb: '6px',
                    border: `2px solid ${theme.palette.background.paper}`
                  }}
                />
              </Tooltip>
            )}
            
            <Box
              sx={{
                maxWidth: '70%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isCurrentUser(msg.sender.id) ? 'flex-end' : 'flex-start',
              }}
            >
              {!isCurrentUser(msg.sender.id) && (
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ ml: 1, mb: 0.5, display: 'block' }}
                >
                  {msg.sender.name}
                </Typography>
              )}
              
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  borderTopLeftRadius: isCurrentUser(msg.sender.id) ? 12 : 4,
                  borderTopRightRadius: isCurrentUser(msg.sender.id) ? 4 : 12,
                  bgcolor: isCurrentUser(msg.sender.id) 
                    ? theme.palette.primary.main 
                    : theme.palette.background.paper,
                  color: isCurrentUser(msg.sender.id) 
                    ? theme.palette.primary.contrastText 
                    : 'text.primary',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    width: 0,
                    height: 0,
                    border: '8px solid transparent',
                    borderTopColor: isCurrentUser(msg.sender.id) 
                      ? theme.palette.primary.main 
                      : theme.palette.background.paper,
                    borderBottom: 0,
                    ...(isCurrentUser(msg.sender.id) 
                      ? { right: -6, transform: 'rotate(-20deg)' }
                      : { left: -6, transform: 'rotate(20deg)' }),
                    marginBottom: '-4px',
                  }
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {msg.text}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    mt: 0.5,
                    gap: 0.5
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.65rem',
                      opacity: 0.8,
                      color: isCurrentUser(msg.sender.id) 
                        ? 'rgba(255,255,255,0.8)' 
                        : 'text.secondary'
                    }}
                  >
                    {formatMessageTime(msg.timestamp)}
                  </Typography>
                  {isCurrentUser(msg.sender.id) && (
                    <Box sx={{ display: 'flex' }}>
                      {msg.isRead ? (
                        <Box sx={{ display: 'flex' }}>
                          <CheckCircleIcon 
                            sx={{ 
                              width: 14, 
                              height: 14, 
                              color: theme.palette.success.light 
                            }} 
                          />
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex' }}>
                          <CheckCircleIcon 
                            sx={{ 
                              width: 14, 
                              height: 14, 
                              color: theme.palette.grey[500] 
                            }} 
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Message Input */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: theme.palette.background.default,
            borderRadius: 4,
            px: 2,
            py: 1,
          }}
        >
          <IconButton 
            size="small" 
            color="primary"
            sx={{ mr: 0.5 }}
          >
            <InsertEmoticonIcon />
          </IconButton>
          
          <IconButton 
            size="small" 
            color="primary"
            sx={{ mr: 0.5 }}
          >
            <AttachFileIcon />
          </IconButton>
          
          <Box sx={{ flex: 1, mx: 1 }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Bir mesaj yazın..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: {
                  '& input': {
                    py: 1.5,
                    '&::placeholder': {
                      opacity: 0.7,
                    },
                  },
                },
              }}
              multiline
              maxRows={4}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </Box>
          
          <IconButton 
            type="submit" 
            color="primary"
            disabled={!message.trim()}
            sx={{ 
              bgcolor: message.trim() ? 'primary.main' : 'action.disabled',
              color: message.trim() ? 'primary.contrastText' : 'text.secondary',
              '&:hover': {
                bgcolor: message.trim() ? 'primary.dark' : 'action.disabled',
              },
              transition: 'all 0.2s',
              width: 36,
              height: 36,
            }}
          >
            <SendMessageIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;
