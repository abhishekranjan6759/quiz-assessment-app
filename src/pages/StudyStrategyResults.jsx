import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { generateStudyPlan } from '../data/questions';

function StudyStrategyResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const plan = generateStudyPlan(answers);
  const { strategy, revisionFrequency, practiceAdvice, encodingAdvice, timeAdvice, struggle, examDistance } = plan;

  const getUrgencyNote = () => {
    if (examDistance === "exam_urgent") return "⚡ Your exam is very close! Focus on high-yield topics, practice past papers, and revise your strongest material first.";
    if (examDistance === "exam_soon") return "⏰ Exam approaching! Prioritize active practice and revision over learning new topics.";
    return null;
  };

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">Your Study Plan</h1>
        <div className="results-divider"></div>

        {/* Subject Header */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '20px',
          padding: '30px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)', textAlign: 'center', marginBottom: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{strategy.emoji}</div>
          <h2 style={{ fontFamily: 'Montserrat', fontSize: '24px', color: '#0B2A5B', marginBottom: '8px' }}>
            {userName ? `${userName}'s` : 'Your'} Personalized Strategy for {strategy.title}
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Based on your answers, here's exactly how you should study</p>
        </div>

        {/* Urgency Note */}
        {getUrgencyNote() && (
          <div style={{
            maxWidth: '900px', width: '100%', background: '#FFF3E0', borderRadius: '12px',
            padding: '16px 20px', borderLeft: '4px solid #FF6B00', marginBottom: '20px'
          }}>
            <p style={{ color: '#333', fontSize: '15px', margin: 0, fontWeight: 500 }}>{getUrgencyNote()}</p>
          </div>
        )}

        {/* Step-by-Step Strategy */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px',
          padding: '28px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', marginBottom: '16px'
        }}>
          <h3 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '16px', fontSize: '18px' }}>
            📋 How to Study {strategy.title} — Step by Step
          </h3>
          <ol style={{ paddingLeft: '20px', margin: 0 }}>
            {strategy.steps.map((step, i) => (
              <li key={i} style={{ color: '#333', fontSize: '14px', lineHeight: '1.8', marginBottom: '10px' }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Revision Strategy */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px',
          padding: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', marginBottom: '16px',
          borderLeft: '4px solid #34A853'
        }}>
          <h4 style={{ color: '#34A853', fontFamily: 'Montserrat', marginBottom: '10px' }}>🔄 Your Revision Schedule</h4>
          <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.7', marginBottom: '12px' }}>{revisionFrequency}</p>
          <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
            Subject-specific: {strategy.revision}
          </p>
        </div>

        {/* Practice Strategy */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px',
          padding: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', marginBottom: '16px',
          borderLeft: '4px solid #1E5EFF'
        }}>
          <h4 style={{ color: '#1E5EFF', fontFamily: 'Montserrat', marginBottom: '10px' }}>✍️ How to Practice</h4>
          <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.7', marginBottom: '12px' }}>{practiceAdvice}</p>
          <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
            Subject-specific: {strategy.practice}
          </p>
        </div>

        {/* Visualization / Encoding */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px',
          padding: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', marginBottom: '16px',
          borderLeft: '4px solid #6A3DE8'
        }}>
          <h4 style={{ color: '#6A3DE8', fontFamily: 'Montserrat', marginBottom: '10px' }}>🧠 How to Remember (Encoding)</h4>
          <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.7', marginBottom: '12px' }}>{encodingAdvice}</p>
          <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
            Subject-specific: {strategy.visualization}
          </p>
        </div>

        {/* Time Allocation */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px',
          padding: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', marginBottom: '16px',
          borderLeft: '4px solid #FF6B00'
        }}>
          <h4 style={{ color: '#FF6B00', fontFamily: 'Montserrat', marginBottom: '10px' }}>⏰ Daily Time Allocation</h4>
          <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{timeAdvice}</p>
        </div>

        {/* Key Rules */}
        <div style={{
          maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px',
          padding: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', marginBottom: '24px',
          borderLeft: '4px solid #0B2A5B'
        }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '12px' }}>⚡ Golden Rules to Follow</h4>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>
              <strong>Active &gt; Passive:</strong> Testing yourself is 3x more effective than re-reading
            </li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>
              <strong>Spaced &gt; Crammed:</strong> 4 sessions of 30 min beat 1 session of 2 hours
            </li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>
              <strong>Struggle = Growth:</strong> If it feels hard, your brain is actually growing
            </li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>
              <strong>Sleep is study:</strong> Your brain consolidates learning while you sleep — never sacrifice it
            </li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>
              <strong>Teach to learn:</strong> If you can explain it simply, you truly understand it
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
            <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6' }}>Make sure you've saved your study plan before leaving.</p>
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

export default StudyStrategyResults;
