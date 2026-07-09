import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ResultChart from '../components/ResultChart';
import Celebration from '../components/Celebration';
import { eqQuestions } from '../data/questions';

function EQResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  // Score by domain
  const domains = {
    'Self-Awareness': { score: 0, max: 0 },
    'Self-Regulation': { score: 0, max: 0 },
    'Empathy': { score: 0, max: 0 },
    'Social Skills': { score: 0, max: 0 },
  };

  eqQuestions.forEach((q, index) => {
    const selectedScore = q.scores[answers[index]] || 0;
    domains[q.domain].score += selectedScore;
    domains[q.domain].max += 4; // max score per question is 4
  });

  const totalScore = Object.values(domains).reduce((a, d) => a + d.score, 0);
  const maxScore = Object.values(domains).reduce((a, d) => a + d.max, 0);
  const percentage = (totalScore / maxScore) * 100;

  const data = Object.entries(domains).map(([name, { score, max }]) => ({
    name,
    value: score,
    percentage: (score / max) * 100,
  }));

  const getEQLabel = () => {
    if (percentage >= 85) return "Exceptional EQ";
    if (percentage >= 70) return "High EQ";
    if (percentage >= 55) return "Moderate EQ";
    if (percentage >= 40) return "Developing EQ";
    return "Low EQ";
  };

  const getEQText = () => {
    if (percentage >= 85) return "Outstanding! You demonstrate exceptional emotional intelligence. You're highly self-aware, regulate your emotions effectively, show deep empathy, and navigate social situations with skill. These abilities make you an excellent communicator, leader, and collaborator.";
    if (percentage >= 70) return "Very good! You have high emotional intelligence. You understand your emotions well, manage them effectively most of the time, and show genuine empathy towards others. Continue developing these strengths.";
    if (percentage >= 55) return "You have moderate emotional intelligence with clear strengths in some areas. Look at your domain breakdown below to identify areas for growth. Practicing mindfulness, active listening, and self-reflection can help strengthen weaker areas.";
    if (percentage >= 40) return "Your emotional intelligence is still developing. Focus on building self-awareness first — start noticing your emotions without judging them. Then work on understanding others' perspectives. These skills can be significantly improved with practice.";
    return "Your results suggest significant room for growth in emotional intelligence. Consider starting with self-awareness exercises, journaling about your emotions, and practicing active listening. EQ is a skill that can be developed at any age.";
  };

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">EQ Results</h1>
        <div className="results-divider"></div>

        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          padding: '40px 30px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          {/* EQ Score Circle */}
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 24px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#e0e0e0" strokeWidth="12" />
              <circle
                cx="100" cy="100" r="85"
                fill="none"
                stroke={percentage >= 70 ? '#34A853' : percentage >= 50 ? '#1E5EFF' : '#FF6B00'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 534} 534`}
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', textAlign: 'center'
            }}>
              <div style={{ fontSize: '38px', fontWeight: 800, color: '#0B2A5B', fontFamily: 'Montserrat' }}>
                {percentage.toFixed(0)}%
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>EQ Score</div>
            </div>
          </div>

          <div style={{
            display: 'inline-block',
            padding: '6px 20px',
            borderRadius: '20px',
            background: percentage >= 70 ? '#34A853' : percentage >= 50 ? '#1E5EFF' : '#FF6B00',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
            fontFamily: 'Montserrat',
            marginBottom: '16px'
          }}>
            {getEQLabel()}
          </div>

          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.8', textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
            {getEQText()}
          </p>
          <p style={{ color: '#999', fontSize: '12px', marginTop: '16px', fontStyle: 'italic' }}>
            Score: {totalScore}/{maxScore} points • Based on Daniel Goleman's Emotional Intelligence framework
          </p>
        </div>

        <ResultChart
          data={data}
          userName={userName}
          quizType="eq"
          onReturnHome={handleReturnHome}
        />

        {/* Domain breakdown */}
        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          padding: '24px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          marginTop: '20px'
        }}>
          <h4 style={{ color: '#0B2A5B', marginBottom: '16px', fontFamily: 'Montserrat' }}>Domain Breakdown</h4>
          {data.map((item) => (
            <div key={item.name} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.name}</span>
                <span style={{ fontSize: '14px', color: '#666' }}>{item.percentage.toFixed(0)}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
                <div style={{
                  width: `${item.percentage}%`,
                  height: '100%',
                  background: item.percentage >= 75 ? '#34A853' : item.percentage >= 50 ? '#1E5EFF' : '#FF6B00',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          ))}
        </div>

        <Dialog open={openDialog} onClose={handleCancelReturn}
          PaperProps={{ style: { borderRadius: '20px', padding: '10px' } }}>
          <DialogTitle style={{ color: '#0B2A5B', fontWeight: 600 }}>Return to Home Page?</DialogTitle>
          <DialogContent>
            <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6' }}>
              Make sure you have downloaded your results before leaving.
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

export default EQResults;
