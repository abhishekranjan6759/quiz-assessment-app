import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TIMER_MODES = [
  { id: 'speed-reading', label: '📖 Speed Reading Timer', icon: '📖' },
  { id: 'pomodoro', label: '🍅 Pomodoro', icon: '🍅' },
  { id: 'custom', label: '⏱️ Custom Timer', icon: '⏱️' },
];

const SPEED_READING_DURATIONS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
];

function TimerPage() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);
  const [phase, setPhase] = useState('select'); // select | breathing | countdown | running | done | break
  const [duration, setDuration] = useState(120);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [countdownNum, setCountdownNum] = useState(0);
  const [customName, setCustomName] = useState('');
  const [customMinutes, setCustomMinutes] = useState(5);
  const [pomodoroRound, setPomodoroRound] = useState(1);
  const [pomodoroPhase, setPomodoroPhase] = useState('focus'); // focus | break
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Timer logic
  useEffect(() => {
    if (phase === 'running' || phase === 'break') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (phase === 'running' && selectedMode === 'pomodoro') {
              setPhase('break');
              setTimeLeft(300); // 5 min break
              setPomodoroPhase('break');
              return 300;
            }
            if (phase === 'break' && selectedMode === 'pomodoro') {
              setPomodoroRound(r => r + 1);
              setPomodoroPhase('focus');
              setPhase('running');
              setTimeLeft(1500); // 25 min
              return 1500;
            }
            setPhase('done');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [phase, selectedMode]);

  const startSpeedReading = (seconds) => {
    setDuration(seconds);
    setPhase('breathing');
  };

  const startBreathing = () => {
    // Show 3-2-1-Go countdown after breathing
    setPhase('countdown');
    setCountdownNum(3);
  };

  // Countdown 3-2-1-Go
  useEffect(() => {
    if (phase === 'countdown' && countdownNum > 0) {
      const t = setTimeout(() => setCountdownNum(countdownNum - 1), 1000);
      return () => clearTimeout(t);
    }
    if (phase === 'countdown' && countdownNum === 0) {
      // Show "Go!" then start
      const t = setTimeout(() => {
        setTimeLeft(duration);
        setPhase('running');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [phase, countdownNum, duration]);

  const startPomodoro = () => {
    setDuration(1500);
    setPomodoroRound(1);
    setPomodoroPhase('focus');
    setTimeLeft(1500);
    setPhase('running');
  };

  const startCustom = () => {
    const secs = customMinutes * 60;
    setDuration(secs);
    setTimeLeft(secs);
    setPhase('running');
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setPhase('done');
  };

  const resetAll = () => {
    clearInterval(timerRef.current);
    setPhase('select');
    setSelectedMode(null);
    setTimeLeft(0);
    setCountdownNum(0);
    setPomodoroRound(1);
    setPomodoroPhase('focus');
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

  return (
    <div className="app-container">
      <style>{`
        @keyframes breathe { 0%,100% { transform: scale(1); opacity:0.7; } 50% { transform: scale(1.3); opacity:1; } }
        @keyframes countPop { 0% { transform: scale(0.3); opacity:0; } 60% { transform: scale(1.2); opacity:1; } 100% { transform: scale(1); } }
        @keyframes reading { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .breathe-circle { animation: breathe 4s ease-in-out infinite; }
        .count-pop { animation: countPop 0.5s ease-out; }
        .reading-anim { animation: reading 2s ease-in-out infinite; }
        .pulse-text { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>

      <div ref={containerRef} style={{
        ...styles.pageContainer,
        ...(isFullscreen ? styles.fullscreenContainer : {}),
      }}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/')} style={styles.backButton}>← Home</button>
          <button onClick={toggleFullscreen} style={styles.fsButton}>
            {isFullscreen ? '⊡ Exit' : '⛶ Fullscreen'}
          </button>
          <h1 style={styles.title}>⏱️ Timer</h1>
          <p style={styles.subtitle}>Focus tools for deep learning sessions</p>
        </div>

        {/* MODE SELECT */}
        {phase === 'select' && !selectedMode && (
          <div style={styles.modeContainer}>
            {TIMER_MODES.map(mode => (
              <button key={mode.id} onClick={() => setSelectedMode(mode.id)} style={styles.modeButton}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <span style={{ fontSize: '2rem' }}>{mode.icon}</span>
                <span style={styles.modeLabel}>{mode.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* SPEED READING - Duration Select */}
        {phase === 'select' && selectedMode === 'speed-reading' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📖 Speed Reading Timer</h2>
            <p style={styles.cardText}>Select your reading duration:</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {SPEED_READING_DURATIONS.map(d => (
                <button key={d.seconds} onClick={() => startSpeedReading(d.seconds)} style={styles.durationBtn}>
                  {d.label}
                </button>
              ))}
            </div>
            <button onClick={resetAll} style={styles.secondaryBtn}>← Back</button>
          </div>
        )}

        {/* POMODORO - Select */}
        {phase === 'select' && selectedMode === 'pomodoro' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🍅 Pomodoro Timer</h2>
            <p style={styles.cardText}>25 min intense focus → 5 min break → repeat</p>
            <button onClick={startPomodoro} style={styles.startBtn}>▶ Start Pomodoro</button>
            <button onClick={resetAll} style={styles.secondaryBtn}>← Back</button>
          </div>
        )}

        {/* CUSTOM - Select */}
        {phase === 'select' && selectedMode === 'custom' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>⏱️ Custom Timer</h2>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>What is this timer for?</label>
              <input type="text" value={customName} onChange={e => setCustomName(e.target.value)}
                placeholder="e.g., Revision, Homework..." style={styles.input} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Duration (minutes)</label>
              <input type="number" min={1} max={120} value={customMinutes}
                onChange={e => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ ...styles.input, maxWidth: '120px' }} />
            </div>
            <button onClick={startCustom} style={styles.startBtn}>▶ Start Timer</button>
            <button onClick={resetAll} style={styles.secondaryBtn}>← Back</button>
          </div>
        )}

        {/* BREATHING PHASE */}
        {phase === 'breathing' && (
          <div style={styles.centerCard}>
            <div className="breathe-circle" style={styles.breatheCircle} />
            <h2 style={styles.breatheTitle}>Take Deep Breaths</h2>
            <p style={styles.breatheText}>Wim Hof breathing — breathe in deeply, exhale slowly. Do 3-5 cycles.</p>
            <button onClick={startBreathing} style={styles.startBtn}>I'm Ready → Start</button>
          </div>
        )}

        {/* COUNTDOWN 3-2-1-Go */}
        {phase === 'countdown' && (
          <div style={styles.centerCard}>
            <div className="count-pop" key={countdownNum} style={styles.countdownNumber}>
              {countdownNum > 0 ? countdownNum : 'Go!'}
            </div>
          </div>
        )}

        {/* RUNNING / BREAK */}
        {(phase === 'running' || phase === 'break') && (
          <div style={styles.runningCard}>
            {/* Mode info */}
            <div style={styles.modeBadge}>
              {selectedMode === 'speed-reading' && '📖 Reading'}
              {selectedMode === 'pomodoro' && (pomodoroPhase === 'focus'
                ? `🍅 Focus (Round ${pomodoroRound})`
                : '☕ Break')}
              {selectedMode === 'custom' && (customName || 'Custom Timer')}
            </div>

            {/* Animation for speed reading */}
            {selectedMode === 'speed-reading' && phase === 'running' && (
              <div className="reading-anim" style={styles.readingAnimation}>
                <span style={{ fontSize: '4rem' }}>📖</span>
                <span style={{ fontSize: '3rem' }}>🧑‍🎓</span>
              </div>
            )}

            {/* Circular progress */}
            <div style={styles.timerCircle}>
              <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="110" cy="110" r="100" fill="none" stroke="#e9ecef" strokeWidth="10" />
                <circle cx="110" cy="110" r="100" fill="none"
                  stroke={phase === 'break' ? '#34A853' : '#1E5EFF'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={628}
                  strokeDashoffset={628 - (628 * progressPercent) / 100}
                  style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div style={styles.timerText}>{formatTime(timeLeft)}</div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={stopTimer} style={styles.stopBtn}>⏹ Stop</button>
              <button onClick={toggleFullscreen} style={styles.fsSmallBtn}>
                {isFullscreen ? '⊡' : '⛶'}
              </button>
            </div>
          </div>
        )}

        {/* DONE */}
        {phase === 'done' && (
          <div style={styles.centerCard}>
            {selectedMode === 'speed-reading' ? (
              <>
                <span style={{ fontSize: '3rem' }}>🧘</span>
                <h2 style={styles.doneTitle}>Time's Up!</h2>
                <div style={styles.recallBox}>
                  <p className="pulse-text" style={styles.recallText}>
                    Close your eyes, relax, and try to recall what you read for at least 1 minute.
                  </p>
                </div>
              </>
            ) : (
              <>
                <span style={{ fontSize: '3rem' }}>✅</span>
                <h2 style={styles.doneTitle}>Timer Complete!</h2>
                <p style={styles.cardText}>Great work! Take a moment to stretch and breathe.</p>
              </>
            )}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
              <button onClick={resetAll} style={styles.startBtn}>🔄 Start New Timer</button>
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
    background: 'linear-gradient(135deg, #0B2A5B 0%, #1E5EFF 100%)',
  },
  fullscreenContainer: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    padding: '20px',
    overflow: 'auto',
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    position: 'relative',
    width: '100%',
    maxWidth: '700px',
  },
  backButton: {
    position: 'absolute', left: 0, top: 0,
    background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
    padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600', backdropFilter: 'blur(10px)',
  },
  fsButton: {
    position: 'absolute', right: 0, top: 0,
    background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
    padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600', backdropFilter: 'blur(10px)',
  },
  title: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '6px',
  },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1rem' },
  // Mode selection
  modeContainer: {
    display: 'flex', flexDirection: 'column', gap: '14px',
    width: '100%', maxWidth: '400px', alignItems: 'center',
  },
  modeButton: {
    width: '100%', background: 'white', border: 'none', borderRadius: '16px',
    padding: '22px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: '14px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', transition: 'all 0.2s',
  },
  modeLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.05rem', fontWeight: '700', color: '#0B2A5B',
  },
  // Cards
  card: {
    background: 'white', borderRadius: '24px', padding: '36px 30px',
    width: '100%', maxWidth: '450px', boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
    textAlign: 'center',
  },
  centerCard: {
    background: 'white', borderRadius: '24px', padding: '50px 30px',
    width: '100%', maxWidth: '500px', boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
    textAlign: 'center',
  },
  runningCard: {
    background: 'white', borderRadius: '24px', padding: '36px 30px',
    width: '100%', maxWidth: '500px', boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
  },
  cardTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.3rem', fontWeight: '700', color: '#0B2A5B',
  },
  cardText: { fontSize: '0.95rem', color: '#555', lineHeight: '1.5' },
  durationBtn: {
    background: 'linear-gradient(135deg, #1E5EFF, #0B2A5B)', color: 'white',
    border: 'none', padding: '14px 28px', borderRadius: '25px',
    fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(30,94,255,0.3)',
  },
  startBtn: {
    background: 'linear-gradient(135deg, #34A853, #27ae60)', color: 'white',
    border: 'none', padding: '14px 36px', borderRadius: '30px',
    fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(52,168,83,0.4)',
  },
  stopBtn: {
    background: '#e74c3c', color: 'white', border: 'none',
    padding: '12px 28px', borderRadius: '25px',
    fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
  },
  secondaryBtn: {
    background: 'transparent', border: '2px solid #ddd', color: '#666',
    padding: '10px 22px', borderRadius: '20px',
    fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
  },
  fsSmallBtn: {
    background: '#1E5EFF', color: 'white', border: 'none',
    padding: '12px 16px', borderRadius: '25px',
    fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
  },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' },
  label: { fontWeight: '700', fontSize: '0.9rem', color: '#0B2A5B', textAlign: 'left' },
  input: {
    padding: '11px 14px', border: '2px solid #e0e0e0', borderRadius: '10px',
    fontSize: '0.95rem', outline: 'none', width: '100%',
  },
  // Breathing
  breatheCircle: {
    width: '120px', height: '120px', borderRadius: '50%',
    background: 'radial-gradient(circle, #85C1E9, #1E5EFF)',
    marginBottom: '10px',
  },
  breatheTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.4rem', fontWeight: '700', color: '#0B2A5B',
  },
  breatheText: { fontSize: '0.95rem', color: '#555', lineHeight: '1.5' },
  // Countdown
  countdownNumber: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '6rem', fontWeight: '900', color: '#1E5EFF',
  },
  // Running
  modeBadge: {
    background: 'linear-gradient(135deg, #6A3DE8, #9B59B6)', color: 'white',
    padding: '6px 18px', borderRadius: '20px',
    fontSize: '0.9rem', fontWeight: '600',
  },
  readingAnimation: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '5px',
  },
  timerCircle: {
    position: 'relative', width: '220px', height: '220px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  timerText: {
    position: 'absolute',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '2.8rem', fontWeight: '800', color: '#0B2A5B',
  },
  // Done
  doneTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.5rem', fontWeight: '700', color: '#0B2A5B',
  },
  recallBox: {
    background: '#f0f7ff', border: '2px solid #b3d9ff', borderRadius: '16px',
    padding: '24px 20px',
  },
  recallText: {
    fontSize: '1.1rem', fontWeight: '600', color: '#1E5EFF', lineHeight: '1.6',
  },
};

export default TimerPage;
