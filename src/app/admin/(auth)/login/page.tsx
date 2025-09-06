"use client";

import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const { loginLocal, guest } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setErr(null);
        try {
            await loginLocal(email, pw);
            router.replace("/admin"); // go to dashboard
        } catch (e: any) {
            setErr(e?.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const onGuest = async () => {
        setLoading(true); setErr(null);
        try {
            await guest();
            router.replace("/admin");
        } catch (e: any) {
            setErr(e?.message ?? "Guest login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-6">
            <h1 className="text-2xl font-semibold text-center">Admin Login</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <input
                    type="email"
                    className="w-full rounded border p-2"
                    placeholder="email@domain.tld"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
                <input
                    type="password"
                    className="w-full rounded border p-2"
                    placeholder="••••••••"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                {err && <p className="text-sm text-red-600">{err}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-black text-white py-2"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
            <button
                onClick={onGuest}
                disabled={loading}
                className="w-full rounded border py-2"
            >
                Continue as Guest
            </button>
        </div>
    );
}
