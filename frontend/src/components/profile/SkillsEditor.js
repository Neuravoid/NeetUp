import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  Box,
  Typography,
  Chip,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Rating,
  Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import profileService from '../../api/profile';

// Sample skills for autocomplete
const SAMPLE_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'CSS',
  'HTML', 'TypeScript', 'SQL', 'MongoDB', 'Redux', 'GraphQL',
  'Docker', 'AWS', 'Git', 'Express.js', 'Java', 'C#', 'PHP',
  'Angular', 'Vue.js', 'Ruby', 'Swift', 'Kotlin', 'Flutter',
  'Data Analysis', 'Machine Learning', 'UI/UX Design', 'Figma',
  'Adobe XD', 'Project Management', 'Agile', 'Scrum', 'Marketing',
  'SEO', 'Content Writing', 'Communication', 'Leadership', 'Problem Solving'
];

const SkillsEditor = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(3);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch user skills on component mount
  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const data = await profileService.getUserSkills();
        setSkills(data);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
        setError('Beceriler yüklenirken bir hata oluştu.');
        
        // Use sample skills for development if API fails
        setSkills([
          { id: '1', name: 'JavaScript', level: 4 },
          { id: '2', name: 'React', level: 4 },
          { id: '3', name: 'CSS', level: 3 },
          { id: '4', name: 'Node.js', level: 3 },
          { id: '5', name: 'Python', level: 2 }
        ]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserSkills();
  }, []);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    // Check if skill already exists
    const skillExists = skills.some(
      skill => skill.name.toLowerCase() === newSkill.toLowerCase()
    );
    
    if (skillExists) {
      setError('Bu beceri zaten eklenmiş.');
      return;
    }
    
    // Add new skill to the list
    const updatedSkills = [
      ...skills,
      {
        id: Date.now().toString(), // Temporary ID for UI
        name: newSkill,
        level: newSkillLevel
      }
    ];
    
    setSkills(updatedSkills);
    setNewSkill('');
    setNewSkillLevel(3);
    setError('');
  };

  const handleRemoveSkill = (skillId) => {
    const updatedSkills = skills.filter(skill => skill.id !== skillId);
    setSkills(updatedSkills);
  };

  const handleSkillLevelChange = (skillId, newLevel) => {
    const updatedSkills = skills.map(skill =>
      skill.id === skillId ? { ...skill, level: newLevel } : skill
    );
    setSkills(updatedSkills);
  };

  const handleSaveSkills = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await profileService.updateUserSkills(skills);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Beceriler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Becerileriniz
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(error)}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Becerileriniz başarıyla güncellendi.
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            freeSolo
            options={SAMPLE_SKILLS}
            value={newSkill}
            onChange={(event, newValue) => {
              setNewSkill(newValue || '');
            }}
            inputValue={newSkill}
            onInputChange={(event, newInputValue) => {
              setNewSkill(newInputValue);
            }}
            sx={{ flexGrow: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Yeni Beceri Ekle"
                variant="outlined"
                size="small"
                fullWidth
              />
            )}
          />
          <Box>
            <Typography component="legend" variant="body2">Seviye</Typography>
            <Rating
              name="new-skill-level"
              value={newSkillLevel}
              onChange={(event, newValue) => {
                setNewSkillLevel(newValue);
              }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSkill}
            disabled={!newSkill.trim() || loading}
          >
            Ekle
          </Button>
        </Stack>
      </Box>
      
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Mevcut Beceriler
      </Typography>
      
      {skills.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
          Henüz beceri eklenmedi.
        </Typography>
      ) : (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {skills.map((skill) => (
              <Paper 
                key={skill.id} 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1 
                }}
              >
                <Chip
                  label={skill.name}
                  onDelete={() => handleRemoveSkill(skill.id)}
                  disabled={loading}
                />
                <Rating
                  name={`skill-level-${skill.id}`}
                  value={skill.level}
                  size="small"
                  onChange={(event, newValue) => {
                    handleSkillLevelChange(skill.id, newValue);
                  }}
                  disabled={loading}
                />
              </Paper>
            ))}
          </Box>
        </Box>
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveSkills}
        disabled={loading || skills.length === 0}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Değişiklikleri Kaydet'}
      </Button>
    </Paper>
  );
};

export default SkillsEditor;
