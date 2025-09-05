import { createContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: number;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setUser(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};