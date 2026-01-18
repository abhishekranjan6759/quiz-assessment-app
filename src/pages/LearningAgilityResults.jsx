import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ResultChart from '../components/ResultChart';

function LearningAgilityResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const scoreMapping = {
    'Rarely or never': 1,
    'Occasionally': 2,
    'Sometimes': 3,
    'Often': 4,
    'Always': 5,
  };

  const totalScore = answers.reduce(
    (total, answer) => total + scoreMapping[answer],
    0
  );
  const maxScore = answers.length * 5;
  const percentage = (totalScore / maxScore) * 100;

  let highAgility = 0;
  let moderateAgility = 0;
  let lowAgility = 0;

  if (percentage >= 80) {
    highAgility = 100;
  } else if (percentage >= 60) {
    moderateAgility = 100;
  } else {
    lowAgility = 100;
  }

  const data = [
    {
      name: 'High Learning Agility',
      value: highAgility,
      percentage: highAgility,
    },
    {
      name: 'Moderate Learning Agility',
      value: moderateAgility,
      percentage: moderateAgility,
    },
    {
      name: 'Low Learning Agility',
      value: lowAgility,
      percentage: lowAgility,
    },
    {
      name: 'Not Applicable',
      value: 0,
      percentage: 0,
    },
  ].filter(item => item.percentage > 0);

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
          quizType="learning-agility" 
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
            Your Score: {totalScore} out of {maxScore} ({percentage.toFixed(1)}%)
          </h3>
          <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.8' }}>
            {percentage >= 80 &&
              "Individuals with high learning agility demonstrate a strong willingness to embrace new ideas and take risks. They consistently seek out opportunities to stretch their abilities and engage in self-reflection."}
            {percentage >= 60 && percentage < 80 &&
              "Individuals with moderate learning agility demonstrate a willingness to consider new ideas and take some level of risk. They may occasionally embrace unfamiliar situations and experiment with new approaches."}
            {percentage < 60 &&
              "Individuals with low learning agility may be more resistant to change and less likely to seek out new experiences or engage in self-reflection. They may need more encouragement and support to embrace change and seek growth opportunities."}
          </p>
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

export default LearningAgilityResults;