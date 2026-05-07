import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextValue } from "../types/auth";

const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "Alex Chen",
    email: "alex@example.com",
    color: "#4285F4",
    initials: "AC"
  },
  {
    id: "user-2",
    name: "Morgan Lee",
    email: "morgan@example.com",
    color: "#34A853",
    initials: "ML"
  }
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("calendar_current_user_id");
    if (storedUserId) {
      const user = MOCK_USERS.find(u => u.id === storedUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
    setIsInitialized(true);
  }, []);

  const signIn = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("calendar_current_user_id", user.id);
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("calendar_current_user_id");
  };

  const switchAccount = (userId: string) => {
    signIn(userId);
  };

  const value = {
    currentUser,
    users: MOCK_USERS,
    signIn,
    signOut,
    switchAccount
  };

  // Prevent flashing unauthenticated state while checking localStorage
  if (!isInitialized) {
    return null; 
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
