"use client";

import React, { useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/app/config/firebase";
import EditUser from "./editUser";
import CreatePayment from "./createPayment";
import ViewPayments from "./viewPayments";
import ViewReferrals from "./viewReferrals";

interface UserData {
  email: string;
  role: string;
  referralCode: string;
  referredBy?: string;
  points: number;
  createdAt: Timestamp;
}

const SearchUser: React.FC = () => {
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeComponent, setActiveComponent] = useState<
    "editUser" | "createPayment" | "viewPayments" | "viewReferrals" | ""
  >("");

  // Handle search for user
  const handleSearch = useCallback(async () => {
    if (!searchEmail.trim()) {
      setErrorMessage("Please enter an email.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setUserData(null);

    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", searchEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setUserData({
          email: doc.data().email,
          role: doc.data().role,
          referralCode: doc.data().referralCode,
          referredBy: doc.data().referredBy,
          points: doc.data().points,
          createdAt: doc.data().createdAt,
        });
      } else {
        setErrorMessage("User not found.");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setErrorMessage("An error occurred while searching for the user.");
    } finally {
      setLoading(false);
    }
  }, [searchEmail]);

  // Toggle active components for UI interaction
  const toggleComponent = useCallback(
    (
      component:
        | "editUser"
        | "createPayment"
        | "viewPayments"
        | "viewReferrals"
        | ""
    ) => {
      setActiveComponent((prev) => (prev === component ? "" : component));
    },
    []
  );

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

      {userData && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-bold mb-2">User Details</h2>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Role:</strong> {userData.role}
          </p>
          <p>
            <strong>Points:</strong> {userData.points}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => toggleComponent("editUser")}
              className="mt-4 py-2 px-4 bg-primary text-white rounded hover:bg-secondary"
            >
              {activeComponent === "editUser" ? "Cancel Edit" : "Edit User"}
            </button>
            <button
              onClick={() => toggleComponent("createPayment")}
              className="mt-4 py-2 px-4 bg-primary text-white rounded hover:bg-secondary"
            >
              {activeComponent === "createPayment"
                ? "Cancel Payment"
                : "Add Payment"}
            </button>
            <button
              onClick={() => toggleComponent("viewPayments")}
              className="mt-4 py-2 px-4 bg-primary text-white rounded hover:bg-secondary"
            >
              {activeComponent === "viewPayments"
                ? "Cancel View"
                : "View Payments"}
            </button>
            <button
              onClick={() => toggleComponent("viewReferrals")}
              className="mt-4 py-2 px-4 bg-primary text-white rounded hover:bg-secondary"
            >
              {activeComponent === "viewReferrals"
                ? "Cancel View"
                : "View Referrals"}
            </button>
          </div>

          {/* Render the active component */}
          {activeComponent === "editUser" && userData && (
            <div className="mt-4">
              <EditUser
                email={userData.email}
                currentRole={userData.role}
                onRoleUpdate={(newRole) => {
                  setUserData((prev) =>
                    prev ? { ...prev, role: newRole } : null
                  );
                }}
              />
            </div>
          )}

          {activeComponent === "createPayment" && userData && (
            <div>
              <CreatePayment
                email={userData.email}
                points={userData.points}
                referredBy={userData.referredBy}
                onPointsUpdate={(newPoints) => {
                  setUserData((prev) =>
                    prev ? { ...prev, points: newPoints } : null
                  );
                }}
              />
            </div>
          )}

          {activeComponent === "viewPayments" && userData && (
            <div>
              <ViewPayments email={userData.email} />
            </div>
          )}

          {activeComponent === "viewReferrals" && userData && (
            <div>
              <ViewReferrals referralCode={userData.referralCode} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
