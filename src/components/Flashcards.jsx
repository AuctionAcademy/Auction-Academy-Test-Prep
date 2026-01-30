import { useState, useEffect } from 'react';
import { getQuizQuestions } from '../data/questionBank';
import './Flashcards.css';

function Flashcards({ state, topic, onExit }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState([]);

  useEffect(() => {
    const cards = getQuizQuestions(state, 20, topic);
    setQuestions(cards);
  }, [state, topic]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkKnown = () => {
    if (!knownCards.includes(currentIndex)) {
      setKnownCards([...knownCards, currentIndex]);
    }
    handleNext();
  };

  if (questions.length === 0) {
    return (
      <div className="flashcards-container">
        <div className="loading">Loading flashcards...</div>
      </div>
    );
  }

  const currentCard = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <div className="header-info">
          <h2>🎴 Flashcards</h2>
          <p>{topic || 'All Topics'} - {state}</p>
        </div>
        <button onClick={onExit} className="btn-exit">Exit</button>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flashcard-stats">
        <span>Card {currentIndex + 1} of {questions.length}</span>
        <span>Known: {knownCards.length}</span>
      </div>

      <div className="flashcard-wrapper">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="flashcard-front">
            <div className="card-label">Question</div>
            <div className="card-topic">{currentCard.topic}</div>
            <div className="card-content">{currentCard.question}</div>
            {currentCard.options && currentCard.options.length > 0 && (
              <div className="card-options">
                {currentCard.options.map((option, idx) => (
                  <div key={idx} className="card-option">
                    {String.fromCharCode(65 + idx)}. {option}
                  </div>
                ))}
              </div>
            )}
            <div className="card-hint">Click to see answer</div>
          </div>
          
          <div className="flashcard-back">
            <div className="card-label">Answer</div>
            <div className="card-content answer">
              {currentCard.options[currentCard.correctAnswer]}
            </div>
            <div className="card-explanation">
              <strong>Explanation:</strong><br/>
              {currentCard.explanation}
            </div>
            <div className="card-hint">Click to go back</div>
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="btn-control"
        >
          ← Previous
        </button>

        <button 
          onClick={handleMarkKnown}
          className="btn-control btn-known"
          disabled={knownCards.includes(currentIndex)}
        >
          {knownCards.includes(currentIndex) ? '✓ Known' : 'I Know This'}
        </button>

        <button 
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="btn-control"
        >
          Next →
        </button>
      </div>

      <div className="keyboard-hint">
        💡 Tip: Click the card to flip it
      </div>
    </div>
  );
}

export default Flashcards;
