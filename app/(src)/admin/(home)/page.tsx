"use client";

import { useAuth } from "@/app/context/authContext";

export default function Page() {
  const { userData } = useAuth();

  return (
    <div>
      <h1 className="text-2xl">{`Welcome, ${userData?.email}!`}</h1>
      <p className="mt-2">This is the Admin Dashboard.</p>
      <p>Select an option from the sidebar to manage the admin panel.</p>
    </div>
  );
}
