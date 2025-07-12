import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
  setExperienceFormData,
  resetExperienceForm
} from '../../store/slices/profileSlice';
import ExperienceSection from './ExperienceSection';

const ExperienceSectionContainer = ({ isOwnProfile = false }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Get experiences and form data from Redux store
  const { 
    experiences,
    loading,
    error,
    formData: experienceFormData
  } = useSelector((state) => ({
    experiences: state.profile.experiences.data,
    loading: state.profile.experiences.loading,
    error: state.profile.experiences.error,
    formData: state.profile.experiences.formData
  }));
  
  // Fetch experiences when component mounts
  React.useEffect(() => {
    if (isOwnProfile) {
      dispatch(fetchExperiences());
    }
  }, [dispatch, isOwnProfile]);
  
  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(setExperienceFormData({ [name]: value }));
  }, [dispatch]);
  
  // Handle date changes
  const handleDateChange = useCallback((name, date) => {
    dispatch(setExperienceFormData({ [name]: date }));
  }, [dispatch]);
  
  // Handle checkbox changes
  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    dispatch(setExperienceFormData({ [name]: checked }));
  }, [dispatch]);
  
  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing experience
      dispatch(updateExperience({ id: editingId, data: experienceFormData }))
        .unwrap()
        .then(() => {
          setIsEditing(false);
          setEditingId(null);
          dispatch(resetExperienceForm());
        });
    } else {
      // Add new experience
      dispatch(addExperience(experienceFormData))
        .unwrap()
        .then(() => {
          setIsEditing(false);
          dispatch(resetExperienceForm());
        });
    }
  }, [dispatch, editingId, experienceFormData]);
  
  // Handle edit button click
  const handleEdit = useCallback((experience) => {
    dispatch(setExperienceFormData({
      id: experience.id,
      title: experience.title,
      company: experience.company,
      location: experience.location,
      description: experience.description,
      startDate: experience.startDate,
      endDate: experience.endDate,
      isCurrent: experience.isCurrent,
      companyLogo: experience.companyLogo
    }));
    setEditingId(experience.id);
    setIsEditing(true);
  }, [dispatch]);
  
  // Handle delete button click
  const handleDelete = useCallback((experienceId) => {
    if (window.confirm('Bu deneyimi silmek istediğinize emin misiniz?')) {
      dispatch(deleteExperience(experienceId));
    }
  }, [dispatch]);
  
  // Handle cancel button click
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditingId(null);
    dispatch(resetExperienceForm());
  }, [dispatch]);
  
  // Handle add new experience button click
  const handleAddNew = useCallback(() => {
    setIsEditing(true);
    setEditingId(null);
    dispatch(resetExperienceForm());
  }, [dispatch]);
  
  return (
    <ExperienceSection 
      experiences={experiences}
      loading={loading}
      error={error}
      isOwnProfile={isOwnProfile}
      isEditing={isEditing}
      formData={experienceFormData}
      onInputChange={handleInputChange}
      onDateChange={handleDateChange}
      onCheckboxChange={handleCheckboxChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCancel={handleCancel}
      onAddNew={handleAddNew}
    />
  );
};

export default ExperienceSectionContainer;
