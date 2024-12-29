import React, { useEffect, useState } from "react";
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
import { db } from "@/app/config/firebase"; // Adjust import path

interface Payment {
  email: string;
  amount: number;
  service: string;
  createdAt: Timestamp; // Timestamp from Firestore
}

interface ViewPaymentsProps {
  email: string;
}

const ViewPayments: React.FC<ViewPaymentsProps> = ({ email }) => {
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
      const paymentsCollection = collection(db, "payments");
      let q = query(
        paymentsCollection,
        where("email", "==", email), // Filter by email
        orderBy("createdAt", "desc"), // Order by timestamp
        limit(5) // Limit to 5 payments per page
      );

      if (page > 1 && lastVisible) {
        // Paginate: fetch next set of documents after the last visible document
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

        // Update total pages based on the total number of payments
        const totalDocs = await getDocs(
          query(paymentsCollection, where("email", "==", email))
        );
        setTotalPages(Math.ceil(totalDocs.size / 5)); // Calculate total pages
      } else {
        setError("No more payments to display.");
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
  }, [email, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-4 p-6 border border-gray-300 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Payments for {email}</h2>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : payments.length === 0 ? (
        <div>No payments found for this email.</div>
      ) : (
        <div>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Service</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="text-sm">
                  <td className="py-2 px-4 border-b">{payment.service}</td>
                  <td className="py-2 px-4 border-b">${payment.amount}</td>
                  <td className="py-2 px-4 border-b">
                    {payment.createdAt.toDate().toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`py-2 px-4 border rounded-md ${
                  currentPage === index + 1
                    ? "bg-primary text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPayments;
