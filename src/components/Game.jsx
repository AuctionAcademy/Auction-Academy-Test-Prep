import { useState, useEffect, useRef } from 'react';
import { getQuizQuestions } from '../data/questionBank';
import './Game.css';

function Game({ state, topic, onExit }) {
  const [gameState, setGameState] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rocketAngle, setRocketAngle] = useState(0);
  const [laserShot, setLaserShot] = useState(null); // { start, end, active }
  const [bubbles, setBubbles] = useState([]);
  const gameAreaRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize game
  useEffect(() => {
    const gameQuestions = getQuizQuestions(state, 10, topic);
    if (gameQuestions.length > 0) {
      setQuestions(gameQuestions);
      setGameState('playing');
    }
  }, [state, topic]);

  // Initialize bubbles for current question
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      const newBubbles = question.options.map((opt, idx) => ({
        id: idx,
        text: opt,
        isCorrect: idx === question.correctAnswer,
        x: Math.random() * 60 + 20, // 20-80% of width
        y: Math.random() * 40 + 10, // 10-50% of height
        vx: (Math.random() - 0.5) * 1, // velocity x (reduced for readability)
        vy: (Math.random() - 0.5) * 1, // velocity y (reduced for readability)
        radius: 80, // collision radius in pixels
        removed: false
      }));
      setBubbles(newBubbles);
      setTimeRemaining(60);
      setShowFeedback(null);
      setLaserShot(null);
    }
  }, [currentQuestionIndex, questions]);

  // Mouse tracking for rocket aim
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (gameAreaRef.current && gameState === 'playing') {
        const rect = gameAreaRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameState]);

  // Calculate rocket rotation to point at mouse
  useEffect(() => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const rocketX = rect.width / 2;
      const rocketY = rect.height - 80; // Rocket position at bottom
      
      const dx = mousePosition.x - rocketX;
      const dy = mousePosition.y - rocketY;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Clamp angle to -90 to +90 degrees (left to right only, no full rotation)
      angle = Math.max(-90, Math.min(90, angle));
      
      setRocketAngle(angle + 90); // +90 to adjust for rocket facing up by default
    }
  }, [mousePosition]);

  // Physics animation loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const animate = () => {
      setBubbles(prevBubbles => {
        return prevBubbles.map(bubble => {
          if (bubble.removed) return bubble;

          let { x, y, vx, vy } = bubble;

          // Update position
          x += vx * 0.5;
          y += vy * 0.5;

          // Bounce off walls
          if (x <= 5 || x >= 95) {
            vx = -vx;
            x = x <= 5 ? 5 : 95;
          }
          if (y <= 5 || y >= 65) { // Keep away from bottom where rocket is
            vy = -vy;
            y = y <= 5 ? 5 : 65;
          }

          return { ...bubble, x, y, vx, vy };
        });
      });

      // Check bubble-to-bubble collisions
      setBubbles(prevBubbles => {
        const newBubbles = [...prevBubbles];
        for (let i = 0; i < newBubbles.length; i++) {
          for (let j = i + 1; j < newBubbles.length; j++) {
            if (newBubbles[i].removed || newBubbles[j].removed) continue;

            const dx = newBubbles[j].x - newBubbles[i].x;
            const dy = newBubbles[j].y - newBubbles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = 18; // Minimum distance between bubble centers (in %)

            if (distance < minDistance) {
              // Collision detected - bounce off each other
              const angle = Math.atan2(dy, dx);
              const targetX = newBubbles[i].x + Math.cos(angle) * minDistance;
              const targetY = newBubbles[i].y + Math.sin(angle) * minDistance;

              // Separate bubbles
              const ax = targetX - newBubbles[j].x;
              const ay = targetY - newBubbles[j].y;
              
              newBubbles[i].vx -= ax * 0.1;
              newBubbles[i].vy -= ay * 0.1;
              newBubbles[j].vx += ax * 0.1;
              newBubbles[j].vy += ay * 0.1;
            }
          }
        }
        return newBubbles;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentQuestionIndex]);

  const handleTimeUp = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('gameOver');
    }
  };

  const handleBubbleClick = (bubble) => {
    if (showFeedback || bubble.removed) return;

    // Calculate laser shot path
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const rocketX = rect.width / 2;
      const rocketY = rect.height - 80;
      const bubbleX = (bubble.x / 100) * rect.width;
      const bubbleY = (bubble.y / 100) * rect.height;

      setLaserShot({
        start: { x: rocketX, y: rocketY },
        end: { x: bubbleX, y: bubbleY },
        active: true
      });

      // Clear laser after animation
      setTimeout(() => setLaserShot(null), 300);
    }

    // Mark bubble as removed
    setBubbles(prev => prev.map(b => 
      b.id === bubble.id ? { ...b, removed: true } : b
    ));

    setTimeout(() => {
      if (bubble.isCorrect) {
        const timeBonus = Math.floor(timeRemaining * 2);
        const totalPoints = 100 + timeBonus;
        setScore(prev => prev + totalPoints);
        setCorrectAnswers(prev => prev + 1);
        
        setShowFeedback({
          correct: true,
          message: `🚀 Direct Hit! +${totalPoints} points`
        });

        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            setGameState('gameOver');
          }
        }, 1500);
      } else {
        setShowFeedback({
          correct: false,
          message: '💥 Missed! Try again!'
        });

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

      {/* Question Section - Separate from play area */}
      <div className="game-question-section">
        <div className="question-text">{currentQuestion.question}</div>
      </div>

      {gameState === 'paused' && (
        <div className="pause-overlay" onClick={togglePause}>
          <div className="pause-message">
            <h2>⏸️ Mission Paused</h2>
            <p>Click anywhere to continue</p>
          </div>
        </div>
      )}

      <div className="space-game-area" ref={gameAreaRef}>
        {/* Stars background */}
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>

        {/* Bouncing answer bubbles */}
        <div className="answer-bubbles">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className={`bubble ${bubble.removed ? 'removed' : ''}`}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                transition: 'opacity 0.3s',
              }}
              onClick={() => handleBubbleClick(bubble)}
            >
              <div className="bubble-content">
                {bubble.text}
              </div>
            </div>
          ))}
        </div>

        {/* Laser shot animation */}
        {laserShot && laserShot.active && (
          <svg className="laser-svg">
            <line
              x1={laserShot.start.x}
              y1={laserShot.start.y}
              x2={laserShot.end.x}
              y2={laserShot.end.y}
              className="laser-beam"
            />
          </svg>
        )}

        {/* Rocket ship - rotates to follow mouse */}
        <div 
          className="rocket-ship" 
          style={{ 
            transform: `translate(-50%, -50%) rotate(${rocketAngle}deg)`
          }}
        >
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
