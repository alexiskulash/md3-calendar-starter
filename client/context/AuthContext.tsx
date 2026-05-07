import { createContext, useContext, useState, ReactNode } from 'react';

export interface Account {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

interface AuthContextType {
  accounts: Account[];
  activeAccount: Account | null;
  signIn: (accountId: string) => void;
  signOut: () => void;
}

const MOCK_ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    initials: 'AC',
    color: 'hsl(var(--md-sys-color-primary))',
  },
  {
    id: '2',
    name: 'Work Account',
    email: 'alex@work.com',
    initials: 'WA',
    color: 'hsl(var(--md-sys-color-tertiary))',
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  const signIn = (accountId: string) => {
    const account = MOCK_ACCOUNTS.find(a => a.id === accountId);
    if (account) {
      setActiveAccount(account);
    }
  };

  const signOut = () => {
    setActiveAccount(null);
  };

  return (
    <AuthContext.Provider value={{
      accounts: MOCK_ACCOUNTS,
      activeAccount,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
