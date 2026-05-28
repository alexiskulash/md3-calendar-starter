import { createContext, useContext, useState, ReactNode } from "react";
import { Account } from "../types/auth";

const MOCK_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex.chen@gmail.com",
    initials: "AC",
    color: "#0B57D0",
  },
  {
    id: "2",
    name: "Alex Chen (Work)",
    email: "achen@company.com",
    initials: "AC",
    color: "#33B679",
  },
  {
    id: "3",
    name: "Maya Chen",
    email: "maya.chen@gmail.com",
    initials: "MC",
    color: "#8E24AA",
  },
];

interface AuthContextValue {
  activeAccount: Account | null;
  accounts: Account[];
  signIn: (id: string) => void;
  signOut: () => void;
  switchAccount: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  const signIn = (id: string) => {
    const account = MOCK_ACCOUNTS.find((a) => a.id === id) ?? null;
    setActiveAccount(account);
  };

  const signOut = () => setActiveAccount(null);

  const switchAccount = (id: string) => {
    const account = MOCK_ACCOUNTS.find((a) => a.id === id) ?? null;
    setActiveAccount(account);
  };

  return (
    <AuthContext.Provider
      value={{ activeAccount, accounts: MOCK_ACCOUNTS, signIn, signOut, switchAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
