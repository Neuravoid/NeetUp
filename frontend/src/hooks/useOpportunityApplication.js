import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  applyForJob, 
  enrollInCourse, 
  joinProject,
  fetchOpportunityById,
  fetchOpportunities
} from '../store/slices/opportunitiesSlice';

/**
 * Custom hook to handle opportunity applications, enrollments, and project joins
 * @param {string} opportunityType - Type of opportunity ('job', 'course', 'project')
 * @param {string} opportunityId - ID of the opportunity
 * @returns {Object} - Application state and handlers
 */
const useOpportunityApplication = (opportunityType, opportunityId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get application status from Redux store
  const { currentOpportunity, loading, error } = useSelector(
    (state) => state.opportunities
  );
  
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [applicationError, setApplicationError] = useState(null);
  
  // Check if user has already applied/enrolled/joined
  const hasApplied = currentOpportunity?.hasApplied || false;
  
  /**
   * Handle application submission
   * @param {Object} formData - Form data from the application form
   */
  const handleSubmitApplication = async (formData) => {
    try {
      setApplicationError(null);
      
      let response;
      const applicationData = {
        ...formData,
        opportunityId,
        opportunityType,
        appliedAt: new Date().toISOString()
      };
      
      // Call the appropriate API based on opportunity type
      switch (opportunityType) {
        case 'job':
          response = await dispatch(applyForJob({ 
            jobId: opportunityId, 
            applicationData 
          })).unwrap();
          break;
          
        case 'course':
          response = await dispatch(enrollInCourse({ 
            courseId: opportunityId, 
            enrollmentData: applicationData 
          })).unwrap();
          break;
          
        case 'project':
          response = await dispatch(joinProject({ 
            projectId: opportunityId, 
            joinData: applicationData 
          })).unwrap();
          break;
          
        default:
          throw new Error('Geçersiz fırsat türü');
      }
      
      // Refresh opportunity data to reflect the application
      await dispatch(fetchOpportunityById({ 
        type: opportunityType, 
        id: opportunityId 
      }));
      
      // Refresh opportunities list
      await dispatch(fetchOpportunities({ 
        type: opportunityType,
        page: 1,
        refresh: true
      }));
      
      // Show success state
      setIsApplicationDialogOpen(false);
      setIsSuccessDialogOpen(true);
      
      return response;
    } catch (error) {
      console.error('Application error:', error);
      setApplicationError(
        error.message || 'Başvuru işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      );
      throw error;
    }
  };
  
  /**
   * Open the application dialog
   */
  const handleOpenApplicationDialog = () => {
    setIsApplicationDialogOpen(true);
    setApplicationError(null);
  };
  
  /**
   * Close the application dialog
   */
  const handleCloseApplicationDialog = () => {
    setIsApplicationDialogOpen(false);
    setApplicationError(null);
  };
  
  /**
   * Close the success dialog and redirect if needed
   */
  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    // Optionally redirect to applications page or elsewhere
    // navigate('/my-applications');
  };
  
  /**
   * Get the appropriate button text based on opportunity type and application status
   */
  const getButtonText = () => {
    if (hasApplied) {
      switch (opportunityType) {
        case 'job':
          return 'Başvuruldu';
        case 'course':
          return 'Kayıt Olundu';
        case 'project':
          return 'Katılım Sağlandı';
        default:
          return 'Başvuru Yapıldı';
      }
    }
    
    switch (opportunityType) {
      case 'job':
        return 'Başvur';
      case 'course':
        return 'Kayıt Ol';
      case 'project':
        return 'Projeye Katıl';
      default:
        return 'Başvur';
    }
  };
  
  /**
   * Get the appropriate success message based on opportunity type
   */
  const getSuccessMessage = () => {
    switch (opportunityType) {
      case 'job':
        return 'Başvurunuz başarıyla gönderildi. İşveren incelemesinin ardından size dönüş yapılacaktır.';
      case 'course':
        return 'Kursa başarıyla kaydoldunuz. Kurs içeriğine hemen erişebilirsiniz.';
      case 'project':
        return 'Projeye katılım başvurunuz gönderildi. Proje yöneticisi onayının ardından size dönüş yapılacaktır.';
      default:
        return 'Başvurunuz başarıyla alındı.';
    }
  };
  
  return {
    // State
    isApplicationDialogOpen,
    isSuccessDialogOpen,
    applicationError,
    isLoading: loading.opportunity || loading.application,
    hasApplied,
    
    // Handlers
    handleSubmitApplication,
    handleOpenApplicationDialog,
    handleCloseApplicationDialog,
    handleCloseSuccessDialog,
    
    // Text content
    buttonText: getButtonText(),
    successMessage: getSuccessMessage(),
    
    // Button props for consistent styling
    getButtonProps: () => ({
      variant: hasApplied ? 'outlined' : 'contained',
      color: hasApplied ? 'success' : 'primary',
      disabled: hasApplied || loading.opportunity,
      onClick: hasApplied ? undefined : handleOpenApplicationDialog,
      startIcon: loading.opportunity ? <CircularProgress size={20} /> : null,
      fullWidth: true,
      sx: {
        mt: 1,
        textTransform: 'none',
        fontWeight: 500,
        py: 1,
      }
    })
  };
};

export default useOpportunityApplication;
