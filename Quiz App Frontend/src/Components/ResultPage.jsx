import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = () => {
  const { quizId } = useParams();
  const [score, setScore] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const navigate = useNavigate();

  // Fetch quiz results
  useEffect(() => {
    const fetchResults = async () => {
      const userId = 1; // Replace with actual user ID

      try {
        const response = await fetch(`http://localhost:8080/quizzes/${quizId}/calculateScore?userId=${userId}`);
        if (response.ok) {
          const result = await response.json();
          setScore(result);

          // Fetch the answers along with correct answers for each question
          const answersResponse = await fetch(`http://localhost:8080/quizzes/${quizId}/userAnswers?userId=${userId}`);
          const answersData = await answersResponse.json();
          setUserAnswers(answersData);  // Store the answers for comparison
        } else {
          console.error("Error fetching score.");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, [quizId]);

  return (
    <div className="result-page-container">
      <h2>Quiz Results</h2>
      <h3>Your Score: {score}</h3>
      <div>
        {userAnswers.map((answer, index) => (
          <div key={index} className="answer-details">
            <p><strong>Question:</strong> {answer.questionText}</p>
            <p><strong>Your Answer:</strong> {answer.selectedAnswer}</p>
            <p><strong>Correct Answer:</strong> {answer.correctAnswer}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate(`/quiz/${quizId}/questions`)}>Retake Quiz</button>
    </div>
  );
};

export default ResultPage;
