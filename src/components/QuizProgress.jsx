import React from 'react';
import { LinearProgress } from '@mui/material';

function QuizProgress({ current, total }) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="quiz-header">
      <div className="quiz-title-small">Question {current + 1} of {total}</div>
      <div className="question-counter">{current + 1}/{total}</div>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#4CAF50'
          }
        }}
      />
    </div>
  );
}

export default QuizProgress;