import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import all your components
import FirstPage from './components/FirstPage.jsx'; // Your renamed component
import FlashCards from './components/FlashCards.jsx';
import QuizPage from './components/QuizPage.jsx';

import './App.css'; 



function App() {
  return (
    <Router>
      <div className="App">
        
        {/* Navigation Bar */}
        <nav className="navbar" style={{ padding: '10px 20px', background: '#333', color: 'white' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '20px' }}>
            <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Store Home</Link></li>
            <li><Link to="/flashcards" style={{ color: 'white', textDecoration: 'none' }}>Flashcards</Link></li>
            <li><Link to="/quiz" style={{ color: 'white', textDecoration: 'none' }}>Quiz</Link></li>
          </ul>
        </nav>

        {/* The main content area where components will be rendered */}
        <main style={{ padding: '20px' }}>
          <Routes>
            {/* Renders your FirstPage (Store) on the root path */}
            <Route path="/" element={<FirstPage />} /> 
            <Route path="/flashcards" element={<FlashCards />} />
            <Route path="/quiz" element={<QuizPage />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;