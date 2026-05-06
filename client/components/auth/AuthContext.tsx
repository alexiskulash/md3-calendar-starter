import { createContext, useContext, useState } from "react";

export interface AuthUser {
  name: string;
  email: string;
  initials: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function makeUser(email: string): AuthUser {
  const local = email.split("@")[0];
  const words = local.replace(/[._+]/g, " ").trim().split(/\s+/);
  const name = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const initials = words
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  return { name, email, initials };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, _password: string) => {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 750));
    setUser(makeUser(email));
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
