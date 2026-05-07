import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AccountPicker from "./pages/AccountPicker";
import { AuthProvider } from "./components/auth/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route path="/account-picker" element={<AccountPicker />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
