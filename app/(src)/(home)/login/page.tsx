"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/authContext";

const translations = {
  loginModal: {
    login: "Login",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    signup: "Signup",
    alreadyHaveAccount: "Already Have Account?",
    createAccount: "Create Account",
    loading: "Loading",
  },
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Changed to 'error' and 'setError'
  const [isSignup, setIsSignup] = useState(false); // Initial state for signup
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const mode = searchParams.get("mode"); // Get the mode from the URL
  const referredBy = searchParams.get("referredBy") || ""; // Default to an empty string if not present

  // Set the initial form mode based on the 'mode' query parameter
  useEffect(() => {
    if (mode === "signup") {
      setIsSignup(true);
    } else {
      setIsSignup(false);
    }
  }, [mode]);

  const { signup, login } = useAuth(); // get the error from context

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Set loading state to true

    try {
      await login(email, password); // Call login function
      router.push(from); // Redirect after successful login
    } catch {
      setError("Login failed. Please check your credentials."); // Set error message
    } finally {
      setLoading(false); // End loading state
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, referredBy);
      router.push(from); // Redirect after successful signup
    } catch {
      setError("Signup failed. Please try again."); // Set error message
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">
          {isSignup
            ? translations?.loginModal?.signup
            : translations?.loginModal?.login}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error} {/* Display error message */}
          </div>
        )}

        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              {translations?.loginModal?.email}
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border border-gray-400 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              {translations?.loginModal?.password}
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border border-gray-400 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignup && (
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="confirmPassword"
              >
                {translations?.loginModal?.confirmPassword}
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full p-2 border border-gray-400 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded mt-4 hover:bg-secondary disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? translations?.loginModal?.loading
              : isSignup
              ? translations?.loginModal?.signup
              : translations?.loginModal?.login}
          </button>
        </form>

        <p
          className="text-sm text-center mt-4 cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? translations?.loginModal?.alreadyHaveAccount
            : translations?.loginModal?.createAccount}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
