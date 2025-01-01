import React, { useState } from "react";
import {
  serverTimestamp,
  collection,
  addDoc,
  doc,
  updateDoc,
  where,
  query,
  getDocs,
  increment,
} from "firebase/firestore";
import { db } from "@/app/config/firebase"; // Adjust import path

interface CreatePaymentProps {
  email: string;
  points: number;
  referredBy?: string;
  onPointsUpdate: (newPoints: number) => void;
}

const CreatePayment: React.FC<CreatePaymentProps> = ({
  email,
  points,
  referredBy,
  onPointsUpdate,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [service, setService] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form fields
    if (amount <= 0 || !service) {
      setErrorMessage("Please fill in all fields correctly.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const paymentsCollection = collection(db, "payments");
      await addDoc(paymentsCollection, {
        email,
        amount,
        service,
        createdAt: serverTimestamp(),
      });

      // Update points for user
      const userDocRef = doc(db, "users", email);
      await updateDoc(userDocRef, {
        points: increment(amount), // Increase points by the amount spent
      });
      onPointsUpdate(points + amount);

      // Handle referral update
      if (referredBy) {
        const usersCollection = collection(db, "users");
        const q = query(
          usersCollection,
          where("referralCode", "==", referredBy)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const referralDoc = querySnapshot.docs[0];
          const referralDocRef = doc(db, "users", referralDoc.id);
          await updateDoc(referralDocRef, {
            points: increment(amount / 10), // Referral gets 10% of the amount
          });
        }
      }

      alert("Payment record created successfully!");
      setAmount(0);
      setService("");
      onPointsUpdate(points + amount); // Refresh user points in parent
    } catch (error) {
      console.error("Error adding document: ", error);
      setErrorMessage("Error creating payment record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (!value || !isNaN(parsedValue)) {
      setAmount(parsedValue);
    }
  };

  return (
    <div className="mt-4 p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Create Payment</h2>

      {/* Display error message if any */}
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          />
        </div>

        {/* Service Select */}
        <div>
          <label
            htmlFor="service"
            className="block text-sm font-medium text-gray-700"
          >
            Service
          </label>
          <select
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a service</option>
            <option value="message">Message</option>
            <option value="guasha">Gua Sha</option>
            <option value="cupping">Cupping</option>
            <option value="steaming">Herbal Steam</option>
          </select>
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
          {isSubmitting ? "Submitting..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
};

export default CreatePayment;
