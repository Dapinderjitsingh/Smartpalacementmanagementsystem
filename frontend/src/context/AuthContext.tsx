import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type AppUser = {
  _id: string;
  name: string;
  email: string;
  role: "student" | "recruiter" | "admin";
  profilePic?: string | null;
};

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  login: (token: string, user: AppUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("smartplacement_token");
    localStorage.removeItem("smartplacement_user");
    setUser(null);
  };

  const login = (token: string, nextUser: AppUser) => {
    localStorage.setItem("smartplacement_token", token);
    localStorage.setItem("smartplacement_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("smartplacement_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get("/auth/me");
      if (!response?.success) throw new Error(response?.message || "Unauthorized");
      setUser(response.user);
      localStorage.setItem("smartplacement_user", JSON.stringify(response.user));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedUser = localStorage.getItem("smartplacement_user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
    refreshUser();
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshUser }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
