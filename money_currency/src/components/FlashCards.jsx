import React, { useState } from 'react';
import './FlashCards.css';

// Data for flashcards (Indian Currency/Money focus)
const flashcardData = [
  { id: 1, front: "What is the currency of India?", back: "Indian Rupee (INR)" },
  { id: 2, front: "What is the smallest Indian coin in value?", back: "Paise (1/100 of a Rupee)" },
  { id: 3, front: "How many paise make 1 rupee?", back: "100 paise" },
  { id: 4, front: "Which symbol represents the Indian Rupee?", back: "₹" },
];

const FlashCards = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcardData[currentCardIndex];
  const cardCount = flashcardData.length;

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cardCount);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentCardIndex((prevIndex) => 
      (prevIndex - 1 + cardCount) % cardCount
    );
    setIsFlipped(false);
  };

  // Background colors for front and back
  const cardStyle = {
    border: '2px solid #555',
    padding: '40px',
    margin: '20px auto',
    width: '300px',
    minHeight: '150px',
    cursor: 'pointer',
    background: isFlipped 
      ? 'linear-gradient(135deg, #ff416c, #ff4b2b)' // Answer background
      : 'linear-gradient(135deg, #6a11cb, #2575fc)', // Question background
    color: '#fff',
    borderRadius: '15px',
    transition: 'all 0.5s ease',
    boxShadow: '2px 2px 12px rgba(0,0,0,0.2)',
  };

  return (
    <div className="flashcards-container" style={{ textAlign: 'center' }}>
      <h2>Flashcards 🧠</h2>
      
      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
        style={cardStyle}
      >
        <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {isFlipped ? currentCard.back : currentCard.front}
        </p>
        <small style={{ color: 'rgba(255,255,255,0.8)' }}>
          {isFlipped ? 'Click to see Question' : 'Click to see Answer'}
        </small>
      </div>

      <div className="controls">
        <button onClick={handlePrev} style={{ marginRight: '10px' }}>
          Previous
        </button>
        <span style={{ margin: '0 15px', color: '#343a40' }}>
          Card {currentCardIndex + 1} of {cardCount}
        </span>
        <button onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashCards;
