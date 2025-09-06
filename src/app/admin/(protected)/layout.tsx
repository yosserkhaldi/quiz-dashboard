// app/admin/(protected)/layout.tsx  (CLIENT component)
"use client";

import Sidebar from "@/components/admin/Sidebar";
import { AuthProvider, useAuth } from "@/hooks/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, user, bootstrapped } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!bootstrapped) return;
    if (!token || !user) router.replace("/admin/login");
  }, [bootstrapped, token, user, router]);

  // Avoid flashing sidebar for guests
  if (!bootstrapped || !token || !user) return null;

  return <>{children}</>;
}

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        {/* Background & Sidebar only when authenticated */}
        <div className="background-icons" aria-hidden="true">
          <img src="/icons/graph-analysis.png" alt="" />
          <img src="/icons/quizz.png" alt="" />
          <img src="/icons/question.png" alt="" />
          <img src="/icons/presentation.png" alt="" />
          <img src="/icons/business-analystt.png" alt="" />
          <img src="/icons/business-analyst.png" alt="" />
        </div>

        <Sidebar />

        <div className="relative z-10 layout">
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
