// app/admin/(auth)/layout.tsx  (CLIENT component)
"use client";

import { AuthProvider } from "@/hooks/AuthContext";

export default function PublicAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <main className="min-h-screen flex items-center justify-center p-6">
        {children}
      </main>
    </AuthProvider>
  );
}
