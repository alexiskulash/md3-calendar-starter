export interface User {
  id: string;
  name: string;
  email: string;
  color: string;
  initials: string;
}

export interface AuthContextValue {
  currentUser: User | null;
  users: User[];
  signIn: (userId: string) => void;
  signOut: () => void;
  switchAccount: (userId: string) => void;
}
