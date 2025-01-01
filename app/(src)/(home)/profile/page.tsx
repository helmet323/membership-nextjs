"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/context/authContext";

export default function Page() {
  const { userData } = useAuth();
  const [isCopied, setIsCopied] = useState(false);

  // Utility function to generate the referral link
  const generateReferralLink = (referralCode: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/login?mode=signup&referredBy=${referralCode}`;
  };

  const handleCopyReferralLink = () => {
    if (userData?.referralCode) {
      const referralLink = generateReferralLink(userData.referralCode);

      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          setIsCopied(true);
          // Reset the copied status after 2 seconds
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((error) => {
          console.error("Failed to copy referral link:", error);
          setIsCopied(false); // Reset isCopied in case of failure
        });
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Your Profile
        </h2>

        {/* Displaying Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <p className="text-lg font-medium text-gray-800">{userData?.email}</p>
        </div>

        {/* Displaying Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Role
          </label>
          <p className="text-lg font-medium text-gray-800">{userData?.role}</p>
        </div>

        {/* Displaying Points */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Points
          </label>
          <p className="text-lg font-medium text-gray-800">
            {userData?.points}
          </p>
        </div>

        {/* Copy Referral Link Button */}
        <div>
          <button
            onClick={handleCopyReferralLink}
            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
          >
            {isCopied ? "Referral Link Copied!" : "Copy Referral Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
