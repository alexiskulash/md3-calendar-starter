import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing mock session
    try {
      const storedUser = localStorage.getItem("mock_auth_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to parse stored user", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Create a mock user based on the email
    const name = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = name.split(" ").map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
    const initials = formattedName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "U";
    
    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      name: formattedName || "User",
      email,
      avatarInitials: initials,
    };
    
    setUser(mockUser);
    localStorage.setItem("mock_auth_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
