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
import BrainDominanceQuiz from './pages/BrainDominanceQuiz';
import BrainDominanceResults from './pages/BrainDominanceResults';
import MotivationQuiz from './pages/MotivationQuiz';
import MotivationResults from './pages/MotivationResults';
import HappinessQuiz from './pages/HappinessQuiz';
import HappinessResults from './pages/HappinessResults';
import IQQuiz from './pages/IQQuiz';
import IQResults from './pages/IQResults';
import EQQuiz from './pages/EQQuiz';
import EQResults from './pages/EQResults';
import SpiritAnimalQuiz from './pages/SpiritAnimalQuiz';
import SpiritAnimalResults from './pages/SpiritAnimalResults';
import MoodCheckQuiz from './pages/MoodCheckQuiz';
import MoodCheckResults from './pages/MoodCheckResults';
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
        <Route path="/quiz/brain-dominance" element={<BrainDominanceQuiz />} />
        <Route path="/results/brain-dominance" element={<BrainDominanceResults />} />
        <Route path="/quiz/motivation" element={<MotivationQuiz />} />
        <Route path="/results/motivation" element={<MotivationResults />} />
        <Route path="/quiz/happiness" element={<HappinessQuiz />} />
        <Route path="/results/happiness" element={<HappinessResults />} />
        <Route path="/quiz/iq" element={<IQQuiz />} />
        <Route path="/results/iq" element={<IQResults />} />
        <Route path="/quiz/eq" element={<EQQuiz />} />
        <Route path="/results/eq" element={<EQResults />} />
        <Route path="/quiz/spirit-animal" element={<SpiritAnimalQuiz />} />
        <Route path="/results/spirit-animal" element={<SpiritAnimalResults />} />
        <Route path="/quiz/mood-check" element={<MoodCheckQuiz />} />
        <Route path="/results/mood-check" element={<MoodCheckResults />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;