"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  orderBy,
  DocumentSnapshot,
  Timestamp,
  startAfter,
} from "firebase/firestore";
import { db } from "@/app/config/firebase";

type Referral = {
  id: string;
  email: string;
  role: string;
  createdAt: Timestamp;
};

const ViewReferrals: React.FC<{ referralCode: string }> = ({
  referralCode,
}) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);

  const fetchReferrals = async (page: number) => {
    setLoading(true);
    setError(""); // Clear any existing errors

    try {
      const referralsRef = collection(db, "users");
      let q = query(
        referralsRef,
        where("referredBy", "==", referralCode),
        orderBy("createdAt", "desc"), // Order by createdAt
        limit(5) // Limit to 5 referrals per page
      );

      // Fetch data based on page number
      if (page > 1 && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const referralData: Referral[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          role: doc.data().role,
          createdAt: doc.data().createdAt,
        }));
        setReferrals(referralData);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        // Update total pages based on the total number of referrals
        if (totalPages === 1) {
          const totalDocsSnapshot = await getDocs(
            query(referralsRef, where("referredBy", "==", referralCode))
          );
          setTotalPages(Math.ceil(totalDocsSnapshot.size / 5)); // Calculate total pages
        }
      } else {
        setError("No referrals found.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      console.error("Error fetching referrals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals(currentPage);
  }, [referralCode, currentPage]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mt-6 border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white">
      <div className="bg-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">Referrals</h2>
      </div>

      {loading ? (
        <div className="p-6 text-center text-gray-500">
          Loading referrals...
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">{error}</div>
      ) : referrals.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No referrals found for this user.
        </div>
      ) : (
        <div>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Role</th>
                <th className="py-3 px-4 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral, index) => (
                <tr
                  key={referral.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-3 px-4 border-b">{referral.email}</td>
                  <td className="py-3 px-4 border-b">{referral.role}</td>
                  <td className="py-3 px-4 border-b">
                    {referral.createdAt.toDate().toLocaleString()}
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
  );
};

export default ViewReferrals;
