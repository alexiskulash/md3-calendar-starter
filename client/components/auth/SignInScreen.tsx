import { useState } from "react";
import { useAuth, Account } from "../../contexts/AuthContext";

export function SignInScreen() {
  const { accounts, signIn } = useAuth();
  const [pressedId, setPressedId] = useState<string | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--neu-base)",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 448,
          backgroundColor: "var(--neu-base)",
          borderRadius: 28,
          boxShadow: "var(--neu-raised)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 32px 28px",
            gap: 18,
          }}
        >
          {/* Calendar icon pill — inset */}
          <div
            style={{
              backgroundColor: "var(--neu-base)",
              borderRadius: 28,
              padding: "14px 24px",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "var(--neu-inset)",
            }}
          >
            <span
              style={{
                fontFamily: "'Material Symbols Outlined', sans-serif",
                fontSize: 22,
                color: "hsl(var(--md-sys-color-primary))",
                lineHeight: 1,
              }}
            >
              calendar_today
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 300,
                color: "var(--neu-text)",
                letterSpacing: 0.5,
              }}
            >
              Calendar
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 300,
              color: "var(--neu-text)",
              letterSpacing: 0.3,
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 300,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              textAlign: "center",
              letterSpacing: 0.2,
            }}
          >
            Use your Google Account
          </p>
        </div>

        {/* Account rows */}
        <div style={{ padding: "0 20px 12px" }}>
          {accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              pressed={pressedId === account.id}
              onMouseDown={() => setPressedId(account.id)}
              onMouseUp={() => setPressedId(null)}
              onMouseLeave={() => setPressedId(null)}
              onSelect={() => signIn(account.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 32px 28px",
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {["Privacy Policy", "Terms of Service"].map((label, i) => (
            <span key={label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {i > 0 && (
                <span style={{ fontSize: 11, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>·</span>
              )}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: 11,
                  fontWeight: 300,
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  textDecoration: "none",
                  letterSpacing: 0.2,
                }}
              >
                {label}
              </a>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AccountRowProps {
  account: Account;
  pressed: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onSelect: () => void;
}

function AccountRow({ account, pressed, onMouseDown, onMouseUp, onMouseLeave, onSelect }: AccountRowProps) {
  return (
    <button
      onClick={onSelect}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 16px",
        borderRadius: 16,
        border: 0,
        backgroundColor: "var(--neu-base)",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        marginBottom: 8,
        boxShadow: pressed ? "var(--neu-inset)" : "var(--neu-raised-sm)",
        transition: "box-shadow 0.15s",
      }}
    >
      {/* Avatar — neumorphic raised circle */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "var(--neu-base)",
          color: "var(--neu-text)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 400,
          flexShrink: 0,
          boxShadow: "var(--neu-raised-sm)",
          letterSpacing: 0.5,
        }}
      >
        {account.initials}
      </div>

      {/* Name + email */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "var(--neu-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            letterSpacing: 0.2,
          }}
        >
          {account.name}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 300,
            color: "hsl(var(--md-sys-color-on-surface-variant))",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {account.email}
        </div>
      </div>
    </button>
  );
}
