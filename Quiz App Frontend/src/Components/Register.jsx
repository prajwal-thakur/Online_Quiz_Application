import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for redirection
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "", // Default role as an empty string, user has to select
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate(); // Hook for navigating to another page

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate the form before submitting
  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.role) {
      setError("Username, password, and role are required.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // If validation fails, do not submit the form

    setIsSubmitting(true); // Set submitting state to true to prevent multiple submits

    try {
      // Make the API call to register the user
      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // If registration is successful, display success message and redirect to login page
        setSuccessMessage("User registered successfully!");
        setError(null);
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after successful registration
        }, 1000); // Wait for a moment to display the success message
      } else {
        // If registration failed, display the error message
        setError(data || "Registration failed");
        setSuccessMessage("");
      }
    } catch (error) {
      setError("Network error occurred");
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Role:
          <div className="custom-dropdown">
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Role</option> {/* Placeholder option */}
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </label>

        <button type="submit" disabled={isSubmitting}>
          Register
        </button>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
    </div>
  );
};

export default Register;
