import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Account {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // Optional real profile photo
  initials: string;
  color: string;
}

// Predefined mock accounts
const MOCK_ACCOUNTS: Account[] = [
  {
    id: "user_1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    initials: "AJ",
    color: "hsl(var(--md-sys-color-primary))"
  },
  {
    id: "user_2",
    name: "Work Account",
    email: "alex@company.com",
    initials: "W",
    color: "hsl(var(--md-sys-color-tertiary))"
  }
];

interface AuthContextType {
  activeAccount: Account | null;
  knownAccounts: Account[];
  signIn: (accountId: string) => void;
  signOut: () => void;
  addAccount: (account: Omit<Account, "id">) => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [knownAccounts, setKnownAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedKnown = localStorage.getItem("calendar_known_accounts");
      const storedActive = localStorage.getItem("calendar_active_account_id");
      
      let accountsToUse = MOCK_ACCOUNTS;
      if (storedKnown) {
        accountsToUse = JSON.parse(storedKnown);
        setKnownAccounts(accountsToUse);
      }
      
      if (storedActive) {
        const account = accountsToUse.find(a => a.id === storedActive);
        if (account) {
          setActiveAccount(account);
        }
      }
    } catch (e) {
      console.error("Failed to load auth state", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save known accounts when it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("calendar_known_accounts", JSON.stringify(knownAccounts));
    }
  }, [knownAccounts, isInitialized]);

  // Save active account when it changes
  useEffect(() => {
    if (isInitialized) {
      if (activeAccount) {
        localStorage.setItem("calendar_active_account_id", activeAccount.id);
      } else {
        localStorage.removeItem("calendar_active_account_id");
      }
    }
  }, [activeAccount, isInitialized]);

  const signIn = (accountId: string) => {
    const account = knownAccounts.find(a => a.id === accountId);
    if (account) {
      setActiveAccount(account);
    }
  };

  const signOut = () => {
    setActiveAccount(null);
  };

  const addAccount = (accountData: Omit<Account, "id">) => {
    const newAccount: Account = {
      ...accountData,
      id: `user_${Date.now()}`
    };
    
    setKnownAccounts(prev => [...prev, newAccount]);
    setActiveAccount(newAccount);
  };

  return (
    <AuthContext.Provider
      value={{
        activeAccount,
        knownAccounts,
        signIn,
        signOut,
        addAccount,
        isInitialized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
