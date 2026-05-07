import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Account {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

const MOCK_ACCOUNTS: Account[] = [
  {
    id: "acc_1",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    initials: "AC",
    color: "hsl(217, 87%, 43%)", // Primary Blue
  },
  {
    id: "acc_2",
    name: "Alex Work",
    email: "alex@acmecorp.com",
    initials: "AW",
    color: "hsl(280, 70%, 40%)", // Purple
  },
];

interface AuthContextValue {
  activeAccount: Account | null;
  accounts: Account[];
  signIn: (id: string) => void;
  switchAccount: (id: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  const signIn = (id: string) => {
    const account = MOCK_ACCOUNTS.find((a) => a.id === id);
    if (account) setActiveAccount(account);
  };

  const switchAccount = (id: string) => {
    const account = MOCK_ACCOUNTS.find((a) => a.id === id);
    if (account) setActiveAccount(account);
  };

  const signOut = () => {
    setActiveAccount(null);
  };

  return (
    <AuthContext.Provider
      value={{
        activeAccount,
        accounts: MOCK_ACCOUNTS,
        signIn,
        switchAccount,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
