import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ResultChart from '../components/ResultChart';
import Celebration from '../components/Celebration';
import { categorizeMotivation } from '../utils/categories';

function MotivationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const { intrinsic, extrinsic } = categorizeMotivation(answers);
  const totalAnswers = answers.length;

  const intrinsicPercent = (intrinsic / totalAnswers) * 100;
  const extrinsicPercent = (extrinsic / totalAnswers) * 100;

  const data = [
    {
      name: 'Intrinsic Motivation',
      value: intrinsic,
      percentage: intrinsicPercent,
    },
    {
      name: 'Extrinsic Motivation',
      value: extrinsic,
      percentage: extrinsicPercent,
    },
  ];

  const getMotivationText = () => {
    if (intrinsicPercent > 65) {
      return "You are primarily Intrinsically Motivated! You are driven by internal satisfaction, curiosity, and the joy of learning itself. You find fulfillment in personal growth, mastery, and doing things because they genuinely interest you. This is a powerful trait — intrinsic motivation leads to deeper learning, greater creativity, and long-term persistence.";
    } else if (extrinsicPercent > 65) {
      return "You are primarily Extrinsically Motivated! You are driven by external rewards such as grades, recognition, career advancement, and social approval. While this can be very effective for achieving tangible goals, consider nurturing your inner curiosity as well. Finding personal meaning in what you do can make the journey more enjoyable and sustainable.";
    } else {
      return "You have a Balanced Motivation style! You are driven by both internal satisfaction and external rewards. This balance means you can enjoy the process of learning while also being motivated by tangible outcomes. This adaptability serves you well in different situations.";
    }
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
          quizType="motivation"
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
            Your Result: {intrinsicPercent > 65 ? 'Intrinsically Motivated' : extrinsicPercent > 65 ? 'Extrinsically Motivated' : 'Balanced Motivation'}
          </h3>
          <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
            {getMotivationText()}
          </p>
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#1E5EFF' }}>
                {intrinsicPercent.toFixed(0)}%
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Intrinsic</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#34A853' }}>
                {extrinsicPercent.toFixed(0)}%
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Extrinsic</div>
            </div>
          </div>
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

export default MotivationResults;
