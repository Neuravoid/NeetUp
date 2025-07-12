import React, { useState } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  useTheme, 
  IconButton,
  Divider,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Check as CheckIcon, 
  Close as CloseIcon,
  School as SchoolIcon,
  MoreVert as MoreIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

const EducationItem = ({ 
  education, 
  onEdit, 
  onDelete,
  isOwnProfile 
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Devam Ediyor';
    return format(parseISO(dateString), 'MMM yyyy', { locale: tr });
  };
  
  return (
    <Paper 
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        '&:hover': {
          boxShadow: theme.shadows[1],
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box display="flex" gap={2} width="100%">
          <Box 
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: theme.palette.secondary.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.secondary.contrastText,
              flexShrink: 0,
              mt: 0.5
            }}
          >
            <SchoolIcon />
          </Box>
          
          <Box flex={1} minWidth={0}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="subtitle1" fontWeight="medium" noWrap>
                  {education.school}
                </Typography>
                <Typography variant="body2" color="text.primary" noWrap>
                  {education.degree} {education.field ? `- ${education.field}` : ''}
                </Typography>
              </Box>
              
              {isOwnProfile && (
                <IconButton
                  size="small"
                  onClick={handleMenuClick}
                  sx={{ ml: 1 }}
                >
                  <MoreIcon />
                </IconButton>
              )}
            </Box>
            
            <Box display="flex" alignItems="center" mt={0.5} flexWrap="wrap" gap={1}>
              <Box display="flex" alignItems="center" mr={2}>
                <CalendarIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(education.startDate)} - {!education.endDate ? 'Devam Ediyor' : formatDate(education.endDate)}
                </Typography>
              </Box>
              
              {education.location && (
                <Box display="flex" alignItems="center">
                  <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="caption" color="text.secondary">
                    {education.location}
                  </Typography>
                </Box>
              )}
            </Box>
            
            {education.description && (
              <Typography variant="body2" sx={{ mt: 1.5 }}>
                {education.description}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      
      {isOwnProfile && (
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
          <MenuItem onClick={() => { onEdit(education); handleMenuClose(); }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Düzenle</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onDelete(education.id); handleMenuClose(); }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Sil</ListItemText>
          </MenuItem>
        </Menu>
      )}
    </Paper>
  );
};

const EducationForm = ({ 
  education = null, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    id: education?.id || Date.now().toString(),
    school: education?.school || '',
    degree: education?.degree || '',
    field: education?.field || '',
    startDate: education?.startDate ? format(parseISO(education.startDate), 'yyyy-MM') : '',
    endDate: education?.endDate ? format(parseISO(education.endDate), 'yyyy-MM') : '',
    location: education?.location || '',
    description: education?.description || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      startDate: `${formData.startDate}-01`,
      endDate: formData.endDate ? `${formData.endDate}-01` : null
    });
  };
  
  return (
    <Paper 
      component="form" 
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        border: `1px solid ${useTheme().palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight="medium">
          {education ? 'Eğitimi Düzenle' : 'Yeni Eğitim Ekle'}
        </Typography>
        <IconButton size="small" onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <TextField
        name="school"
        label="Okul Adı"
        value={formData.school}
        onChange={handleChange}
        fullWidth
        required
        size="small"
        sx={{ mb: 2 }}
      />
      
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
        <TextField
          name="degree"
          label="Derece (örn. Lisans, Yüksek Lisans)"
          value={formData.degree}
          onChange={handleChange}
          fullWidth
          required
          size="small"
        />
        <TextField
          name="field"
          label="Bölüm/Program"
          value={formData.field}
          onChange={handleChange}
          fullWidth
          size="small"
        />
      </Box>
      
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
        <TextField
          name="startDate"
          label="Başlangıç Tarihi"
          type="month"
          value={formData.startDate}
          onChange={handleChange}
          fullWidth
          required
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
        />
        
        <TextField
          name="endDate"
          label="Mezuniyet Tarihi (boş bırakılırsa 'Devam Ediyor' olarak işaretlenir)"
          type="month"
          value={formData.endDate}
          onChange={handleChange}
          fullWidth
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      
      <TextField
        name="location"
        label="Konum (örn. İstanbul, Türkiye)"
        value={formData.location}
        onChange={handleChange}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />
      
      <TextField
        name="description"
        label="Açıklama (İsteğe bağlı)"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={2}
        size="small"
        sx={{ mb: 2 }}
      />
      
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button 
          variant="outlined" 
          onClick={onCancel}
          startIcon={<CloseIcon />}
        >
          Vazgeç
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          startIcon={<CheckIcon />}
          disabled={!formData.school || !formData.degree || !formData.startDate}
        >
          {education ? 'Güncelle' : 'Ekle'}
        </Button>
      </Box>
    </Paper>
  );
};

const EducationSection = ({ education = [], isOwnProfile = false, error = null, loading = false }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [localEducation, setLocalEducation] = useState(education);
  
  // Import Alert for MUI
  const { Alert } = require('@mui/material');
  
  const handleAddClick = () => {
    setEditingEdu(null);
    setIsAdding(true);
  };
  
  const handleEdit = (edu) => {
    setEditingEdu(edu);
    setIsAdding(true);
  };
  
  const handleSave = (edu) => {
    if (editingEdu) {
      // Update existing education
      setLocalEducation(prev => 
        prev.map(item => item.id === edu.id ? edu : item)
      );
    } else {
      // Add new education
      setLocalEducation(prev => [edu, ...prev]);
    }
    
    setIsAdding(false);
    setEditingEdu(null);
  };
  
  const handleDelete = (id) => {
    setLocalEducation(prev => prev.filter(item => item.id !== id));
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setEditingEdu(null);
  };
  
  // Sort education by date (most recent first)
  const sortedEducation = [...localEducation].sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate) : new Date();
    const dateB = b.endDate ? new Date(b.endDate) : new Date();
    return dateB - dateA;
  });
  
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(error)}
        </Alert>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Eğitim
        </Typography>
        {isOwnProfile && !isAdding && (
          <Button 
            size="small" 
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{ ml: 'auto' }}
          >
            Eğitim Ekle
          </Button>
        )}
      </Box>
      
      {isAdding && (
        <EducationForm 
          education={editingEdu} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      )}
      
      {sortedEducation.length > 0 ? (
        <Box>
          {sortedEducation.map(edu => (
            <EducationItem 
              key={edu.id} 
              education={edu} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </Box>
      ) : !isAdding && (
        <Box 
          textAlign="center" 
          py={4}
          sx={{ 
            backgroundColor: useTheme().palette.background.default, 
            borderRadius: 1,
            mb: 2
          }}
        >
          <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.5, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {isOwnProfile 
              ? 'Eğitim geçmişinizi ekleyerek profilinizi zenginleştirin.' 
              : 'Bu kullanıcı henüz eğitim bilgisi eklememiş.'}
          </Typography>
          {isOwnProfile && !isAdding && (
            <Button 
              size="small" 
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ mt: 1 }}
            >
              Eğitim Ekle
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EducationSection;
