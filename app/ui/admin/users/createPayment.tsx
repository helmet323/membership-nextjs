import React, { useState } from "react";
import {
  serverTimestamp,
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/config/firebase"; // Adjust import path

interface CreatePaymentProps {
  email: string;
  points: number;
  funds: number;
  referredBy?: string;
  onPointsUpdate: (newPoints: number) => void;
  onFundsUpdate: (newFunds: number) => void;
}

interface PaymentDetails {
  amount: number;
  service: string;
  paymentMethod: string;
}

const CreatePayment: React.FC<CreatePaymentProps> = ({
  email,
  points,
  funds,
  referredBy,
  onPointsUpdate,
  onFundsUpdate,
}) => {
  const [formState, setFormState] = useState({
    amount: 0,
    service: "",
    paymentMethod: "paywithfunds", // Default to 'paywithfunds'
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (!value || !isNaN(parsedValue)) {
      setFormState((prevState) => ({ ...prevState, amount: parsedValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { amount, service, paymentMethod } = formState;
    if (amount <= 0 || !service) {
      setErrorMessage("Please fill in all fields correctly.");
      return;
    }

    if (paymentMethod === "paywithfunds" && amount > funds) {
      setErrorMessage("You do not have enough funds for this payment.");
      return;
    }

    setPaymentDetails({ amount, service, paymentMethod });
    setIsConfirmationOpen(true);
  };

  const handleConfirmation = async (confirmed: boolean) => {
    if (confirmed) {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        const paymentsCollection = collection(db, "payments");
        const paymentRecord = {
          email,
          ...formState,
          type: "service_payment",
          createdAt: serverTimestamp(),
        };

        await addDoc(paymentsCollection, paymentRecord);

        if (formState.paymentMethod === "paywithfunds") {
          const userDocRef = doc(db, "users", email);
          await updateDoc(userDocRef, {
            funds: increment(-formState.amount),
            points: increment(formState.amount),
          });
          onFundsUpdate(funds - formState.amount);
          onPointsUpdate(points + formState.amount);
        }

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
              points: increment(formState.amount / 10),
            });
          }
        }

        alert("Service payment recorded successfully!");
        setFormState({ amount: 0, service: "", paymentMethod: "paywithfunds" });
      } catch (error) {
        console.error("Error adding document: ", error);
        setErrorMessage("Error creating payment record. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }

    setIsConfirmationOpen(false);
  };

  return (
    <div className="mt-4 p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Record Service Payment</h2>

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
            value={formState.amount || ""}
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
            value={formState.service}
            onChange={handleChange}
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

        {/* Payment Method Select */}
        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700"
          >
            Payment Method
          </label>
          <select
            id="paymentMethod"
            value={formState.paymentMethod}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="paywithfunds">Pay with Funds</option>
            <option value="cash">Cash</option>
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

      {/* Confirmation Modal */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-semibold mb-4">Confirm Payment</h3>
            <p>
              <strong>Amount:</strong> ${paymentDetails?.amount}
            </p>
            <p>
              <strong>Service:</strong> {paymentDetails?.service}
            </p>
            <p>
              <strong>Payment Method:</strong> {paymentDetails?.paymentMethod}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleConfirmation(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePayment;
