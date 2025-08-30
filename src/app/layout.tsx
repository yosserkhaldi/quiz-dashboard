// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/admin/Sidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "QuizMaster Admin",
  description: "Admin dashboard for QuizMaster: manage users, questions, avatars, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased text-gray-800">
        {/* Decorative floating background */}
        <div className="background-icons" aria-hidden="true">
          <img src="/icons/graph-analysis.png" alt="" />
          <img src="/icons/quizz.png" alt="" />
          <img src="/icons/question.png" alt="" />
          <img src="/icons/presentation.png" alt="" />
          <img src="/icons/business-analystt.png" alt="" />
          <img src="/icons/business-analyst.png" alt="" />
        </div>

        <Sidebar />

        {/* Content wrapper: full width on mobile, padded by --sbw on md+ */}
        <div className="relative z-10 layout">   {/* z-10 < z-40 sidebar */}
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </div>


      </body>
    </html>
  );
}
