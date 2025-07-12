import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/profileSlice';
import AboutSection from './AboutSection';

const AboutSectionContainer = ({ isOwnProfile = false }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get profile data from Redux store
  const { 
    about, 
    loading, 
    error 
  } = useSelector((state) => ({
    about: state.profile.profile?.about || '',
    loading: state.profile.loading,
    error: state.profile.error
  }));
  
  // Handle save button click
  const handleSave = useCallback((newAbout) => {
    dispatch(updateProfile({ about: newAbout }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
      });
  }, [dispatch]);
  
  // Handle cancel button click
  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);
  
  // Handle edit button click
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);
  
  return (
    <AboutSection 
      about={about}
      isEditing={isEditing}
      loading={loading}
      error={error}
      isOwnProfile={isOwnProfile}
      onSave={handleSave}
      onCancel={handleCancel}
      onEdit={handleEdit}
    />
  );
};

export default AboutSectionContainer;
