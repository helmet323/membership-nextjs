import React, { useState } from "react";
import {
  doc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/config/firebase"; // Adjust import path

interface AddFundProps {
  email: string;
  funds: number;
  onFundsUpdate: (newFunds: number) => void;
}

const AddFund: React.FC<AddFundProps> = ({ email, funds, onFundsUpdate }) => {
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (!value || !isNaN(parsedValue)) {
      setAmount(parsedValue);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      setErrorMessage("Please enter a valid positive amount.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Update user funds in Firestore
      const userDocRef = doc(db, "users", email);
      await updateDoc(userDocRef, { funds: increment(amount) });

      // Create a payment record in Firestore
      const paymentsCollection = collection(db, "payments");
      await addDoc(paymentsCollection, {
        email,
        amount,
        createdAt: serverTimestamp(),
        type: "add_funds",
      });

      const updatedFunds = funds + amount;
      onFundsUpdate(updatedFunds);

      alert("Funds added successfully and payment record created!");
      setAmount(0); // Reset input field
    } catch (error) {
      console.error("Error adding funds: ", error);
      setErrorMessage("Error adding funds. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Add Funds</h2>

      {/* Display error message if any */}
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}

      <form onSubmit={handleAddFunds} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount || ""}
            onChange={handleAmountChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter amount to add"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 bg-primary text-white rounded-md ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-secondary"
          } transition-colors`}
        >
          {isSubmitting ? "Adding..." : "Add Funds"}
        </button>
      </form>
    </div>
  );
};

export default AddFund;
