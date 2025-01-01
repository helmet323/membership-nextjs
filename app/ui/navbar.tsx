"use client";

import Link from "next/link";
import { useAuth } from "../context/authContext";
import ToggleMenu from "./navbar/toggleMenu";

const translations = {
  navbar: {
    pages: [
      { name: "About", link: "/about" },
      { name: "Services", link: "/services" },
      { name: "Contact", link: "/contact" },
    ],
    settings: [
      { name: "Profile", link: "/profile" },
      { name: "History", link: "/history" },
      // Admin link will be conditionally rendered
    ],
    login: { name: "Login", link: "/login?mode=login" },
    language: "Language",
  },
};

export default function Navbar() {
  const { userData } = useAuth(); // Fetch user data from auth context

  // Conditionally add Admin link if the user is an admin
  const settings = [
    { name: "Profile", link: "/profile" },
    { name: "History", link: "/history" },
    ...(userData?.role === "admin" ? [{ name: "Admin", link: "/admin" }] : []), // Admin link conditionally added
  ];

  return (
    <div className="w-full px-8 bg-primary">
      <div className="flex items-center justify-between max-w-screen-2xl m-auto">
        <div className="flex items-center">
          <Link href="/">
            <div className="mr-8 flex font-mono font-bold tracking-[.3rem] text-[18px]">
              Baicao
            </div>
          </Link>

          <div className="flex gap-4">
            {translations?.navbar?.pages?.map((page) => (
              <Link href={page.link} key={page.name}>
                <div className="p-4 py-6 font-mono">{page.name}</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono">
          <div>{translations?.navbar?.language}</div>

          {userData ? (
            <div>
              <ToggleMenu settings={settings} />{" "}
            </div>
          ) : (
            <div>
              <Link
                className="border py-2 px-4 rounded-md hover:bg-[rgba(255,255,255,0.1)] font-mono"
                href={translations?.navbar?.login?.link}
              >
                {translations?.navbar?.login?.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
