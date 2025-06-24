"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setShowError(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Please enter your username or email";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Please enter your password";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setShowError(false);
    try {
      const response = await axios.post(
        "/api/user/login",
        {
          email: formData.username,
          password: formData.password,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        router.push("/Dashboard");
      } else {
        setErrorMessage(response.data.msg || "Login failed");
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.msg ||
          "Invalid username or password. Please try again."
      );
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {showError && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="form-floating mb-3">
        <input
          type="text"
          className={`form-control ${errors.username ? "is-invalid" : ""}`}
          id="username"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <label htmlFor="username">Email</label>
        {errors.username && (
          <div className="invalid-feedback">{errors.username}</div>
        )}
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          id="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <label htmlFor="password">Password</label>
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>
      <div className="d-grid gap-2">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
