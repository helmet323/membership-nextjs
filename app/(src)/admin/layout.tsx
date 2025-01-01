"use client";

import { useAuth } from "@/app/context/authContext";
import SideNav from "@/app/ui/admin/sidenav";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCalendar, BiHome, BiUser } from "react-icons/bi";

const sidebarItems = [
  { label: "Home", href: "/admin", icon: <BiHome /> },
  { label: "Users", href: "/admin/users", icon: <BiUser /> },
  { label: "Schedule", href: "/admin/schedule", icon: <BiCalendar /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // state to track loading of user data

  useEffect(() => {
    if (userData) {
      if (userData.role !== "admin") {
        router.push("/unauthorized"); // Redirect to the unauthorized page if not admin
      } else {
        setLoading(false); // Stop loading once the user data is verified as admin
      }
    }
  }, [userData, router]);

  // If user data is still loading or if they're not an admin, don't render the layout
  if (loading || userData?.role !== "admin") {
    return null; // Or a loading spinner if preferred
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="h-full text-black bg-white">
        <SideNav links={sidebarItems} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 text-black">
        {children}
      </div>
    </div>
  );
}
