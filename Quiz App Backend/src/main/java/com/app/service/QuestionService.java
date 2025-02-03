package com.app.service;

import com.app.entity.Question;
import com.app.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getQuestionsByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId);
       
    }
    

    public void saveQuestion(Question question) {
        questionRepository.save(question);
    }
}
