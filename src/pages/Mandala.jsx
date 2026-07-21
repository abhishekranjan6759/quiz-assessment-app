import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const COLOR_THEMES = [
  { name: 'Cosmic', colors: ['#6A3DE8', '#9B59B6', '#3498DB', '#1ABC9C', '#E74C3C'] },
  { name: 'Sunset', colors: ['#FF6B00', '#FFC107', '#E74C3C', '#FF8C00', '#FF1493'] },
  { name: 'Ocean', colors: ['#0077B6', '#00B4D8', '#90E0EF', '#48CAE4', '#023E8A'] },
  { name: 'Forest', colors: ['#2D6A4F', '#40916C', '#52B788', '#95D5B2', '#1B4332'] },
  { name: 'Aurora', colors: ['#7400B8', '#6930C3', '#5390D9', '#48BFE3', '#56CFE1'] },
  { name: 'Lotus', colors: ['#FF69B4', '#DA70D6', '#BA55D3', '#9370DB', '#8B008B'] },
];

function Mandala() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const currentTheme = COLOR_THEMES[themeIndex];

  // Auto-change theme every 30 seconds during session
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setThemeIndex(prev => (prev + 1) % COLOR_THEMES.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Session timer
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

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

  const startSession = () => {
    setIsPlaying(true);
    setSessionTime(0);
    audioRef.current?.play();
  };

  const stopSession = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
    clearInterval(timerRef.current);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      <style>{`
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
        @keyframes breathe { 0%,100% { transform: scale(0.95); } 50% { transform: scale(1.05); } }
        @keyframes colorShift {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(60deg); }
          100% { filter: hue-rotate(0deg); }
        }
        .mandala-container { position: relative; width: 500px; height: 500px; max-width: 90vw; max-height: 90vw; }
        .mandala-layer {
          position: absolute; top: 50%; left: 50%;
          transform-origin: center center;
          border-radius: 50%;
        }
        .layer-1 { animation: spinSlow 40s linear infinite, colorShift 30s ease-in-out infinite; }
        .layer-2 { animation: spinReverse 30s linear infinite; }
        .layer-3 { animation: spinSlow 20s linear infinite; }
        .layer-4 { animation: spinReverse 50s linear infinite, breathe 6s ease-in-out infinite; }
        .layer-5 { animation: pulse 4s ease-in-out infinite; }
        .mandala-paused .mandala-layer { animation-play-state: paused; }
      `}</style>

      <div ref={containerRef} style={{
        ...styles.pageContainer,
        ...(isFullscreen ? styles.fullscreenContainer : {}),
        background: isPlaying
          ? `radial-gradient(ellipse at center, ${currentTheme.colors[4]}22 0%, #0B2A5B 100%)`
          : 'linear-gradient(135deg, #0B2A5B 0%, #1E5EFF 100%)',
        transition: 'background 2s ease',
      }}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/')} style={styles.backButton}>← Home</button>
          <button onClick={toggleFullscreen} style={styles.fsButton}>
            {isFullscreen ? '⊡ Exit' : '⛶ Fullscreen'}
          </button>
          <h1 style={styles.title}>🕉️ Mandala Meditation</h1>
          <p style={styles.subtitle}>Gaze at the mandala, breathe deeply, and let your mind be still</p>
        </div>

        {/* Audio */}
        <audio ref={audioRef} loop
          src={`${import.meta.env.BASE_URL}Mandala/Inspiration (Music for Meditation, Relaxation and Inspiration).mp3`}
        />

        {/* Controls */}
        {!isPlaying && (
          <div style={styles.card}>
            <p style={styles.infoText}>
              Focus on the center of the spinning mandala. Let the colors and motion calm your mind.
              The mandala will evolve through different color themes during your session.
            </p>
            <button onClick={startSession} style={styles.startBtn}>🕉️ Start Session</button>
          </div>
        )}

        {isPlaying && (
          <div style={styles.sessionBar}>
            <span style={styles.stat}>⏱ {formatTime(sessionTime)}</span>
            <span style={styles.stat}>🎨 {currentTheme.name}</span>
            <button onClick={() => setThemeIndex(p => (p + 1) % COLOR_THEMES.length)} style={styles.themeBtn}>
              🎨 Next Theme
            </button>
            <button onClick={stopSession} style={styles.stopBtn}>⏹ End Session</button>
          </div>
        )}

        {/* Mandala SVG */}
        <div className={`mandala-container ${!isPlaying ? 'mandala-paused' : ''}`}>
          {/* Layer 1 - Outer petals */}
          <svg className="mandala-layer layer-1" style={{ width: '100%', height: '100%', marginLeft: '-50%', marginTop: '-50%' }} viewBox="0 0 400 400">
            {Array.from({ length: 12 }, (_, i) => (
              <ellipse key={i} cx="200" cy="200" rx="180" ry="60"
                fill="none" stroke={currentTheme.colors[0]} strokeWidth="2" opacity="0.6"
                transform={`rotate(${i * 30} 200 200)`}
                style={{ transition: 'stroke 2s ease' }} />
            ))}
          </svg>

          {/* Layer 2 - Inner petals */}
          <svg className="mandala-layer layer-2" style={{ width: '75%', height: '75%', marginLeft: '-37.5%', marginTop: '-37.5%' }} viewBox="0 0 400 400">
            {Array.from({ length: 8 }, (_, i) => (
              <path key={i}
                d={`M200,200 Q${200 + 80 * Math.cos(i * Math.PI / 4)},${200 + 80 * Math.sin(i * Math.PI / 4)} ${200 + 140 * Math.cos((i + 0.5) * Math.PI / 4)},${200 + 140 * Math.sin((i + 0.5) * Math.PI / 4)}`}
                fill="none" stroke={currentTheme.colors[1]} strokeWidth="2.5" opacity="0.7"
                style={{ transition: 'stroke 2s ease' }} />
            ))}
            {Array.from({ length: 16 }, (_, i) => (
              <circle key={`c${i}`} cx={200 + 120 * Math.cos(i * Math.PI / 8)} cy={200 + 120 * Math.sin(i * Math.PI / 8)}
                r="8" fill={currentTheme.colors[2]} opacity="0.5"
                style={{ transition: 'fill 2s ease' }} />
            ))}
          </svg>

          {/* Layer 3 - Geometric pattern */}
          <svg className="mandala-layer layer-3" style={{ width: '55%', height: '55%', marginLeft: '-27.5%', marginTop: '-27.5%' }} viewBox="0 0 400 400">
            {Array.from({ length: 6 }, (_, i) => (
              <polygon key={i}
                points={`200,80 ${200 + 40 * Math.cos(i * Math.PI / 3)},${200 + 40 * Math.sin(i * Math.PI / 3)} 200,320 ${200 - 40 * Math.cos(i * Math.PI / 3)},${200 - 40 * Math.sin(i * Math.PI / 3)}`}
                fill="none" stroke={currentTheme.colors[3]} strokeWidth="1.5" opacity="0.6"
                transform={`rotate(${i * 30} 200 200)`}
                style={{ transition: 'stroke 2s ease' }} />
            ))}
          </svg>

          {/* Layer 4 - Diamond ring */}
          <svg className="mandala-layer layer-4" style={{ width: '40%', height: '40%', marginLeft: '-20%', marginTop: '-20%' }} viewBox="0 0 400 400">
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const x = 200 + 80 * Math.cos(angle);
              const y = 200 + 80 * Math.sin(angle);
              return (
                <rect key={i} x={x - 10} y={y - 10} width="20" height="20"
                  fill={currentTheme.colors[4]} opacity="0.6"
                  transform={`rotate(${i * 30} ${x} ${y})`}
                  style={{ transition: 'fill 2s ease' }} />
              );
            })}
            <circle cx="200" cy="200" r="50" fill="none" stroke={currentTheme.colors[0]} strokeWidth="2" opacity="0.4"
              style={{ transition: 'stroke 2s ease' }} />
          </svg>

          {/* Layer 5 - Center */}
          <svg className="mandala-layer layer-5" style={{ width: '20%', height: '20%', marginLeft: '-10%', marginTop: '-10%' }} viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="80" fill={currentTheme.colors[2]} opacity="0.3"
              style={{ transition: 'fill 2s ease' }} />
            <circle cx="200" cy="200" r="40" fill={currentTheme.colors[0]} opacity="0.5"
              style={{ transition: 'fill 2s ease' }} />
            <circle cx="200" cy="200" r="15" fill="white" opacity="0.9" />
          </svg>
        </div>

        {/* Breathing guide */}
        {isPlaying && (
          <p style={styles.breatheText}>Breathe in... hold... breathe out...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh', padding: '20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '20px', transition: 'background 2s ease',
  },
  fullscreenContainer: {
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh', zIndex: 9999,
    padding: '20px', overflow: 'hidden',
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center', position: 'relative', width: '100%', maxWidth: '700px',
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
  card: {
    background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '28px',
    maxWidth: '500px', width: '100%', textAlign: 'center',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center',
  },
  infoText: { fontSize: '0.9rem', color: '#555', lineHeight: '1.6' },
  startBtn: {
    background: 'linear-gradient(135deg, #6A3DE8, #9B59B6)', color: 'white',
    border: 'none', padding: '16px 40px', borderRadius: '30px',
    fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(106,61,232,0.4)',
  },
  sessionBar: {
    display: 'flex', alignItems: 'center', gap: '14px',
    background: 'rgba(0,0,0,0.4)', borderRadius: '14px',
    padding: '10px 20px', backdropFilter: 'blur(10px)',
    flexWrap: 'wrap', justifyContent: 'center',
  },
  stat: { fontSize: '0.9rem', fontWeight: '600', color: 'white' },
  themeBtn: {
    background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '20px',
    fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
  },
  stopBtn: {
    background: '#e74c3c', color: 'white', border: 'none',
    padding: '8px 18px', borderRadius: '20px',
    fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
  },
  breatheText: {
    color: 'rgba(255,255,255,0.7)', fontSize: '1rem',
    fontStyle: 'italic', animation: 'pulse 6s ease-in-out infinite',
  },
};

export default Mandala;
