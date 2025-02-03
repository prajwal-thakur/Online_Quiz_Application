import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Navbar from "./Components/Navbar";
import QuizPage from "./Components/QuizPage";
import QuestionsPage from "./Components/QuestionPage";
import ResultPage from "./Components/ResultPage";

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar component for navigation */}
      <Routes>
        <Route path="/" element={<Login />} /> {/* Homepage route */}
        <Route path="/login" element={<Login />} /> {/* Login page route */}
        <Route path="/register" element={<Register />} /> Register page route
        <Route path="/quiz" element={<QuizPage/>} /> 
        <Route path="/quiz/:quizId/questions" element={<QuestionsPage />} />
        <Route path="/quiz/:quizId/results" element={<ResultPage />} />
      </Routes>
    </Router>
  );
};

export default App;
