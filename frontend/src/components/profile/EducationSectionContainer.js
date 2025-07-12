import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  setEducationFormData,
  resetEducationForm
} from '../../store/slices/profileSlice';
import EducationSection from './EducationSection';

const EducationSectionContainer = ({ isOwnProfile = false }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Get education and form data from Redux store
  const { 
    education,
    loading,
    error,
    formData: educationFormData
  } = useSelector((state) => ({
    education: state.profile.education.data,
    loading: state.profile.education.loading,
    error: state.profile.education.error,
    formData: state.profile.education.formData
  }));
  
  // Fetch education when component mounts
  React.useEffect(() => {
    if (isOwnProfile) {
      dispatch(fetchEducation());
    }
  }, [dispatch, isOwnProfile]);
  
  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(setEducationFormData({ [name]: value }));
  }, [dispatch]);
  
  // Handle date changes
  const handleDateChange = useCallback((name, date) => {
    dispatch(setEducationFormData({ [name]: date }));
  }, [dispatch]);
  
  // Handle checkbox changes
  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    dispatch(setEducationFormData({ [name]: checked }));
  }, [dispatch]);
  
  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing education
      dispatch(updateEducation({ id: editingId, data: educationFormData }))
        .unwrap()
        .then(() => {
          setIsEditing(false);
          setEditingId(null);
          dispatch(resetEducationForm());
        });
    } else {
      // Add new education
      dispatch(addEducation(educationFormData))
        .unwrap()
        .then(() => {
          setIsEditing(false);
          dispatch(resetEducationForm());
        });
    }
  }, [dispatch, editingId, educationFormData]);
  
  // Handle edit button click
  const handleEdit = useCallback((edu) => {
    dispatch(setEducationFormData({
      id: edu.id,
      school: edu.school,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      isCurrent: edu.isCurrent,
      description: edu.description,
      activities: edu.activities,
      grade: edu.grade
    }));
    setEditingId(edu.id);
    setIsEditing(true);
  }, [dispatch]);
  
  // Handle delete button click
  const handleDelete = useCallback((educationId) => {
    if (window.confirm('Bu eğitim bilgisini silmek istediğinize emin misiniz?')) {
      dispatch(deleteEducation(educationId));
    }
  }, [dispatch]);
  
  // Handle cancel button click
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditingId(null);
    dispatch(resetEducationForm());
  }, [dispatch]);
  
  // Handle add new education button click
  const handleAddNew = useCallback(() => {
    setIsEditing(true);
    setEditingId(null);
    dispatch(resetEducationForm());
  }, [dispatch]);
  
  return (
    <EducationSection 
      education={education}
      loading={loading}
      error={error}
      isOwnProfile={isOwnProfile}
      isEditing={isEditing}
      formData={educationFormData}
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

export default EducationSectionContainer;
