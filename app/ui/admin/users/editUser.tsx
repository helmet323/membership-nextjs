"use client";

import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/config/firebase";

interface EditUserProps {
  email: string;
  currentRole: string;
  onRoleUpdate: (newRole: string) => void; // Callback function
}

const EditUser: React.FC<EditUserProps> = ({
  email,
  currentRole,
  onRoleUpdate,
}) => {
  const [newRole, setNewRole] = useState<string>(currentRole);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleUpdateRole = async () => {
    if (!newRole.trim()) {
      setErrorMessage("Role cannot be empty.");
      return;
    }

    if (newRole === currentRole) {
      setErrorMessage("The role is already the same.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const userDocRef = doc(db, "users", email);
      await updateDoc(userDocRef, { role: newRole });

      // Call the parent callback to update the role in the parent component
      onRoleUpdate(newRole);

      setSuccessMessage("User role updated successfully!");
    } catch (error) {
      console.error("Error updating role:", error);
      setErrorMessage("Failed to update user role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Edit User Role</h2>
      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          New Role
        </label>
        <select
          id="role"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Select new user role"
        >
          <option value="user">User</option>
          <option value="member">Member</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button
        type="button"
        onClick={handleUpdateRole}
        disabled={loading}
        className={`w-full py-3 px-6 bg-primary text-white rounded-md ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary"
        } transition-colors`}
      >
        {loading ? "Updating..." : "Update Role"}
      </button>

      {successMessage && (
        <div className="mt-4 text-green-500 text-sm">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mt-4 text-red-500 text-sm">{errorMessage}</div>
      )}
    </div>
  );
};

export default EditUser;
