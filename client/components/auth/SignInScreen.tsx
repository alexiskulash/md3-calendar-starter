import { Account, useAuth } from "../../context/AuthContext";

export function SignInScreen() {
  const { accounts, signIn } = useAuth();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsl(var(--md-sys-color-surface-container-low))",
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "min(448px, 100vw - 32px)",
          backgroundColor: "hsl(var(--md-sys-color-surface))",
          borderRadius: 28,
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 24px 24px",
            gap: 12,
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
              borderRadius: 28,
              backgroundColor: "hsl(var(--md-sys-color-primary-container))",
            }}
          >
            <span
              style={{
                fontFamily: "Material Symbols Outlined",
                fontSize: 28,
                color: "hsl(var(--md-sys-color-on-primary-container))",
              }}
            >
              calendar_month
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 400,
              color: "hsl(var(--md-sys-color-on-surface))",
              fontFamily: "inherit",
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
            Choose an account to continue to Calendar
          </p>
        </div>

        {/* Account list */}
        <div style={{ borderTop: "1px solid hsl(var(--md-sys-color-outline-variant))" }}>
          {accounts.map((account) => (
            <AccountRow key={account.id} account={account} onSelect={signIn} />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid hsl(var(--md-sys-color-outline-variant))",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "center",
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
          <span style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>·</span>
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
    </div>
  );
}

function AccountRow({ account, onSelect }: { account: Account; onSelect: (a: Account) => void }) {
  return (
    <button
      onClick={() => onSelect(account)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        padding: "12px 24px",
        border: 0,
        backgroundColor: "transparent",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        transition: "background-color 0.1s",
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
