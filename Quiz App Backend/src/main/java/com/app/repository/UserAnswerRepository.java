package com.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.entity.UserAnswer;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {

    List<UserAnswer> findByUserIdAndQuizIdAndAttemptId(Long userId, Long quizId, int attemptId);
    
    List<UserAnswer> findByUserIdAndQuizId(Long userId, Long quizId);

    
    @Query("SELECT COALESCE(MAX(ua.attemptId), 0) FROM UserAnswer ua WHERE ua.user.id = :userId AND ua.quiz.id = :quizId")
    Integer findMaxAttemptIdByUserIdAndQuizId(@Param("userId") Long userId, @Param("quizId") Long quizId);
}
