import { useState } from "react";
import { useAuth, Account } from "../../contexts/AuthContext";

export function SignInScreen() {
  const { accounts, signIn } = useAuth();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsl(var(--md-sys-color-surface))",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 448,
          backgroundColor: "hsl(var(--md-sys-color-surface-container-low))",
          borderRadius: 28,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 32px 24px",
            gap: 16,
          }}
        >
          {/* Calendar icon pill */}
          <div
            style={{
              backgroundColor: "hsl(var(--md-sys-color-primary-container))",
              borderRadius: 24,
              padding: "12px 20px",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'Material Symbols Outlined', sans-serif",
                fontSize: 24,
                color: "hsl(var(--md-sys-color-on-primary-container))",
                lineHeight: 1,
              }}
            >
              calendar_today
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "hsl(var(--md-sys-color-on-primary-container))",
                letterSpacing: 0.15,
              }}
            >
              Calendar
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 400,
              color: "hsl(var(--md-sys-color-on-surface))",
              letterSpacing: 0,
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              textAlign: "center",
            }}
          >
            Use your Google Account
          </p>
        </div>

        {/* Account rows */}
        <div style={{ padding: "0 16px 8px" }}>
          {accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              hovered={hoveredId === account.id}
              onMouseEnter={() => setHoveredId(account.id)}
              onMouseLeave={() => setHoveredId(null)}
              onSelect={() => signIn(account.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 32px 24px",
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              fontSize: 12,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              textDecoration: "none",
            }}
          >
            Privacy Policy
          </a>
          <span
            style={{
              fontSize: 12,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
            }}
          >
            ·
          </span>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              fontSize: 12,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              textDecoration: "none",
            }}
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}

interface AccountRowProps {
  account: Account;
  hovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onSelect: () => void;
}

function AccountRow({ account, hovered, onMouseEnter, onMouseLeave, onSelect }: AccountRowProps) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 16px",
        borderRadius: 12,
        border: 0,
        backgroundColor: hovered
          ? "hsl(var(--md-sys-color-surface-container))"
          : "transparent",
        cursor: "pointer",
        textAlign: "left",
        transition: "background-color 0.15s",
        fontFamily: "inherit",
      }}
    >
      {/* Avatar */}
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
          fontSize: 15,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {account.initials}
      </div>

      {/* Name + email */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "hsl(var(--md-sys-color-on-surface))",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {account.name}
        </div>
        <div
          style={{
            fontSize: 13,
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
