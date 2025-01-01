// app/unauthorized/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Unauthorized() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after a short delay for a smoother experience
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to the home page
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timeout
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Unauthorized</h1>
        <p className="text-lg text-gray-600 ">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}
