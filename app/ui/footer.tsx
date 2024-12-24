import React from "react";
import Link from "next/link";

const translations = {
  footer: {
    rights: "All Rights Reserved",
    contact: "Contact Us",
  },
};

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-5 text-center">
      <p className="text-base">
        &copy; {new Date().getFullYear()} Baicao. {translations?.footer?.rights}
        .
      </p>
      <Link href="/contact">
        <div className="text-white hover:underline text-sm mt-2">
          {translations?.footer?.contact}
        </div>
      </Link>
    </footer>
  );
}
