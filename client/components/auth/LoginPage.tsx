import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
import { useState } from "react";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("alex.chen@example.com");
    setPassword("demo1234");
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "hsl(var(--md-sys-color-surface-container-low))",
        fontFamily: "inherit",
      }}
    >
      {/* Left branding panel — desktop only */}
      <div
        style={{
          display: "none",
          flex: "0 0 420px",
          background: `linear-gradient(160deg,
            hsl(var(--md-sys-color-primary)) 0%,
            hsl(var(--md-sys-color-tertiary)) 100%)`,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "48px 40px",
        }}
        className="login-brand-panel"
      >
        {/* Big calendar tile */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ height: 22, backgroundColor: "rgba(255,255,255,0.25)" }} />
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            28
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
            Calendar
          </div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", marginTop: 8, lineHeight: 1.5 }}>
            Your day, beautifully organized.
          </div>
        </div>

        {/* Feature bullets */}
        {[
          { icon: "calendar_month", text: "Week & day time grid" },
          { icon: "drag_indicator", text: "Drag to reschedule" },
          { icon: "group", text: "Multiple calendars" },
        ].map(({ icon, text }) => (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "rgba(255,255,255,0.9)",
              fontSize: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <md-icon style={{ color: "#fff", fontSize: "18px" }}>{icon}</md-icon>
            </div>
            {text}
          </div>
        ))}
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "hsl(var(--md-sys-color-surface))",
            borderRadius: 24,
            padding: "40px 36px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          }}
        >
          {/* Mobile logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: "hsl(var(--md-sys-color-primary-container))",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                flexShrink: 0,
                boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              }}
            >
              <div
                style={{
                  height: 8,
                  backgroundColor: "hsl(var(--md-sys-color-primary))",
                }}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "hsl(var(--md-sys-color-on-primary-container))",
                }}
              >
                28
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "hsl(var(--md-sys-color-on-surface))",
                  letterSpacing: "-0.2px",
                }}
              >
                Calendar
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "hsl(var(--md-sys-color-on-surface))",
              letterSpacing: "-0.3px",
              marginBottom: 6,
            }}
          >
            Sign in
          </div>
          <div
            style={{
              fontSize: 14,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              marginBottom: 28,
            }}
          >
            Use your Calendar account
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Email */}
            <div style={{ position: "relative" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder=" "
                id="login-email"
                autoComplete="email"
                style={{
                  width: "100%",
                  height: 56,
                  padding: "20px 16px 8px",
                  borderRadius: 10,
                  border: `1.5px solid ${error && !email ? "hsl(var(--md-sys-color-error))" : "hsl(var(--md-sys-color-outline-variant))"}`,
                  backgroundColor: "hsl(var(--md-sys-color-surface-container-low))",
                  fontSize: 16,
                  color: "hsl(var(--md-sys-color-on-surface))",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "hsl(var(--md-sys-color-primary))";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "hsl(var(--md-sys-color-outline-variant))";
                }}
              />
              <label
                htmlFor="login-email"
                style={{
                  position: "absolute",
                  top: email ? 8 : "50%",
                  left: 16,
                  transform: email ? "none" : "translateY(-50%)",
                  fontSize: email ? 11 : 16,
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  pointerEvents: "none",
                  transition: "all 0.15s",
                  fontWeight: email ? 500 : 400,
                }}
              >
                Email address
              </label>
            </div>

            {/* Password */}
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder=" "
                id="login-password"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  height: 56,
                  padding: "20px 44px 8px 16px",
                  borderRadius: 10,
                  border: `1.5px solid ${error && !password ? "hsl(var(--md-sys-color-error))" : "hsl(var(--md-sys-color-outline-variant))"}`,
                  backgroundColor: "hsl(var(--md-sys-color-surface-container-low))",
                  fontSize: 16,
                  color: "hsl(var(--md-sys-color-on-surface))",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "hsl(var(--md-sys-color-primary))";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "hsl(var(--md-sys-color-outline-variant))";
                }}
              />
              <label
                htmlFor="login-password"
                style={{
                  position: "absolute",
                  top: password ? 8 : "50%",
                  left: 16,
                  transform: password ? "none" : "translateY(-50%)",
                  fontSize: password ? 11 : 16,
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  pointerEvents: "none",
                  transition: "all 0.15s",
                  fontWeight: password ? 500 : 400,
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <md-icon style={{ fontSize: "20px" }}>
                  {showPassword ? "visibility_off" : "visibility"}
                </md-icon>
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  fontSize: 13,
                  color: "hsl(var(--md-sys-color-error))",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <md-icon style={{ fontSize: "16px" }}>error</md-icon>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 48,
                borderRadius: 24,
                border: "none",
                backgroundColor: loading
                  ? "hsl(var(--md-sys-color-surface-container-high))"
                  : "hsl(var(--md-sys-color-primary))",
                color: loading
                  ? "hsl(var(--md-sys-color-on-surface-variant))"
                  : "hsl(var(--md-sys-color-on-primary))",
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
                fontFamily: "inherit",
                letterSpacing: "0.1px",
                transition: "background-color 0.2s, opacity 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      border: "2.5px solid hsl(var(--md-sys-color-outline-variant))",
                      borderTopColor: "hsl(var(--md-sys-color-primary))",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: "hsl(var(--md-sys-color-outline-variant))" }} />
            <span style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: "hsl(var(--md-sys-color-outline-variant))" }} />
          </div>

          {/* Demo hint */}
          <button
            type="button"
            onClick={fillDemo}
            style={{
              width: "100%",
              height: 44,
              borderRadius: 22,
              border: "1.5px solid hsl(var(--md-sys-color-outline-variant))",
              backgroundColor: "transparent",
              color: "hsl(var(--md-sys-color-on-surface))",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "hsl(var(--md-sys-color-surface-container))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            <md-icon style={{ fontSize: "18px", color: "hsl(var(--md-sys-color-primary))" }}>
              auto_awesome
            </md-icon>
            Use demo account
          </button>

          <p
            style={{
              fontSize: 12,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              textAlign: "center",
              marginTop: 20,
              lineHeight: 1.5,
            }}
          >
            This is a sample auth flow — any email & password will work.
          </p>
        </div>
      </div>

      {/* Spin keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 700px) {
          .login-brand-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
