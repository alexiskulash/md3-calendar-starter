import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./components/auth/AuthContext";
import { SignInScreen } from "./components/auth/SignInScreen";
import { ThemeProvider } from "./components/theme/ThemeContext";

function AuthGate() {
  const { activeAccount } = useAuth();
  return activeAccount ? <Index /> : <SignInScreen />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthGate />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
