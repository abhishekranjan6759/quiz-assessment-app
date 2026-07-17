import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { focusQuestions, focusLevels } from '../data/questions';

function FocusResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const scoreMapping = { 'Not at all': 1, 'A little': 2, 'Moderately': 3, 'Quite a bit': 4, 'Completely': 5 };

  let totalScore = 0;
  focusQuestions.forEach((q, index) => {
    let score = scoreMapping[answers[index]] || 0;
    if (q.reverse) score = 6 - score;
    totalScore += score;
  });

  const maxScore = focusQuestions.length * 5;
  const percentage = (totalScore / maxScore) * 100;

  const getLevel = () => {
    if (percentage >= 70) return 'high';
    if (percentage >= 45) return 'moderate';
    return 'low';
  };

  const level = getLevel();
  const result = focusLevels[level];

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">Your Focus Level</h1>
        <div className="results-divider"></div>

        {/* Score Card */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '20px',
          padding: '40px 30px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', textAlign: 'center', marginBottom: '24px'
        }}>
          {/* Circle */}
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 20px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="75" fill="none" stroke="#e0e0e0" strokeWidth="12" />
              <circle cx="90" cy="90" r="75" fill="none" stroke={result.color} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 471} 471`} transform="rotate(-90 90 90)" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: result.color, fontFamily: 'Montserrat' }}>{percentage.toFixed(0)}%</div>
              <div style={{ fontSize: '11px', color: '#666' }}>Focus Level</div>
            </div>
          </div>

          <div style={{ fontSize: '40px', marginBottom: '8px' }}>{result.emoji}</div>
          <h3 style={{ color: result.color, fontFamily: 'Montserrat', fontSize: '22px', marginBottom: '12px' }}>{result.label}</h3>
          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.8', textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
            {result.description}
          </p>
        </div>

        {/* Actionable Tip */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px',
          padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', marginBottom: '24px',
          borderLeft: `4px solid ${result.color}`
        }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '10px' }}>💡 What to do right now</h4>
          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>{result.tip}</p>
        </div>

        {/* Focus Improvement Techniques */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px',
          padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '24px',
          borderLeft: '4px solid #6A3DE8'
        }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '12px' }}>🧘 Quick Focus Reset Techniques</h4>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>Box Breathing:</strong> Inhale 4 sec → Hold 4 sec → Exhale 4 sec → Hold 4 sec. Repeat 4 times.</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>5-4-3-2-1 Grounding:</strong> Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>Brain Dump:</strong> Write everything on your mind for 2 minutes. Get it out of your head onto paper.</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>Single Point Focus:</strong> Stare at one spot for 60 seconds without looking away. Notice thoughts, let them pass.</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>Cold Stimulus:</strong> Splash cold water on your face or hold ice for 15 seconds — instantly sharpens attention.</li>
          </ul>
        </div>

        {/* Thought Occupation Insight */}
        {percentage < 60 && (
          <div style={{
            maxWidth: '900px', width: '100%', background: '#FFF8E1', borderRadius: '16px',
            padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '24px',
            borderLeft: '4px solid #FFC107'
          }}>
            <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '10px' }}>🧠 Your Mind is Occupied</h4>
            <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              Your results show your mind is currently carrying a lot of background thoughts — worries, plans, unfinished tasks, or emotions. 
              This is completely normal and human. However, <strong>learning with an occupied mind is like pouring water into a cup that's already full</strong>. 
              Before starting a study session, take 3-5 minutes to clear mental space using the techniques above. 
              Even writing "I'll deal with this later at [specific time]" for each worry can free up surprising amounts of attention.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 12px' }}>
          <button className="download-button" onClick={handleReturnHome}>Return to Home</button>
        </div>

        <Dialog open={openDialog} onClose={handleCancelReturn} PaperProps={{ style: { borderRadius: '20px', padding: '10px' } }}>
          <DialogTitle style={{ color: '#0B2A5B', fontWeight: 600 }}>Return to Home Page?</DialogTitle>
          <DialogContent><p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6' }}>Are you sure you want to leave?</p></DialogContent>
          <DialogActions style={{ padding: '20px' }}>
            <Button onClick={handleCancelReturn} variant="outlined" style={{ borderColor: '#0B2A5B', color: '#0B2A5B', borderRadius: '20px', padding: '8px 24px', fontWeight: 600 }}>Cancel</Button>
            <Button onClick={handleConfirmReturn} variant="contained" autoFocus style={{ backgroundColor: '#0B2A5B', borderRadius: '20px', padding: '8px 24px', fontWeight: 600 }}>Yes, Return Home</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default FocusResults;
