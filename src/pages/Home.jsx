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
  <div className="profile-header">Ranjan Notes</div>
  <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
    <img 
      src={`${import.meta.env.BASE_URL}profile.jpg`}
      alt="Profile" 
      style={{ 
        width: '100%', 
        height: 'auto', 
        display: 'block',
        borderRadius: '10px'
      }}
    />
  </div>
</div>
          </div>

          <div className="home-right">
            <h1 className="quiz-title">Quiz Link</h1>
            <div className="quiz-buttons">
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/learning-agility')}
              >
                Learning Agility
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/social-type')}
              >
                Social Type
              </button>
              <button 
                className="quiz-button"
                onClick={() => navigate('/username/vark')}
              >
                VARK Know Your Learning Style
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