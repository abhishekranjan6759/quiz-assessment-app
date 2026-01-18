import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UserName() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { quizType } = useParams();

  const quizTitles = {
    'learning-agility': 'Learning Agility Quiz',
    'social-type': 'Social Type Quiz',
    'vark': 'VARK Learning Style Quiz'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const routes = {
        'learning-agility': '/quiz/learning-agility',
        'social-type': '/quiz/social-type',
        'vark': '/quiz/vark'
      };
      navigate(routes[quizType], { state: { userName: name.trim() } });
    }
  };

  return (
    <div className="app-container">
      <div className="username-container">
        <div className="username-card">
          <h2>{quizTitles[quizType]}</h2>
          <form onSubmit={handleSubmit} className="username-form">
            <div className="form-group">
              <label htmlFor="name">What's your name?</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Start Quiz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserName;