import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ResultChart from '../components/ResultChart';
import { categorizeVARK } from '../utils/categories';

function VARKResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  // Categorize answers
  const categories = { Visual: 0, Auditory: 0, 'Reading/Writing': 0, Kinesthetic: 0 };

  answers.forEach((answer) => {
    const category = categorizeVARK(answer);
    if (category) {
      categories[category]++;
    }
  });

  const totalAnswers = answers.length;
  const data = [
    { 
      name: 'Visual', 
      value: categories.Visual, 
      percentage: (categories.Visual / totalAnswers) * 100 
    },
    { 
      name: 'Auditory', 
      value: categories.Auditory, 
      percentage: (categories.Auditory / totalAnswers) * 100 
    },
    { 
      name: 'Reading/Writing', 
      value: categories['Reading/Writing'], 
      percentage: (categories['Reading/Writing'] / totalAnswers) * 100 
    },
    { 
      name: 'Kinesthetic', 
      value: categories.Kinesthetic, 
      percentage: (categories.Kinesthetic / totalAnswers) * 100 
    },
  ];

  const handleReturnHome = () => {
    setOpenDialog(true);
  };

  const handleConfirmReturn = () => {
    setOpenDialog(false);
    navigate('/');
  };

  const handleCancelReturn = () => {
    setOpenDialog(false);
  };

  return (
    <div className="app-container">
      <div className="results-container">
        <h1 className="results-title">Congratulations</h1>
        <div className="results-divider"></div>
        <ResultChart 
          data={data} 
          userName={userName} 
          quizType="vark" 
          onReturnHome={handleReturnHome}
        />

        {/* Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCancelReturn}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              borderRadius: '20px',
              padding: '10px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title" style={{ color: '#1565C0', fontWeight: 600 }}>
            Return to Home Page?
          </DialogTitle>
          <DialogContent>
            <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6' }}>
              Are you sure you want to go to the main page? 
              <br/><br/>
              <strong>Warning:</strong> If you leave this page, you will not be able to re-download your results.
              Please make sure you have downloaded your results before leaving.
            </p>
          </DialogContent>
          <DialogActions style={{ padding: '20px' }}>
            <Button 
              onClick={handleCancelReturn} 
              variant="outlined"
              style={{ 
                borderColor: '#1565C0', 
                color: '#1565C0',
                borderRadius: '20px',
                padding: '8px 24px',
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmReturn} 
              variant="contained"
              autoFocus
              style={{ 
                backgroundColor: '#1565C0',
                borderRadius: '20px',
                padding: '8px 24px',
                fontWeight: 600
              }}
            >
              Yes, Return Home
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default VARKResults;