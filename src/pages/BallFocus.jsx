import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Generate fibonacci sequence up to max
function fibSequence(max) {
  const seq = [1, 1];
  while (true) {
    const next = seq[seq.length - 1] + seq[seq.length - 2];
    if (next > max) break;
    seq.push(next);
  }
  return seq;
}

const FIB_SEQUENCE = fibSequence(150);

// Random color generator
function randomColor() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1',
    '#DDA0DD', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F1948A', '#82E0AA', '#F8C471', '#AED6F1',
    '#D2B4DE', '#A3E4D7', '#FAD7A0', '#A9CCE3',
    '#FF6B00', '#1E5EFF', '#34A853', '#6A3DE8',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function BallFocus() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const ballsRef = useRef([]);
  const containerRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [ballCount, setBallCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const startTimeRef = useRef(null);
  const nextDropTimeRef = useRef(null);
  const fibIndexRef = useRef(0);
  const ballsToDropRef = useRef(0);
  const droppedInBatchRef = useRef(0);

  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1080;
  const BALL_RADIUS = 18;
  const GRAVITY = 0.3;
  const DAMPING = 0.85;
  const DROP_INTERVAL = 10000; // 10 seconds between batches

  const createBall = useCallback(() => {
    return {
      x: Math.random() * (CANVAS_WIDTH - BALL_RADIUS * 2) + BALL_RADIUS,
      y: -BALL_RADIUS,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 2 + 1,
      radius: BALL_RADIUS + Math.random() * 6 - 3,
      color: randomColor(),
    };
  }, []);

  const startGame = () => {
    ballsRef.current = [];
    fibIndexRef.current = 0;
    ballsToDropRef.current = FIB_SEQUENCE[0]; // first batch = 1 ball
    droppedInBatchRef.current = 0;
    startTimeRef.current = Date.now();
    nextDropTimeRef.current = Date.now(); // drop first ball immediately
    setBallCount(0);
    setElapsedTime(0);
    setIsRunning(true);
  };

  const stopGame = () => {
    setIsRunning(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const now = Date.now();

      // Update elapsed time
      setElapsedTime(Math.floor((now - startTimeRef.current) / 1000));

      // Drop new balls based on timing
      if (now >= nextDropTimeRef.current && fibIndexRef.current < FIB_SEQUENCE.length) {
        // Drop one ball from current batch
        if (droppedInBatchRef.current < ballsToDropRef.current) {
          ballsRef.current.push(createBall());
          droppedInBatchRef.current += 1;
          setBallCount(ballsRef.current.length);

          // If more balls in this batch, drop next one in 300ms
          if (droppedInBatchRef.current < ballsToDropRef.current) {
            nextDropTimeRef.current = now + 300;
          } else {
            // Batch complete, schedule next batch
            fibIndexRef.current += 1;
            if (fibIndexRef.current < FIB_SEQUENCE.length) {
              ballsToDropRef.current = FIB_SEQUENCE[fibIndexRef.current];
              droppedInBatchRef.current = 0;
              nextDropTimeRef.current = now + DROP_INTERVAL;
            }
          }
        }
      }

      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Update & draw balls
      ballsRef.current.forEach((ball) => {
        // Apply gravity
        ball.vy += GRAVITY;

        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Bounce off walls
        if (ball.x - ball.radius <= 0) {
          ball.x = ball.radius;
          ball.vx = Math.abs(ball.vx) * DAMPING;
        }
        if (ball.x + ball.radius >= CANVAS_WIDTH) {
          ball.x = CANVAS_WIDTH - ball.radius;
          ball.vx = -Math.abs(ball.vx) * DAMPING;
        }

        // Bounce off floor
        if (ball.y + ball.radius >= CANVAS_HEIGHT) {
          ball.y = CANVAS_HEIGHT - ball.radius;
          ball.vy = -Math.abs(ball.vy) * DAMPING;
          // Add slight random horizontal force on bounce
          ball.vx += (Math.random() - 0.5) * 2;
        }

        // Bounce off ceiling
        if (ball.y - ball.radius <= 0) {
          ball.y = ball.radius;
          ball.vy = Math.abs(ball.vy) * DAMPING;
        }

        // Keep balls moving (minimum velocity)
        if (Math.abs(ball.vy) < 2 && ball.y + ball.radius >= CANVAS_HEIGHT - 5) {
          ball.vy = -(Math.random() * 8 + 5);
          ball.vx = (Math.random() - 0.5) * 8;
        }

        // Draw ball with gradient for 3D effect
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          ball.radius * 0.1,
          ball.x,
          ball.y,
          ball.radius
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, ball.color);
        gradient.addColorStop(1, ball.color);

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning, createBall]);

  // Calculate total balls that will eventually drop
  const totalBalls = FIB_SEQUENCE.reduce((a, b) => a + b, 0);

  return (
    <div className="app-container">
      <div ref={containerRef} style={{
        ...styles.pageContainer,
        ...(isFullscreen ? styles.fullscreenContainer : {}),
      }}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            ← Home
          </button>
          <h1 style={styles.title}>🎱 Ball Focus Trainer</h1>
          <p style={styles.subtitle}>
            Track the bouncing balls — train your focus & attention
          </p>
        </div>

        {/* Controls */}
        {!isRunning && (
          <div style={styles.infoCard}>
            <p style={styles.infoText}>
              Balls drop from the top every 10 seconds in Fibonacci batches
              (1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...) up to ~{totalBalls} balls total.
              Keep your eyes on as many balls as possible!
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={startGame} style={styles.startButton}>
                ▶ Start Game
              </button>
              <button onClick={toggleFullscreen} style={styles.fullscreenButton}>
                {isFullscreen ? '⊡ Exit Fullscreen' : '⛶ Fullscreen'}
              </button>
            </div>
          </div>
        )}

        {isRunning && (
          <div style={styles.statsBar}>
            <span style={styles.stat}>⏱ {elapsedTime}s</span>
            <span style={styles.stat}>🎱 Balls: {ballCount}</span>
            <span style={styles.stat}>
              Next batch in: {Math.max(0, Math.ceil((nextDropTimeRef.current - Date.now()) / 1000))}s
            </span>
            <button onClick={toggleFullscreen} style={styles.fullscreenBtnSmall}>
              {isFullscreen ? '⊡' : '⛶'}
            </button>
            <button onClick={stopGame} style={styles.stopButton}>
              ⏹ Stop
            </button>
          </div>
        )}

        {/* Canvas */}
        <div style={styles.canvasWrapper}>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
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
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    padding: '10px',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  header: {
    textAlign: 'center',
    position: 'relative',
    width: '100%',
    maxWidth: '900px',
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
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'white',
    marginBottom: '4px',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.95rem',
  },
  infoCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px 32px',
    maxWidth: '600px',
    textAlign: 'center',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  infoText: {
    fontSize: '0.95rem',
    color: '#555',
    lineHeight: '1.6',
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
  fullscreenButton: {
    background: 'linear-gradient(135deg, #1E5EFF 0%, #0B2A5B 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 30px',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(30, 94, 255, 0.3)',
  },
  fullscreenBtnSmall: {
    background: '#1E5EFF',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '14px',
    padding: '12px 24px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  stat: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#0B2A5B',
  },
  stopButton: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  canvasWrapper: {
    width: '100%',
    maxWidth: '1920px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    border: '3px solid rgba(255,255,255,0.3)',
    maxHeight: 'calc(100vh - 200px)',
  },
  canvas: {
    width: '100%',
    height: 'auto',
    maxHeight: 'calc(100vh - 200px)',
    display: 'block',
    background: '#ffffff',
    objectFit: 'contain',
  },
};

export default BallFocus;
