import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ResultChart from '../components/ResultChart';
import Celebration from '../components/Celebration';
import { iqQuestions } from '../data/questions';

function IQResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  // Score by category
  const categories = { numerical: 0, logical: 0, pattern: 0, verbal: 0 };
  const categoryTotals = { numerical: 0, logical: 0, pattern: 0, verbal: 0 };

  iqQuestions.forEach((q, index) => {
    categoryTotals[q.category]++;
    if (answers[index] === q.correctIndex) {
      categories[q.category]++;
    }
  });

  const totalCorrect = Object.values(categories).reduce((a, b) => a + b, 0);
  const totalQuestions = iqQuestions.length;
  const percentage = (totalCorrect / totalQuestions) * 100;

  // Estimate IQ score (simplified bell curve mapping)
  // 0% = ~70, 50% = ~100, 100% = ~140
  const estimatedIQ = Math.round(70 + (percentage / 100) * 70);

  const data = [
    { name: 'Numerical', value: categories.numerical, percentage: (categories.numerical / categoryTotals.numerical) * 100 },
    { name: 'Logical', value: categories.logical, percentage: (categories.logical / categoryTotals.logical) * 100 },
    { name: 'Pattern', value: categories.pattern, percentage: (categories.pattern / categoryTotals.pattern) * 100 },
    { name: 'Verbal', value: categories.verbal, percentage: (categories.verbal / categoryTotals.verbal) * 100 },
  ];

  const getIQLabel = () => {
    if (estimatedIQ >= 130) return "Superior";
    if (estimatedIQ >= 120) return "Above Average";
    if (estimatedIQ >= 110) return "High Average";
    if (estimatedIQ >= 90) return "Average";
    if (estimatedIQ >= 80) return "Below Average";
    return "Needs Development";
  };

  const getIQText = () => {
    if (estimatedIQ >= 130) return "Excellent! You demonstrated superior cognitive abilities across logical reasoning, pattern recognition, and problem-solving. You think quickly and accurately.";
    if (estimatedIQ >= 120) return "Very good! You show above-average cognitive abilities. Your logical thinking and problem-solving skills are well-developed.";
    if (estimatedIQ >= 110) return "Good job! You have high-average cognitive abilities. You handle logical challenges and patterns well.";
    if (estimatedIQ >= 90) return "You show average cognitive abilities. With practice, you can strengthen specific areas like pattern recognition or numerical reasoning.";
    return "This score suggests room for growth. Regular practice with puzzles, reading, and logical exercises can significantly improve cognitive performance.";
  };

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">IQ Results</h1>
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
          <div style={{ fontSize: '64px', fontWeight: 800, color: '#0B2A5B', fontFamily: 'Montserrat' }}>
            {estimatedIQ}
          </div>
          <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>Estimated IQ Score</div>
          <div style={{
            display: 'inline-block',
            padding: '6px 20px',
            borderRadius: '20px',
            background: estimatedIQ >= 120 ? '#34A853' : estimatedIQ >= 90 ? '#1E5EFF' : '#FF6B00',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
            fontFamily: 'Montserrat'
          }}>
            {getIQLabel()}
          </div>
          <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.8', marginTop: '20px', textAlign: 'left' }}>
            {getIQText()}
          </p>
          <p style={{ color: '#999', fontSize: '12px', marginTop: '16px', fontStyle: 'italic' }}>
            Score: {totalCorrect}/{totalQuestions} correct • This is an indicative estimate, not a clinical IQ assessment.
          </p>
        </div>

        <ResultChart
          data={data}
          userName={userName}
          quizType="iq"
          onReturnHome={handleReturnHome}
        />

        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          padding: '24px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          marginTop: '20px'
        }}>
          <h4 style={{ color: '#0B2A5B', marginBottom: '16px', fontFamily: 'Montserrat' }}>Category Breakdown</h4>
          {data.map((item) => (
            <div key={item.name} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.name} Reasoning</span>
                <span style={{ fontSize: '14px', color: '#666' }}>{item.percentage.toFixed(0)}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
                <div style={{
                  width: `${item.percentage}%`,
                  height: '100%',
                  background: item.percentage >= 80 ? '#34A853' : item.percentage >= 50 ? '#1E5EFF' : '#FF6B00',
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

export default IQResults;
