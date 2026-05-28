import "@material/web/icon/icon.js";
import { useAuth } from "../context/AuthContext";
import { Account } from "../types/auth";

function AccountRow({ account, onSelect }: { account: Account; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(); }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        padding: "10px 16px",
        border: 0,
        backgroundColor: "transparent",
        cursor: "pointer",
        textAlign: "left",
        borderRadius: 8,
        fontFamily: "inherit",
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
          fontSize: 14,
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
  );
}

export default function SignIn() {
  const { accounts, signIn } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsl(var(--md-sys-color-surface))",
        padding: 24,
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 448,
          backgroundColor: "hsl(var(--md-sys-color-surface-container-low))",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 24px 20px",
            gap: 12,
          }}
        >
          {/* Calendar icon pill */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "hsl(var(--md-sys-color-primary-container))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <md-icon
              style={{
                color: "hsl(var(--md-sys-color-on-primary-container))",
                fontSize: "24px",
              }}
            >
              calendar_month
            </md-icon>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 400,
                color: "hsl(var(--md-sys-color-on-surface))",
                marginBottom: 4,
              }}
            >
              Sign in
            </div>
            <div
              style={{
                fontSize: 14,
                color: "hsl(var(--md-sys-color-on-surface-variant))",
              }}
            >
              Choose an account to continue to Calendar
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "hsl(var(--md-sys-color-outline-variant))",
            margin: "0 16px",
          }}
        />

        {/* Account list */}
        <div style={{ padding: "8px 8px" }}>
          {accounts.map((account) => (
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
            padding: "12px 24px 20px",
            display: "flex",
            justifyContent: "center",
            gap: 16,
            borderTop: "1px solid hsl(var(--md-sys-color-outline-variant))",
          }}
        >
          <a
            href="#"
            style={{
              fontSize: 12,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = "underline")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = "none")}
          >
            Privacy Policy
          </a>
          <span style={{ fontSize: 12, color: "hsl(var(--md-sys-color-outline))" }}>·</span>
          <a
            href="#"
            style={{
              fontSize: 12,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = "underline")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = "none")}
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
