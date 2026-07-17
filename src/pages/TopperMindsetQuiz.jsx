import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizProgress from '../components/QuizProgress';
import { topperMindsetQuestions } from '../data/questions';

function TopperMindsetQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(topperMindsetQuestions.length).fill(null));
  const userName = location.state?.userName || '';

  const handleOptionChange = (score) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < topperMindsetQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate('/results/topper-mindset', { state: { answers, userName } });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = topperMindsetQuestions[currentQuestion];

  return (
    <div className="app-container">
      <div className="quiz-container">
        <QuizProgress current={currentQuestion} total={topperMindsetQuestions.length} />
        <div className="quiz-body">
          <div className="question-section">
            <h3 className="question-text">{currentQ.question}</h3>
            <ul className="options-list">
              {currentQ.options.map((option, index) => (
                <li key={index} className="option-item" onClick={() => handleOptionChange(option.score)}>
                  <input type="radio" name={`question-${currentQuestion}`} checked={answers[currentQuestion] === option.score} onChange={() => handleOptionChange(option.score)} />
                  <span className="option-text">{option.text}</span>
                </li>
              ))}
            </ul>
            <div className="quiz-navigation">
              <button className="nav-button" onClick={handleBack} disabled={currentQuestion === 0}>Back</button>
              <button className="nav-button" onClick={handleNext} disabled={!answers[currentQuestion]}>
                {currentQuestion === topperMindsetQuestions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopperMindsetQuiz;
