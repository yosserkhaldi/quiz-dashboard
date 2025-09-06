// hooks/AuthContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { request } from "../lib/api";

type Stats = { totalGames: number; totalWins: number; totalCoins: number };
export type User = { _id: string; username?: string; email?: string; isGuest: boolean; stats?: Stats };

type AuthCtx = {
  user: User | null;
  token: string | null;
  bootstrapped: boolean;                     // 👈 NEW
  loginLocal: (e: string, p: string) => Promise<void>;
  signup: (u: string, e: string, p: string) => Promise<void>;
  guest: () => Promise<void>;
  logout: () => void;
};

const initToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);
const initUser = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as User) : null;
};

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTok] = useState<string | null>(initToken);
  const [user, setUser] = useState<User | null>(initUser);
  const [bootstrapped, setBootstrapped] = useState(false);   // 👈 NEW

  const store = (u: User, t: string) => {
    setTok(t);
    setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
  };

  useEffect(() => {
    if (!token) {
      setBootstrapped(true);                                  // nothing to refresh
      return;
    }
    (async () => {
      try {
        const { user: fresh } = await request<{ user: User }>("/api/users/me", { token });
        store(fresh, token);
      } catch (err) {
        console.error("auth refresh failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTok(null);
        setUser(null);
      } finally {
        setBootstrapped(true);                                // 👈 we’re ready either way
      }
    })();
  }, []); // mount

  const loginLocal = async (email: string, password: string) => {
    const { token } = await request<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const { user: me } = await request<{ user: User }>("/api/users/me", { token });
    store(me, token);
    setBootstrapped(true);
  };

  const signup = async (username: string, email: string, pw: string) => {
    const { token } = await request<{ token: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password: pw }),
    });
    const { user: me } = await request<{ user: User }>("/api/users/me", { token });
    store(me, token);
    setBootstrapped(true);
  };

  const guest = async () => {
    const { token } = await request<{ token: string }>("/api/auth/guest", { method: "POST" });
    const { user: me } = await request<{ user: User }>("/api/users/me", { token });
    store(me, token);
    setBootstrapped(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTok(null);
    setUser(null);
    setBootstrapped(true);
  };

  return (
    <Ctx.Provider value={{ user, token, bootstrapped, loginLocal, signup, guest, logout }}>
      {children}
    </Ctx.Provider>
  );
}
