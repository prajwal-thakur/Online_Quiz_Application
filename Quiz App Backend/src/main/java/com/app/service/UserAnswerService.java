package com.app.service;

import com.app.entity.Question;
import com.app.entity.Quiz;
import com.app.entity.User;
import com.app.entity.UserAnswer;
import com.app.repository.UserAnswerRepository;
import com.app.repository.QuizRepository;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserAnswerService {

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private UserRepository userRepository;  // For fetching User details

    @Autowired
    private QuizRepository quizRepository;  // For fetching Quiz details

    // Fetch the current attempt ID for the user and quiz
    private int getNextAttemptId(Long userId, Long quizId) {
        Integer maxAttempt = userAnswerRepository.findMaxAttemptIdByUserIdAndQuizId(userId, quizId);
        return (maxAttempt == null) ? 1 : maxAttempt + 1;
    }

    public UserAnswer submitAnswer(Long userId, Long quizId, Long questionId, String selectedAnswer) {
        // Fetch the Question from the quiz
        Question question = questionService.getQuestionsByQuizId(quizId)
                .stream().filter(q -> q.getId().equals(questionId))
                .findFirst().orElseThrow(() -> new RuntimeException("Question not found"));

        // Fetch User and Quiz from the database
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Calculate the current attempt ID
        int attemptId = getNextAttemptId(userId, quizId);

        // Create the UserAnswer object and set the values
        UserAnswer userAnswer = new UserAnswer();
        userAnswer.setUser(user);
        userAnswer.setQuiz(quiz);
        userAnswer.setQuestion(question);
        userAnswer.setSelectedAnswer(selectedAnswer);
        userAnswer.setAttemptId(attemptId);

        // Save the answer
        return userAnswerRepository.save(userAnswer);
    }
    
    public int calculateScore(Long userId, Long quizId) {
        // Get the latest attempt ID for the given user and quiz
        int latestAttempt = getNextAttemptId(userId, quizId);

        // Fetch answers for the latest attempt of the user for the given quiz
        List<UserAnswer> answers = userAnswerRepository.findByUserIdAndQuizIdAndAttemptId(userId, quizId, latestAttempt);

        int score = 0;

        // Iterate through the answers and compare with the correct answer
        for (UserAnswer answer : answers) {
            String selectedAnswer = answer.getSelectedAnswer();
            String correctAnswer = answer.getQuestion().getCorrectAnswer();

            // If the selected answer is correct, increase the score
            if (selectedAnswer != null && selectedAnswer.equals(correctAnswer)) {
                score++;
            }
        }

        return score;
    }

    public int getMaxAttemptId(Long userId, Long quizId) {
        Integer maxAttempt = userAnswerRepository.findMaxAttemptIdByUserIdAndQuizId(userId, quizId);
        return (maxAttempt == null) ? 1 : maxAttempt;
    }

    public List<UserAnswer> getUserAnswersForQuiz(Long userId, Long quizId) {
        // Fetch all user answers for the given quiz and user
        List<UserAnswer> userAnswers = userAnswerRepository.findByUserIdAndQuizId(userId, quizId);
        return userAnswers;
    }



}
