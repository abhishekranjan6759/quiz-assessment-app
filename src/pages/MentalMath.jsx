import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const OPERATIONS = [
  { id: 'addition', label: 'Addition (+)', symbol: '+' },
  { id: 'subtraction', label: 'Subtraction (−)', symbol: '−' },
  { id: 'multiplication', label: 'Multiplication (×)', symbol: '×' },
  { id: 'division', label: 'Division (÷)', symbol: '÷' },
];

const LEVELS = [
  { id: 1, label: 'Level 1', description: '1-digit numbers' },
  { id: 2, label: 'Level 2', description: '2-digit numbers' },
];

const TIME_OPTIONS = [1, 2, 3, 5]; // minutes

function generateQuestion(level, operation) {
  let a, b, answer;
  const isOneDigit = level === 1;
  const min = isOneDigit ? 1 : 10;
  const max = isOneDigit ? 9 : 99;

  switch (operation) {
    case 'addition':
      a = Math.floor(Math.random() * (max - min + 1)) + min;
      b = Math.floor(Math.random() * (max - min + 1)) + min;
      answer = a + b;
      break;
    case 'subtraction':
      a = Math.floor(Math.random() * (max - min + 1)) + min;
      b = Math.floor(Math.random() * (a - min + 1)) + min;
      answer = a - b;
      break;
    case 'multiplication':
      if (isOneDigit) {
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 9) + 1;
      } else {
        a = Math.floor(Math.random() * 20) + 10;
        b = Math.floor(Math.random() * 9) + 2;
      }
      answer = a * b;
      break;
    case 'division':
      if (isOneDigit) {
        b = Math.floor(Math.random() * 8) + 2;
        answer = Math.floor(Math.random() * 8) + 1;
        a = b * answer;
      } else {
        b = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 15) + 10;
        a = b * answer;
      }
      break;
    default:
      a = 1; b = 1; answer = 2;
  }

  return { a, b, answer };
}

function generateOptions(correctAnswer) {
  const options = new Set([correctAnswer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const wrong = correctAnswer + (offset === 0 ? 1 : offset);
    if (wrong >= 0) options.add(wrong);
  }
  return [...options].sort(() => Math.random() - 0.5);
}

function MentalMath() {
  const navigate = useNavigate();
  const [selectedOp, setSelectedOp] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTime, setSelectedTime] = useState(5);
  const [mode, setMode] = useState('setup'); // setup | playing | results
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const timerRef = useRef(null);

  const getSymbol = () => {
    return OPERATIONS.find(o => o.id === selectedOp)?.symbol || '+';
  };

  const nextQuestion = useCallback(() => {
    const q = generateQuestion(selectedLevel, selectedOp);
    setQuestion(q);
    setOptions(generateOptions(q.answer));
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [selectedLevel, selectedOp]);

  const startGame = () => {
    setScore(0);
    setTotal(0);
    setTimeLeft(selectedTime * 60);
    setMode('playing');
    nextQuestion();
  };

  // Timer
  useEffect(() => {
    if (mode !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setMode('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [mode]);

  // Generate first question when game starts
  useEffect(() => {
    if (mode === 'playing' && !question) {
      nextQuestion();
    }
  }, [mode, question, nextQuestion]);

  const handleAnswer = (ans) => {
    if (showFeedback) return;
    setSelectedAnswer(ans);
    setShowFeedback(true);
    setTotal(prev => prev + 1);
    if (ans === question.answer) {
      setScore(prev => prev + 1);
    }
    // Move to next question after brief feedback
    setTimeout(() => {
      if (timeLeft > 0) {
        nextQuestion();
      }
    }, 800);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const resetGame = () => {
    setMode('setup');
    setQuestion(null);
    setScore(0);
    setTotal(0);
    clearInterval(timerRef.current);
  };

  return (
    <div className="app-container">
      <div style={styles.pageContainer}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            ← Home
          </button>
          <h1 style={styles.title}>🧮 Mental Math</h1>
          <p style={styles.subtitle}>Train your brain with quick calculations</p>
        </div>

        {/* SETUP SCREEN */}
        {mode === 'setup' && (
          <div style={styles.setupCard}>
            {/* Operation Selection */}
            <div style={styles.section}>
              <h3 style={styles.sectionLabel}>Choose Operation</h3>
              <div style={styles.optionGrid}>
                {OPERATIONS.map(op => (
                  <button
                    key={op.id}
                    onClick={() => setSelectedOp(op.id)}
                    style={selectedOp === op.id ? styles.optSelected : styles.optBtn}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Selection */}
            <div style={styles.section}>
              <h3 style={styles.sectionLabel}>Choose Level</h3>
              <div style={styles.optionGrid}>
                {LEVELS.map(lv => (
                  <button
                    key={lv.id}
                    onClick={() => setSelectedLevel(lv.id)}
                    style={selectedLevel === lv.id ? styles.optSelected : styles.optBtn}
                  >
                    {lv.label} — {lv.description}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div style={styles.section}>
              <h3 style={styles.sectionLabel}>Choose Duration</h3>
              <div style={styles.optionGrid}>
                {TIME_OPTIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    style={selectedTime === t ? styles.optSelected : styles.optBtn}
                  >
                    {t} min
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              disabled={!selectedOp || !selectedLevel}
              style={{
                ...styles.startButton,
                opacity: (!selectedOp || !selectedLevel) ? 0.5 : 1,
                cursor: (!selectedOp || !selectedLevel) ? 'not-allowed' : 'pointer',
              }}
            >
              ▶ Start
            </button>
          </div>
        )}

        {/* PLAYING SCREEN */}
        {mode === 'playing' && question && (
          <div style={styles.playCard}>
            {/* Timer & Score bar */}
            <div style={styles.topBar}>
              <div style={styles.timerBox}>
                <span style={styles.timerIcon}>⏱</span>
                <span style={{
                  ...styles.timerText,
                  color: timeLeft <= 10 ? '#e74c3c' : '#0B2A5B',
                }}>{formatTime(timeLeft)}</span>
              </div>
              <div style={styles.scoreBox}>
                ✅ {score} / {total}
              </div>
            </div>

            {/* Timer progress bar */}
            <div style={styles.timerBar}>
              <div style={{
                ...styles.timerFill,
                width: `${(timeLeft / (selectedTime * 60)) * 100}%`,
                background: timeLeft <= 10
                  ? '#e74c3c'
                  : 'linear-gradient(90deg, #1E5EFF, #6A3DE8)',
              }} />
            </div>

            {/* Question */}
            <div style={styles.questionBox}>
              <span style={styles.questionText}>
                {question.a} {getSymbol()} {question.b} = ?
              </span>
            </div>

            {/* Options */}
            <div style={styles.answersGrid}>
              {options.map((opt, idx) => {
                let btnStyle = styles.answerBtn;
                if (showFeedback) {
                  if (opt === question.answer) {
                    btnStyle = { ...styles.answerBtn, ...styles.correctBtn };
                  } else if (opt === selectedAnswer && opt !== question.answer) {
                    btnStyle = { ...styles.answerBtn, ...styles.wrongBtn };
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    style={btnStyle}
                    disabled={showFeedback}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <button onClick={resetGame} style={styles.quitBtn}>
              ✕ Quit
            </button>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {mode === 'results' && (
          <div style={styles.resultsCard}>
            <span style={styles.resultsIcon}>🏆</span>
            <h2 style={styles.resultsTitle}>Time's Up!</h2>
            <div style={styles.resultsStats}>
              <div style={styles.statRow}>
                <span>✅ Correct</span>
                <span style={{ fontWeight: '700', color: '#34A853' }}>{score}</span>
              </div>
              <div style={styles.statRow}>
                <span>❌ Wrong</span>
                <span style={{ fontWeight: '700', color: '#e74c3c' }}>{total - score}</span>
              </div>
              <div style={styles.statRow}>
                <span>📊 Total Attempted</span>
                <span style={{ fontWeight: '700' }}>{total}</span>
              </div>
              <div style={styles.statRow}>
                <span>📈 Accuracy</span>
                <span style={{ fontWeight: '700', color: '#1E5EFF' }}>
                  {total > 0 ? Math.round((score / total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={startGame} style={styles.startButton}>
                🔄 Play Again
              </button>
              <button onClick={resetGame} style={styles.secondaryBtn}>
                ← Change Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  header: {
    textAlign: 'center',
    position: 'relative',
    width: '100%',
    maxWidth: '700px',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '2rem',
    fontWeight: '800',
    color: 'white',
    marginBottom: '6px',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1rem',
  },
  // Setup
  setupCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '36px 30px',
    width: '100%',
    maxWidth: '550px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    alignItems: 'center',
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0B2A5B',
  },
  optionGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  optBtn: {
    background: '#f5f5f5',
    border: '2px solid #e0e0e0',
    padding: '10px 18px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#555',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  optSelected: {
    background: '#1E5EFF',
    border: '2px solid #1E5EFF',
    padding: '10px 18px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
  },
  startButton: {
    background: 'linear-gradient(135deg, #34A853 0%, #27ae60 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 40px',
    borderRadius: '30px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(52, 168, 83, 0.4)',
  },
  // Playing
  playCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '30px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  topBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  timerIcon: { fontSize: '1.2rem' },
  timerText: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.4rem',
    fontWeight: '800',
  },
  scoreBox: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#34A853',
    background: '#f0fff4',
    padding: '6px 14px',
    borderRadius: '12px',
  },
  timerBar: {
    width: '100%',
    height: '6px',
    background: '#e9ecef',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 1s linear',
  },
  questionBox: {
    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
    borderRadius: '16px',
    padding: '30px 40px',
    width: '100%',
    textAlign: 'center',
  },
  questionText: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#0B2A5B',
  },
  answersGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    width: '100%',
  },
  answerBtn: {
    background: '#f8f9fa',
    border: '2px solid #e0e0e0',
    borderRadius: '14px',
    padding: '18px',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#333',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  correctBtn: {
    background: '#d4edda',
    borderColor: '#34A853',
    color: '#155724',
  },
  wrongBtn: {
    background: '#f8d7da',
    borderColor: '#e74c3c',
    color: '#721c24',
  },
  quitBtn: {
    background: 'transparent',
    border: '2px solid #ddd',
    color: '#666',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  // Results
  resultsCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px 30px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'center',
  },
  resultsIcon: { fontSize: '3rem' },
  resultsTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0B2A5B',
  },
  resultsStats: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: '#f8f9fa',
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#444',
  },
  secondaryBtn: {
    background: 'transparent',
    border: '2px solid #ddd',
    color: '#666',
    padding: '12px 24px',
    borderRadius: '25px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default MentalMath;
