"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/context/authContext";

const ProfilePage: React.FC = () => {
  const { userData } = useAuth();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyReferralLink = () => {
    if (userData?.referralCode) {
      // Get the current website's base URL dynamically
      const baseUrl = window.location.origin;

      // Construct the full referral link
      const referralLink = `${baseUrl}/login?mode=signup&referredBy=${userData.referralCode}`;

      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset the copied status after 2 seconds
        })
        .catch((error) => {
          console.error("Failed to copy referral link:", error);
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Profile
        </h2>

        {/* Displaying Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <p className="text-lg font-medium text-gray-800">{userData?.email}</p>
        </div>

        {/* Displaying Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Role
          </label>
          <p className="text-lg font-medium text-gray-800">{userData?.role}</p>
        </div>

        {/* Copy Referral Link Button */}
        <div className="mb-6">
          <button
            onClick={handleCopyReferralLink}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            {isCopied ? "Referral Link Copied!" : "Copy Referral Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
