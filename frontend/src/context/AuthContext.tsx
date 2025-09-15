import { createContext, useMemo, useState, useEffect } from "react";

type Role = "admin" | "client" | string;
type User = { id: string | number; role: Role; email?: string } | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  logout: () => Promise<void>;
  login: (token: string, u?: User) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  logout: async () => {},
  login: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = (token: string, u?: User) => {
    if (token) localStorage.setItem("token", token);
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
    }
  };

  const logout = async () => {
    try {
      // si usas cookie httpOnly en el backend, puedes llamar:
      // await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, logout, login }),
    [user, loading]
  );

  useEffect(() => {}, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
