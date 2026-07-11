import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { fomoLevels } from '../data/questions';

function FOMOResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const scoreMapping = {
    'Not at all true of me': 1,
    'Slightly true': 2,
    'Moderately true': 3,
    'Very true': 4,
    'Extremely true of me': 5,
  };

  const totalScore = answers.reduce((sum, a) => sum + (scoreMapping[a] || 0), 0);
  const maxScore = answers.length * 5;
  const percentage = (totalScore / maxScore) * 100;

  const getLevel = () => {
    if (percentage <= 40) return 'low';
    if (percentage <= 65) return 'moderate';
    return 'high';
  };

  const level = getLevel();
  const result = fomoLevels[level];

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">FOMO Results</h1>
        <div className="results-divider"></div>

        {/* Score Card */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '20px',
          padding: '40px 30px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)', textAlign: 'center', marginBottom: '24px'
        }}>
          {/* Circle */}
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 24px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="75" fill="none" stroke="#e0e0e0" strokeWidth="12" />
              <circle
                cx="90" cy="90" r="75"
                fill="none"
                stroke={result.color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 471} 471`}
                transform="rotate(-90 90 90)"
              />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: result.color, fontFamily: 'Montserrat' }}>
                {percentage.toFixed(0)}%
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>FOMO Level</div>
            </div>
          </div>

          <div style={{ fontSize: '40px', marginBottom: '8px' }}>{result.emoji}</div>
          <h3 style={{ color: result.color, fontFamily: 'Montserrat', fontSize: '22px', marginBottom: '12px' }}>
            {result.label}
          </h3>
          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.8', textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
            {result.description}
          </p>
          <p style={{ color: '#999', fontSize: '12px', marginTop: '16px', fontStyle: 'italic' }}>
            Score: {totalScore}/{maxScore} • Based on the FoMO Scale framework (Przybylski et al., 2013)
          </p>
        </div>

        {/* Action Steps */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px',
          padding: '28px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', marginBottom: '24px',
          borderLeft: `4px solid ${result.color}`
        }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '16px', fontSize: '18px' }}>
            🛠️ Steps to Take
          </h4>
          <ol style={{ paddingLeft: '20px', margin: 0 }}>
            {result.steps.map((step, i) => (
              <li key={i} style={{ color: '#333', fontSize: '14px', lineHeight: '1.8', marginBottom: '10px' }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Perspective Shift */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px',
          padding: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', marginBottom: '24px',
          borderLeft: '4px solid #6A3DE8'
        }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '12px' }}>
            💡 Perspective Shift
          </h4>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>
              Social media shows <strong>2% of someone's life</strong> — the curated, filtered highlight reel
            </li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>
              While you watch others' lives, <strong>your own life is happening</strong> — and you're missing IT
            </li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>
              The most successful people practice <strong>JOMO</strong> (Joy of Missing Out) — they protect their time and focus
            </li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>
              Every "yes" to something unimportant is a <strong>"no" to something that matters</strong> to you
            </li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>
              <strong>Comparison is the thief of joy.</strong> Your only competition is yesterday's version of yourself
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 12px' }}>
          <button className="download-button" onClick={handleReturnHome}>
            Return to Home
          </button>
        </div>

        <Dialog open={openDialog} onClose={handleCancelReturn}
          PaperProps={{ style: { borderRadius: '20px', padding: '10px' } }}>
          <DialogTitle style={{ color: '#0B2A5B', fontWeight: 600 }}>Return to Home Page?</DialogTitle>
          <DialogContent>
            <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6' }}>Are you sure you want to leave?</p>
          </DialogContent>
          <DialogActions style={{ padding: '20px' }}>
            <Button onClick={handleCancelReturn} variant="outlined"
              style={{ borderColor: '#0B2A5B', color: '#0B2A5B', borderRadius: '20px', padding: '8px 24px', fontWeight: 600 }}>Cancel</Button>
            <Button onClick={handleConfirmReturn} variant="contained" autoFocus
              style={{ backgroundColor: '#0B2A5B', borderRadius: '20px', padding: '8px 24px', fontWeight: 600 }}>Yes, Return Home</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default FOMOResults;
