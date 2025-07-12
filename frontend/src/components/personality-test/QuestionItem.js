import React from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper
} from '@mui/material';

/**
 * Component to render a single personality test question with a 5-point scale
 */
const QuestionItem = ({ question, value, onChange }) => {
  const handleChange = (e) => {
    onChange(question.id, parseInt(e.target.value));
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        {question.text}
      </Typography>
      
      {question.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {question.description}
        </Typography>
      )}
      
      <FormControl component="fieldset">
        <RadioGroup
          row
          name={`question-${question.id}`}
          value={value || ''}
          onChange={handleChange}
        >
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mt: 2 }}>
            <FormControlLabel value="1" control={<Radio />} label="1 — Hiç bilgim yok" />
            <FormControlLabel value="2" control={<Radio />} label="2 — Başlangıç" />
            <FormControlLabel value="3" control={<Radio />} label="3 — Orta" />
            <FormControlLabel value="4" control={<Radio />} label="4 — İyi" />
            <FormControlLabel value="5" control={<Radio />} label="5 — Uzman" />
          </Box>
        </RadioGroup>
      </FormControl>
    </Paper>
  );
};

export default QuestionItem;
