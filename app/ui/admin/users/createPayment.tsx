import React, { useState } from "react";
import { serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from "@/app/config/firebase"; // Adjust import path

interface PaymentProps {
  email: string;
}

const CreatePayment: React.FC<PaymentProps> = ({ email }) => {
  const [amount, setAmount] = useState<number>(0);
  const [service, setService] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form fields
    if (amount <= 0 || !service) {
      alert("Please fill in all fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentsCollection = collection(db, "payments"); // Firestore reference
      await addDoc(paymentsCollection, {
        email,
        amount,
        service,
        createdAt: serverTimestamp(),
      });
      alert("Payment record created successfully!");
      setAmount(0);
      setService("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error creating payment record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle amount input change and ensure a valid number is set
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (!value || !isNaN(parsedValue)) {
      setAmount(parsedValue); // Allow empty value or valid number
    }
  };

  return (
    <div className="mt-4 p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Create Payment</h2>
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
            value={amount || ""} // Ensure a string is set when amount is 0
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
