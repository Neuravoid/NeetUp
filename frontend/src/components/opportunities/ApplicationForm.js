import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import tr from 'date-fns/locale/tr';

// Validation schema
const applicationSchema = (opportunityType) => {
  const baseSchema = {
    coverLetter: yup.string().required('Bu alan zorunludur').min(50, 'Minimum 50 karakter giriniz'),
  };

  if (opportunityType === 'job') {
    return yup.object({
      ...baseSchema,
      expectedSalary: yup.number().typeError('Geçerli bir sayı giriniz').positive('Pozitif bir değer giriniz').required('Bu alan zorunludur'),
      availableFrom: yup.date().required('Bu alan zorunludur'),
    });
  } else if (opportunityType === 'course') {
    return yup.object({
      ...baseSchema,
      experienceLevel: yup.string().required('Bu alan zorunludur'),
      learningGoals: yup.string().required('Bu alan zorunludur'),
    });
  } else if (opportunityType === 'project') {
    return yup.object({
      ...baseSchema,
      role: yup.string().required('Bu alan zorunludur'),
      timeCommitment: yup.string().required('Bu alan zorunludur'),
      relevantExperience: yup.string().required('Bu alan zorunludur'),
    });
  }
  
  return yup.object(baseSchema);
};

const ApplicationForm = ({ 
  open, 
  onClose, 
  opportunity, 
  onSubmit, 
  loading = false, 
  error = null 
}) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const opportunityType = opportunity?.type || 'job';
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(applicationSchema(opportunityType)),
    defaultValues: {
      coverLetter: '',
      expectedSalary: '',
      availableFrom: null,
      experienceLevel: '',
      learningGoals: '',
      role: '',
      timeCommitment: '',
      relevantExperience: ''
    },
  });

  const handleClose = () => {
    reset();
    setStep(1);
    setSubmitted(false);
    onClose();
  };

  const handleFormSubmit = async (data) => {
    if (submitted) return;
    
    setSubmitted(true);
    try {
      await onSubmit(data);
      setStep(2);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitted(false);
    }
  };

  const renderFormFields = () => {
    switch (opportunityType) {
      case 'job':
        return (
          <>
            <Grid item xs={12} md={6}>
              <Controller
                name="expectedSalary"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Beklenen Maaş (₺)"
                    type="number"
                    error={!!errors.expectedSalary}
                    helperText={errors.expectedSalary?.message}
                    InputProps={{
                      endAdornment: '₺',
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="availableFrom"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                    <DatePicker
                      {...field}
                      label="Müsait Başlangıç Tarihi"
                      minDate={new Date()}
                      openTo="month"
                      views={['year', 'month', 'day']}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.availableFrom}
                          helperText={errors.availableFrom?.message}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
          </>
        );
      
      case 'course':
        return (
          <>
            <Grid item xs={12}>
              <Controller
                name="experienceLevel"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.experienceLevel}>
                    <InputLabel>Deneyim Seviyesi</InputLabel>
                    <Select {...field} label="Deneyim Seviyesi">
                      <MenuItem value="beginner">Başlangıç Seviyesi</MenuItem>
                      <MenuItem value="intermediate">Orta Seviye</MenuItem>
                      <MenuItem value="advanced">İleri Seviye</MenuItem>
                      <MenuItem value="expert">Uzman</MenuItem>
                    </Select>
                    {errors.experienceLevel && (
                      <FormHelperText>{errors.experienceLevel.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="learningGoals"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Öğrenme Hedefleriniz"
                    placeholder="Bu kurstan ne öğrenmeyi hedefliyorsunuz?"
                    error={!!errors.learningGoals}
                    helperText={errors.learningGoals?.message}
                  />
                )}
              />
            </Grid>
          </>
        );
      
      case 'project':
        return (
          <>
            <Grid item xs={12} md={6}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Projedeki Rolünüz"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="timeCommitment"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.timeCommitment}>
                    <InputLabel>Zaman Ayırma Durumunuz</InputLabel>
                    <Select {...field} label="Zaman Ayırma Durumunuz">
                      <MenuItem value="part-time">Yarı Zamanlı (Haftada 10-20 saat)</MenuItem>
                      <MenuItem value="full-time">Tam Zamanlı (Haftada 30+ saat)</MenuItem>
                      <MenuItem value="weekends">Hafta Sonları</MenuItem>
                      <MenuItem value="flexible">Esnek Zamanlı</MenuItem>
                    </Select>
                    {errors.timeCommitment && (
                      <FormHelperText>{errors.timeCommitment.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="relevantExperience"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="İlgili Deneyimleriniz"
                    placeholder="Bu proje için sahip olduğunuz ilgili deneyimlerinizi belirtiniz"
                    error={!!errors.relevantExperience}
                    helperText={errors.relevantExperience?.message}
                  />
                )}
              />
            </Grid>
          </>
        );
      
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <Box>
          <Typography variant="h6" gutterBottom>
            {opportunity?.title} - Başvuru Formu
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Lütfen aşağıdaki formu doldurarak başvurunuzu tamamlayın.
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {renderFormFields()}
            <Grid item xs={12}>
              <Controller
                name="coverLetter"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={6}
                    label="Ön Yazı"
                    placeholder="Neden bu fırsat için uygun olduğunuzu açıklayın..."
                    error={!!errors.coverLetter}
                    helperText={`${field.value?.length || 0}/1000 ${errors.coverLetter ? `- ${errors.coverLetter.message}` : ''}`}
                    inputProps={{ maxLength: 1000 }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      );
    } else if (step === 2) {
      return (
        <Box textAlign="center" py={4}>
          <Box sx={{ color: 'success.main', mb: 2 }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
            </svg>
          </Box>
          <Typography variant="h5" gutterBottom>
            Başvurunuz Gönderildi!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            <strong>{opportunity?.title}</strong> için başvurunuz başarıyla alındı.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            İşveren incelemesinin ardından size dönüş yapılacaktır. Başvuru durumunuzu profil sayfanızdan takip edebilirsiniz.
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      {step === 1 && (
        <DialogTitle sx={{ 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          py: 2,
          px: 3
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div">
              {opportunityType === 'job' ? 'İş Başvurusu' : 
               opportunityType === 'course' ? 'Kursa Kayıt' : 'Projeye Katıl'}
            </Typography>
            <Box sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}>
              1/1
            </Box>
          </Box>
        </DialogTitle>
      )}
      
      <DialogContent sx={{ py: 4, px: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {getErrorMessage(error)}
          </Alert>
        )}
        
        {renderStepContent()}
      </DialogContent>
      
      <DialogActions sx={{ 
        borderTop: step === 1 ? '1px solid' : 'none', 
        borderColor: 'divider',
        p: 3,
        pt: 2,
      }}>
        {step === 1 && (
          <>
            <Button 
              onClick={handleClose} 
              color="inherit"
              disabled={loading}
            >
              İptal
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit(handleFormSubmit)}
              disabled={loading || submitted}
              startIcon={(loading || submitted) ? <CircularProgress size={20} color="inherit" /> : null}
              type="button"
            >
              {loading || submitted ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
            </Button>
          </>
        )}
        {step === 2 && (
          <Button 
            variant="contained" 
            onClick={handleClose}
            fullWidth
          >
            Tamam
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationForm;
