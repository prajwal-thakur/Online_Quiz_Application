package com.app.controller;

import com.app.entity.Quiz;
import com.app.entity.Question;
import com.app.entity.UserAnswer;
import com.app.service.QuizService;
import com.app.service.QuestionService;
import com.app.service.UserAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quizzes")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private UserAnswerService userAnswerService;

    // Create quiz
    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(@RequestBody Quiz quiz) {
        quizService.saveQuiz(quiz);
        return ResponseEntity.status(HttpStatus.CREATED).body("Quiz created successfully!");
    }

    @GetMapping("/{quizId}/userAnswers")
    public ResponseEntity<List<UserAnswer>> getUserAnswers(
            @PathVariable Long quizId, 
            @RequestParam Long userId) {
        List<UserAnswer> userAnswers = userAnswerService.getUserAnswersForQuiz(userId, quizId);
        return ResponseEntity.ok(userAnswers);
    }

    
    // Fetch all available quizzes
    @GetMapping("/getquiz")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    // Fetch questions for a specific quiz
    @GetMapping("/{quizId}/questions")
    public ResponseEntity<List<Question>> getQuestionsByQuizId(@PathVariable Long quizId) {
        List<Question> questions = questionService.getQuestionsByQuizId(quizId);
        return ResponseEntity.ok(questions);
    }

    // Submit an answer for a specific question in a quiz
    @PostMapping("/{quizId}/submitAnswer")
    public ResponseEntity<String> submitAnswer(
            @PathVariable Long quizId,
            @RequestParam Long questionId,
            @RequestParam String selectedAnswer,
            @RequestParam Long userId) {

        UserAnswer userAnswer = userAnswerService.submitAnswer(userId, quizId, questionId, selectedAnswer);
        return ResponseEntity.ok("Answer for question " + questionId + " submitted successfully with attempt ID: " + userAnswer.getAttemptId());
    }

    @GetMapping("/{quizId}/maxAttemptId")
    public ResponseEntity<Integer> getMaxAttemptId(@PathVariable Long quizId, @RequestParam Long userId) {
        int maxAttemptId = userAnswerService.getMaxAttemptId(userId, quizId);  // Assuming you have this method in the service
        return ResponseEntity.ok(maxAttemptId);
    }


    // Calculate the score for a quiz after submission
    @GetMapping("/{quizId}/calculateScore")
    public ResponseEntity<Integer> calculateScore(@PathVariable Long quizId, @RequestParam Long userId) {
        int score = userAnswerService.calculateScore(userId, quizId);
        return ResponseEntity.ok(score);
    }
}
