import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { studyEffortQuestions, studyEffortDomains } from '../data/questions';

function StudyEffortResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  // Calculate domain scores
  const domainScores = {};
  const domainMaxes = {};

  studyEffortQuestions.forEach((q, index) => {
    const domain = q.domain;
    if (!domainScores[domain]) {
      domainScores[domain] = 0;
      domainMaxes[domain] = 0;
    }
    domainScores[domain] += answers[index] || 0;
    domainMaxes[domain] += 5;
  });

  const totalScore = Object.values(domainScores).reduce((a, b) => a + b, 0);
  const totalMax = Object.values(domainMaxes).reduce((a, b) => a + b, 0);
  const overallPercentage = (totalScore / totalMax) * 100;

  const getOverallLabel = () => {
    if (overallPercentage >= 80) return "Excellent — High Effort Student";
    if (overallPercentage >= 60) return "Good — Solid Effort with Room to Grow";
    if (overallPercentage >= 40) return "Average — Needs Improvement";
    return "Low — Significant Change Needed";
  };

  const getOverallColor = () => {
    if (overallPercentage >= 80) return "#34A853";
    if (overallPercentage >= 60) return "#1E5EFF";
    if (overallPercentage >= 40) return "#FF6B00";
    return "#E53935";
  };

  const getOverallText = () => {
    if (overallPercentage >= 80) {
      return "You're putting in serious effort with smart strategies. Your consistency, active techniques, and exam preparation are at a high level. Keep optimizing — you're on the path to mastery.";
    }
    if (overallPercentage >= 60) {
      return "You have good habits forming but there are clear gaps. Look at your weakest domain below — even small improvements there will significantly boost your results. You're closer to excellence than you think.";
    }
    if (overallPercentage >= 40) {
      return "Your effort level is average. You likely know you could do better. The gap between where you are and where you want to be is closable — but it requires changing specific habits, not just 'trying harder'. Focus on the domains marked red/orange below.";
    }
    return "Your current study effort is significantly below what's needed for strong results. This isn't about intelligence — it's about habits and systems. Start with ONE change: set a specific 1-hour study block at the same time every day. Build from there.";
  };

  const getDomainLevel = (domain) => {
    const pct = (domainScores[domain] / domainMaxes[domain]) * 100;
    if (pct >= 75) return 'high';
    if (pct >= 50) return 'moderate';
    return 'low';
  };

  const getGrade = () => {
    if (overallPercentage >= 85) return "A";
    if (overallPercentage >= 75) return "B+";
    if (overallPercentage >= 65) return "B";
    if (overallPercentage >= 55) return "C+";
    if (overallPercentage >= 45) return "C";
    if (overallPercentage >= 35) return "D";
    return "E";
  };

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">Your Study Effort</h1>
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
          {/* Grade + Circle */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {/* Grade Badge */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: getOverallColor(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${getOverallColor()}44`
            }}>
              <span style={{ fontSize: '42px', fontWeight: 800, color: 'white', fontFamily: 'Montserrat' }}>
                {getGrade()}
              </span>
            </div>
            {/* Score Circle */}
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#e0e0e0" strokeWidth="10" />
                <circle
                  cx="80" cy="80" r="68"
                  fill="none"
                  stroke={getOverallColor()}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallPercentage / 100) * 427} 427`}
                  transform="rotate(-90 80 80)"
                />
              </svg>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', textAlign: 'center'
              }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: getOverallColor(), fontFamily: 'Montserrat' }}>
                  {totalScore}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>out of {totalMax}</div>
              </div>
            </div>
          </div>

          <h3 style={{ color: getOverallColor(), fontFamily: 'Montserrat', fontSize: '18px', marginBottom: '12px' }}>
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
          {Object.entries(studyEffortDomains).map(([domain, info]) => {
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
                    background: level === 'high' ? '#E8F5E9' : level === 'moderate' ? '#FFF3E0' : '#FFEBEE',
                    color: level === 'high' ? '#34A853' : level === 'moderate' ? '#FF6B00' : '#E53935',
                  }}>
                    {pct.toFixed(0)}% — {level === 'high' ? 'Strong' : level === 'moderate' ? 'Moderate' : 'Weak'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '12px' }}>
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

        {/* Action Steps */}
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
            🚀 Your Next Steps
          </h4>
          <ul style={{ color: '#333', fontSize: '14px', lineHeight: '2', paddingLeft: '20px', margin: 0 }}>
            {overallPercentage < 40 && <li><strong>Start here:</strong> Commit to just 1 focused hour of study at the same time every day for 7 days</li>}
            {overallPercentage < 60 && <li>Replace re-reading with <strong>active recall</strong> — close the book and try to write what you remember</li>}
            {domainScores["Revision & Retention"] && (domainScores["Revision & Retention"] / domainMaxes["Revision & Retention"]) < 0.5 && 
              <li>Start the <strong>24-hour rule</strong>: revise every topic within 24 hours of first learning it</li>}
            {domainScores["Exam Performance"] && (domainScores["Exam Performance"] / domainMaxes["Exam Performance"]) < 0.5 && 
              <li>Practice <strong>one full mock test per week</strong> under real exam conditions (timed, no breaks)</li>}
            {domainScores["Techniques & Methods"] && (domainScores["Techniques & Methods"] / domainMaxes["Techniques & Methods"]) < 0.5 && 
              <li>Learn the <strong>Feynman Technique</strong>: explain the concept in simple words as if teaching a child</li>}
            <li>Track your daily study hours for one week — awareness alone improves effort by 20%</li>
            <li>Find an accountability partner — shared goals increase follow-through by 65%</li>
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

export default StudyEffortResults;
