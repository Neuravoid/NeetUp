import React, { useState } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  Box, 
  Typography, 
  Chip, 
  Button, 
  TextField, 
  useTheme, 
  IconButton,
  Divider,
  Paper,
  Autocomplete,
  LinearProgress,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Check as CheckIcon, 
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Sample skills data - in a real app, this would come from an API
const allSkills = [
  'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust',
  'HTML', 'CSS', 'SASS', 'LESS', 'Tailwind CSS', 'Material-UI', 'Bootstrap', 'Styled Components',
  'Redux', 'MobX', 'GraphQL', 'Apollo', 'REST API', 'Express', 'NestJS', 'Django', 'Flask',
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQL Server', 'SQLite', 'Firebase', 'AWS', 'Docker', 'Kubernetes',
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jest', 'Cypress', 'React Testing Library', 'Mocha', 'Chai',
  'Webpack', 'Babel', 'ESLint', 'Prettier', 'TypeScript', 'Next.js', 'Gatsby', 'React Native', 'Flutter',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Agile', 'Scrum', 'Kanban', 'Jira', 'Trello', 'Asana'
].sort();

const SkillItem = ({ skill, level, onEdit, onDelete, isEditing }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 1.5,
        p: 1,
        borderRadius: 1,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <Box sx={{ width: '100%', mr: 1 }}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" fontWeight="medium">
            {skill}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {level}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={level} 
          sx={{ 
            height: 6, 
            borderRadius: 3,
            backgroundColor: theme.palette.grey[200],
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.main,
            }
          }} 
        />
      </Box>
      
      {isEditing && (
        <Box ml={1} display="flex">
          <IconButton size="small" onClick={() => onEdit({ skill, level })}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

const SkillsSection = ({ skills = [], isOwnProfile = false, error = null, loading = false }) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState(50);
  const [localSkills, setLocalSkills] = useState(skills);
  
  const handleAddClick = () => {
    setEditingSkill(null);
    setSkillInput('');
    setSkillLevel(50);
    setIsEditing(true);
  };
  
  const handleEditClick = (skill) => {
    setEditingSkill(skill);
    setSkillInput(skill.skill);
    setSkillLevel(skill.level);
    setIsEditing(true);
  };
  
  const handleSaveSkill = () => {
    if (!skillInput.trim()) return;
    
    const newSkill = {
      skill: skillInput,
      level: Math.min(100, Math.max(0, skillLevel)) // Ensure level is between 0-100
    };
    
    if (editingSkill) {
      // Update existing skill
      setLocalSkills(prev => 
        prev.map(s => s.skill === editingSkill.skill ? newSkill : s)
      );
    } else {
      // Add new skill if it doesn't exist
      const exists = localSkills.some(s => 
        s.skill.toLowerCase() === skillInput.toLowerCase()
      );
      
      if (!exists) {
        setLocalSkills(prev => [...prev, newSkill]);
      }
    }
    
    setIsEditing(false);
  };
  
  const handleDeleteSkill = (skillToDelete) => {
    setLocalSkills(prev => 
      prev.filter(s => s.skill !== skillToDelete.skill)
    );
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingSkill(null);
  };
  
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(error)}
        </Alert>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Yetkinlikler
        </Typography>
        {isOwnProfile && !isEditing && (
          <Button 
            size="small" 
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{ ml: 'auto' }}
          >
            Yetkinlik Ekle
          </Button>
        )}
      </Box>
      
      {isEditing ? (
        <Paper elevation={0} sx={{ p: 2, mb: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <Autocomplete
            freeSolo
            options={allSkills}
            value={skillInput}
            onChange={(event, newValue) => setSkillInput(newValue || '')}
            inputValue={skillInput}
            onInputChange={(event, newInputValue) => setSkillInput(newInputValue)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Yetenek Adı" 
                variant="outlined" 
                size="small" 
                fullWidth 
                sx={{ mb: 2 }}
              />
            )}
          />
          
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Seviye: {skillLevel}%
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="caption" color="text.secondary">
                0%
              </Typography>
              <Box flex={1}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(parseInt(e.target.value, 10))}
                  style={{
                    width: '100%',
                    height: 6,
                    borderRadius: 3,
                    background: `linear-gradient(to right, ${theme.palette.primary.main} ${skillLevel}%, ${theme.palette.grey[300]} ${skillLevel}%)`,
                    WebkitAppearance: 'none',
                    outline: 'none',
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                100%
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleCancelEdit}
              startIcon={<CloseIcon />}
            >
              Vazgeç
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              color="primary"
              onClick={handleSaveSkill}
              startIcon={<CheckIcon />}
              disabled={!skillInput.trim()}
            >
              {editingSkill ? 'Güncelle' : 'Ekle'}
            </Button>
          </Box>
        </Paper>
      ) : null}
      
      {localSkills.length > 0 ? (
        <Box>
          {localSkills.map((skill, index) => (
            <SkillItem
              key={`${skill.skill}-${index}`}
              skill={skill.skill}
              level={skill.level}
              onEdit={() => handleEditClick(skill)}
              onDelete={() => handleDeleteSkill(skill)}
              isEditing={isOwnProfile}
            />
          ))}
        </Box>
      ) : (
        <Box 
          textAlign="center" 
          py={2}
          sx={{ 
            backgroundColor: theme.palette.background.default, 
            borderRadius: 1,
            mb: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {isOwnProfile 
              ? 'Henüz yetenek eklemediniz. Yeteneklerinizi ekleyerek profilinizi zenginleştirin.' 
              : 'Bu kullanıcı henüz yetenek eklememiş.'}
          </Typography>
          {isOwnProfile && !isEditing && (
            <Button 
              size="small" 
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ mt: 1 }}
            >
              Yetenek Ekle
            </Button>
          )}
        </Box>
      )}
      
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default SkillsSection;
