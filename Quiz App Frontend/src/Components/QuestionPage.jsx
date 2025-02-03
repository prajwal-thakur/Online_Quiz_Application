import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuestionPage.css';

const QuestionsPage = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null); // Store the score here
  const [attemptId, setAttemptId] = useState(1); // Track attempt ID
  const navigate = useNavigate();

  // Fetch the quiz questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:8080/quizzes/${quizId}/questions`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [quizId]);

  // Fetch the max attempt ID for the user
  useEffect(() => {
    const fetchAttemptId = async () => {
      try {
        const response = await fetch(`http://localhost:8080/quizzes/${quizId}/maxAttemptId?userId=1`);
        const maxAttemptId = await response.json();
        setAttemptId(maxAttemptId + 1); // Increment for the new attempt
      } catch (error) {
        console.error("Error fetching attempt ID:", error);
      }
    };

    fetchAttemptId();
  }, [quizId]);

  const handleAnswerChange = (questionId, option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option, // Store the selected answer for the current question
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1); // Go to the previous question
    }
  };

  const handleSubmit = async () => {
    const userId = 1; // Hardcoded for now, replace with the logged-in user ID

    // Submit the answers first
    const submitAnswers = async () => {
      for (let questionId of Object.keys(answers)) {
        const selectedAnswer = answers[questionId];
        try {
          const response = await fetch(`http://localhost:8080/quizzes/${quizId}/submitAnswer?questionId=${questionId}&selectedAnswer=${selectedAnswer}&userId=${userId}`, {
            method: 'POST',
          });

          if (response.ok) {
            console.log(`Answer for Question ${questionId} submitted successfully`);
          } else {
            console.error(`Error submitting answer for Question ${questionId}`);
          }
        } catch (error) {
          console.error("Error submitting answer:", error);
        }
      }
    };

    await submitAnswers(); // Submit all answers at once

    // Now, calculate the score
    try {
      const response = await fetch(`http://localhost:8080/quizzes/${quizId}/calculateScore?userId=${userId}`);
      if (response.ok) {
        const result = await response.json();
        setScore(result); // Set the score state
        console.log('Score calculated successfully:', result);
        navigate(`/quiz/${quizId}/results`); // Navigate to results page after score calculation
      } else {
        console.error('Error calculating score:', response.statusText);
      }
    } catch (error) {
      console.error("Error calculating score:", error);
    }
};
  
  
  if (!questions.length) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="questions-page-container">
      <h2>Quiz: Question {currentQuestionIndex + 1}</h2>
      <div className="question-card">
        <h3>{currentQuestion.questionText}</h3>
        <ul>
          <li>
            <input
              type="radio"
              id="optionA"
              name={`question-${currentQuestion.id}`}
              value="A"
              checked={answers[currentQuestion.id] === 'A'}
              onChange={() => handleAnswerChange(currentQuestion.id, 'A')}
            />
            <label htmlFor="optionA">{currentQuestion.optionA}</label>
          </li>
          <li>
            <input
              type="radio"
              id="optionB"
              name={`question-${currentQuestion.id}`}
              value="B"
              checked={answers[currentQuestion.id] === 'B'}
              onChange={() => handleAnswerChange(currentQuestion.id, 'B')}
            />
            <label htmlFor="optionB">{currentQuestion.optionB}</label>
          </li>
          <li>
            <input
              type="radio"
              id="optionC"
              name={`question-${currentQuestion.id}`}
              value="C"
              checked={answers[currentQuestion.id] === 'C'}
              onChange={() => handleAnswerChange(currentQuestion.id, 'C')}
            />
            <label htmlFor="optionC">{currentQuestion.optionC}</label>
          </li>
          <li>
            <input
              type="radio"
              id="optionD"
              name={`question-${currentQuestion.id}`}
              value="D"
              checked={answers[currentQuestion.id] === 'D'}
              onChange={() => handleAnswerChange(currentQuestion.id, 'D')}
            />
            <label htmlFor="optionD">{currentQuestion.optionD}</label>
          </li>
        </ul>
      </div>
      
      <div className="navigation-buttons">
        <button onClick={handlePrev} disabled={currentQuestionIndex === 0}>Previous</button>
        <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
      </div>
      
      {currentQuestionIndex === questions.length - 1 && (
        <div className="submit-button">
          <button onClick={handleSubmit}>Submit Quiz</button>
        </div>
      )}

      {/* Display the score after submission */}
      {score !== null && (
        <div className="score-display">
          <h3>Your Score: {score}</h3>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
