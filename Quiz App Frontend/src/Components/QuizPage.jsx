import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizPage.css';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:8080/quizzes/getquiz");
        const data = await response.json();
        console.log(data);  // Log the data to see its structure
        
        // Check if the data is in the correct format
        if (Array.isArray(data)) {
          setQuizzes(data);
        } else if (data && Array.isArray(data.quizzes)) {
          setQuizzes(data.quizzes);  // If quizzes are inside a `quizzes` key
        } else {
          console.error('Fetched data is not in the expected format');
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}/questions`);
  };

  return (
    <div className="quiz-page-container">
      <h2>Select a Quiz</h2>
      <div className="quiz-cards-container">
        {Array.isArray(quizzes) && quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <button className="start-btn" onClick={() => handleStartQuiz(quiz.id)}>Start Quiz</button>
            </div>
          ))
        ) : (
          <p>No quizzes available</p>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
