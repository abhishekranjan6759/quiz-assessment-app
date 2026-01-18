import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizProgress from '../components/QuizProgress';
import { socialTypeQuestions } from '../data/questions';

function SocialTypeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || '';

  const handleOptionChange = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < socialTypeQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate('/results/social-type', { state: { answers, userName } });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="app-container">
      <div className="quiz-container">
        <QuizProgress current={currentQuestion} total={socialTypeQuestions.length} />
        <div className="quiz-body">
          <div className="question-section">
            <h3 className="question-text">
              {socialTypeQuestions[currentQuestion].question}
              <br/>
              <span style={{ fontSize: '18px', fontStyle: 'italic' }}>
                Choose one word that describes you best
              </span>
            </h3>
            <ul className="options-list">
              {socialTypeQuestions[currentQuestion].options.map((option, index) => (
                <li 
                  key={index} 
                  className="option-item"
                  onClick={() => handleOptionChange(option)}
                >
                  <input
                    type="checkbox"
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleOptionChange(option)}
                  />
                  <span className="option-text">{option}</span>
                </li>
              ))}
            </ul>
            <div className="quiz-navigation">
              <button 
                className="nav-button" 
                onClick={handleBack} 
                disabled={currentQuestion === 0}
              >
                Back
              </button>
              <button 
                className="nav-button" 
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
              >
                {currentQuestion === socialTypeQuestions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialTypeQuiz;