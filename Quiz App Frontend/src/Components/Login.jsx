import React, { useState } from "react";
import './Login.css';  // Importing the same styles as Register
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();  // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if fields are not empty
    if (!credentials.username || !credentials.password) {
      setError("Both fields are required");
      return;
    }

    setIsSubmitting(true);
    setError(null); // Reset error

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Content type for login
        },
        body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      // Handle the response based on status
      if (response.ok) {
        // Parse the response JSON (in case the server returns any data)
        const data = await response.json();

        // After successful login, redirect to the quiz page
        navigate('/quiz');  // Redirect to quiz page
      } else {
        // If the response status is not 200, show an error message
        const errorData = await response.json();  // Capture error response data
        setError(errorData.message || "Invalid Credentials!");  // Show error message from response
      }
    } catch (error) {
      // Handle network errors or any other issues
      setError('Network error occurred');
    } finally {
      setIsSubmitting(false);  // Reset submitting state
    }
  };

  return (
    
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={isSubmitting}>Login</button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
