"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getToken } from "@/lib/api";
import type { User } from "@/lib/types";
type AuthValue = {
  user: User | null;
  token: string | null;
  ready: boolean;
  setSession: (token: string, user: User) => void;
  logout: () => void;
  refresh: () => void;
};
const AuthContext = createContext<AuthValue | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const refresh = () => {
    setToken(getToken());
    setUser(getCurrentUser());
  };
  useEffect(() => {
    refresh();
    setReady(true);
  }, []);
  const setSession = (t: string, u: User) => {
    localStorage.setItem("loop_token", t);
    localStorage.setItem("loop_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem("loop_token");
    localStorage.removeItem("loop_user");
    setToken(null);
    setUser(null);
    router.push("/login");
  };
  return (
    <AuthContext.Provider
      value={{ user, token, ready, setSession, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
