import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import UserName from './pages/UserName';
import SocialTypeQuiz from './pages/SocialTypeQuiz';
import SocialTypeResults from './pages/SocialTypeResults';
import LearningAgilityQuiz from './pages/LearningAgilityQuiz';
import LearningAgilityResults from './pages/LearningAgilityResults';
import VARKQuiz from './pages/VARKQuiz';
import VARKResults from './pages/VARKResults';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router basename="/quiz-assessment-app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/username/:quizType" element={<UserName />} />
        <Route path="/quiz/social-type" element={<SocialTypeQuiz />} />
        <Route path="/results/social-type" element={<SocialTypeResults />} />
        <Route path="/quiz/learning-agility" element={<LearningAgilityQuiz />} />
        <Route path="/results/learning-agility" element={<LearningAgilityResults />} />
        <Route path="/quiz/vark" element={<VARKQuiz />} />
        <Route path="/results/vark" element={<VARKResults />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;