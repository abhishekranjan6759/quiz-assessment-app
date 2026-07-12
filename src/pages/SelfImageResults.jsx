import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { selfImageQuestions, selfImageDomains } from '../data/questions';

function SelfImageResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const scoreMapping = { 'Strongly Disagree': 1, 'Disagree': 2, 'Neutral': 3, 'Agree': 4, 'Strongly Agree': 5 };

  const domainScores = {};
  const domainMaxes = {};

  selfImageQuestions.forEach((q, index) => {
    const domain = q.domain;
    if (!domainScores[domain]) { domainScores[domain] = 0; domainMaxes[domain] = 0; }
    let score = scoreMapping[answers[index]] || 0;
    if (q.reverse) score = 6 - score; // reverse score
    domainScores[domain] += score;
    domainMaxes[domain] += 5;
  });

  const totalScore = Object.values(domainScores).reduce((a, b) => a + b, 0);
  const totalMax = Object.values(domainMaxes).reduce((a, b) => a + b, 0);
  const percentage = (totalScore / totalMax) * 100;

  const getOverallLabel = () => {
    if (percentage >= 75) return "Strong & Positive Self-Image";
    if (percentage >= 55) return "Moderate Self-Image";
    if (percentage >= 35) return "Fragile Self-Image";
    return "Very Low Self-Image";
  };

  const getOverallColor = () => {
    if (percentage >= 75) return "#34A853";
    if (percentage >= 55) return "#1E5EFF";
    if (percentage >= 35) return "#FF6B00";
    return "#E53935";
  };

  const getOverallText = () => {
    if (percentage >= 75) return "You see yourself in a positive, balanced way. You recognize your worth, feel comfortable in your skin, and trust your abilities. This healthy self-image is a strong foundation for learning, relationships, and personal growth.";
    if (percentage >= 55) return "You have a moderately positive self-image with some areas of doubt. Some days you feel confident, other days you question yourself. This is common — and the good news is that self-image can be actively strengthened with awareness and daily practices.";
    if (percentage >= 35) return "Your self-image is fragile and you often see yourself negatively. You may struggle with self-doubt, appearance concerns, or feeling inadequate. Remember: the way you see yourself is a lens, not reality. That lens can be gradually adjusted.";
    return "You are carrying a deeply negative self-image that's likely affecting your mood, relationships, and ability to learn. This is not your fault — negative self-image is often built by past experiences, criticism, or comparison. But it CAN be rebuilt. Please consider talking to a counselor.";
  };

  const getDomainLevel = (domain) => {
    const pct = (domainScores[domain] / domainMaxes[domain]) * 100;
    if (pct >= 70) return 'high';
    if (pct >= 45) return 'moderate';
    return 'low';
  };

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">Your Self-Image</h1>
        <div className="results-divider"></div>

        {/* Overall Score */}
        <div style={{ maxWidth: '900px', width: '100%', background: 'white', borderRadius: '20px', padding: '40px 30px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 24px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="75" fill="none" stroke="#e0e0e0" strokeWidth="12" />
              <circle cx="90" cy="90" r="75" fill="none" stroke={getOverallColor()} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(percentage / 100) * 471} 471`} transform="rotate(-90 90 90)" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: getOverallColor(), fontFamily: 'Montserrat' }}>{percentage.toFixed(0)}%</div>
              <div style={{ fontSize: '11px', color: '#666' }}>Self-Image</div>
            </div>
          </div>
          <h3 style={{ color: getOverallColor(), fontFamily: 'Montserrat', fontSize: '20px', marginBottom: '12px' }}>{getOverallLabel()}</h3>
          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.8', textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>{getOverallText()}</p>
        </div>

        {/* Domain Cards */}
        <div style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {Object.entries(selfImageDomains).map(([domain, info]) => {
            const pct = (domainScores[domain] / domainMaxes[domain]) * 100;
            const level = getDomainLevel(domain);
            return (
              <div key={domain} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderLeft: `4px solid ${info.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', margin: 0, fontSize: '16px' }}>{info.emoji} {domain}</h4>
                  <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: level === 'high' ? '#E8F5E9' : level === 'moderate' ? '#E3F2FD' : '#FFEBEE', color: level === 'high' ? '#34A853' : level === 'moderate' ? '#1E5EFF' : '#E53935' }}>
                    {pct.toFixed(0)}% — {level === 'high' ? 'Healthy' : level === 'moderate' ? 'Mixed' : 'Needs Care'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '12px' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: info.color, borderRadius: '4px' }} />
                </div>
                <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{info[level]}</p>
              </div>
            );
          })}
        </div>

        {/* Rebuild Tips */}
        <div style={{ maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderLeft: '4px solid #6A3DE8', marginBottom: '24px' }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '12px' }}>🌱 Building a Healthier Self-Image</h4>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>Daily affirmation:</strong> Write one genuine thing you like about yourself each morning</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>Evidence journal:</strong> Log small wins and compliments — your brain forgets positives faster than negatives</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>Limit comparison:</strong> Reduce social media consumption that triggers self-comparison</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>Self-talk audit:</strong> Notice how you talk to yourself — would you say those things to a friend?</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>Body gratitude:</strong> Thank your body daily for 3 things it does (breathes, walks, heals)</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}><strong>Seek feedback:</strong> Ask 3 people you trust what they admire about you — you'll be surprised</li>
          </ul>
        </div>

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

export default SelfImageResults;
