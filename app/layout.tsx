import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Baicao Wellness Centre",
  description: "A place to relax",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.className} antialiased min-h-[100vh]`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
