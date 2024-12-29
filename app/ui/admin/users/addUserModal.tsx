"use client";

// Import necessary dependencies
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";

const AddUserModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [referral, setReferral] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralValid, setReferralValid] = useState<boolean>(false); // State to track if referral is valid

  const { adminSignup, checkReferral } = useAuth();

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !role) {
      setErrorMessage("Email and Role are required.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await adminSignup(email, role, referralCode); // Pass referral to the signup function
      alert("User added successfully!");
      // Clear the form data after successful addition
      setEmail("");
      setRole("user");
      setReferral("");
      setReferralCode("");
      setReferralValid(false);
      onClose(); // Close the modal after adding the user
    } catch (error) {
      setErrorMessage("Failed to add admin.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckReferral = async () => {
    if (!referral) {
      setErrorMessage("Referral email is required.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const userCode = await checkReferral(referral); // Implement this in your `useAuth`
      if (userCode) {
        setReferralCode(userCode); // Store the referral data temporarily
        setReferralValid(true); // Set referral as valid
      } else {
        setReferralValid(false); // Set referral as invalid
        setErrorMessage("Referral not found.");
      }
    } catch (error) {
      setErrorMessage("Error checking referral.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full p-6 bg-white shadow-md rounded-md relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h1 className="text-2xl font-bold mb-4">Add User</h1>
        {errorMessage && (
          <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded"
          >
            <option value="user">User</option>
            <option value="member">Member</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="referral" className="block text-sm font-medium mb-2">
            Referral (optional)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              id="referral"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded"
              placeholder="Enter referral email"
            />
            <button
              type="button"
              onClick={handleCheckReferral}
              disabled={loading}
              className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-secondary"
              }`}
            >
              {loading ? "Checking..." : "Check"}
            </button>
          </div>
          {referralValid && (
            <div className="mt-2 text-green-500 text-sm">
              Referral is valid!
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddUser}
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-secondary"
          }`}
        >
          {loading ? "Adding..." : "Add User"}
        </button>
      </div>
    </div>
  );
};

export default AddUserModal;
