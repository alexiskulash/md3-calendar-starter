import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "@material/web/icon/icon.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/divider/divider.js";

export default function SignIn() {
  const { accounts, signIn } = useAuth();
  const [showManualSignIn, setShowManualSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleManualSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // For demo purposes, we'll sign into the first account or personal account
    // if the email somewhat matches, otherwise default to first account.
    const matchedAccount = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    signIn(matchedAccount?.id || accounts[0].id);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsl(var(--md-sys-color-background))",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 448,
          backgroundColor: "hsl(var(--md-sys-color-surface))",
          borderRadius: 28,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: "1px solid hsl(var(--md-sys-color-outline-variant))",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "40px 24px 24px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "16px",
              backgroundColor: "hsl(var(--md-sys-color-primary-container))",
              color: "hsl(var(--md-sys-color-on-primary-container))",
              marginBottom: 16,
            }}
          >
            <md-icon style={{ fontSize: 32 }}>calendar_today</md-icon>
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 400,
              margin: "0 0 8px 0",
              color: "hsl(var(--md-sys-color-on-surface))",
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              fontSize: 14,
              margin: 0,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
            }}
          >
            {showManualSignIn
              ? "Use your Google Account"
              : "Choose an account to continue to Calendar"}
          </p>
        </div>

        {/* Dynamic Body */}
        {showManualSignIn ? (
          <form onSubmit={handleManualSignIn} style={{ padding: "0 24px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <md-outlined-text-field
                label="Email or phone"
                type="email"
                value={email}
                onInput={(e: any) => setEmail(e.target.value)}
                style={{ width: "100%" }}
              />
              <md-outlined-text-field
                label="Enter your password"
                type="password"
                value={password}
                onInput={(e: any) => setPassword(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
              <md-text-button
                type="button"
                onClick={() => setShowManualSignIn(false)}
              >
                Back
              </md-text-button>
              <md-filled-button type="submit" disabled={!email || !password ? true : undefined}>
                Next
              </md-filled-button>
            </div>
          </form>
        ) : (
          <div style={{ padding: "0 12px 16px" }}>
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => signIn(account.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "12px 16px",
                  border: "none",
                  background: "transparent",
                  borderRadius: 20,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "hsl(var(--md-sys-color-surface-container))";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    signIn(account.id);
                  }
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: account.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {account.initials}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "hsl(var(--md-sys-color-on-surface))",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {account.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "hsl(var(--md-sys-color-on-surface-variant))",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {account.email}
                  </div>
                </div>
              </button>
            ))}

            <md-divider style={{ margin: "8px 16px" }} />

            <button
              onClick={() => setShowManualSignIn(true)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 16px",
                border: "none",
                background: "transparent",
                borderRadius: 20,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "background-color 0.2s",
                color: "hsl(var(--md-sys-color-on-surface))",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "hsl(var(--md-sys-color-surface-container))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                }}
              >
                <md-icon>account_circle</md-icon>
              </div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>
                Use another account
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 16,
        }}
      >
        <a
          href="#"
          style={{
            fontSize: 12,
            color: "hsl(var(--md-sys-color-on-surface-variant))",
            textDecoration: "none",
          }}
          onClick={(e) => e.preventDefault()}
        >
          Privacy Policy
        </a>
        <a
          href="#"
          style={{
            fontSize: 12,
            color: "hsl(var(--md-sys-color-on-surface-variant))",
            textDecoration: "none",
          }}
          onClick={(e) => e.preventDefault()}
        >
          Terms of Service
        </a>
      </div>
    </div>
  );
}
