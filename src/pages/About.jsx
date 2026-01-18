import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="about-container">
        <div className="about-content">
          <h1>About These Quizzes</h1>
          
          <h2>Learning Agility Quiz</h2>
          <p>
            Learning agility is the ability and willingness to learn from experience and apply 
            that learning to perform successfully under new or first-time conditions. This quiz 
            helps you understand your capacity to adapt, grow, and thrive in changing environments.
          </p>
          <p>
            The assessment evaluates your approach to:
          </p>
          <ul>
            <li>Embracing new ideas and taking calculated risks</li>
            <li>Seeking feedback and learning opportunities</li>
            <li>Self-reflection and continuous improvement</li>
            <li>Collaboration across diverse teams</li>
            <li>Adapting to change and uncertainty</li>
          </ul>

          <h2>Social Type Quiz</h2>
          <p>
            The Social Type assessment helps identify your behavioral style and communication 
            preferences. Understanding your social type can improve your relationships, teamwork, 
            and professional interactions.
          </p>
          <p>
            The four social types are:
          </p>
          <ul>
            <li><strong>Amiable:</strong> Cooperative, supportive, and relationship-focused</li>
            <li><strong>Driver:</strong> Assertive, results-oriented, and decisive</li>
            <li><strong>Analytical:</strong> Detail-oriented, systematic, and precise</li>
            <li><strong>Expressive:</strong> Enthusiastic, creative, and people-oriented</li>
          </ul>

          <h2>VARK Learning Style Quiz</h2>
          <p>
            VARK stands for Visual, Auditory, Reading/Writing, and Kinesthetic learning preferences. 
            This model helps you understand how you prefer to receive and process information.
          </p>
          <p>
            The four learning styles are:
          </p>
          <ul>
            <li><strong>Visual:</strong> Learn best through pictures, diagrams, and visual aids</li>
            <li><strong>Auditory:</strong> Learn best through listening and verbal instruction</li>
            <li><strong>Reading/Writing:</strong> Learn best through written words and text</li>
            <li><strong>Kinesthetic:</strong> Learn best through hands-on experience and practice</li>
          </ul>

          <h2>How to Use Your Results</h2>
          <p>
            After completing each quiz, you'll receive a detailed breakdown of your results in 
            the form of a pie chart. You can download your results as an image to keep for 
            reference or share with others. Use these insights to:
          </p>
          <ul>
            <li>Better understand your strengths and areas for development</li>
            <li>Improve communication with colleagues and friends</li>
            <li>Tailor your learning approach for maximum effectiveness</li>
            <li>Make informed decisions about your career and personal growth</li>
          </ul>

          <button className="back-home-button" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;