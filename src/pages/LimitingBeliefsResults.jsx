import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { limitingBeliefsQuestions, limitingBeliefsDomains } from '../data/questions';

function LimitingBeliefsResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const scoreMapping = {
    'Strongly Disagree': 1,
    'Disagree': 2,
    'Neutral': 3,
    'Agree': 4,
    'Strongly Agree': 5,
  };

  // Calculate domain scores
  const domainScores = {};
  const domainMaxes = {};

  limitingBeliefsQuestions.forEach((q, index) => {
    const domain = q.domain;
    if (!domainScores[domain]) {
      domainScores[domain] = 0;
      domainMaxes[domain] = 0;
    }
    domainScores[domain] += scoreMapping[answers[index]] || 0;
    domainMaxes[domain] += 5;
  });

  const totalScore = Object.values(domainScores).reduce((a, b) => a + b, 0);
  const totalMax = Object.values(domainMaxes).reduce((a, b) => a + b, 0);
  const overallPercentage = (totalScore / totalMax) * 100;

  const getOverallLabel = () => {
    if (overallPercentage <= 30) return "Free Thinker — Few Limiting Beliefs";
    if (overallPercentage <= 50) return "Moderate — Some Beliefs Holding You Back";
    if (overallPercentage <= 70) return "Significant — Many Self-Limiting Patterns";
    return "Critical — Deeply Rooted Limiting Beliefs";
  };

  const getOverallColor = () => {
    if (overallPercentage <= 30) return "#34A853";
    if (overallPercentage <= 50) return "#1E5EFF";
    if (overallPercentage <= 70) return "#FF6B00";
    return "#E53935";
  };

  const getOverallText = () => {
    if (overallPercentage <= 30) {
      return "Your mind is relatively free from self-limiting beliefs. You approach challenges with confidence and see setbacks as learning opportunities. Keep nurturing this growth mindset.";
    }
    if (overallPercentage <= 50) {
      return "You carry some self-limiting beliefs that occasionally hold you back. The good news? Awareness is the first step to change. Now that you can see these patterns, you can start challenging them one by one.";
    }
    if (overallPercentage <= 70) {
      return "Self-limiting beliefs are significantly impacting your potential. These beliefs feel real, but they are NOT facts — they are stories your mind has learned to repeat. Every single one of them can be unlearned with awareness, practice, and support.";
    }
    return "You are carrying deeply rooted limiting beliefs that are heavily restricting your potential. These beliefs were likely formed early in life through experiences, comments, or comparisons. They feel like truth, but they are not. With consistent work — journaling, affirmations, mentoring, or therapy — these beliefs CAN be transformed.";
  };

  const getDomainLevel = (domain) => {
    const pct = (domainScores[domain] / domainMaxes[domain]) * 100;
    if (pct <= 35) return 'low';
    if (pct <= 60) return 'moderate';
    return 'high';
  };

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">Your Beliefs Map</h1>
        <div className="results-divider"></div>

        {/* Overall Score */}
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
          {/* Score Circle */}
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 24px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="75" fill="none" stroke="#e0e0e0" strokeWidth="12" />
              <circle
                cx="90" cy="90" r="75"
                fill="none"
                stroke={getOverallColor()}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(overallPercentage / 100) * 471} 471`}
                transform="rotate(-90 90 90)"
              />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: getOverallColor(), fontFamily: 'Montserrat' }}>
                {overallPercentage.toFixed(0)}%
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>Limiting Beliefs</div>
            </div>
          </div>

          <h3 style={{ color: getOverallColor(), fontFamily: 'Montserrat', fontSize: '20px', marginBottom: '12px' }}>
            {getOverallLabel()}
          </h3>
          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.8', textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
            {getOverallText()}
          </p>
        </div>

        {/* Domain Cards */}
        <div style={{
          maxWidth: '900px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {Object.entries(limitingBeliefsDomains).map(([domain, info]) => {
            const pct = (domainScores[domain] / domainMaxes[domain]) * 100;
            const level = getDomainLevel(domain);
            return (
              <div key={domain} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                borderLeft: `4px solid ${info.color}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', margin: 0, fontSize: '16px' }}>
                    {info.emoji} {info.label}
                  </h4>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: level === 'low' ? '#E8F5E9' : level === 'moderate' ? '#FFF3E0' : '#FFEBEE',
                    color: level === 'low' ? '#34A853' : level === 'moderate' ? '#FF6B00' : '#E53935',
                  }}>
                    {level === 'low' ? 'Low' : level === 'moderate' ? 'Moderate' : 'High'}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '12px' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: info.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '0 0 10px' }}>
                  {info[level]}
                </p>
                {/* Reframe suggestion for moderate/high */}
                {level !== 'low' && (
                  <div style={{
                    background: '#F5F5F5',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    borderLeft: '3px solid #34A853'
                  }}>
                    <p style={{ color: '#333', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                      <strong>🔄 Reframe:</strong> {info.reframe}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Growth Message */}
        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderLeft: '4px solid #34A853',
          marginBottom: '24px'
        }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '10px' }}>
            🌱 The Truth About Limiting Beliefs
          </h4>
          <ul style={{ color: '#333', fontSize: '14px', lineHeight: '2', paddingLeft: '20px', margin: 0 }}>
            <li>They are <strong>learned</strong> — which means they can be <strong>unlearned</strong></li>
            <li>They feel like facts, but they are just <strong>repeated thoughts</strong></li>
            <li>Every expert was once a beginner who could have quit but didn't</li>
            <li>Your brain physically changes when you practice new thinking patterns</li>
            <li>One new belief, practiced daily, can transform your entire life</li>
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

export default LimitingBeliefsResults;
