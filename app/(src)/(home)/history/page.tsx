"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/app/config/firebase";
import { useAuth } from "@/app/context/authContext"; // Assuming you have an auth context

type Payment = {
  email: string;
  amount: number;
  service: string;
  createdAt: Timestamp;
};

export default function Page() {
  const { userData } = useAuth(); // Get user data from context
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);

  const fetchPayments = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!userData?.email) {
        setError("User not authenticated.");
        return;
      }

      const paymentsCollection = collection(db, "payments");
      let q = query(
        paymentsCollection,
        where("email", "==", userData.email), // Filter payments by user's email
        orderBy("createdAt", "desc"),
        limit(5)
      );

      if (page > 1 && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const paymentsData: Payment[] = querySnapshot.docs.map((doc) => ({
          email: doc.data().email,
          amount: doc.data().amount,
          service: doc.data().service,
          createdAt: doc.data().createdAt,
        }));

        setPayments(paymentsData);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        const totalDocs = await getDocs(
          query(paymentsCollection, where("email", "==", userData.email))
        );
        setTotalPages(Math.ceil(totalDocs.size / 5));
      } else {
        setError("No payments found.");
      }
    } catch (err) {
      setError("Error fetching payments.");
      console.error("Error fetching payments: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage, userData?.email]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Payment History
          </h2>

          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : payments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No payments found.
            </div>
          ) : (
            <div>
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-3 px-4 border-b">Service</th>
                    <th className="py-3 px-4 border-b">Amount</th>
                    <th className="py-3 px-4 border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4 border-b text-gray-600">
                        {payment.service}
                      </td>
                      <td className="py-3 px-4 border-b text-gray-600">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 border-b text-gray-600">
                        {payment.createdAt.toDate().toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="p-4 bg-gray-100 flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 text-sm font-medium border rounded ${
                      currentPage === index + 1
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
