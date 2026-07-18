import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AUDIO_TRACKS = [
  {
    title: 'A Ten Minute Guided Meditation',
    description: 'A calming guided meditation to center your mind and boost clarity.',
    file: 'A Ten Minute Guided Meditation.mp3',
    icon: '🧘',
    color: '#34A853',
  },
  {
    title: 'Rewire Your Brain with Neuroplasticity',
    description: 'Harness the power of neuroplasticity to reshape your thought patterns.',
    file: 'REWIRE YOUR BRAIN with NEUROPLASTICITY.mp3',
    icon: '🔄',
    color: '#1E5EFF',
  },
  {
    title: 'NLP Bubble Exercise',
    description: 'A powerful NLP technique for transforming your self-image permanently.',
    file: 'NLP Bubble-Exercise-Audio.mp3',
    icon: '🫧',
    color: '#6A3DE8',
    hasBubbleGuide: true,
  },
];

function NLP() {
  const navigate = useNavigate();
  const [playingIndex, setPlayingIndex] = useState(null);
  const [showBubbleGuide, setShowBubbleGuide] = useState(false);
  const audioRefs = useRef([]);

  const handlePlay = (idx) => {
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== idx) audio.pause();
    });
    setPlayingIndex(idx);
  };

  const handlePause = () => setPlayingIndex(null);
  const handleEnded = () => setPlayingIndex(null);

  return (
    <div className="app-container">
      <div style={styles.pageContainer}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            ← Home
          </button>
          <h1 style={styles.title}>🧠 NLP: Positive Affirmation</h1>
          <p style={styles.subtitle}>
            Transform your self-image with guided audio exercises
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
                  src={`${import.meta.env.BASE_URL}Possitive Affirmation/${track.file}`}
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
                {track.hasBubbleGuide && (
                  <button
                    onClick={() => setShowBubbleGuide(!showBubbleGuide)}
                    style={styles.guideToggle}
                  >
                    {showBubbleGuide ? '▲ Hide' : '▼ Read'} Bubble Exercise Guide
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bubble Exercise Guide */}
        {showBubbleGuide && (
          <div style={styles.guideCard}>
            <h2 style={styles.guideTitle}>🫧 The Bubble Exercise – Step By Step</h2>

            <div style={styles.guideIntro}>
              <p>For transforming your self-image, you will have to avoid or give up some behavior and acquire some desirable behavior. Here is how the Bubble Exercise works:</p>
            </div>

            <div style={styles.step}>
              <div style={styles.stepBadge}>Step 1</div>
              <p>Imagine that you are sitting comfortably inside a huge bubble (just like a soap bubble) that is very friendly and likeable in every respect. You are feeling totally relaxed. There is a friendly window in this bubble and fresh cool air is coming in through this window.</p>
            </div>

            <div style={styles.step}>
              <div style={styles.stepBadge}>Step 2</div>
              <p>Now imagine that there is <strong>'another you'</strong> standing on a huge platform outside this bubble.</p>
              <p>Think of all the changes and improvements that you desire to make in your own self. Create a movie in your imagination where all these changes are taking place in the life of the 'other you'.</p>
              <div style={styles.examples}>
                <p><strong>Examples:</strong></p>
                <ul>
                  <li>If you feel fearful in a crowd → imagine the 'other you' is absolutely fearless and resourceful even in a big crowd</li>
                  <li>If you feel low and unenergetic → imagine the 'other you' is very confident and creating tremendous success</li>
                  <li>If you face health issues → see the 'other you' as strong, having overcome health challenges</li>
                </ul>
              </div>
            </div>

            <div style={styles.step}>
              <div style={styles.stepBadge}>Step 3</div>
              <p>Give yourself the three <strong>'VAK' NLP commands</strong>:</p>
              <ul style={styles.vakList}>
                <li><strong>👁️ SEE</strong> what the 'other you' would be SEEING</li>
                <li><strong>👂 HEAR</strong> what the 'other you' would be HEARING and what compliments they receive</li>
                <li><strong>✋ FEEL</strong> what the 'other you' would be FEELING — enhanced confidence, higher energy, better health</li>
              </ul>
              <p>Give yourself time to be comfortable with what you see, hear and feel. Create a very strong and powerful image of the 'other you'.</p>
            </div>

            <div style={styles.step}>
              <div style={styles.stepBadge}>Step 4</div>
              <p>Let the movie be complete. See your changed version — the 'other you' walking towards you. Both looking into each other's eyes.</p>
              <p>Start walking slowly towards the 'other you'. See the 'other you' slowly enter your bubble. Embrace each other lovingly. With affection, both entities integrate into one 'you'.</p>
              <p><strong>Both persons become one — you now carry all the attributes of the 'other you'!</strong></p>
            </div>

            <div style={styles.resultsBox}>
              <h3 style={styles.resultsTitle}>✨ Results</h3>
              <p>After finishing this exercise, you will have a wonderful feeling. Your face will glow with joy and there will be marked improvement in your physiology.</p>
              <p>The Bubble Exercise can help get rid of certain allergies and diseases, enhance confidence, and solve many other problems. Improvements can be seen almost instantaneously.</p>
            </div>

            <div style={styles.tipsBox}>
              <h3 style={styles.tipsTitle}>🔑 How to get optimum results</h3>
              <ol style={styles.tipsList}>
                <li>Do the exercise <strong>once a day for minimum 7 days</strong> for permanent self-image transformation.</li>
                <li>You must have an <strong>honest intention</strong> to totally transform your self-image.</li>
                <li>Follow up with <strong>concrete action</strong> on a consistent basis in your day-to-day living.</li>
              </ol>
            </div>

            <div style={styles.advantageBox}>
              <h3 style={styles.advantageTitle}>💡 Distinct Advantage</h3>
              <p>Unlike regular visualization where your Conscious Mind may resist ("You DON'T have that!"), in the Bubble Exercise your Conscious Mind <strong>cannot object</strong> because it is "the other you" who has achieved it — not you directly. This bypasses mental resistance completely.</p>
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
  cardIcon: { fontSize: '2rem' },
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
  guideToggle: {
    background: 'linear-gradient(135deg, #6A3DE8 0%, #9B59B6 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  // Bubble Guide styles
  guideCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '36px 30px',
    width: '100%',
    maxWidth: '750px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  guideTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#0B2A5B',
    textAlign: 'center',
  },
  guideIntro: {
    fontSize: '0.95rem',
    color: '#444',
    lineHeight: '1.6',
    background: '#f8f0ff',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #e8d5f5',
  },
  step: {
    background: '#fafafa',
    borderRadius: '14px',
    padding: '20px',
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '0.95rem',
    color: '#444',
    lineHeight: '1.6',
  },
  stepBadge: {
    background: 'linear-gradient(135deg, #6A3DE8, #9B59B6)',
    color: 'white',
    padding: '4px 14px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  examples: {
    background: '#f0f7ff',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #d0e4ff',
    fontSize: '0.9rem',
  },
  vakList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  resultsBox: {
    background: '#f0fff4',
    borderRadius: '14px',
    padding: '20px',
    border: '1px solid #c6f6d5',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '0.95rem',
    color: '#2d6a4f',
    lineHeight: '1.6',
  },
  resultsTitle: {
    fontWeight: '700',
    fontSize: '1.05rem',
    color: '#1b5e20',
  },
  tipsBox: {
    background: '#fff8e1',
    borderRadius: '14px',
    padding: '20px',
    border: '1px solid #ffe082',
    fontSize: '0.95rem',
    color: '#5d4037',
    lineHeight: '1.6',
  },
  tipsTitle: {
    fontWeight: '700',
    fontSize: '1.05rem',
    color: '#e65100',
    marginBottom: '10px',
  },
  tipsList: {
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  advantageBox: {
    background: '#e8f4fd',
    borderRadius: '14px',
    padding: '20px',
    border: '1px solid #b3e0ff',
    fontSize: '0.95rem',
    color: '#0d47a1',
    lineHeight: '1.6',
  },
  advantageTitle: {
    fontWeight: '700',
    fontSize: '1.05rem',
    color: '#1565c0',
    marginBottom: '8px',
  },
};

export default NLP;
