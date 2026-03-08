import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getStoredUser,
  validateToken,
  type BackendlessUser,
} from "../lib/backendless";

/* ───────── Context Types ───────── */
interface AuthContextType {
  user: BackendlessUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/* ───────── Provider ───────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackendlessUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check stored session on mount
  useEffect(() => {
    async function checkAuth() {
      const storedUser = getStoredUser();
      if (storedUser) {
        const isValid = await validateToken();
        if (isValid) {
          setUser(storedUser);
        }
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await apiLogin(email, password);
    setUser(loggedInUser);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await apiRegister(name, email, password);
      // After register, auto-login
      const loggedInUser = await apiLogin(email, password);
      setUser(loggedInUser);
    },
    []
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ───────── Hook ───────── */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
