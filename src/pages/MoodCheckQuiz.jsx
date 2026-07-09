import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizProgress from '../components/QuizProgress';
import { moodCheckQuestions } from '../data/questions';

function MoodCheckQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || '';

  const handleAnswerChange = (mood) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = mood;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < moodCheckQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate('/results/mood-check', { state: { answers, userName } });
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
        <QuizProgress current={currentQuestion} total={moodCheckQuestions.length} />
        <div className="quiz-body">
          <div className="question-section">
            <h3 className="question-text">
              {moodCheckQuestions[currentQuestion].question}
            </h3>
            <ul className="options-list">
              {moodCheckQuestions[currentQuestion].options.map((option, index) => (
                <li
                  key={index}
                  className="option-item"
                  onClick={() => handleAnswerChange(option.mood)}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={answers[currentQuestion] === option.mood}
                    onChange={() => handleAnswerChange(option.mood)}
                  />
                  <span className="option-text">{option.text}</span>
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
                {currentQuestion === moodCheckQuestions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoodCheckQuiz;
