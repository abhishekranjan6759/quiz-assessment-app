import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LEVELS = [
  { id: 1, label: 'Level 1', pegs: 10, subtitle: 'Peg 1 – Peg 10' },
  { id: 2, label: 'Level 2', pegs: 20, subtitle: 'Peg 1 – Peg 20' },
  { id: 3, label: 'Level 3', pegs: 30, subtitle: 'Peg 1 – Peg 30' },
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function PegSystem() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [mode, setMode] = useState('levelSelect');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomOrder, setRandomOrder] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [flipDirection, setFlipDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  // Canvas mode: images fill up a grid on full screen
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'canvas'
  const [canvasRevealedCount, setCanvasRevealedCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const maxPeg = selectedLevel ? LEVELS.find(l => l.id === selectedLevel)?.pegs : 0;

  // Fullscreen handlers
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const getImageSrc = (pegNumber) => {
    return `${import.meta.env.BASE_URL}Peg system/Peg ${pegNumber}.png`;
  };

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
    setMode('start');
    setCurrentIndex(0);
    setImageError(false);
    setCanvasRevealedCount(0);
  };

  const handleStart = () => {
    setMode('sequential');
    setCurrentIndex(0);
    setImageError(false);
    setFlipDirection('');
    setCanvasRevealedCount(viewMode === 'canvas' ? 1 : 0);
  };

  const animateTransition = (direction, callback) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFlipDirection(direction);
    setTimeout(() => {
      callback();
      setImageError(false);
      setFlipDirection('');
      setIsAnimating(false);
    }, 500);
  };

  const handleNext = () => {
    if (viewMode === 'canvas') {
      if (canvasRevealedCount < maxPeg) {
        setCanvasRevealedCount(prev => prev + 1);
      }
      return;
    }
    if (currentIndex < maxPeg - 1) {
      animateTransition('flip-next', () => {
        setCurrentIndex(prev => prev + 1);
      });
    }
  };

  const handlePrev = () => {
    if (viewMode === 'canvas') {
      if (canvasRevealedCount > 1) {
        setCanvasRevealedCount(prev => prev - 1);
      }
      return;
    }
    if (currentIndex > 0) {
      animateTransition('flip-prev', () => {
        setCurrentIndex(prev => prev - 1);
      });
    }
  };

  const handleRandom = () => {
    const order = shuffleArray(Array.from({ length: maxPeg }, (_, i) => i + 1));
    setRandomOrder(order);
    setCurrentIndex(0);
    setMode('random');
    setImageError(false);
    setFlipDirection('');
    setCanvasRevealedCount(viewMode === 'canvas' ? 1 : 0);
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setMode('levelSelect');
    setCurrentIndex(0);
    setRandomOrder([]);
    setImageError(false);
    setFlipDirection('');
    setViewMode('single');
    setCanvasRevealedCount(0);
  };

  const handleRestart = () => {
    setMode('start');
    setCurrentIndex(0);
    setRandomOrder([]);
    setImageError(false);
    setFlipDirection('');
    setCanvasRevealedCount(0);
  };

  const getCurrentPegNumber = () => {
    if (mode === 'random') return randomOrder[currentIndex];
    return currentIndex + 1;
  };

  const getCanvasPegNumber = (idx) => {
    if (mode === 'random') return randomOrder[idx];
    return idx + 1;
  };

  const isLastImage = viewMode === 'canvas'
    ? canvasRevealedCount >= maxPeg
    : currentIndex >= maxPeg - 1;

  // Grid config based on level
  const getGridCols = () => {
    if (maxPeg <= 10) return 5;  // 2 rows x 5 cols
    if (maxPeg <= 20) return 5;  // 4 rows x 5 cols
    return 6;                    // 5 rows x 6 cols
  };

  // ============ RENDER ============
  return (
    <div className="app-container">
      <style>{`
        @keyframes flipNext {
          0% { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
          50% { transform: perspective(1200px) rotateY(-90deg); opacity: 0.3; }
          100% { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
        }
        @keyframes flipPrev {
          0% { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
          50% { transform: perspective(1200px) rotateY(90deg); opacity: 0.3; }
          100% { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0.3); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .flip-next { animation: flipNext 0.5s ease-in-out; }
        .flip-prev { animation: flipPrev 0.5s ease-in-out; }
        .peg-image-card { transform-style: preserve-3d; backface-visibility: hidden; }
        .canvas-item { animation: popIn 0.4s ease-out forwards; }
        .canvas-grid {
          display: grid;
          gap: 10px;
          padding: 20px;
          width: 100%;
          max-width: 1920px;
          margin: 0 auto;
        }
        .canvas-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .canvas-cell img {
          width: 100%;
          aspect-ratio: 1/1;
          object-fit: contain;
          border-radius: 8px;
          border: 2px solid #e0e0e0;
          background: #f8f9fa;
        }
        .canvas-cell-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #0B2A5B;
          text-align: center;
        }
      `}</style>

      <div ref={containerRef} style={{
        ...styles.pageContainer,
        ...(isFullscreen ? styles.fullscreenContainer : {}),
      }}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            ← Home
          </button>
          <button onClick={toggleFullscreen} style={styles.fullscreenBtn}>
            {isFullscreen ? '⊡ Exit' : '⛶ Fullscreen'}
          </button>
          <h1 style={styles.title}>🧠 Peg System</h1>
          <p style={styles.subtitle}>Memory Training with Visual Pegs</p>
        </div>

        {/* Level Selection */}
        {mode === 'levelSelect' && (
          <div style={styles.levelContainer}>
            <h2 style={styles.sectionTitle}>Choose Your Level</h2>
            <div style={styles.levelGrid}>
              {LEVELS.map((level) => (
                <button
                  key={level.id}
                  style={styles.levelButton}
                  onClick={() => handleLevelSelect(level.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(30, 94, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <span style={styles.levelIcon}>
                    {level.id === 1 ? '🌱' : level.id === 2 ? '🌿' : '🌳'}
                  </span>
                  <span style={styles.levelLabel}>{level.label}</span>
                  <span style={styles.levelSubtitle}>{level.subtitle}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Screen */}
        {mode === 'start' && (
          <div style={styles.startContainer}>
            <div style={styles.startCard}>
              <span style={styles.startIcon}>🚀</span>
              <h2 style={styles.startTitle}>Ready to Begin?</h2>
              <p style={styles.startText}>
                Level {selectedLevel} — Peg 1 to Peg {maxPeg}
              </p>
              <p style={styles.startDescription}>
                Click Next to reveal pegs one by one.
              </p>

              {/* View mode toggle */}
              <div style={styles.viewToggle}>
                <button
                  onClick={() => setViewMode('single')}
                  style={viewMode === 'single' ? styles.toggleActive : styles.toggleInactive}
                >
                  🖼️ Single View
                </button>
                <button
                  onClick={() => setViewMode('canvas')}
                  style={viewMode === 'canvas' ? styles.toggleActive : styles.toggleInactive}
                >
                  📋 Full Canvas
                </button>
              </div>

              <button onClick={handleStart} style={styles.startButton}>
                Start
              </button>
              <button onClick={handleBackToLevels} style={styles.secondaryButton}>
                ← Back to Levels
              </button>
            </div>
          </div>
        )}

        {/* ============ CANVAS VIEW ============ */}
        {(mode === 'sequential' || mode === 'random') && viewMode === 'canvas' && (
          <div style={{ width: '100%', maxWidth: '1920px' }}>
            {/* Controls bar */}
            <div style={styles.canvasControls}>
              <div style={styles.modeBadge}>
                {mode === 'sequential' ? '📖 Sequential' : '🎲 Random'}
              </div>
              <div style={styles.progressText}>
                {canvasRevealedCount} / {maxPeg}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={handlePrev}
                  disabled={canvasRevealedCount <= 1}
                  style={{
                    ...styles.navButton,
                    opacity: canvasRevealedCount <= 1 ? 0.4 : 1,
                    cursor: canvasRevealedCount <= 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Remove Last
                </button>
                {!isLastImage ? (
                  <button onClick={handleNext} style={styles.navButtonPrimary}>
                    Next →
                  </button>
                ) : (
                  <button onClick={handleRandom} style={styles.randomButton}>
                    🎲 Random
                  </button>
                )}
              </div>
            </div>

            {/* Grid of images */}
            <div
              className="canvas-grid"
              style={{ gridTemplateColumns: `repeat(${getGridCols()}, 1fr)` }}
            >
              {Array.from({ length: canvasRevealedCount }, (_, idx) => {
                const pegNum = getCanvasPegNumber(idx);
                return (
                  <div key={`${mode}-${idx}`} className="canvas-cell canvas-item">
                    <span className="canvas-cell-label">{pegNum}.</span>
                    <img
                      src={getImageSrc(pegNum)}
                      alt={`Peg ${pegNum}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button onClick={handleBackToLevels} style={styles.backToLevelsBtn}>
                ← Back to Levels
              </button>
            </div>
          </div>
        )}

        {/* ============ SINGLE VIEW ============ */}
        {(mode === 'sequential' || mode === 'random') && viewMode === 'single' && (
          <div style={styles.viewerContainer}>
            <div style={styles.viewerCard}>
              <div style={styles.modeBadge}>
                {mode === 'sequential' ? '📖 Sequential' : '🎲 Random'}
              </div>

              <div style={styles.progressContainer}>
                <div style={styles.progressText}>
                  {currentIndex + 1} / {maxPeg}
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${((currentIndex + 1) / maxPeg) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <h2 style={styles.pegLabel}>Peg {getCurrentPegNumber()}</h2>

              <div
                className={`peg-image-card ${flipDirection}`}
                style={styles.imageWrapper}
              >
                {!imageError ? (
                  <img
                    src={getImageSrc(getCurrentPegNumber())}
                    alt={`Peg ${getCurrentPegNumber()}`}
                    style={styles.pegImage}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div style={styles.placeholder}>
                    <span style={styles.placeholderText}>Peg {getCurrentPegNumber()}</span>
                    <span style={styles.placeholderSub}>Image not available</span>
                  </div>
                )}
              </div>

              <div style={styles.navControls}>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0 || isAnimating}
                  style={{
                    ...styles.navButton,
                    opacity: currentIndex === 0 ? 0.4 : 1,
                    cursor: currentIndex === 0 || isAnimating ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Previous
                </button>
                {!isLastImage ? (
                  <button
                    onClick={handleNext}
                    disabled={isAnimating}
                    style={{ ...styles.navButtonPrimary, cursor: isAnimating ? 'not-allowed' : 'pointer' }}
                  >
                    Next →
                  </button>
                ) : (
                  <button onClick={handleRandom} style={styles.randomButton}>
                    🎲 Random
                  </button>
                )}
              </div>
            </div>
            <button onClick={handleBackToLevels} style={styles.backToLevelsBtn}>
              ← Back to Levels
            </button>
          </div>
        )}

        {/* Complete Screen */}
        {mode === 'complete' && (
          <div style={styles.startContainer}>
            <div style={styles.startCard}>
              <span style={styles.startIcon}>🏆</span>
              <h2 style={styles.startTitle}>Well Done!</h2>
              <p style={styles.startText}>
                You've completed Level {selectedLevel} — all {maxPeg} pegs!
              </p>
              <button onClick={handleRandom} style={styles.randomButton}>
                🎲 Try Random Again
              </button>
              <button onClick={handleRestart} style={styles.secondaryButton}>
                🔄 Restart Sequential
              </button>
              <button onClick={handleBackToLevels} style={styles.secondaryButton}>
                ← Back to Levels
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
    gap: '30px',
    background: 'linear-gradient(135deg, #0B2A5B 0%, #1E5EFF 100%)',
  },
  fullscreenContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    padding: '20px',
    overflow: 'auto',
  },
  fullscreenBtn: {
    position: 'absolute',
    right: 0,
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
  levelContainer: {
    width: '100%',
    maxWidth: '700px',
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '24px',
  },
  levelGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
  },
  levelButton: {
    width: '100%',
    maxWidth: '400px',
    background: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '24px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
  },
  levelIcon: { fontSize: '2rem' },
  levelLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#0B2A5B',
  },
  levelSubtitle: { fontSize: '0.9rem', color: '#666' },
  startContainer: {
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    justifyContent: 'center',
  },
  startCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px 30px',
    textAlign: 'center',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
  },
  startIcon: { fontSize: '3rem' },
  startTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0B2A5B',
  },
  startText: { fontSize: '1.1rem', color: '#333', fontWeight: '600' },
  startDescription: { fontSize: '0.95rem', color: '#666', lineHeight: '1.5' },
  startButton: {
    background: 'linear-gradient(135deg, #34A853 0%, #27ae60 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 40px',
    borderRadius: '30px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(52, 168, 83, 0.4)',
  },
  secondaryButton: {
    background: 'transparent',
    border: '2px solid #ddd',
    color: '#666',
    padding: '10px 24px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  viewToggle: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  toggleActive: {
    background: 'linear-gradient(135deg, #1E5EFF 0%, #0B2A5B 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  toggleInactive: {
    background: '#f0f0f0',
    color: '#555',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  // Canvas controls
  canvasControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '16px',
    padding: '16px 24px',
    marginBottom: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  // Single view
  viewerContainer: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  viewerCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '30px',
    width: '100%',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  modeBadge: {
    background: 'linear-gradient(135deg, #6A3DE8 0%, #9B59B6 100%)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  progressText: { fontSize: '0.95rem', fontWeight: '600', color: '#555' },
  progressBar: {
    width: '100%',
    height: '6px',
    background: '#e9ecef',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #1E5EFF, #6A3DE8)',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  },
  pegLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#0B2A5B',
  },
  imageWrapper: {
    width: '100%',
    maxWidth: '500px',
    aspectRatio: '1 / 1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#f8f9fa',
    border: '3px solid #e9ecef',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
  },
  pegImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '12px',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    height: '100%',
    background: '#f0f0f0',
  },
  placeholderText: { fontSize: '1.5rem', fontWeight: '700', color: '#999' },
  placeholderSub: { fontSize: '0.85rem', color: '#bbb' },
  navControls: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  navButton: {
    background: '#f0f0f0',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#555',
    cursor: 'pointer',
  },
  navButtonPrimary: {
    background: 'linear-gradient(135deg, #1E5EFF 0%, #0B2A5B 100%)',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(30, 94, 255, 0.3)',
  },
  randomButton: {
    background: 'linear-gradient(135deg, #FF6B00 0%, #FFC107 100%)',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: '700',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(255, 107, 0, 0.4)',
  },
  backToLevelsBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
  },
};

export default PegSystem;
