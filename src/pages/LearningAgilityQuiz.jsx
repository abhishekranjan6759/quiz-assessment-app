import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizProgress from '../components/QuizProgress';
import { learningAgilityQuestions } from '../data/questions';

const options = [
  'Rarely or never',
  'Occasionally',
  'Sometimes',
  'Often',
  'Always',
];

function LearningAgilityQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(learningAgilityQuestions.length).fill(null));
  const userName = location.state?.userName || '';

  const handleOptionChange = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < learningAgilityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate('/results/learning-agility', { state: { answers, userName } });
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
        <QuizProgress current={currentQuestion} total={learningAgilityQuestions.length} />
        <div className="quiz-body">
          <div className="question-section">
            <h3 className="question-text">
              {learningAgilityQuestions[currentQuestion]}
            </h3>
            <ul className="options-list">
              {options.map((option, index) => (
                <li 
                  key={index} 
                  className="option-item"
                  onClick={() => handleOptionChange(option)}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
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
                {currentQuestion === learningAgilityQuestions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningAgilityQuiz;