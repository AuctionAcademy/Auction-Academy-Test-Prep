import { useState, useEffect } from 'react';
import { getQuizQuestions } from '../data/questionBank';
import './Game.css';

function Game({ state, topic, onExit }) {
  const [gameState, setGameState] = useState('loading'); // loading, playing, paused, gameOver
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per question
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [blastingBubble, setBlastingBubble] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null); // { correct: bool, message: string }

  // Initialize game
  useEffect(() => {
    const gameQuestions = getQuizQuestions(state, 10, topic);
    if (gameQuestions.length > 0) {
      setQuestions(gameQuestions);
      setGameState('playing');
    }
  }, [state, topic]);

  // Load current question's answers when question changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      // Get 4-5 options (current question has 4, we'll use all of them)
      const answerOptions = question.options.map((opt, idx) => ({
        id: idx,
        text: opt,
        isCorrect: idx === question.correctAnswer,
        position: generateRandomPosition(idx)
      }));
      setCurrentAnswers(answerOptions);
      setTimeRemaining(60); // Reset timer for new question
      setShowFeedback(null);
    }
  }, [currentQuestionIndex, questions]);

  // Generate random positions for floating bubbles
  const generateRandomPosition = (index) => {
    const positions = [
      { top: '15%', left: '15%' },
      { top: '20%', right: '15%' },
      { top: '45%', left: '10%' },
      { top: '40%', right: '12%' },
      { top: '65%', left: '20%' },
    ];
    return positions[index % positions.length];
  };

  // Timer countdown for current question
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up for this question, move to next
          handleTimeUp();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentQuestionIndex]);

  const handleTimeUp = () => {
    // Move to next question or end game
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('gameOver');
    }
  };

  const handleBubbleClick = (answer) => {
    if (showFeedback) return; // Prevent clicking while feedback is showing

    setBlastingBubble(answer.id);

    setTimeout(() => {
      setBlastingBubble(null);
      
      if (answer.isCorrect) {
        // Correct answer!
        const timeBonus = Math.floor(timeRemaining * 2); // Up to 120 bonus points
        const totalPoints = 100 + timeBonus;
        setScore(prev => prev + totalPoints);
        setCorrectAnswers(prev => prev + 1);
        
        setShowFeedback({
          correct: true,
          message: `🚀 Direct Hit! +${totalPoints} points`
        });

        // Move to next question after showing feedback
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            setGameState('gameOver');
          }
        }, 1500);
      } else {
        // Wrong answer
        setShowFeedback({
          correct: false,
          message: '💥 Missed! Try again!'
        });

        // Clear feedback and allow another attempt
        setTimeout(() => {
          setShowFeedback(null);
        }, 1000);
      }
    }, 300);
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  if (gameState === 'loading' || questions.length === 0) {
    return (
      <div className="space-container">
        <div className="loading">🚀 Loading Space Mission...</div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

    return (
      <div className="space-container">
        <div className="game-over">
          <h2>🚀 Mission Complete!</h2>
          <div className="final-score">
            <div className="score-big">{score}</div>
            <div className="score-label">Final Score</div>
          </div>
          <div className="game-stats">
            <div className="stat">
              <div className="stat-value">{correctAnswers}/{questions.length}</div>
              <div className="stat-label">Targets Hit</div>
            </div>
            <div className="stat">
              <div className="stat-value">{accuracy}%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat">
              <div className="stat-value">{Math.round(score / (correctAnswers || 1))}</div>
              <div className="stat-label">Avg Points</div>
            </div>
          </div>
          <div className="game-actions">
            <button onClick={onExit} className="btn-primary">
              Return to Base
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-container">
      <div className="game-header">
        <div className="game-info">
          <h2>🚀 Space Shooter</h2>
          <p>{topic || 'All Topics'} - {state}</p>
        </div>
        <div className="header-controls">
          <button onClick={togglePause} className="btn-pause">
            {gameState === 'paused' ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button onClick={onExit} className="btn-exit">Exit</button>
        </div>
      </div>

      <div className="game-stats-bar">
        <div className="stat-item">
          <span className="stat-icon">⏱️</span>
          <span className={`timer ${timeRemaining <= 10 ? 'timer-warning' : ''}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🎯</span>
          <span>Score: {score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">✓</span>
          <span>Hits: {correctAnswers}</span>
        </div>
      </div>

      {gameState === 'paused' && (
        <div className="pause-overlay" onClick={togglePause}>
          <div className="pause-message">
            <h2>⏸️ Mission Paused</h2>
            <p>Click anywhere to continue</p>
          </div>
        </div>
      )}

      <div className="space-game-area">
        {/* Stars background effect */}
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>

        {/* Question display */}
        <div className="question-display">
          <div className="question-text">{currentQuestion.question}</div>
        </div>

        {/* Answer bubbles floating in space */}
        <div className="answer-bubbles">
          {currentAnswers.map((answer) => (
            <div
              key={answer.id}
              className={`bubble ${blastingBubble === answer.id ? 'blasting' : ''}`}
              style={answer.position}
              onClick={() => handleBubbleClick(answer)}
            >
              <div className="bubble-content">
                {answer.text}
              </div>
            </div>
          ))}
        </div>

        {/* Rocket ship at bottom */}
        <div className="rocket-ship">
          <div className="rocket-body">🚀</div>
          <div className="rocket-flame">🔥</div>
        </div>

        {/* Feedback message */}
        {showFeedback && (
          <div className={`feedback-message ${showFeedback.correct ? 'correct' : 'incorrect'}`}>
            {showFeedback.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
