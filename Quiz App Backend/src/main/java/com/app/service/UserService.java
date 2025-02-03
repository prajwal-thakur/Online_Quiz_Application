package com.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.entity.User;
import com.app.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User authenticate(String username, String password) {
        // Fetch user from the database by username
        User user = userRepository.findByUsername(username);

        // Validate username and password
        if (user != null && user.getPassword().equals(password)) {
            return user; // Authentication successful
        }

        // Return null if authentication fails
        return null;
    }

    public void registerUser(User user) {
        // Check if the username already exists
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }

        // Save the user to the database
        userRepository.save(user);
    }
}
