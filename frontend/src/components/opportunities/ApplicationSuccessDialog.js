import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  GroupWork as ProjectIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const ApplicationSuccessDialog = ({
  open,
  onClose,
  opportunity,
  onShare,
  onSave,
  saved = false,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!opportunity) return null;
  
  const { type, title, company, deadline, location } = opportunity;
  
  // Get the appropriate icon for the opportunity type
  const getTypeIcon = () => {
    switch (type) {
      case 'job':
        return <WorkIcon fontSize="large" color="primary" />;
      case 'course':
        return <SchoolIcon fontSize="large" color="primary" />;
      case 'project':
        return <ProjectIcon fontSize="large" color="primary" />;
      default:
        return <WorkIcon fontSize="large" color="primary" />;
    }
  };
  
  // Get success message based on opportunity type
  const getSuccessMessage = () => {
    switch (type) {
      case 'job':
        return 'Başvurunuz başarıyla gönderildi! İşveren incelemesinin ardından size dönüş yapılacaktır.';
      case 'course':
        return 'Kursa başarıyla kaydoldunuz! Kurs içeriğine hemen erişebilirsiniz.';
      case 'project':
        return 'Projeye katılım başvurunuz gönderildi! Proje yöneticisi onayının ardından size dönüş yapılacaktır.';
      default:
        return 'Başvurunuz başarıyla alındı!';
    }
  };
  
  // Get action button text based on opportunity type
  const getActionButtonText = () => {
    switch (type) {
      case 'job':
        return 'Başvurularımı Görüntüle';
      case 'course':
        return 'Kursa Git';
      case 'project':
        return 'Projeyi Görüntüle';
      default:
        return 'Devam Et';
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: 'success.light', 
        color: 'success.contrastText',
        textAlign: 'center',
        py: 3,
      }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar 
            sx={{ 
              bgcolor: 'success.main',
              width: 80, 
              height: 80,
              mb: 2,
              '& svg': {
                fontSize: 40,
              }
            }}
          >
            <CheckCircleIcon />
          </Avatar>
          <Typography variant="h5" component="div" gutterBottom>
            Başvurunuz Alındı!
          </Typography>
          <Typography variant="body2">
            {getSuccessMessage()}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ py: 4, px: 3 }}>
        <Box 
          display="flex" 
          flexDirection={isMobile ? 'column' : 'row'} 
          alignItems={isMobile ? 'center' : 'flex-start'}
          textAlign={isMobile ? 'center' : 'left'}
          gap={3}
          mb={3}
        >
          <Avatar 
            src={company?.logo} 
            alt={company?.name}
            sx={{ 
              width: 80, 
              height: 80,
              bgcolor: 'primary.main',
              '& svg': {
                fontSize: 40,
              },
              flexShrink: 0
            }}
          >
            {getTypeIcon()}
          </Avatar>
          
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {company?.name}
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={2} mt={1.5} justifyContent={isMobile ? 'center' : 'flex-start'}>
              {location && (
                <Box display="flex" alignItems="center" color="text.secondary">
                  <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{location}</Typography>
                </Box>
              )}
              
              {deadline && (
                <Box display="flex" alignItems="center" color="text.secondary">
                  <Typography variant="body2">
                    Son Başvuru: {format(new Date(deadline), 'd MMMM yyyy', { locale: tr })}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Sonraki Adımlar
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {type === 'job' 
              ? 'İşveren başvurunuzu inceledikten sonra size e-posta yoluyla dönüş yapılacaktır. Başvuru durumunuzu her zaman profil sayfanızdan takip edebilirsiniz.'
              : type === 'course'
                ? 'Kurs içeriğine hemen erişebilir, dersleri takip edebilir ve tamamladığınızda sertifikanızı alabilirsiniz.'
                : 'Proje yöneticisi başvurunuzu inceledikten sonra size dönüş yapacaktır. Başvuru durumunuzu profil sayfanızdan takip edebilirsiniz.'}
          </Typography>
        </Box>
        
        <Box 
          bgcolor={theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50'}
          p={2}
          borderRadius={2}
          border={`1px solid ${theme.palette.divider}`}
        >
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Paylaş
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Bu fırsatı arkadaşlarınızla paylaşarak daha fazla kişiye ulaşmasını sağlayabilirsiniz.
          </Typography>
          <Box display="flex" gap={1} mt={1}>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<ShareIcon />}
              onClick={onShare}
              fullWidth={isMobile}
            >
              Paylaş
            </Button>
            <Button 
              variant={saved ? 'contained' : 'outlined'} 
              size="small" 
              startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              onClick={() => onSave(!saved)}
              disabled={loading}
              fullWidth={isMobile}
            >
              {saved ? 'Kaydedildi' : 'Kaydet'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2} width="100%">
          <Button 
            variant="outlined" 
            onClick={onClose}
            fullWidth
          >
            Kapat
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={onClose}
            fullWidth
          >
            {getActionButtonText()}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationSuccessDialog;
