import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/types";
import { getCurrentUser, login as apiLogin, logout as apiLogout, signup as apiSignup } from "@/services/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (user: Pick<User, "username" | "email" | "password">) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: async (email, password) => {
      const res = await apiLogin(email, password);
      if (res.success) {
        setUser(res.user);
        return true;
      }
      return false;
    },
    logout: async () => {
      await apiLogout();
      setUser(null);
    },
    signup: async ({ username, email, password }) => {
      const res = await apiSignup({ username, email, password });
      return res.success;
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
