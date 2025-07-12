import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import QuestionItem from './QuestionItem';

/**
 * Component to render a section of questions for a specific coalition type
 */
const QuestionSection = ({ questions, sectionTitle, answers, onAnswerChange }) => {
  if (!questions || questions.length === 0) {
    return (
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body1">Bu bölümde henüz soru yok.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {sectionTitle && (
        <>
          <Typography variant="h5" gutterBottom>
            {sectionTitle}
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </>
      )}
      
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          value={answers[question.id]}
          onChange={onAnswerChange}
        />
      ))}
    </Box>
  );
};

export default QuestionSection;
