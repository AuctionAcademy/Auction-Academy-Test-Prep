import { useState } from 'react';
import { states } from '../data/questionBank';
import './StateSelector.css';

function StateSelector({ onSelectState }) {
  const [selectedState, setSelectedState] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedState) {
      onSelectState(selectedState);
    }
  };

  return (
    <div className="state-selector-container">
      <div className="brand-header">
        <img src="/logo.png" alt="Auction Academy" className="brand-logo" />
        <h2>Auctioneer Exam Prep</h2>
        <p className="tagline">Master Your State Licensing Exam</p>
      </div>

      <div className="state-selector-card">
        <h3>Select Your State</h3>
        <p>Choose the state where you'll be taking your auctioneer licensing exam</p>
        
        <form onSubmit={handleSubmit}>
          <select 
            value={selectedState} 
            onChange={(e) => setSelectedState(e.target.value)}
            required
          >
            <option value="">-- Select a State --</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          
          <button type="submit" className="btn-primary">
            Start Learning
          </button>
        </form>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h4>Practice Tests</h4>
          <p>Full 75-question exams simulating the real licensing test</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h4>Topic Quizzes</h4>
          <p>Focus on specific sections and topics</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎴</div>
          <h4>Flashcards</h4>
          <p>Quick review with interactive flashcards</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎮</div>
          <h4>Study Games</h4>
          <p>Learn through fun and engaging activities</p>
        </div>
      </div>
    </div>
  );
}

export default StateSelector;
