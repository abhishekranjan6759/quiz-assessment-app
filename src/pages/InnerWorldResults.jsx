import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { innerWorldQuestions, innerWorldDomains } from '../data/questions';

function InnerWorldResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const scoreMapping = {
    'Not at all': 1,
    'Rarely': 2,
    'Sometimes': 3,
    'Often': 4,
    'Almost Always': 5,
  };

  // Calculate domain scores
  const domainScores = {};
  const domainMaxes = {};

  innerWorldQuestions.forEach((q, index) => {
    const domain = q.domain;
    if (!domainScores[domain]) {
      domainScores[domain] = 0;
      domainMaxes[domain] = 0;
    }
    domainScores[domain] += scoreMapping[answers[index]] || 0;
    domainMaxes[domain] += 5;
  });

  // Overall
  const totalScore = Object.values(domainScores).reduce((a, b) => a + b, 0);
  const totalMax = Object.values(domainMaxes).reduce((a, b) => a + b, 0);
  const overallPercentage = (totalScore / totalMax) * 100;

  const getOverallLabel = () => {
    if (overallPercentage <= 30) return "Light — Your Mind is Clear";
    if (overallPercentage <= 55) return "Moderate — Some Weight on Your Mind";
    return "Heavy — You're Carrying a Lot";
  };

  const getOverallColor = () => {
    if (overallPercentage <= 30) return "#34A853";
    if (overallPercentage <= 55) return "#FF6B00";
    return "#E53935";
  };

  const getOverallText = () => {
    if (overallPercentage <= 30) {
      return "Your inner world feels relatively light right now. You have mental space available for learning, growth, and new experiences. Keep nurturing the habits that keep you balanced.";
    }
    if (overallPercentage <= 55) {
      return "You're carrying some mental and emotional weight. This is common and human — but it's important to acknowledge it. When our mind is occupied with unresolved thoughts, learning becomes harder. Consider talking to someone or taking small steps to address what's weighing on you.";
    }
    return "Your inner world is carrying significant weight right now. Family issues, relationship concerns, self-doubt, or academic pressure are taking up a lot of your mental energy. This doesn't mean you're weak — it means you need support. Please talk to a trusted teacher, counselor, or friend. You don't have to carry this alone.";
  };

  const getDomainLevel = (domain) => {
    const pct = (domainScores[domain] / domainMaxes[domain]) * 100;
    if (pct <= 30) return 'low';
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
        <h1 className="results-title">Your Inner World</h1>
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
          {/* Circle */}
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
              <div style={{ fontSize: '11px', color: '#666' }}>Mental Load</div>
            </div>
          </div>

          <h3 style={{ color: getOverallColor(), fontFamily: 'Montserrat', fontSize: '20px', marginBottom: '12px' }}>
            {getOverallLabel()}
          </h3>
          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.8', textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
            {getOverallText()}
          </p>
        </div>

        {/* Domain Breakdown */}
        <div style={{
          maxWidth: '900px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {Object.entries(innerWorldDomains).map(([domain, info]) => {
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
                    {info.emoji} {domain}
                  </h4>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: level === 'low' ? '#E8F5E9' : level === 'moderate' ? '#FFF3E0' : '#FFEBEE',
                    color: level === 'low' ? '#34A853' : level === 'moderate' ? '#FF6B00' : '#E53935',
                  }}>
                    {level === 'low' ? 'Low Concern' : level === 'moderate' ? 'Moderate' : 'High Concern'}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '10px' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: info.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {info[level]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        {overallPercentage > 55 && (
          <div style={{
            maxWidth: '900px',
            width: '100%',
            background: '#FFF8E1',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #FFC107',
            marginBottom: '24px'
          }}>
            <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '8px' }}>
              💛 A Gentle Reminder
            </h4>
            <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
              Carrying emotional weight is not a sign of weakness — it's a sign of being human.
              What matters is that you don't carry it alone. Talk to a teacher, counselor, friend,
              or family member you trust. Sometimes just saying it out loud makes it lighter.
              <br /><br />
              <strong>Your mental peace matters more than any grade.</strong>
            </p>
          </div>
        )}

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

export default InnerWorldResults;
