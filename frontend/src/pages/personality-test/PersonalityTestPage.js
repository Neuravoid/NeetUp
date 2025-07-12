import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  Box, 
  Container, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchQuestions, 
  setActiveSection, 
  setAnswer, 
  submitAnswers,
  loadMockQuestions
} from '../../store/slices/personalityTestSlice';
import QuestionSection from '../../components/personality-test/QuestionSection';

const PersonalityTestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    activeSection, 
    questions, 
    coalitionTypes, 
    answers, 
    loading, 
    error,
    testCompleted
  } = useSelector(state => state.personalityTest);
  
  // Completed sections tracking
  const [completedSections, setCompletedSections] = useState([]);
  
  // Check if current section is complete (all questions answered)
  const isCurrentSectionComplete = () => {
    const currentSectionQuestions = questions.filter(q => q.section === activeSection);
    return currentSectionQuestions.every(q => answers[q.id] !== undefined);
  };
  
  // Load questions on component mount
  useEffect(() => {
    dispatch(fetchQuestions())
      .unwrap()
      .catch(() => {
        // If API fails, load mock questions for development
        dispatch(loadMockQuestions());
      });
  }, [dispatch]);
  
  // Track completed sections
  useEffect(() => {
    if (isCurrentSectionComplete() && !completedSections.includes(activeSection)) {
      setCompletedSections([...completedSections, activeSection]);
    }
  }, [answers, activeSection, completedSections]);
  
  // Handle section navigation
  const handleNext = () => {
    if (activeSection < coalitionTypes.length - 1) {
      dispatch(setActiveSection(activeSection + 1));
    }
  };
  
  const handleBack = () => {
    if (activeSection > 0) {
      dispatch(setActiveSection(activeSection - 1));
    }
  };
  
  // Handle answer change
  const handleAnswerChange = (questionId, value) => {
    dispatch(setAnswer({ questionId, value }));
  };
  
  // Handle test submission
  const handleSubmit = () => {
    dispatch(submitAnswers(answers))
      .unwrap()
      .then(() => {
        // Navigate to results page on successful submission
        navigate('/personality-test/results');
      })
      .catch(err => {
        console.error('Test submission failed:', err);
      });
  };
  
  // Get current section questions
  const currentSectionQuestions = questions.filter(q => q.section === activeSection);
  
  // Check if we can proceed to next section
  const canProceed = isCurrentSectionComplete();
  
  // Check if all sections are complete
  const allSectionsComplete = completedSections.length === coalitionTypes.length;
  
  if (testCompleted) {
    navigate('/personality-test/results');
    return null;
  }
  
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Kişilik Değerlendirmesi
        </Typography>
        
        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          Bu test, 10 koalisyon tipine göre kişilik ve yetkinlik profilinizi belirlemeye yardımcı olacaktır.
          Her bölümde, ilgili koalisyon tipine ait soruları 1'den 5'e kadar derecelendirin.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {getErrorMessage(error)}
          </Alert>
        )}
        
        <Stepper 
          activeStep={activeSection} 
          alternativeLabel
          sx={{ mb: 4, overflowX: 'auto' }}
        >
          {coalitionTypes.map((label, index) => (
            <Step key={label} completed={completedSections.includes(index)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Bölüm {activeSection + 1}: {coalitionTypes[activeSection]}
            </Typography>
            
            <QuestionSection
              questions={currentSectionQuestions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeSection === 0 || loading}
              >
                Geri
              </Button>
              
              {activeSection < coalitionTypes.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!canProceed || loading}
                >
                  İleri
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={!allSectionsComplete || loading}
                >
                  Testi Tamamla
                </Button>
              )}
            </Box>
            
            {!canProceed && (
              <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
                Lütfen bu bölümdeki tüm soruları yanıtlayın.
              </Typography>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default PersonalityTestPage;
