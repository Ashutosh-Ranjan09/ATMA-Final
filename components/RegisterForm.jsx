"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function RegisterForm({ onRegistered }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    if (showError) {
      setShowError(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Please enter a username";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter an email address";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Please enter a password";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("/api/user/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      alert("Registration successful! You can now log in.");
      onRegistered();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.msg || "Registration failed. Please try again."
      );
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {showError && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="form-floating mb-3">
        <input
          type="text"
          className={`form-control ${errors.username ? "is-invalid" : ""}`}
          id="reg-username"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <label htmlFor="reg-username">Username</label>
        {errors.username && (
          <div className="invalid-feedback">{errors.username}</div>
        )}
      </div>
      <div className="form-floating mb-3">
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          id="reg-email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <label htmlFor="reg-email">Email Address</label>
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          id="reg-password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <label htmlFor="reg-password">Password</label>
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>
      <div className="form-floating mb-4">
        <input
          type="password"
          className={`form-control ${
            errors.confirmPassword ? "is-invalid" : ""
          }`}
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        {errors.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword}</div>
        )}
      </div>
      <div className="d-grid gap-2">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
