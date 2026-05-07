import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

export interface Account {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

export const ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@example.com",
    initials: "AC",
    color: "hsl(var(--md-sys-color-primary))",
  },
  {
    id: "2",
    name: "Work Account",
    email: "alex.work@company.com",
    initials: "W",
    color: "#006A6A", // Material Teal
  },
];

interface AuthContextValue {
  accounts: Account[];
  activeAccount: Account | null;
  switchAccount: (id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  const activeAccount = useMemo(() => {
    return ACCOUNTS.find((a) => a.id === activeAccountId) || null;
  }, [activeAccountId]);

  const switchAccount = (id: string) => {
    setActiveAccountId(id);
  };

  const logout = () => {
    setActiveAccountId(null);
  };

  const value = useMemo(
    () => ({
      accounts: ACCOUNTS,
      activeAccount,
      switchAccount,
      logout,
    }),
    [activeAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
