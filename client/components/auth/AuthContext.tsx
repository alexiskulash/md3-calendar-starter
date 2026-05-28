import { createContext, useContext, useState, ReactNode } from "react";
import { UserAccount } from "../../types/auth";

const KNOWN_ACCOUNTS: UserAccount[] = [
  {
    id: "alex-chen",
    name: "Alex Chen",
    email: "alex.chen@gmail.com",
    initials: "AC",
    color: "#0B57D0",
  },
  {
    id: "jordan-park",
    name: "Jordan Park",
    email: "jordan.park@work.com",
    initials: "JP",
    color: "#33B679",
  },
];

interface AuthContextValue {
  activeAccount: UserAccount | null;
  knownAccounts: UserAccount[];
  signIn: (id: string) => void;
  signOut: () => void;
  switchAccount: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [activeAccount, setActiveAccount] = useState<UserAccount | null>(null);

  const signIn = (id: string) => {
    const account = KNOWN_ACCOUNTS.find((a) => a.id === id) ?? null;
    setActiveAccount(account);
  };

  const signOut = () => setActiveAccount(null);

  const switchAccount = (id: string) => {
    const account = KNOWN_ACCOUNTS.find((a) => a.id === id) ?? null;
    setActiveAccount(account);
  };

  return (
    <AuthContext.Provider
      value={{ activeAccount, knownAccounts: KNOWN_ACCOUNTS, signIn, signOut, switchAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
