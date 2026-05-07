import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

export interface UserContextValue {
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  switchAccount: (id: string) => void;
  addAccount: (account: UserAccount) => void;
  signOut: (id?: string) => void;
  signOutAll: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@example.com",
    avatarColor: "hsl(var(--md-sys-color-primary))",
  },
  {
    id: "2",
    name: "Work Account",
    email: "alex.c@company.com",
    avatarColor: "hsl(var(--md-sys-color-tertiary))",
  },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem("calendar_accounts");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored accounts", e);
    }
    return DEFAULT_ACCOUNTS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      const storedId = localStorage.getItem("calendar_current_user_id");
      if (storedId) return storedId;
    } catch (e) {
      console.error("Failed to parse stored current user id", e);
    }
    return DEFAULT_ACCOUNTS[0].id;
  });

  useEffect(() => {
    localStorage.setItem("calendar_accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem("calendar_current_user_id", currentUserId);
    } else {
      localStorage.removeItem("calendar_current_user_id");
    }
  }, [currentUserId]);

  const currentUser = currentUserId
    ? accounts.find((a) => a.id === currentUserId) || null
    : null;

  const switchAccount = (id: string) => {
    if (accounts.some((a) => a.id === id)) {
      setCurrentUserId(id);
    }
  };

  const addAccount = (account: UserAccount) => {
    if (!accounts.some((a) => a.id === account.id)) {
      setAccounts([...accounts, account]);
    }
    setCurrentUserId(account.id);
  };

  const signOut = (id?: string) => {
    const targetId = id || currentUserId;
    if (!targetId) return;

    const newAccounts = accounts.filter((a) => a.id !== targetId);
    setAccounts(newAccounts);

    if (currentUserId === targetId) {
      setCurrentUserId(newAccounts.length > 0 ? newAccounts[0].id : null);
    }
  };

  const signOutAll = () => {
    setAccounts([]);
    setCurrentUserId(null);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        accounts,
        switchAccount,
        addAccount,
        signOut,
        signOutAll,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
