import React, { useState, useCallback } from 'react';
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
  const [mode, setMode] = useState('levelSelect'); // levelSelect | start | sequential | random | complete
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomOrder, setRandomOrder] = useState([]);
  const [imageError, setImageError] = useState(false);

  const maxPeg = selectedLevel ? LEVELS.find(l => l.id === selectedLevel)?.pegs : 0;

  const getImageSrc = (pegNumber) => {
    return `${import.meta.env.BASE_URL}Peg system/Peg ${pegNumber}.png`;
  };

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
    setMode('start');
    setCurrentIndex(0);
    setImageError(false);
  };

  const handleStart = () => {
    setMode('sequential');
    setCurrentIndex(0);
    setImageError(false);
  };

  const handleNext = () => {
    if (currentIndex < maxPeg - 1) {
      setCurrentIndex(prev => prev + 1);
      setImageError(false);
    } else if (mode === 'sequential') {
      // Finished sequential, show random button
      setMode('randomReady');
    } else if (mode === 'random') {
      setMode('complete');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setImageError(false);
    }
  };

  const handleRandom = () => {
    const order = shuffleArray(Array.from({ length: maxPeg }, (_, i) => i + 1));
    setRandomOrder(order);
    setCurrentIndex(0);
    setMode('random');
    setImageError(false);
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setMode('levelSelect');
    setCurrentIndex(0);
    setRandomOrder([]);
    setImageError(false);
  };

  const handleRestart = () => {
    setMode('start');
    setCurrentIndex(0);
    setRandomOrder([]);
    setImageError(false);
  };

  const getCurrentPegNumber = () => {
    if (mode === 'random') {
      return randomOrder[currentIndex];
    }
    return currentIndex + 1;
  };

  const isLastImage = currentIndex >= maxPeg - 1;

  return (
    <div className="app-container">
      <div style={styles.pageContainer}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            ← Home
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
                Images will appear one by one in sequence. Take your time to memorize each peg association.
              </p>
              <button onClick={handleStart} style={styles.startButton}>
                Start
              </button>
              <button onClick={handleBackToLevels} style={styles.secondaryButton}>
                ← Back to Levels
              </button>
            </div>
          </div>
        )}

        {/* Image Viewer - Sequential & Random */}
        {(mode === 'sequential' || mode === 'random') && (
          <div style={styles.viewerContainer}>
            <div style={styles.viewerCard}>
              {/* Mode Badge */}
              <div style={styles.modeBadge}>
                {mode === 'sequential' ? '📖 Sequential' : '🎲 Random'}
              </div>

              {/* Progress */}
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

              {/* Peg Label */}
              <h2 style={styles.pegLabel}>Peg {getCurrentPegNumber()}</h2>

              {/* Image */}
              <div style={styles.imageWrapper}>
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

              {/* Navigation Controls */}
              <div style={styles.navControls}>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  style={{
                    ...styles.navButton,
                    opacity: currentIndex === 0 ? 0.4 : 1,
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Previous
                </button>

                {!isLastImage ? (
                  <button onClick={handleNext} style={styles.navButtonPrimary}>
                    Next →
                  </button>
                ) : mode === 'sequential' ? (
                  <button onClick={handleRandom} style={styles.randomButton}>
                    🎲 Random
                  </button>
                ) : (
                  <button onClick={() => setMode('complete')} style={styles.navButtonPrimary}>
                    Finish ✓
                  </button>
                )}
              </div>
            </div>

            <button onClick={handleBackToLevels} style={styles.backToLevelsBtn}>
              ← Back to Levels
            </button>
          </div>
        )}

        {/* Random Ready (after sequential completes) */}
        {mode === 'randomReady' && (
          <div style={styles.startContainer}>
            <div style={styles.startCard}>
              <span style={styles.startIcon}>🎉</span>
              <h2 style={styles.startTitle}>Sequential Complete!</h2>
              <p style={styles.startText}>
                You've viewed all {maxPeg} pegs in order.
              </p>
              <p style={styles.startDescription}>
                Now test your memory! Click Random to see the pegs in a shuffled order.
              </p>
              <button onClick={handleRandom} style={styles.randomButton}>
                🎲 Random
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
  // Level Selection
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
  levelIcon: {
    fontSize: '2rem',
  },
  levelLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#0B2A5B',
  },
  levelSubtitle: {
    fontSize: '0.9rem',
    color: '#666',
  },
  // Start Screen
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
  startIcon: {
    fontSize: '3rem',
  },
  startTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0B2A5B',
  },
  startText: {
    fontSize: '1.1rem',
    color: '#333',
    fontWeight: '600',
  },
  startDescription: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.5',
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
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(52, 168, 83, 0.4)',
    transition: 'transform 0.2s ease',
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
    transition: 'all 0.2s ease',
  },
  // Image Viewer
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
  progressText: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#555',
  },
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
  placeholderText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#999',
  },
  placeholderSub: {
    fontSize: '0.85rem',
    color: '#bbb',
  },
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
    transition: 'all 0.2s ease',
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
    transition: 'all 0.2s ease',
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
    transition: 'all 0.2s ease',
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
