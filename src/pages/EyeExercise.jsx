import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SPEED_OPTIONS = [
  { label: 'Slow', value: 0.015 },
  { label: 'Medium', value: 0.025 },
  { label: 'Fast', value: 0.04 },
  { label: 'Very Fast', value: 0.06 },
];

const READING_SPEED_OPTIONS = [
  { label: 'Slow', pxPerFrame: 3 },
  { label: 'Medium', pxPerFrame: 6 },
  { label: 'Fast', pxPerFrame: 10 },
  { label: 'Very Fast', pxPerFrame: 15 },
];

const CANVAS_SIZES = [
  { label: '800 × 500', w: 800, h: 500 },
  { label: '1200 × 700', w: 1200, h: 700 },
  { label: '1920 × 1080', w: 1920, h: 1080 },
];

const PATTERNS = [
  { id: 'infinity-h', label: '∞ Horizontal Infinity', icon: '♾️' },
  { id: 'perimeter', label: '◻ Corner Perimeter', icon: '🔲' },
  { id: 'infinity-v', label: '∞ Vertical Infinity', icon: '🔃' },
  { id: 'diagonal', label: '✕ Diagonal Cross', icon: '❌' },
  { id: 'circle', label: '○ Circle', icon: '⭕' },
];

function EyeExercise() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const containerRef = useRef(null);

  // Mode: 'select' | 'reading' | 'eyeball'
  const [exerciseMode, setExerciseMode] = useState('select');
  const [isRunning, setIsRunning] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 1200, h: 700 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reading mode state
  const [readingSpeed, setReadingSpeed] = useState(6);
  const [lineCount, setLineCount] = useState(0);
  const ballRef = useRef({ x: 40, y: 54, direction: 1, line: 0 });

  // Eyeball mode state
  const [eyeSpeed, setEyeSpeed] = useState(0.025);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const tRef = useRef(0); // parametric t for eyeball patterns

  const BALL_RADIUS = 14;
  const LINE_HEIGHT = 50;
  const MARGIN = 40;
  const CYCLES_PER_PATTERN = 3;

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

  const totalLines = Math.floor((canvasSize.h - MARGIN * 2) / LINE_HEIGHT);

  const startReading = () => {
    ballRef.current = { x: MARGIN, y: MARGIN + BALL_RADIUS, direction: 1, line: 0 };
    setLineCount(0);
    setExerciseMode('reading');
    setIsRunning(true);
  };

  const startEyeball = () => {
    tRef.current = 0;
    setCurrentPattern(0);
    setCycleCount(0);
    setExerciseMode('eyeball');
    setIsRunning(true);
  };

  const stopExercise = () => {
    setIsRunning(false);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  const nextPattern = () => {
    setCurrentPattern(p => (p + 1) % PATTERNS.length);
    setCycleCount(0);
    tRef.current = 0;
  };

  const resetToSelect = () => {
    stopExercise();
    setExerciseMode('select');
  };

  // Eyeball pattern position calculator
  const getEyeballPosition = (t, W, H, pattern) => {
    const cx = W / 2;
    const cy = H / 2;
    const rx = (W - MARGIN * 2) / 2 * 0.85;
    const ry = (H - MARGIN * 2) / 2 * 0.85;

    switch (pattern) {
      case 'infinity-h': {
        // Lemniscate of Bernoulli (figure 8 horizontal)
        const angle = t * Math.PI * 2;
        const denom = 1 + Math.sin(angle) * Math.sin(angle);
        const x = cx + (rx * Math.cos(angle)) / denom;
        const y = cy + (ry * 0.5 * Math.sin(angle) * Math.cos(angle)) / denom;
        return { x, y };
      }
      case 'infinity-v': {
        // Vertical figure 8
        const angle = t * Math.PI * 2;
        const denom = 1 + Math.sin(angle) * Math.sin(angle);
        const x = cx + (rx * 0.5 * Math.sin(angle) * Math.cos(angle)) / denom;
        const y = cy + (ry * Math.cos(angle)) / denom;
        return { x, y };
      }
      case 'perimeter': {
        // Move along canvas edges: top→right→bottom→left
        const totalPerimeter = 2 * (W - MARGIN * 2) + 2 * (H - MARGIN * 2);
        const pos = (t % 1) * totalPerimeter;
        const topW = W - MARGIN * 2;
        const sideH = H - MARGIN * 2;
        if (pos < topW) {
          return { x: MARGIN + pos, y: MARGIN };
        } else if (pos < topW + sideH) {
          return { x: W - MARGIN, y: MARGIN + (pos - topW) };
        } else if (pos < topW * 2 + sideH) {
          return { x: W - MARGIN - (pos - topW - sideH), y: H - MARGIN };
        } else {
          return { x: MARGIN, y: H - MARGIN - (pos - topW * 2 - sideH) };
        }
      }
      case 'diagonal': {
        // Diagonal cross: TL→BR→TR→BL→TL
        const segment = t % 1;
        const phase = Math.floor(segment * 4) % 4;
        const frac = (segment * 4) % 1;
        const tl = { x: MARGIN, y: MARGIN };
        const tr = { x: W - MARGIN, y: MARGIN };
        const bl = { x: MARGIN, y: H - MARGIN };
        const br = { x: W - MARGIN, y: H - MARGIN };
        if (phase === 0) return { x: tl.x + (br.x - tl.x) * frac, y: tl.y + (br.y - tl.y) * frac };
        if (phase === 1) return { x: br.x + (tr.x - br.x) * frac, y: br.y + (tr.y - br.y) * frac };
        if (phase === 2) return { x: tr.x + (bl.x - tr.x) * frac, y: tr.y + (bl.y - tr.y) * frac };
        return { x: bl.x + (tl.x - bl.x) * frac, y: bl.y + (tl.y - bl.y) * frac };
      }
      case 'circle': {
        const angle = t * Math.PI * 2;
        return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
      }
      default:
        return { x: cx, y: cy };
    }
  };

  // Reading mode animation
  useEffect(() => {
    if (!isRunning || exerciseMode !== 'reading') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvasSize.w;
    const H = canvasSize.h;

    const loop = () => {
      const ball = ballRef.current;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      // Guide lines
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      for (let i = 0; i <= totalLines; i++) {
        const ly = MARGIN + i * LINE_HEIGHT;
        ctx.beginPath();
        ctx.moveTo(MARGIN, ly);
        ctx.lineTo(W - MARGIN, ly);
        ctx.stroke();
      }

      ball.x += readingSpeed * ball.direction;
      if (ball.direction === 1 && ball.x >= W - MARGIN) {
        ball.line += 1;
        ball.x = MARGIN;
        ball.y = MARGIN + BALL_RADIUS + ball.line * LINE_HEIGHT;
        setLineCount(ball.line);
        if (ball.line >= totalLines) {
          ball.line = 0;
          ball.y = MARGIN + BALL_RADIUS;
          setLineCount(0);
        }
      }

      // Line highlight
      const currentLineY = MARGIN + ball.line * LINE_HEIGHT;
      ctx.fillStyle = 'rgba(30, 94, 255, 0.04)';
      ctx.fillRect(MARGIN, currentLineY - LINE_HEIGHT / 2 + BALL_RADIUS, W - MARGIN * 2, LINE_HEIGHT);

      // Trail
      for (let i = 0; i < 5; i++) {
        const tx = ball.x - (i + 1) * readingSpeed * 2;
        if (tx > MARGIN && tx < W - MARGIN) {
          ctx.beginPath();
          ctx.arc(tx, ball.y, BALL_RADIUS - i * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 80, 80, ${0.15 - i * 0.03})`;
          ctx.fill();
        }
      }

      // Ball
      const gradient = ctx.createRadialGradient(ball.x - 4, ball.y - 4, 2, ball.x, ball.y, BALL_RADIUS);
      gradient.addColorStop(0, '#ff8a8a');
      gradient.addColorStop(0.5, '#ff3333');
      gradient.addColorStop(1, '#cc0000');
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isRunning, exerciseMode, readingSpeed, canvasSize, totalLines]);

  // Eyeball mode animation
  useEffect(() => {
    if (!isRunning || exerciseMode !== 'eyeball') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvasSize.w;
    const H = canvasSize.h;
    let prevT = tRef.current;

    const loop = () => {
      tRef.current += eyeSpeed;

      // Check if we completed a cycle
      if (Math.floor(tRef.current) > Math.floor(prevT)) {
        setCycleCount(c => {
          const newC = c + 1;
          if (newC >= CYCLES_PER_PATTERN) {
            // Auto advance to next pattern
            setCurrentPattern(p => (p + 1) % PATTERNS.length);
            tRef.current = 0;
            return 0;
          }
          return newC;
        });
      }
      prevT = tRef.current;

      const patternId = PATTERNS[currentPattern].id;
      const pos = getEyeballPosition(tRef.current, W, H, patternId);

      // Clear
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      // Draw pattern path (faint guide)
      ctx.strokeStyle = 'rgba(30, 94, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const sampleT = i / 200;
        const sp = getEyeballPosition(sampleT, W, H, patternId);
        if (i === 0) ctx.moveTo(sp.x, sp.y);
        else ctx.lineTo(sp.x, sp.y);
      }
      ctx.stroke();

      // Draw trail
      for (let i = 1; i <= 8; i++) {
        const trailT = tRef.current - i * eyeSpeed * 3;
        if (trailT >= 0) {
          const tp = getEyeballPosition(trailT, W, H, patternId);
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, BALL_RADIUS - i * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 80, 80, ${0.2 - i * 0.025})`;
          ctx.fill();
        }
      }

      // Draw ball
      const gradient = ctx.createRadialGradient(pos.x - 4, pos.y - 4, 2, pos.x, pos.y, BALL_RADIUS);
      gradient.addColorStop(0, '#ff8a8a');
      gradient.addColorStop(0.5, '#ff3333');
      gradient.addColorStop(1, '#cc0000');
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pattern label on canvas
      ctx.fillStyle = 'rgba(11, 42, 91, 0.6)';
      ctx.font = "bold 16px 'Montserrat', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(PATTERNS[currentPattern].label, W / 2, H - 20);

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isRunning, exerciseMode, eyeSpeed, canvasSize, currentPattern]);

  return (
    <div className="app-container">
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
          <h1 style={styles.title}>👁️ Eye Movement Exercise</h1>
          <p style={styles.subtitle}>Train your eye muscles for better reading & focus</p>
        </div>

        {/* MODE SELECT */}
        {exerciseMode === 'select' && !isRunning && (
          <div style={styles.controlsCard}>
            <h3 style={styles.sectionTitle}>Choose Exercise Type</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => setExerciseMode('readingSetup')} style={styles.modeBtn}>
                <span style={{ fontSize: '1.5rem' }}>📖</span>
                <span style={styles.modeBtnLabel}>Reading Exercise</span>
                <span style={styles.modeBtnSub}>Ball moves left→right line by line</span>
              </button>
              <button onClick={() => setExerciseMode('eyeballSetup')} style={styles.modeBtn}>
                <span style={{ fontSize: '1.5rem' }}>🔄</span>
                <span style={styles.modeBtnLabel}>Eyeball Exercise</span>
                <span style={styles.modeBtnSub}>Infinity, perimeter, circle patterns</span>
              </button>
            </div>
          </div>
        )}

        {/* READING SETUP */}
        {exerciseMode === 'readingSetup' && !isRunning && (
          <div style={styles.controlsCard}>
            <h3 style={styles.sectionTitle}>📖 Reading Exercise Setup</h3>
            <div style={styles.section}>
              <label style={styles.label}>Speed</label>
              <div style={styles.optionRow}>
                {READING_SPEED_OPTIONS.map(s => (
                  <button key={s.label} onClick={() => setReadingSpeed(s.pxPerFrame)}
                    style={readingSpeed === s.pxPerFrame ? styles.optActive : styles.optBtn}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.section}>
              <label style={styles.label}>Canvas Size</label>
              <div style={styles.optionRow}>
                {CANVAS_SIZES.map(c => (
                  <button key={c.label} onClick={() => setCanvasSize({ w: c.w, h: c.h })}
                    style={canvasSize.w === c.w ? styles.optActive : styles.optBtn}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={startReading} style={styles.startBtn}>▶ Start</button>
              <button onClick={resetToSelect} style={styles.backBtn}>← Back</button>
            </div>
          </div>
        )}

        {/* EYEBALL SETUP */}
        {exerciseMode === 'eyeballSetup' && !isRunning && (
          <div style={styles.controlsCard}>
            <h3 style={styles.sectionTitle}>🔄 Eyeball Exercise Setup</h3>
            <p style={styles.infoText}>
              The ball will trace patterns: ∞ Horizontal → Corner Perimeter → ∞ Vertical → Diagonal Cross → Circle. 
              Each pattern repeats {CYCLES_PER_PATTERN} times then auto-advances.
            </p>
            <div style={styles.section}>
              <label style={styles.label}>Speed</label>
              <div style={styles.optionRow}>
                {SPEED_OPTIONS.map(s => (
                  <button key={s.label} onClick={() => setEyeSpeed(s.value)}
                    style={eyeSpeed === s.value ? styles.optActive : styles.optBtn}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.section}>
              <label style={styles.label}>Canvas Size</label>
              <div style={styles.optionRow}>
                {CANVAS_SIZES.map(c => (
                  <button key={c.label} onClick={() => setCanvasSize({ w: c.w, h: c.h })}
                    style={canvasSize.w === c.w ? styles.optActive : styles.optBtn}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={startEyeball} style={styles.startBtn}>▶ Start</button>
              <button onClick={resetToSelect} style={styles.backBtn}>← Back</button>
            </div>
          </div>
        )}

        {/* RUNNING STATS BAR - Reading */}
        {isRunning && exerciseMode === 'reading' && (
          <div style={styles.statsBar}>
            <span style={styles.stat}>📖 Reading</span>
            <span style={styles.stat}>Line: {lineCount + 1} / {totalLines}</span>
            <button onClick={stopExercise} style={styles.stopBtn}>⏹ Stop</button>
            <button onClick={resetToSelect} style={styles.backBtn}>← Back</button>
          </div>
        )}

        {/* RUNNING STATS BAR - Eyeball */}
        {isRunning && exerciseMode === 'eyeball' && (
          <div style={styles.statsBar}>
            <span style={styles.stat}>{PATTERNS[currentPattern].icon} {PATTERNS[currentPattern].label}</span>
            <span style={styles.stat}>Cycle: {cycleCount + 1} / {CYCLES_PER_PATTERN}</span>
            <button onClick={nextPattern} style={styles.skipBtn}>⏭ Skip</button>
            <button onClick={stopExercise} style={styles.stopBtn}>⏹ Stop</button>
            <button onClick={resetToSelect} style={styles.backBtn}>← Back</button>
          </div>
        )}

        {/* Canvas */}
        {(isRunning || exerciseMode === 'reading' || exerciseMode === 'eyeball') && (
          <div style={{ ...styles.canvasWrapper, maxWidth: canvasSize.w + 'px' }}>
            <canvas
              ref={canvasRef}
              width={canvasSize.w}
              height={canvasSize.h}
              style={styles.canvas}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh', padding: '20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
    background: 'linear-gradient(135deg, #0B2A5B 0%, #1E5EFF 100%)',
  },
  fullscreenContainer: {
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh', zIndex: 9999,
    padding: '10px', overflow: 'auto',
  },
  header: {
    textAlign: 'center', position: 'relative', width: '100%', maxWidth: '900px',
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
    fontSize: '1.8rem', fontWeight: '800', color: 'white', marginBottom: '4px',
  },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' },
  controlsCard: {
    background: 'white', borderRadius: '20px', padding: '28px',
    maxWidth: '580px', width: '100%',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.1rem', fontWeight: '700', color: '#0B2A5B', textAlign: 'center',
  },
  infoText: {
    fontSize: '0.85rem', color: '#555', textAlign: 'center', lineHeight: '1.5',
  },
  modeBtn: {
    background: '#f8f9fa', border: '2px solid #e0e0e0', borderRadius: '16px',
    padding: '20px 24px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '6px', width: '200px', transition: 'all 0.2s',
  },
  modeBtnLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.95rem', fontWeight: '700', color: '#0B2A5B',
  },
  modeBtnSub: { fontSize: '0.75rem', color: '#666', textAlign: 'center' },
  section: { width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: '700', fontSize: '0.9rem', color: '#0B2A5B' },
  optionRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  optBtn: {
    background: '#f5f5f5', border: '2px solid #e0e0e0',
    padding: '9px 16px', borderRadius: '12px',
    fontSize: '0.85rem', fontWeight: '600', color: '#555', cursor: 'pointer',
  },
  optActive: {
    background: '#1E5EFF', border: '2px solid #1E5EFF',
    padding: '9px 16px', borderRadius: '12px',
    fontSize: '0.85rem', fontWeight: '600', color: 'white', cursor: 'pointer',
  },
  startBtn: {
    background: 'linear-gradient(135deg, #34A853, #27ae60)', color: 'white',
    border: 'none', padding: '14px 36px', borderRadius: '30px',
    fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(52,168,83,0.4)',
  },
  backBtn: {
    background: 'transparent', border: '2px solid #ddd', color: '#666',
    padding: '10px 20px', borderRadius: '20px',
    fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
  },
  statsBar: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'rgba(255,255,255,0.95)', borderRadius: '14px',
    padding: '10px 20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    flexWrap: 'wrap', justifyContent: 'center',
  },
  stat: { fontSize: '0.85rem', fontWeight: '600', color: '#0B2A5B' },
  stopBtn: {
    background: '#e74c3c', color: 'white', border: 'none',
    padding: '8px 18px', borderRadius: '20px',
    fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
  },
  skipBtn: {
    background: '#FF6B00', color: 'white', border: 'none',
    padding: '8px 18px', borderRadius: '20px',
    fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
  },
  canvasWrapper: {
    width: '100%', borderRadius: '12px', overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    border: '3px solid rgba(255,255,255,0.3)',
    maxHeight: 'calc(100vh - 200px)',
  },
  canvas: {
    width: '100%', height: 'auto', display: 'block', background: '#ffffff',
    maxHeight: 'calc(100vh - 200px)',
  },
};

export default EyeExercise;
