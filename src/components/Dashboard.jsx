import { useState } from 'react';
import { topics } from '../data/questionBank';
import './Dashboard.css';

function Dashboard({ state, onChangeState, onStartTest, onStartQuiz, onStartFlashcards, onStartGame }) {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [quizSize, setQuizSize] = useState(10);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <img src="/logo.png" alt="Auction Academy" className="dashboard-logo" />
          <div className="state-info">
            <span className="state-label">Studying for:</span>
            <span className="state-name">{state}</span>
            <button onClick={onChangeState} className="btn-change-state">
              Change State
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to Your Study Dashboard</h2>
          <p>Choose your learning method and start preparing for your {state} auctioneer licensing exam</p>
        </div>

        <div className="study-modes-grid">
          {/* Full Practice Test */}
          <div className="study-mode-card primary-card">
            <div className="card-icon">📝</div>
            <h3>Full Practice Test</h3>
            <p>Take a complete 75-question exam simulating the real licensing test</p>
            <button 
              onClick={() => onStartTest(75)} 
              className="btn-mode btn-primary"
            >
              Start Practice Test
            </button>
          </div>

          {/* Topic Quiz */}
          <div className="study-mode-card">
            <div className="card-icon">🎯</div>
            <h3>Topic Quiz</h3>
            <p>Focus on specific sections to strengthen your knowledge</p>
            
            <div className="quiz-options">
              <select 
                value={selectedTopic} 
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="topic-select"
              >
                <option value="">All Topics</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>

              <select 
                value={quizSize} 
                onChange={(e) => setQuizSize(Number(e.target.value))}
                className="size-select"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            <button 
              onClick={() => onStartQuiz(selectedTopic, quizSize)} 
              className="btn-mode"
            >
              Start Quiz
            </button>
          </div>

          {/* Flashcards */}
          <div className="study-mode-card">
            <div className="card-icon">🎴</div>
            <h3>Flashcards</h3>
            <p>Quick review with interactive flashcards for efficient studying</p>
            
            <div className="quiz-options">
              <select 
                value={selectedTopic} 
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="topic-select"
              >
                <option value="">All Topics</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => onStartFlashcards(selectedTopic)} 
              className="btn-mode"
            >
              Start Flashcards
            </button>
          </div>

          {/* Study Games */}
          <div className="study-mode-card">
            <div className="card-icon">🎮</div>
            <h3>Study Games</h3>
            <p>Learn through fun matching games and challenges</p>
            
            <div className="quiz-options">
              <select 
                value={selectedTopic} 
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="topic-select"
              >
                <option value="">All Topics</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => onStartGame(selectedTopic)} 
              className="btn-mode"
            >
              Play Game
            </button>
          </div>
        </div>

        {/* Topics Overview */}
        <div className="topics-section">
          <h3>Topics Covered</h3>
          <div className="topics-grid">
            {topics.map(topic => (
              <div key={topic} className="topic-badge">
                {topic}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
