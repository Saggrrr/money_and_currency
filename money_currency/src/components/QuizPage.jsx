import React, { useState, useEffect } from "react";
import "./QuizPage.css"; 

// 🧠 Quiz questions
const quizQuestions = [
  { text: "What is the name of the Indian currency?", options: ["Yen", "Rupee", "Dollar", "Euro"], answer: 1 },
  { text: "Which denomination of Indian banknote features Mahatma Gandhi walking with a stick?", options: ["₹10", "₹50", "₹100", "₹500"], answer: 3 },
  { text: "Who has the signature on a ₹1 Indian note?", options: ["Governor of RBI", "Finance Secretary", "Prime Minister", "President"], answer: 1 },
];

// 🧾 Modal for showing previous scores
const ScoresModal = ({ scores, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Your Previous Scores</h3>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="score-list-container">
        {scores.length === 0 ? (
          <p>No scores yet. Finish a quiz to save your first score!</p>
        ) : (
          <ul className="score-list">
            {scores.map((s, i) => (
              <li key={i} className="score-item">
                <span className="score-date">
                  {new Date(s.timestamp).toLocaleDateString()} at{" "}
                  {new Date(s.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="score-value">
                  Score: {s.score} / {s.total}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

// ✨ NEW: Component for the CSS Pie Chart
const ScorePieChart = ({ score, total }) => {
  const percentage = (score / total) * 100;
  // Calculate the color stops for the conic gradient
  const pieStyle = {
    background: `conic-gradient(
      #4CAF50 0% ${percentage}%, 
      #FFC107 ${percentage}% 100%
    )`,
  };

  return (
    <div className="pie-chart-container">
      <div className="pie-chart" style={pieStyle}>
        <div className="pie-text">
          {percentage.toFixed(0)}%
        </div>
      </div>
      <div className="chart-legend">
        <span style={{ color: '#4CAF50' }}>Correct</span> | <span style={{ color: '#FFC107' }}>Incorrect</span>
      </div>
    </div>
  );
};


export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [sessionScores, setSessionScores] = useState([]);
  const [isScoresModalOpen, setIsScoresModalOpen] = useState(false);
  const [scoreMessage, setScoreMessage] = useState("");

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // 🔹 Fetch all scores when modal opens
  useEffect(() => {
    if (isScoresModalOpen) {
      fetch("http://localhost:5000/api/scores")
        .then((res) => {
          if (!res.ok) throw new Error("Network response not ok");
          return res.json();
        })
        .then((data) => setSessionScores(data))
        .catch((err) => {
          console.error("Error fetching scores:", err);
          alert("Could not fetch scores. Please ensure backend is running on port 5000.");
          setIsScoresModalOpen(false);
        });
    }
  }, [isScoresModalOpen]);

  const handleOptionClick = (i) => {
    if (showResult) return;
    setSelectedOptionIndex(i);
    if (i === currentQuestion.answer) setScore((s) => s + 1);
    setShowResult(true);
  };

  const handleNextClick = () => {
    setSelectedOptionIndex(null);
    setShowResult(false);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setQuizFinished(true);
      setScoreMessage("Saving score...");

      // 🔹 Save score to backend
      fetch("http://localhost:5000/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, total: quizQuestions.length }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to save score on server");
          return res.json();
        })
        .then((savedScore) => {
          setSessionScores((prev) => [savedScore, ...prev]);
          setScoreMessage("✅ Score saved successfully!");
        })
        .catch((err) => {
          console.error("Error saving score:", err);
          setScoreMessage("❌ Failed to save score. Backend not reachable.");
        });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setQuizFinished(false);
    setShowResult(false);
    setScoreMessage("");
  };

  if (quizFinished) {
    return (
      <div className="page-container">
        <main className="quiz-container">
          <h2>🎉 Quiz Complete!</h2>
          {/* ✨ NEW: Pie Chart component added here */}
          <ScorePieChart score={score} total={quizQuestions.length} />
          
          <p className="final-score">Your final score: **{score} / {quizQuestions.length}**</p>
          <p className="save-message">{scoreMessage}</p>
          <div className="action-buttons-group">
            <button className="restart-button" onClick={handleRestartQuiz}>
              Restart Quiz
            </button>
            <button className="scores-button" onClick={() => setIsScoresModalOpen(true)}>
              My Scores
            </button>
          </div>
        </main>
        {isScoresModalOpen && <ScoresModal scores={sessionScores} onClose={() => setIsScoresModalOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="quiz-header">
        <h1>🇮🇳 Indian Currency Quiz</h1>
        <p>Current Score: {score}</p>
        <button className="scores-button" onClick={() => setIsScoresModalOpen(true)}>
          My Scores
        </button>
      </header>

      <main className="quiz-container">
        <p className="question-counter">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
        <h2>{currentQuestion.text}</h2>

        <div className="options">
          {currentQuestion.options.map((opt, i) => {
            let cls = "";
            if (showResult) {
              if (i === currentQuestion.answer) cls = "correct";
              else if (i === selectedOptionIndex) cls = "incorrect";
            } else if (i === selectedOptionIndex) cls = "selected";

            return (
              <button
                key={i}
                onClick={() => handleOptionClick(i)}
                className={cls}
                disabled={showResult}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <>
            <p className="result">
              {selectedOptionIndex === currentQuestion.answer ? "✅ Correct!" : "❌ Wrong!"}
            </p>
            <button className="next-button" onClick={handleNextClick}>
              {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question →" : "Finish Quiz"}
            </button>
          </>
        )}
      </main>

      {isScoresModalOpen && <ScoresModal scores={sessionScores} onClose={() => setIsScoresModalOpen(false)} />}
    </div>
  );
}