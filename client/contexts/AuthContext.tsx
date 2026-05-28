import { createContext, useContext, useState, ReactNode } from "react";

export interface Account {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

interface AuthContextValue {
  activeAccount: Account | null;
  accounts: Account[];
  signIn: (id: string) => void;
  signOut: () => void;
  switchAccount: (id: string) => void;
}

const ACCOUNTS: Account[] = [
  {
    id: "alex-personal",
    name: "Alex Chen",
    email: "alex.chen@gmail.com",
    initials: "AC",
    color: "#0B57D0",
  },
  {
    id: "alex-work",
    name: "Alex Chen (Work)",
    email: "alex@acme.co",
    initials: "AC",
    color: "#1E8E3E",
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  const signIn = (id: string) => {
    const account = ACCOUNTS.find((a) => a.id === id) ?? null;
    setActiveAccount(account);
  };

  const signOut = () => setActiveAccount(null);

  const switchAccount = (id: string) => {
    const account = ACCOUNTS.find((a) => a.id === id) ?? null;
    setActiveAccount(account);
  };

  return (
    <AuthContext.Provider
      value={{ activeAccount, accounts: ACCOUNTS, signIn, signOut, switchAccount }}
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
