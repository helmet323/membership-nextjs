// src/components/LoginModal.tsx
import React, { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/config/firebase";

type LoginModalProps = {
  open: boolean;
  handleClose: () => void;
};

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
const LoginModal: React.FC<LoginModalProps> = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleClose();
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      handleClose();
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 text-black">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold text-center mb-4 ">
            {isSignup
              ? translations?.loginModal?.signup
              : translations?.loginModal?.login}
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
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
                  className="w-full p-2 border rounded"
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
    )
  );
};

export default LoginModal;
