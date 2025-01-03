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
import { db } from "@/app/config/firebase";

interface Payment {
  email: string;
  amount: number;
  type: string;
  service?: string;
  paymentMethod: string; // New field for payment method
  createdAt: Timestamp;
}

interface ViewPaymentsProps {
  email: string;
}

const ViewPayments: React.FC<ViewPaymentsProps> = ({ email }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);

  const fetchPayments = async (page: number) => {
    setIsLoading(true);
    setError("");

    try {
      const paymentsCollection = collection(db, "payments");
      let q = query(
        paymentsCollection,
        where("email", "==", email),
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
          type: doc.data().type,
          service:
            doc.data().type === "service_payment"
              ? doc.data().service
              : undefined,
          paymentMethod: doc.data().paymentMethod, // Assuming this field exists
          createdAt: doc.data().createdAt,
        }));

        setPayments(paymentsData);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        // Update the totalPages only if it's not already set
        if (totalPages === 1) {
          const totalDocsSnapshot = await getDocs(
            query(paymentsCollection, where("email", "==", email))
          );
          setTotalPages(Math.ceil(totalDocsSnapshot.size / 5));
        }
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
  }, [email, currentPage]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mt-6 border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white">
      <div className="bg-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">Payments</h2>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">{error}</div>
      ) : payments.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No payments found for this email.
        </div>
      ) : (
        <div>
          <table className="w-full table-auto border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 border-b">Type</th>
                <th className="py-3 px-4 border-b">Service</th>
                <th className="py-3 px-4 border-b text-right">Amount</th>
                <th className="py-3 px-4 border-b">Payment Method</th>{" "}
                {/* New column */}
                <th className="py-3 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="py-3 px-4 border-b capitalize">
                    {payment.type?.replace("_", " ")
                      ? payment.type?.replace("_", " ")
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {payment.service || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b text-right">
                    <span
                      className={`${
                        payment.type === "service_payment"
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {payment.type === "service_payment"
                        ? `- $${payment.amount.toFixed(2)}`
                        : `$${payment.amount.toFixed(2)}`}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    {payment.paymentMethod ? payment.paymentMethod : "N/A"}
                  </td>
                  {/* Display payment method */}
                  <td className="py-3 px-4 border-b text-gray-600">
                    {payment.createdAt.toDate().toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
  );
};

export default ViewPayments;
