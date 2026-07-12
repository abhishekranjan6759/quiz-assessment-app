import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizProgress from '../components/QuizProgress';
import { selfImageQuestions } from '../data/questions';

const options = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
];

function SelfImageQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(selfImageQuestions.length).fill(null));
  const userName = location.state?.userName || '';

  const handleOptionChange = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < selfImageQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate('/results/self-image', { state: { answers, userName } });
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
        <QuizProgress current={currentQuestion} total={selfImageQuestions.length} />
        <div className="quiz-body">
          <div className="question-section">
            <h3 className="question-text">
              "{selfImageQuestions[currentQuestion].question}"
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
              <button className="nav-button" onClick={handleBack} disabled={currentQuestion === 0}>Back</button>
              <button className="nav-button" onClick={handleNext} disabled={!answers[currentQuestion]}>
                {currentQuestion === selfImageQuestions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelfImageQuiz;
