import { useState, useEffect } from 'react';
import { getQuizQuestions } from '../data/questionBank';
import './Game.css';

function Game({ state, topic, onExit }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    const gameQuestions = getQuizQuestions(state, topic, 15);
    setQuestions(gameQuestions);
    if (gameQuestions.length > 0) {
      loadNextQuestion(gameQuestions, 0);
    }
  }, [state, topic]);

  const loadNextQuestion = (questionList, index) => {
    if (index >= questionList.length) {
      // Game over
      setCurrentQuestion(null);
      return;
    }

    const question = questionList[index];
    setCurrentQuestion(question);
    
    // Shuffle options
    const shuffledOptions = question.options.map((opt, idx) => ({
      text: opt,
      index: idx
    })).sort(() => Math.random() - 0.5);
    
    setOptions(shuffledOptions);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  const handleAnswer = (optionIndex) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    setFeedback({
      isCorrect,
      explanation: currentQuestion.explanation
    });

    if (isCorrect) {
      setScore(score + 10);
      setStreak(streak + 1);
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1);
      }
    } else {
      setStreak(0);
    }

    setQuestionsAnswered(questionsAnswered + 1);

    // Auto advance after 2 seconds
    setTimeout(() => {
      loadNextQuestion(questions, questionsAnswered + 1);
    }, 2000);
  };

  if (questions.length === 0) {
    return (
      <div className="game-container">
        <div className="loading">Loading game...</div>
      </div>
    );
  }

  if (!currentQuestion) {
    // Game over screen
    const totalQuestions = questions.length;
    const percentage = ((score / (totalQuestions * 10)) * 100).toFixed(0);

    return (
      <div className="game-container">
        <div className="game-over">
          <h2>🎮 Game Over!</h2>
          <div className="final-score">
            <div className="score-big">{score}</div>
            <div className="score-label">Final Score</div>
          </div>
          <div className="game-stats">
            <div className="stat">
              <div className="stat-value">{percentage}%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat">
              <div className="stat-value">{questionsAnswered}</div>
              <div className="stat-label">Questions</div>
            </div>
            <div className="stat">
              <div className="stat-value">{bestStreak}</div>
              <div className="stat-label">Best Streak</div>
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

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-info">
          <h2>🎮 Study Game</h2>
          <p>{topic || 'All Topics'}</p>
        </div>
        <button onClick={onExit} className="btn-exit">Exit</button>
      </div>

      <div className="game-stats-bar">
        <div className="stat-item">
          <span className="stat-icon">🎯</span>
          <span>Score: {score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📝</span>
          <span>{questionsAnswered + 1}/{questions.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔥</span>
          <span>Streak: {streak}</span>
        </div>
      </div>

      <div className="game-content">
        <div className="game-topic">{currentQuestion.topic}</div>
        
        <div className="game-question">
          {currentQuestion.question}
        </div>

        <div className="game-options">
          {options.map((option, idx) => {
            let className = 'game-option';
            
            if (selectedAnswer !== null) {
              if (option.index === currentQuestion.correctAnswer) {
                className += ' correct';
              } else if (option.index === selectedAnswer) {
                className += ' incorrect';
              } else {
                className += ' disabled';
              }
            }

            return (
              <button
                key={idx}
                className={className}
                onClick={() => handleAnswer(option.index)}
                disabled={selectedAnswer !== null}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className={`game-feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="feedback-header">
              {feedback.isCorrect ? (
                <>
                  <span className="feedback-icon">✓</span>
                  <span>Correct! +10 points</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">✗</span>
                  <span>Incorrect</span>
                </>
              )}
            </div>
            <div className="feedback-explanation">
              {feedback.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
