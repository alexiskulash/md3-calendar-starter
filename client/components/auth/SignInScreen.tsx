import "@material/web/icon/icon.js";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { UserAccount } from "../../types/auth";

function AccountRow({
  account,
  onSelect,
}: {
  account: UserAccount;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        padding: "10px 16px",
        border: 0,
        borderRadius: 8,
        backgroundColor: hovered
          ? "hsl(var(--md-sys-color-surface-container))"
          : "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        transition: "background-color 0.15s",
      }}
    >
      {/* 40px avatar */}
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
            lineHeight: 1.3,
          }}
        >
          {account.name}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "hsl(var(--md-sys-color-on-surface-variant))",
            lineHeight: 1.3,
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

export function SignInScreen() {
  const { knownAccounts, signIn } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsl(var(--md-sys-color-background))",
        padding: "24px 16px",
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 448,
          backgroundColor: "hsl(var(--md-sys-color-surface))",
          borderRadius: 28,
          boxShadow: "0 2px 12px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "32px 24px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Calendar icon pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: "hsl(var(--md-sys-color-primary-container))",
            }}
          >
            <md-icon
              style={{
                fontSize: "28px",
                color: "hsl(var(--md-sys-color-on-primary-container))",
              }}
            >
              calendar_month
            </md-icon>
          </div>

          {/* Heading */}
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 400,
                color: "hsl(var(--md-sys-color-on-surface))",
                lineHeight: 1.3,
              }}
            >
              Sign in
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 14,
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                lineHeight: 1.4,
              }}
            >
              Choose an account to continue to Calendar
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "hsl(var(--md-sys-color-outline-variant))",
            margin: "0 24px",
          }}
        />

        {/* Account list */}
        <div style={{ padding: "12px 8px" }}>
          {knownAccounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              onSelect={() => signIn(account.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 24px 24px",
            textAlign: "center",
            fontSize: 12,
            color: "hsl(var(--md-sys-color-on-surface-variant))",
          }}
        >
          <a
            href="#"
            style={{ color: "inherit", textDecoration: "underline" }}
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </a>
          {" · "}
          <a
            href="#"
            style={{ color: "inherit", textDecoration: "underline" }}
            onClick={(e) => e.preventDefault()}
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
