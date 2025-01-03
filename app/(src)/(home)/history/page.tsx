"use client";

import { useAuth } from "@/app/context/authContext";
import ViewPayments from "@/app/ui/admin/users/viewPayments";

export default function Page() {
  const { userData } = useAuth();

  // Check if userData is available before rendering ViewPayments
  if (!userData) {
    return <div>Loading...</div>; // Or an appropriate loading state
  }

  return (
    <div className="text-black p-4">
      <ViewPayments email={userData.email} />
    </div>
  );
}
