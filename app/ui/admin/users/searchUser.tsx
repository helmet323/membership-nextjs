"use client";

import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/config/firebase";
import EditUser from "./editUser";

const SearchUser: React.FC = () => {
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [user, setUser] = useState<{ email: string; role: string } | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isEditUserVisible, setIsEditUserVisible] = useState<boolean>(false); // New state for controlling visibility of EditUser component

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      setErrorMessage("Please enter an email.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setUser(null);

    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", searchEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setUser({ email: doc.id, role: doc.data().role });
      } else {
        setErrorMessage("User not found.");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setErrorMessage("An error occurred while searching for the user.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditUserVisible(!isEditUserVisible);
  };

  const handleRoleUpdate = (newRole: string) => {
    setUser((prev) => {
      if (prev === null) {
        return null;
      }
      return { ...prev, role: newRole };
    });
  };

  return (
    <div>
      <div className="mb-4 relative">
        <input
          type="email"
          id="email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter user email"
          aria-label="Email address input"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className={`absolute top-0 right-0 h-full py-2 px-4 bg-primary text-white rounded-r-md ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary"
          }`}
          aria-label="Search button"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {errorMessage && (
        <div className="mt-4 text-red-500 text-sm">{errorMessage}</div>
      )}

      {user && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-bold mb-2">User Details</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <button
            onClick={handleEditClick}
            className="mt-4 py-2 px-4 bg-primary text-white rounded hover:bg-secondary"
          >
            {isEditUserVisible ? "Cancel Edit" : "Edit User"}
          </button>

          {/* Show the EditUser component only when the button is clicked */}
          {isEditUserVisible && (
            <div className="mt-4">
              <EditUser
                email={user.email}
                currentRole={user.role}
                onRoleUpdate={handleRoleUpdate}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
