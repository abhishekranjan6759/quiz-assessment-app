import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { moodProfiles } from '../data/questions';

function MoodCheckResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  // Count votes per mood
  const moodCounts = {};
  answers.forEach((mood) => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  // Sort by count
  const sorted = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const topMood = sorted[0][0];
  const profile = moodProfiles[topMood];

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">Your Current State</h1>
        <div className="results-divider"></div>

        {/* Main Result */}
        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          borderRadius: '20px',
          padding: '40px 30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{profile.emoji}</div>
          <h2 style={{
            fontFamily: 'Montserrat',
            fontSize: '28px',
            fontWeight: 800,
            color: profile.color,
            marginBottom: '8px'
          }}>
            {userName ? `${userName}, you are ` : 'You are '}{profile.label}
          </h2>
          <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.8', marginTop: '16px', textAlign: 'left', maxWidth: '700px', margin: '16px auto 0' }}>
            {profile.description}
          </p>
        </div>

        {/* Mood Breakdown */}
        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          marginBottom: '24px'
        }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '16px' }}>Your Mood Breakdown</h4>
          {sorted.map(([mood, count]) => {
            const pct = (count / answers.length) * 100;
            const p = moodProfiles[mood];
            return (
              <div key={mood} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{p.emoji} {p.label}</span>
                  <span style={{ fontSize: '14px', color: '#666' }}>{pct.toFixed(0)}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: '#e0e0e0', borderRadius: '5px' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: p.color,
                    borderRadius: '5px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Facilitator Recommendation */}
        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          marginBottom: '24px',
          borderLeft: `4px solid ${profile.color}`
        }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '8px' }}>
            💡 What this means for your learning environment
          </h4>
          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
            {profile.forFacilitator}
          </p>
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
            <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6' }}>
              Are you sure you want to leave?
            </p>
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

export default MoodCheckResults;
