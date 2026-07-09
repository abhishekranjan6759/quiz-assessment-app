import React from 'react';
import { useNavigate } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="home-container">
        <div className="home-content">
          <div className="home-left">
            <div className="profile-card">
  <div className="profile-header">Super Learner Academy</div>
  <div style={{ padding: '20px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img 
      src={`${import.meta.env.BASE_URL}Logo.png`}
      alt="Super Learner Academy Logo" 
      style={{ 
        width: '100%', 
        maxWidth: '280px',
        height: 'auto', 
        display: 'block',
        borderRadius: '10px'
      }}
    />
  </div>
</div>
          </div>

          <div className="home-right">
            <h1 className="quiz-title">Know Yourself Better</h1>
            <div className="quiz-buttons">
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/mood-check')}
              >
                🎭 Mood Check (How Ready Are You?)
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/inner-world')}
              >
                🌊 Inner World (What's on Your Mind?)
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/spirit-animal')}
              >
                🐾 Spirit Animal Personality
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/brain-dominance')}
              >
                🧠 Brain Dominance (Left/Right Brain)
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/vark')}
              >
                📚 VARK Know Your Learning Style
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/social-type')}
              >
                👥 Social Type
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/motivation')}
              >
                🎯 Motivation Type (Intrinsic/Extrinsic)
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/learning-agility')}
              >
                📈 Learning Agility
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/happiness')}
              >
                😊 Happiness & Well-being Check
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/eq')}
              >
                💡 EQ (Emotional Intelligence)
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/iq')}
              >
                🧩 IQ Assessment
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/about')}
              >
                About
              </button>
            </div>
            <div className="social-icons">
  <a 
    href="https://www.instagram.com/abhishek_ranjan_mnnit/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="social-icon-link"
  >
    <InstagramIcon className="social-icon" />
  </a>
  <a 
    href="https://www.youtube.com/@RanjanNotes" 
    target="_blank" 
    rel="noopener noreferrer"
    className="social-icon-link"
  >
    <YouTubeIcon className="social-icon" />
  </a>
  <a 
    href="https://www.facebook.com/Ranjan705" 
    target="_blank" 
    rel="noopener noreferrer"
    className="social-icon-link"
  >
    <FacebookIcon className="social-icon" />
  </a>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;