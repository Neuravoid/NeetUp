import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  setSkillFormData,
  resetSkillForm
} from '../../store/slices/profileSlice';
import SkillsSection from './SkillsSection';

const SkillsSectionContainer = ({ isOwnProfile = false }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Get skills and form data from Redux store
  const { 
    skills,
    loading,
    error,
    formData: skillFormData
  } = useSelector((state) => ({
    skills: state.profile.skills.data,
    loading: state.profile.skills.loading,
    error: state.profile.skills.error,
    formData: state.profile.skills.formData
  }));
  
  // Fetch skills when component mounts
  React.useEffect(() => {
    if (isOwnProfile) {
      dispatch(fetchSkills());
    }
  }, [dispatch, isOwnProfile]);
  
  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(setSkillFormData({ [name]: value }));
  }, [dispatch]);
  
  // Handle skill level change
  const handleSkillLevelChange = useCallback((event, newValue) => {
    dispatch(setSkillFormData({ level: newValue }));
  }, [dispatch]);
  
  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing skill
      dispatch(updateSkill({ id: editingId, data: skillFormData }))
        .unwrap()
        .then(() => {
          setIsEditing(false);
          setEditingId(null);
          dispatch(resetSkillForm());
        });
    } else {
      // Add new skill
      dispatch(addSkill(skillFormData))
        .unwrap()
        .then(() => {
          setIsEditing(false);
          dispatch(resetSkillForm());
        });
    }
  }, [dispatch, editingId, skillFormData]);
  
  // Handle edit button click
  const handleEdit = useCallback((skill) => {
    dispatch(setSkillFormData({
      id: skill.id,
      name: skill.name,
      level: skill.level,
      category: skill.category,
      isFeatured: skill.isFeatured
    }));
    setEditingId(skill.id);
    setIsEditing(true);
  }, [dispatch]);
  
  // Handle delete button click
  const handleDelete = useCallback((skillId) => {
    if (window.confirm('Bu yetkinliği silmek istediğinize emin misiniz?')) {
      dispatch(deleteSkill(skillId));
    }
  }, [dispatch]);
  
  // Handle reordering skills
  const handleReorder = useCallback(({ oldIndex, newIndex }) => {
    dispatch(reorderSkills({ oldIndex, newIndex }));
  }, [dispatch]);
  
  // Handle cancel button click
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditingId(null);
    dispatch(resetSkillForm());
  }, [dispatch]);
  
  // Handle add new skill button click
  const handleAddNew = useCallback(() => {
    setIsEditing(true);
    setEditingId(null);
    dispatch(resetSkillForm());
  }, [dispatch]);
  
  return (
    <SkillsSection 
      skills={skills}
      loading={loading}
      error={error}
      isOwnProfile={isOwnProfile}
      isEditing={isEditing}
      formData={skillFormData}
      onInputChange={handleInputChange}
      onSkillLevelChange={handleSkillLevelChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onReorder={handleReorder}
      onCancel={handleCancel}
      onAddNew={handleAddNew}
    />
  );
};

export default SkillsSectionContainer;
