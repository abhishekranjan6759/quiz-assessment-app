import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizProgress from '../components/QuizProgress';
import { fomoQuestions } from '../data/questions';

const options = [
  'Not at all true of me',
  'Slightly true',
  'Moderately true',
  'Very true',
  'Extremely true of me',
];

function FOMOQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(fomoQuestions.length).fill(null));
  const userName = location.state?.userName || '';

  const handleOptionChange = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < fomoQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate('/results/fomo', { state: { answers, userName } });
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
        <QuizProgress current={currentQuestion} total={fomoQuestions.length} />
        <div className="quiz-body">
          <div className="question-section">
            <h3 className="question-text">
              "{fomoQuestions[currentQuestion]}"
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
                {currentQuestion === fomoQuestions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FOMOQuiz;
