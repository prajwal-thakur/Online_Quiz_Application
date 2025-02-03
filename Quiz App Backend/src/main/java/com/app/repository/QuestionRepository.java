package com.app.repository;

import com.app.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    // Custom method to find questions by quizId
    List<Question> findByQuizId(Long quizId);
}
