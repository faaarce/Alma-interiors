import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getStoredUser, validateToken, type BackendlessUser } from "../lib/backendless";

interface AuthContextType {
  user: BackendlessUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackendlessUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const stored = getStoredUser();
      if (stored) { const valid = await validateToken(); if (valid) setUser(stored); }
      setIsLoading(false);
    }
    check();
  }, []);

  const login = useCallback(async (email: string, password: string) => { setUser(await apiLogin(email, password)); }, []);
  const register = useCallback(async (name: string, email: string, password: string) => { await apiRegister(name, email, password); setUser(await apiLogin(email, password)); }, []);
  const logout = useCallback(async () => { await apiLogout(); setUser(null); }, []);

  return <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
