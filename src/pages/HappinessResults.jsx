import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ResultChart from '../components/ResultChart';
import Celebration from '../components/Celebration';
import { scoreHappiness } from '../utils/categories';

function HappinessResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const { totalScore, maxScore, percentage } = scoreHappiness(answers);

  let highHappiness = 0;
  let moderateHappiness = 0;
  let lowHappiness = 0;

  if (percentage >= 75) {
    highHappiness = 100;
  } else if (percentage >= 50) {
    moderateHappiness = 100;
  } else {
    lowHappiness = 100;
  }

  const data = [
    { name: 'High Well-being', value: highHappiness, percentage: highHappiness },
    { name: 'Moderate Well-being', value: moderateHappiness, percentage: moderateHappiness },
    { name: 'Needs Attention', value: lowHappiness, percentage: lowHappiness },
  ].filter(item => item.percentage > 0);

  const getHappinessText = () => {
    if (percentage >= 75) {
      return "Great news! You have a high level of happiness and well-being. You feel energetic, optimistic, and in control of your life. This positive mental state is excellent for learning — you're in a great position to absorb new knowledge and take on challenges. Keep doing what makes you feel good!";
    } else if (percentage >= 50) {
      return "You have a moderate level of happiness and well-being. While you're doing reasonably well overall, there may be areas where stress or dissatisfaction is creeping in. Consider incorporating more activities that bring you joy, practicing mindfulness, or connecting with friends. A balanced emotional state supports better learning outcomes.";
    } else {
      return "Your results suggest you may be experiencing stress or low well-being. This is important to address because stress significantly impacts your ability to learn, concentrate, and retain information. Consider talking to someone you trust, practicing self-care, getting regular exercise, and ensuring adequate sleep. Remember: taking care of your mental health is not a luxury — it's essential for effective learning.";
    }
  };

  const getLabel = () => {
    if (percentage >= 75) return "High Well-being";
    if (percentage >= 50) return "Moderate Well-being";
    return "Needs Attention";
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
        <h1 className="results-title">Your Results</h1>
        <div className="results-divider"></div>
        <ResultChart
          data={data}
          userName={userName}
          quizType="happiness"
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
          <h3 style={{ color: '#0B2A5B', marginBottom: '15px' }}>
            Your Well-being Score: {totalScore} out of {maxScore} ({percentage.toFixed(1)}%) — {getLabel()}
          </h3>
          <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.8' }}>
            {getHappinessText()}
          </p>
          {percentage < 50 && (
            <div style={{
              marginTop: '20px',
              padding: '15px 20px',
              background: '#FFF3E0',
              borderRadius: '12px',
              borderLeft: '4px solid #FF6B00'
            }}>
              <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                <strong>Remember:</strong> This is not a clinical assessment. If you're feeling overwhelmed,
                please reach out to a counselor, mentor, or trusted adult. You don't have to face challenges alone.
              </p>
            </div>
          )}
        </div>

        <Dialog
          open={openDialog}
          onClose={handleCancelReturn}
          aria-labelledby="alert-dialog-title"
          PaperProps={{ style: { borderRadius: '20px', padding: '10px' } }}
        >
          <DialogTitle id="alert-dialog-title" style={{ color: '#0B2A5B', fontWeight: 600 }}>
            Return to Home Page?
          </DialogTitle>
          <DialogContent>
            <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6' }}>
              Are you sure you want to go to the main page?
              <br /><br />
              <strong>Warning:</strong> If you leave this page, you will not be able to re-download your results.
            </p>
          </DialogContent>
          <DialogActions style={{ padding: '20px' }}>
            <Button onClick={handleCancelReturn} variant="outlined"
              style={{ borderColor: '#0B2A5B', color: '#0B2A5B', borderRadius: '20px', padding: '8px 24px', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReturn} variant="contained" autoFocus
              style={{ backgroundColor: '#0B2A5B', borderRadius: '20px', padding: '8px 24px', fontWeight: 600 }}>
              Yes, Return Home
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default HappinessResults;
