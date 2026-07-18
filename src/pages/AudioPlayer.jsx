import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AUDIO_TRACKS = [
  {
    title: '852 Hz Reset The Mind',
    description: 'A powerful frequency to clear mental fog and restore clarity.',
    file: '852 Hz Reset The Mind.mp3',
    icon: '🧘',
    color: '#6A3DE8',
  },
  {
    title: 'This Sound Will Reset Your Brain',
    description: 'Deep reset audio to calm your nervous system and improve focus.',
    file: 'This sound will reset your brain 1.mp3',
    icon: '🧠',
    color: '#1E5EFF',
  },
];

function AudioPlayer() {
  const navigate = useNavigate();
  const [playingIndex, setPlayingIndex] = useState(null);
  const audioRefs = useRef([]);

  const handlePlay = (idx) => {
    // Pause all others
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== idx) {
        audio.pause();
      }
    });
    setPlayingIndex(idx);
  };

  const handlePause = () => {
    setPlayingIndex(null);
  };

  const handleEnded = () => {
    setPlayingIndex(null);
  };

  return (
    <div className="app-container">
      <div style={styles.pageContainer}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            ← Home
          </button>
          <h1 style={styles.title}>🎧 Reset Your Brain</h1>
          <p style={styles.subtitle}>
            Listen to these audio tracks to reset and recharge your mind
          </p>
        </div>

        {/* Audio Cards */}
        <div style={styles.cardsContainer}>
          {AUDIO_TRACKS.map((track, idx) => (
            <div key={idx} style={styles.audioCard}>
              <div style={{ ...styles.cardHeader, background: track.color }}>
                <span style={styles.cardIcon}>{track.icon}</span>
                <h2 style={styles.cardTitle}>{track.title}</h2>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.cardDescription}>{track.description}</p>
                <audio
                  ref={(el) => (audioRefs.current[idx] = el)}
                  src={`${import.meta.env.BASE_URL}ResetYourBrainAudio/${track.file}`}
                  onPlay={() => handlePlay(idx)}
                  onPause={handlePause}
                  onEnded={handleEnded}
                  controls
                  style={styles.audioElement}
                />
                {playingIndex === idx && (
                  <div style={styles.nowPlaying}>
                    <span style={styles.pulsingDot} />
                    Now Playing
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div style={styles.tipsCard}>
          <h3 style={styles.tipsTitle}>💡 Tips for best experience</h3>
          <ul style={styles.tipsList}>
            <li>Use headphones for maximum effect</li>
            <li>Find a quiet, comfortable place</li>
            <li>Close your eyes and breathe deeply</li>
            <li>Listen for at least 5 minutes</li>
          </ul>
        </div>
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
    gap: '28px',
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
    color: 'rgba(255,255,255,0.85)',
    fontSize: '1rem',
  },
  cardsContainer: {
    width: '100%',
    maxWidth: '650px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  audioCard: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  },
  cardHeader: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  cardIcon: {
    fontSize: '2rem',
  },
  cardTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'white',
  },
  cardBody: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  cardDescription: {
    fontSize: '0.95rem',
    color: '#555',
    lineHeight: '1.5',
  },
  audioElement: {
    width: '100%',
    borderRadius: '8px',
    outline: 'none',
  },
  nowPlaying: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#34A853',
  },
  pulsingDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#34A853',
    animation: 'pulse 1.2s infinite',
  },
  tipsCard: {
    background: 'rgba(255,255,255,0.12)',
    borderRadius: '16px',
    padding: '24px 28px',
    maxWidth: '650px',
    width: '100%',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  tipsTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '12px',
  },
  tipsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.9rem',
  },
};

export default AudioPlayer;
