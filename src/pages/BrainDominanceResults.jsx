import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ResultChart from '../components/ResultChart';
import Celebration from '../components/Celebration';
import { categorizeBrainDominance } from '../utils/categories';

function BrainDominanceResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const { leftBrain, rightBrain } = categorizeBrainDominance(answers);
  const totalAnswers = answers.length;

  const leftPercentage = (leftBrain / totalAnswers) * 100;
  const rightPercentage = (rightBrain / totalAnswers) * 100;

  const data = [
    {
      name: 'Left Brain',
      value: leftBrain,
      percentage: leftPercentage,
    },
    {
      name: 'Right Brain',
      value: rightBrain,
      percentage: rightPercentage,
    },
  ];

  const getDominanceText = () => {
    if (leftPercentage > 60) {
      return "You are Left Brain Dominant! You tend to be logical, analytical, and detail-oriented. You excel at tasks involving language, mathematics, and sequential thinking. You prefer structure, planning, and working with facts and data.";
    } else if (rightPercentage > 60) {
      return "You are Right Brain Dominant! You tend to be creative, intuitive, and big-picture oriented. You excel at tasks involving art, music, spatial awareness, and imagination. You prefer flexibility, spontaneity, and visual or hands-on learning.";
    } else {
      return "You have a Balanced Brain! You use both hemispheres fairly equally, giving you a blend of analytical and creative abilities. You can adapt your thinking style to different situations, combining logic with intuition effectively.";
    }
  };

  const getDominanceLabel = () => {
    if (leftPercentage > 60) return "Left Brain Dominant";
    if (rightPercentage > 60) return "Right Brain Dominant";
    return "Balanced Brain";
  };

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
        <Celebration />
        <h1 className="results-title">Congratulations</h1>
        <div className="results-divider"></div>
        <ResultChart
          data={data}
          userName={userName}
          quizType="brain-dominance"
          onReturnHome={handleReturnHome}
        />
        <div style={{
          maxWidth: '900px',
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          marginTop: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ color: '#1565C0', marginBottom: '15px' }}>
            Your Result: {getDominanceLabel()}
          </h3>
          <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
            {getDominanceText()}
          </p>
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#4FC3F7' }}>
                {leftPercentage.toFixed(0)}%
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Left Brain</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#66BB6A' }}>
                {rightPercentage.toFixed(0)}%
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Right Brain</div>
            </div>
          </div>
        </div>

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
              <br /><br />
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

export default BrainDominanceResults;
