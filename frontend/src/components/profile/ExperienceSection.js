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
  ListItemText,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Check as CheckIcon, 
  Close as CloseIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  MoreVert as MoreIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

const ExperienceItem = ({ 
  experience, 
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
    if (!dateString) return 'Şimdi';
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
              bgcolor: theme.palette.primary.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.primary.contrastText,
              flexShrink: 0,
              mt: 0.5
            }}
          >
            <BusinessIcon />
          </Box>
          
          <Box flex={1} minWidth={0}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="subtitle1" fontWeight="medium" noWrap>
                  {experience.title}
                </Typography>
                <Typography variant="body2" color="primary" noWrap>
                  {experience.company}
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
                  {formatDate(experience.startDate)} - {experience.current ? 'Şimdi' : formatDate(experience.endDate)}
                </Typography>
              </Box>
              
              {experience.location && (
                <Box display="flex" alignItems="center">
                  <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="caption" color="text.secondary">
                    {experience.location}
                  </Typography>
                </Box>
              )}
            </Box>
            
            {experience.description && (
              <Typography variant="body2" sx={{ mt: 1.5 }}>
                {experience.description}
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
          <MenuItem onClick={() => { onEdit(experience); handleMenuClose(); }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Düzenle</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onDelete(experience.id); handleMenuClose(); }}>
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

const ExperienceForm = ({ 
  experience = null, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    id: experience?.id || Date.now().toString(),
    title: experience?.title || '',
    company: experience?.company || '',
    location: experience?.location || '',
    startDate: experience?.startDate ? format(parseISO(experience.startDate), 'yyyy-MM') : '',
    endDate: experience?.endDate ? format(parseISO(experience.endDate), 'yyyy-MM') : '',
    current: experience?.current || false,
    description: experience?.description || ''
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      startDate: `${formData.startDate}-01`,
      endDate: formData.current ? null : `${formData.endDate}-01`
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
          {experience ? 'Deneyimi Düzenle' : 'Yeni İş Deneyimi Ekle'}
        </Typography>
        <IconButton size="small" onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
        <TextField
          name="title"
          label="Pozisyon"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
          size="small"
        />
        <TextField
          name="company"
          label="Şirket Adı"
          value={formData.company}
          onChange={handleChange}
          fullWidth
          required
          size="small"
        />
      </Box>
      
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
        <TextField
          name="location"
          label="Konum (örn. İstanbul, Türkiye)"
          value={formData.location}
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
        
        <Box flex={1} display="flex" flexDirection="column">
          <TextField
            name="endDate"
            label="Bitiş Tarihi"
            type="month"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            disabled={formData.current}
            required={!formData.current}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={formData.current} 
                onChange={handleChange} 
                name="current" 
                size="small" 
              />
            }
            label="Şu anda burada çalışıyorum"
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Box>
      
      <TextField
        name="description"
        label="Açıklama (İsteğe bağlı)"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
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
          disabled={!formData.title || !formData.company || !formData.startDate || (!formData.current && !formData.endDate)}
        >
          {experience ? 'Güncelle' : 'Ekle'}
        </Button>
      </Box>
    </Paper>
  );
};

const ExperienceSection = ({ experiences = [], isOwnProfile = false, error = null, loading = false }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [localExperiences, setLocalExperiences] = useState(experiences);
  
  const handleAddClick = () => {
    setEditingExp(null);
    setIsAdding(true);
  };
  
  const handleEdit = (experience) => {
    setEditingExp(experience);
    setIsAdding(true);
  };
  
  const handleSave = (experience) => {
    if (editingExp) {
      // Update existing experience
      setLocalExperiences(prev => 
        prev.map(exp => exp.id === experience.id ? experience : exp)
      );
    } else {
      // Add new experience
      setLocalExperiences(prev => [experience, ...prev]);
    }
    
    setIsAdding(false);
    setEditingExp(null);
  };
  
  const handleDelete = (id) => {
    setLocalExperiences(prev => prev.filter(exp => exp.id !== id));
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setEditingExp(null);
  };
  
  // Sort experiences by date (most recent first)
  const sortedExperiences = [...localExperiences].sort((a, b) => {
    const dateA = a.current ? new Date() : new Date(a.endDate);
    const dateB = b.current ? new Date() : new Date(b.endDate);
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
          Deneyim
        </Typography>
        {isOwnProfile && !isAdding && (
          <Button 
            size="small" 
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{ ml: 'auto' }}
          >
            Deneyim Ekle
          </Button>
        )}
      </Box>
      
      {isAdding && (
        <ExperienceForm 
          experience={editingExp} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      )}
      
      {sortedExperiences.length > 0 ? (
        <Box>
          {sortedExperiences.map(exp => (
            <ExperienceItem 
              key={exp.id} 
              experience={exp} 
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
          <WorkIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.5, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {isOwnProfile 
              ? 'İş deneyiminizi ekleyerek profilinizi zenginleştirin.' 
              : 'Bu kullanıcı henüz iş deneyimi eklememiş.'}
          </Typography>
          {isOwnProfile && !isAdding && (
            <Button 
              size="small" 
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ mt: 1 }}
            >
              Deneyim Ekle
            </Button>
          )}
        </Box>
      )}
      
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default ExperienceSection;
