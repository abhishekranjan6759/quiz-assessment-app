import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { topperMindsetQuestions, topperMindsetDomains } from '../data/questions';

function TopperMindsetResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  const domainScores = {};
  const domainMaxes = {};

  topperMindsetQuestions.forEach((q, index) => {
    const domain = q.domain;
    if (!domainScores[domain]) { domainScores[domain] = 0; domainMaxes[domain] = 0; }
    domainScores[domain] += answers[index] || 0;
    domainMaxes[domain] += 5;
  });

  const totalScore = Object.values(domainScores).reduce((a, b) => a + b, 0);
  const totalMax = Object.values(domainMaxes).reduce((a, b) => a + b, 0);
  const percentage = (totalScore / totalMax) * 100;

  const getOverallLabel = () => {
    if (percentage >= 80) return "🏆 Topper Mindset";
    if (percentage >= 60) return "📈 Growth Mindset (Almost There)";
    if (percentage >= 40) return "😐 Average/Comfort Zone Mindset";
    return "⚠️ Fixed/Mediocre Mindset";
  };

  const getOverallColor = () => {
    if (percentage >= 80) return "#34A853";
    if (percentage >= 60) return "#1E5EFF";
    if (percentage >= 40) return "#FF6B00";
    return "#E53935";
  };

  const getOverallText = () => {
    if (percentage >= 80) return "You think like a topper. You believe in growth, own your results, embrace failure as feedback, and set audacious standards. Keep this mindset and combine it with smart strategy — results will follow inevitably.";
    if (percentage >= 60) return "You're close to a topper mindset but some limiting beliefs are still holding you back. Look at the domains marked orange/red below — fixing even ONE of those areas could dramatically shift your trajectory.";
    if (percentage >= 40) return "You're stuck in an average comfort zone. Not because you lack ability, but because your beliefs, standards, and responses keep you playing safe. The difference between you and a topper isn't talent — it's these exact mindset patterns. The good news: they're all changeable.";
    return "Your current mindset is keeping you trapped in mediocrity. You believe ability is fixed, avoid failure, rely on motivation, and blame circumstances. None of these are character flaws — they're LEARNED patterns that can be UNLEARNED. Start with one domain below and commit to changing it for 30 days.";
  };

  const getDomainLevel = (domain) => {
    const pct = (domainScores[domain] / domainMaxes[domain]) * 100;
    if (pct >= 75) return 'topper';
    if (pct >= 50) return 'average';
    return 'mediocre';
  };

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">Your Mindset</h1>
        <div className="results-divider"></div>

        {/* Overall */}
        <div style={{ maxWidth: '900px', width: '100%', background: 'white', borderRadius: '20px', padding: '40px 30px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: getOverallColor(), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 20px ${getOverallColor()}44` }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: 'white', fontFamily: 'Montserrat' }}>{percentage.toFixed(0)}%</span>
            </div>
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#e0e0e0" strokeWidth="10" />
                <circle cx="80" cy="80" r="68" fill="none" stroke={getOverallColor()} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(percentage / 100) * 427} 427`} transform="rotate(-90 80 80)" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: getOverallColor(), fontFamily: 'Montserrat' }}>Mindset</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Score</div>
              </div>
            </div>
          </div>
          <h3 style={{ color: getOverallColor(), fontFamily: 'Montserrat', fontSize: '20px', marginBottom: '12px' }}>{getOverallLabel()}</h3>
          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.8', textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>{getOverallText()}</p>
        </div>

        {/* Domain Cards */}
        <div style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {Object.entries(topperMindsetDomains).map(([domain, info]) => {
            const pct = (domainScores[domain] / domainMaxes[domain]) * 100;
            const level = getDomainLevel(domain);
            const levelLabel = level === 'topper' ? '🏆 Topper' : level === 'average' ? '😐 Average' : '⚠️ Mediocre';
            const levelBg = level === 'topper' ? '#E8F5E9' : level === 'average' ? '#FFF3E0' : '#FFEBEE';
            const levelColor = level === 'topper' ? '#34A853' : level === 'average' ? '#FF6B00' : '#E53935';
            return (
              <div key={domain} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderLeft: `4px solid ${info.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', margin: 0, fontSize: '16px' }}>{info.emoji} {domain}</h4>
                  <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: levelBg, color: levelColor }}>{levelLabel} — {pct.toFixed(0)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '12px' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: info.color, borderRadius: '4px' }} />
                </div>
                <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '0 0 10px' }}>{info[level]}</p>
                {level !== 'topper' && (
                  <div style={{ background: '#F5F5F5', borderRadius: '10px', padding: '12px 16px', borderLeft: '3px solid #34A853' }}>
                    <p style={{ color: '#333', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                      <strong>🔧 Fix:</strong> {info.fix}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Key Insight */}
        <div style={{ maxWidth: '900px', width: '100%', background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderLeft: '4px solid #0B2A5B', marginBottom: '24px' }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '12px' }}>💡 The Truth About Toppers</h4>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>Toppers are NOT born smarter — they <strong>think differently</strong> about effort, failure, and growth</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>The #1 predictor of academic success is <strong>belief in your ability to improve</strong>, not IQ</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>Average students wait for motivation. Toppers <strong>build systems</strong> that work even on bad days</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>Every domain above is a <strong>learnable skill</strong> — not a personality trait. You can change any of them in 30 days</li>
            <li style={{ color: '#333', fontSize: '14px', lineHeight: '2' }}>Pick your <strong>weakest domain</strong> (marked red/orange) and commit to improving JUST that one area for the next month</li>
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

export default TopperMindsetResults;
