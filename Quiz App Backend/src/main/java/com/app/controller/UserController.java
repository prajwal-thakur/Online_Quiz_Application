package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.entity.User;
import com.app.service.UserService;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000") // Frontend URL
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    /**
     * User Login API
     * @param username Username of the user
     * @param password Password of the user
     * @return ResponseEntity with login status
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam String username, @RequestParam String password) {
        logger.info("Login attempt for username: {}", username);

        User user = userService.authenticate(username, password);

        Map<String, String> response = new HashMap<>();
        if (user != null) {
            logger.info("Login successful for username: {}", username);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        }

        logger.warn("Login failed for username: {}", username);
        response.put("error", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * User Registration API
     * @param user User object containing registration details
     * @return ResponseEntity with registration status
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        logger.info("Registration attempt for username: {}", user.getUsername());

        Map<String, String> response = new HashMap<>();
        try {
            userService.registerUser(user);
            logger.info("Registration successful for username: {}", user.getUsername());
            response.put("message", "User registered successfully!");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            logger.error("Registration failed for username: {}: {}", user.getUsername(), e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
