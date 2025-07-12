import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  useTheme,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import { getErrorMessage } from '../../utils/errorHandler';
import { Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const AboutSection = ({ about = '', isOwnProfile = false, error = null, loading = false, isEditing = false, onSave, onCancel, onEdit }) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(about);
  
  const handleEditClick = () => {
    setEditedAbout(about);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving about:', editedAbout);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedAbout(about);
    setIsEditing(false);
  };
  
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(error)}
        </Alert>
      )}
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Hakkımda
        </Typography>
        {isOwnProfile && !isEditing && (
          <IconButton size="small" onClick={handleEditClick}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      {isEditing ? (
        <Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editedAbout}
            onChange={(e) => setEditedAbout(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleCancel}
              startIcon={<CloseIcon />}
            >
              Vazgeç
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              color="primary"
              onClick={handleSave}
              startIcon={<CheckIcon />}
            >
              Kaydet
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" paragraph>
          {about || (isOwnProfile ? 'Hakkınızda kısa bir özet ekleyin...' : 'Bu kullanıcı hakkında bilgi eklenmemiş.')}
        </Typography>
      )}
      
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default AboutSection;
