import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "@material/web/button/filled-button.js";
import "@material/web/textfield/filled-text-field.js";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    
    try {
      setError("");
      setIsSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Failed to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface p-4 text-on-surface">
      <div className="w-full max-w-md rounded-3xl bg-surface-container p-8 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-on-surface-variant">Sign in to continue to Calendar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <md-filled-text-field
            label="Email"
            type="email"
            value={email}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            disabled={isSubmitting ? true : undefined}
            required
          />

          <md-filled-text-field
            label="Password"
            type="password"
            value={password}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            disabled={isSubmitting ? true : undefined}
            required
          />

          {error && (
            <div className="rounded-lg bg-error-container p-4 text-sm text-on-error-container">
              {error}
            </div>
          )}

          <div className="mt-2 flex flex-col gap-4">
            <md-filled-button
              type="submit"
              className="w-full"
              disabled={isSubmitting ? true : undefined}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </md-filled-button>
            <p className="text-center text-sm text-on-surface-variant">
              (Use any email and password for this mock auth)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
