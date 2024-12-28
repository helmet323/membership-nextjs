"use client";

// Import necessary dependencies
import { useState } from "react";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "@/app/config/firebase";

const AddUserModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleAddUser = async () => {
    console.log(email, role);
    if (!email || !role) {
      setErrorMessage("Email and Role are required.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Add user to Firestore with email as document ID
      const userRef = doc(db, "users", email); // Using email as document ID
      const user = {
        email,
        role,
        createdAt: serverTimestamp(),
      };

      await setDoc(userRef, user); // Set the document with the user data

      alert("User added successfully!");

      onClose();

      setEmail("");
      setRole("user");
    } catch (error) {
      console.error("Error adding user:", error);
      setErrorMessage("Failed to add user.");
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
