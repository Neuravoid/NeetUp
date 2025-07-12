import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const ApplicationDialog = ({ 
  open, 
  onClose, 
  onApply, 
  opportunity,
  loading = false,
  error = null
}) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [step, setStep] = useState(1); // 1: Form, 2: Success

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(coverLetter);
  };

  const handleClose = () => {
    setCoverLetter('');
    setStep(1);
    onClose();
  };

  if (step === 2) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Application Submitted</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon 
              color="success" 
              sx={{ fontSize: 60, mb: 2 }} 
            />
            <Typography variant="h6" gutterBottom>
              Application Submitted Successfully!
            </Typography>
            <Typography color="text.secondary" paragraph>
              Your application for {opportunity.title} at {opportunity.company} has been submitted.
            </Typography>
            <Typography color="text.secondary">
              The company will review your application and contact you if you're selected for the next steps.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose} 
            variant="contained" 
            fullWidth
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      component="form"
      onSubmit={handleSubmit}
    >
      <DialogTitle>Apply for {opportunity.title}</DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {getErrorMessage(error)}
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Application Details</Typography>
          <Box sx={{ 
            bgcolor: 'grey.50', 
            p: 2, 
            borderRadius: 1,
            mb: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              You're applying to: <strong>{opportunity.title}</strong> at <strong>{opportunity.company}</strong>
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Cover Letter</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Introduce yourself and explain why you'd be a good fit for this position.
          </Typography>
          <TextField
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            placeholder="Write your cover letter here..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          />
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Your profile will be shared with {opportunity.company}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            By submitting this application, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading || !coverLetter.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationDialog;
