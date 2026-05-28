import { createContext, useContext, useState, ReactNode } from "react";

export interface Account {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

interface AuthContextValue {
  currentUser: Account | null;
  accounts: Account[];
  signIn: (account: Account) => void;
  signOut: () => void;
  switchAccount: (account: Account) => void;
}

const SEEDED_ACCOUNTS: Account[] = [
  { id: "1", name: "Alex Chen", email: "alex.chen@gmail.com", initials: "AC", color: "#0B57D0" },
  { id: "2", name: "Alex Chen", email: "alex@designco.com", initials: "AC", color: "#1E8E3E" },
  { id: "3", name: "Jamie Park", email: "jamie.park@gmail.com", initials: "JP", color: "#8430CE" },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Account | null>(null);

  const signIn = (account: Account) => setCurrentUser(account);
  const signOut = () => setCurrentUser(null);
  const switchAccount = (account: Account) => setCurrentUser(account);

  return (
    <AuthContext.Provider value={{ currentUser, accounts: SEEDED_ACCOUNTS, signIn, signOut, switchAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
