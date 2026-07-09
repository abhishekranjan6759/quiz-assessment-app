import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizProgress from '../components/QuizProgress';
import { motivationQuestions } from '../data/questions';

function MotivationQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || '';

  const handleAnswerChange = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < motivationQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate('/results/motivation', { state: { answers, userName } });
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
        <QuizProgress current={currentQuestion} total={motivationQuestions.length} />
        <div className="quiz-body">
          <div className="question-section">
            <h3 className="question-text">
              {motivationQuestions[currentQuestion].question}
            </h3>
            <ul className="options-list">
              {motivationQuestions[currentQuestion].options.map((option, index) => (
                <li
                  key={index}
                  className="option-item"
                  onClick={() => handleAnswerChange(index)}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswerChange(index)}
                  />
                  <span className="option-text">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
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
                disabled={answers[currentQuestion] === undefined}
              >
                {currentQuestion === motivationQuestions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotivationQuiz;
