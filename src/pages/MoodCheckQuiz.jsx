import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizProgress from '../components/QuizProgress';
import { moodCheckQuestions } from '../data/questions';

function MoodCheckQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [scaleValue, setScaleValue] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || '';

  const currentQ = moodCheckQuestions[currentQuestion];
  const isScaleQuestion = currentQ.type === 'scale';

  const handleAnswerChange = (mood) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = mood;
    setAnswers(newAnswers);
  };

  const handleScaleSelect = (num) => {
    setScaleValue(num);
    // Map number to mood using scaleMapping
    const mapping = currentQ.scaleMapping.find(
      (m) => num >= m.range[0] && num <= m.range[1]
    );
    if (mapping) {
      handleAnswerChange(mapping.mood);
    }
  };

  const handleNext = () => {
    if (currentQuestion < moodCheckQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setScaleValue(null);
    } else {
      navigate('/results/mood-check', { state: { answers, userName } });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setScaleValue(null);
    }
  };

  return (
    <div className="app-container">
      <div className="quiz-container">
        <QuizProgress current={currentQuestion} total={moodCheckQuestions.length} />
        <div className="quiz-body">
          <div className="question-section">
            <h3 className="question-text">
              {currentQ.question}
            </h3>

            {isScaleQuestion ? (
              /* Horizontal 1-10 Number Scale */
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '600px',
                  margin: '0 auto',
                  flexWrap: 'wrap'
                }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleScaleSelect(num)}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: scaleValue === num ? '3px solid #FF6B00' : '2px solid white',
                        background: scaleValue === num ? '#FF6B00' : 'white',
                        color: scaleValue === num ? 'white' : '#0B2A5B',
                        fontSize: '18px',
                        fontWeight: 700,
                        fontFamily: 'Montserrat',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: scaleValue === num
                          ? '0 4px 12px rgba(255, 107, 0, 0.4)'
                          : '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  maxWidth: '600px',
                  margin: '12px auto 0',
                  padding: '0 8px'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Low Energy</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>High Energy</span>
                </div>
              </div>
            ) : (
              /* Regular options */
              <ul className="options-list">
                {currentQ.options.map((option, index) => (
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
            )}

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
