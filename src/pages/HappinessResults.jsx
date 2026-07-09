import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { scoreHappiness } from '../utils/categories';

function HappinessResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const { totalScore, maxScore, percentage } = scoreHappiness(answers);

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

  const getColor = () => {
    if (percentage >= 75) return "#34A853";
    if (percentage >= 50) return "#FF6B00";
    return "#E53935";
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

        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          padding: '40px 30px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          {/* Score Circle */}
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 30px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#e0e0e0" strokeWidth="12" />
              <circle
                cx="100" cy="100" r="85"
                fill="none"
                stroke={getColor()}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 534} 534`}
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '42px', fontWeight: 800, color: getColor(), fontFamily: 'Montserrat' }}>
                {percentage.toFixed(0)}%
              </div>
              <div style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>Well-being</div>
            </div>
          </div>

          {/* Score Details */}
          <h3 style={{ color: '#0B2A5B', marginBottom: '8px', fontFamily: 'Montserrat', fontSize: '22px' }}>
            {getLabel()}
          </h3>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
            Score: {totalScore} out of {maxScore}
          </p>

          {/* Score Bar */}
          <div style={{
            width: '100%',
            maxWidth: '400px',
            height: '12px',
            background: '#e0e0e0',
            borderRadius: '6px',
            margin: '0 auto 30px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${percentage}%`,
              height: '100%',
              background: getColor(),
              borderRadius: '6px',
              transition: 'width 1s ease'
            }} />
          </div>

          {/* Description */}
          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.8', textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
            {getHappinessText()}
          </p>

          {percentage < 50 && (
            <div style={{
              marginTop: '20px',
              padding: '15px 20px',
              background: '#FFF3E0',
              borderRadius: '12px',
              borderLeft: '4px solid #FF6B00',
              textAlign: 'left'
            }}>
              <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                <strong>Remember:</strong> This is not a clinical assessment. If you're feeling overwhelmed,
                please reach out to a counselor, mentor, or trusted adult. You don't have to face challenges alone.
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px', padding: '0 12px' }}>
          <button className="download-button" onClick={handleReturnHome}>
            Return to Home
          </button>
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
