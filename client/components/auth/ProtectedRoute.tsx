import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { activeAccount } = useAuth();
  const location = useLocation();

  if (!activeAccount) {
    // Redirect to the account picker if there's no active session
    return <Navigate to="/account-picker" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
