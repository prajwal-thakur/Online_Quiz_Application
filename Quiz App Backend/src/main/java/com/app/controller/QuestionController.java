package com.app.controller;

import com.app.entity.Question;
import com.app.entity.Quiz;
import com.app.service.QuestionService;
import com.app.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuizService quizService;

    @PostMapping("/add/{quizId}")
    public ResponseEntity<String> addQuestionsToQuiz(@PathVariable Long quizId, @RequestBody List<Question> questions) {
        // Fetch the quiz by its ID
        Quiz quiz = quizService.getQuizById(quizId);
        
        // Check if the quiz exists
        if (quiz == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Quiz not found.");
        }

        // Link the questions to the quiz
        for (Question question : questions) {
            question.setQuiz(quiz);  // Set the quiz for each question
        }

        // Save the questions
        for (Question question : questions) {
            questionService.saveQuestion(question);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("Questions added to quiz successfully.");
    }
}
