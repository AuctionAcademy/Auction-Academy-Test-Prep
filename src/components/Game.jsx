import { useState, useEffect, useCallback } from 'react';
import { getQuizQuestions } from '../data/questionBank';
import './Game.css';

function Game({ state, topic, onExit }) {
  const [gameState, setGameState] = useState('loading'); // loading, playing, paused, gameOver
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [incorrectPairs, setIncorrectPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  // Initialize game
  useEffect(() => {
    const gameQuestions = getQuizQuestions(state, 8, topic); // Use 8 questions for matching
    if (gameQuestions.length > 0) {
      const questionsList = gameQuestions.map((q, idx) => ({
        id: idx,
        text: q.question,
        topic: q.topic,
        correctAnswerId: idx
      }));
      
      const answersList = gameQuestions.map((q, idx) => ({
        id: idx,
        text: q.options[q.correctAnswer],
        explanation: q.explanation
      }));
      
      // Shuffle answers to make it challenging
      const shuffledAnswers = [...answersList].sort(() => Math.random() - 0.5);
      
      setQuestions(questionsList);
      setAnswers(shuffledAnswers);
      setGameState('playing');
    }
  }, [state, topic]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Check if game is complete
  useEffect(() => {
    if (gameState === 'playing' && matchedPairs.length === questions.length && questions.length > 0) {
      setGameState('gameOver');
    }
  }, [matchedPairs, questions, gameState]);

  const handleQuestionClick = (questionId) => {
    if (matchedPairs.includes(questionId)) return;
    
    if (selectedQuestion === questionId) {
      setSelectedQuestion(null);
    } else {
      setSelectedQuestion(questionId);
      
      // If an answer is already selected, try to match
      if (selectedAnswer !== null) {
        checkMatch(questionId, selectedAnswer);
      }
    }
  };

  const handleAnswerClick = (answerId) => {
    if (matchedPairs.includes(answerId)) return;
    
    if (selectedAnswer === answerId) {
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(answerId);
      
      // If a question is already selected, try to match
      if (selectedQuestion !== null) {
        checkMatch(selectedQuestion, answerId);
      }
    }
  };

  const checkMatch = (questionId, answerId) => {
    const question = questions.find(q => q.id === questionId);
    
    if (question && question.correctAnswerId === answerId) {
      // Correct match!
      setMatchedPairs([...matchedPairs, questionId]);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > bestCombo) {
        setBestCombo(newCombo);
      }
      
      // Calculate points: base + time bonus + combo bonus
      const basePoints = 100;
      const timeBonus = Math.floor(timeRemaining / 2); // Up to 30 bonus points
      const comboBonus = newCombo * 10;
      const totalPoints = basePoints + timeBonus + comboBonus;
      
      setScore(score + totalPoints);
      
      // Clear selections
      setSelectedQuestion(null);
      setSelectedAnswer(null);
    } else {
      // Incorrect match
      setIncorrectPairs([...incorrectPairs, { questionId, answerId }]);
      setCombo(0);
      
      // Flash red and clear after delay
      setTimeout(() => {
        setIncorrectPairs([]);
        setSelectedQuestion(null);
        setSelectedAnswer(null);
      }, 800);
    }
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  if (gameState === 'loading' || questions.length === 0) {
    return (
      <div className="game-container">
        <div className="loading">Loading matching game...</div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    const totalPossibleScore = questions.length * 100 + 30 * questions.length; // Base + max time bonus
    const percentage = questions.length > 0 ? Math.round((score / totalPossibleScore) * 100) : 0;

    return (
      <div className="game-container">
        <div className="game-over">
          <h2>⏰ Time's Up!</h2>
          <div className="final-score">
            <div className="score-big">{score}</div>
            <div className="score-label">Final Score</div>
          </div>
          <div className="game-stats">
            <div className="stat">
              <div className="stat-value">{matchedPairs.length}/{questions.length}</div>
              <div className="stat-label">Matched</div>
            </div>
            <div className="stat">
              <div className="stat-value">{percentage}%</div>
              <div className="stat-label">Efficiency</div>
            </div>
            <div className="stat">
              <div className="stat-value">{bestCombo}</div>
              <div className="stat-label">Best Combo</div>
            </div>
          </div>
          <div className="game-actions">
            <button onClick={onExit} className="btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-info">
          <h2>🎮 Matching Game</h2>
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
          <span className="stat-icon">✓</span>
          <span>{matchedPairs.length}/{questions.length} Matched</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔥</span>
          <span>Combo: {combo}</span>
        </div>
      </div>

      {gameState === 'paused' && (
        <div className="pause-overlay" onClick={togglePause}>
          <div className="pause-message">
            <h2>⏸️ Paused</h2>
            <p>Click anywhere to continue</p>
          </div>
        </div>
      )}

      <div className="game-content">
        <div className="instructions">
          <p>💡 Click a question, then click its matching answer!</p>
        </div>

        <div className="matching-grid">
          {/* Questions Column */}
          <div className="questions-column">
            <h3 className="column-header">Questions</h3>
            {questions.map((question) => {
              const isMatched = matchedPairs.includes(question.id);
              const isSelected = selectedQuestion === question.id;
              const isIncorrect = incorrectPairs.some(p => p.questionId === question.id);
              
              return (
                <div
                  key={question.id}
                  className={`match-item question-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                  onClick={() => !isMatched && handleQuestionClick(question.id)}
                >
                  <div className="match-number">{question.id + 1}</div>
                  <div className="match-text">{question.text}</div>
                  {isMatched && <div className="check-mark">✓</div>}
                </div>
              );
            })}
          </div>

          {/* Answers Column */}
          <div className="answers-column">
            <h3 className="column-header">Answers</h3>
            {answers.map((answer) => {
              const isMatched = matchedPairs.includes(answer.id);
              const isSelected = selectedAnswer === answer.id;
              const isIncorrect = incorrectPairs.some(p => p.answerId === answer.id);
              
              return (
                <div
                  key={answer.id}
                  className={`match-item answer-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                  onClick={() => !isMatched && handleAnswerClick(answer.id)}
                >
                  <div className="match-text">{answer.text}</div>
                  {isMatched && <div className="check-mark">✓</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
