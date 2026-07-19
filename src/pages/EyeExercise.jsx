import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SPEED_OPTIONS = [
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

function EyeExercise() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const containerRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(6);
  const [canvasSize, setCanvasSize] = useState({ w: 1200, h: 700 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lineCount, setLineCount] = useState(0);

  const BALL_RADIUS = 14;
  const LINE_HEIGHT = 50;
  const MARGIN = 40;

  // Ball position ref for animation
  const ballRef = useRef({ x: MARGIN, y: MARGIN + BALL_RADIUS, direction: 1, line: 0 });

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

  const startExercise = () => {
    ballRef.current = { x: MARGIN, y: MARGIN + BALL_RADIUS, direction: 1, line: 0 };
    setLineCount(0);
    setIsRunning(true);
  };

  const stopExercise = () => {
    setIsRunning(false);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  useEffect(() => {
    if (!isRunning) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvasSize.w;
    const H = canvasSize.h;

    const loop = () => {
      const ball = ballRef.current;

      // Clear
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      // Draw guide lines (faint)
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      for (let i = 0; i <= totalLines; i++) {
        const ly = MARGIN + i * LINE_HEIGHT;
        ctx.beginPath();
        ctx.moveTo(MARGIN, ly);
        ctx.lineTo(W - MARGIN, ly);
        ctx.stroke();
      }

      // Move ball
      ball.x += speed * ball.direction;

      // Check bounds - end of line
      if (ball.direction === 1 && ball.x >= W - MARGIN) {
        ball.x = W - MARGIN;
        ball.direction = 1; // always left to right
        ball.line += 1;
        ball.x = MARGIN; // jump to left of next line
        ball.y = MARGIN + BALL_RADIUS + ball.line * LINE_HEIGHT;
        setLineCount(ball.line);

        // If past last line, loop back to top
        if (ball.line >= totalLines) {
          ball.line = 0;
          ball.y = MARGIN + BALL_RADIUS;
          setLineCount(0);
        }
      }

      // Draw current line highlight
      const currentLineY = MARGIN + ball.line * LINE_HEIGHT;
      ctx.fillStyle = 'rgba(30, 94, 255, 0.04)';
      ctx.fillRect(MARGIN, currentLineY - LINE_HEIGHT / 2 + BALL_RADIUS, W - MARGIN * 2, LINE_HEIGHT);

      // Draw ball trail (fading)
      const trailLength = 60;
      for (let i = 0; i < 5; i++) {
        const tx = ball.x - (i + 1) * speed * 2 * ball.direction;
        if (tx > MARGIN && tx < W - MARGIN) {
          ctx.beginPath();
          ctx.arc(tx, ball.y, BALL_RADIUS - i * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 80, 80, ${0.15 - i * 0.03})`;
          ctx.fill();
        }
      }

      // Draw ball
      const gradient = ctx.createRadialGradient(
        ball.x - 4, ball.y - 4, 2,
        ball.x, ball.y, BALL_RADIUS
      );
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
  }, [isRunning, speed, canvasSize, totalLines]);

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
          <p style={styles.subtitle}>Follow the red ball line by line to train your reading eye movement</p>
        </div>

        {/* Controls */}
        {!isRunning && (
          <div style={styles.controlsCard}>
            {/* Speed */}
            <div style={styles.section}>
              <label style={styles.label}>Speed</label>
              <div style={styles.optionRow}>
                {SPEED_OPTIONS.map(s => (
                  <button key={s.label}
                    onClick={() => setSpeed(s.pxPerFrame)}
                    style={speed === s.pxPerFrame ? styles.optActive : styles.optBtn}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Size */}
            <div style={styles.section}>
              <label style={styles.label}>Canvas Size</label>
              <div style={styles.optionRow}>
                {CANVAS_SIZES.map(c => (
                  <button key={c.label}
                    onClick={() => setCanvasSize({ w: c.w, h: c.h })}
                    style={canvasSize.w === c.w ? styles.optActive : styles.optBtn}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startExercise} style={styles.startBtn}>▶ Start Exercise</button>
          </div>
        )}

        {isRunning && (
          <div style={styles.statsBar}>
            <span style={styles.stat}>Line: {lineCount + 1} / {totalLines}</span>
            <span style={styles.stat}>Speed: {SPEED_OPTIONS.find(s => s.pxPerFrame === speed)?.label}</span>
            <button onClick={stopExercise} style={styles.stopBtn}>⏹ Stop</button>
          </div>
        )}

        {/* Canvas */}
        <div style={{ ...styles.canvasWrapper, maxWidth: canvasSize.w + 'px' }}>
          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            style={styles.canvas}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    background: 'linear-gradient(135deg, #0B2A5B 0%, #1E5EFF 100%)',
  },
  fullscreenContainer: {
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh', zIndex: 9999,
    padding: '10px', overflow: 'auto',
  },
  header: {
    textAlign: 'center', position: 'relative',
    width: '100%', maxWidth: '900px',
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
    background: 'white', borderRadius: '20px', padding: '28px 28px',
    maxWidth: '550px', width: '100%',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center',
  },
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
    border: 'none', padding: '14px 40px', borderRadius: '30px',
    fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(52,168,83,0.4)',
  },
  statsBar: {
    display: 'flex', alignItems: 'center', gap: '16px',
    background: 'rgba(255,255,255,0.95)', borderRadius: '14px',
    padding: '10px 20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    flexWrap: 'wrap', justifyContent: 'center',
  },
  stat: { fontSize: '0.9rem', fontWeight: '600', color: '#0B2A5B' },
  stopBtn: {
    background: '#e74c3c', color: 'white', border: 'none',
    padding: '8px 20px', borderRadius: '20px',
    fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
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
