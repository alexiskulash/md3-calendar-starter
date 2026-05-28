import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Account } from "../types/auth";

function AccountRow({ account, onSelect }: { account: Account; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect(); }}
      tabIndex={0}
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
        borderRadius: 0,
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

export default function SignInPage() {
  const { accounts, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    signIn(id);
    navigate("/");
  };

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
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 24px 24px",
            gap: 16,
          }}
        >
          {/* Calendar icon pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "hsl(var(--md-sys-color-primary-container))",
              borderRadius: 28,
              padding: "10px 20px",
            }}
          >
            <span
              style={{
                fontFamily: "Material Symbols Outlined",
                fontSize: 24,
                color: "hsl(var(--md-sys-color-on-primary-container))",
              }}
            >
              calendar_month
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "hsl(var(--md-sys-color-on-primary-container))",
                letterSpacing: 0.5,
              }}
            >
              Calendar
            </span>
          </div>

          {/* Heading */}
          <div style={{ textAlign: "center" }}>
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
                margin: "8px 0 0",
                fontSize: 14,
                color: "hsl(var(--md-sys-color-on-surface-variant))",
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
        <div style={{ padding: "8px 0" }}>
          {accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              onSelect={() => handleSelect(account.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px 24px",
            textAlign: "center",
            fontSize: 12,
            color: "hsl(var(--md-sys-color-on-surface-variant))",
            borderTop: "1px solid hsl(var(--md-sys-color-outline-variant))",
          }}
        >
          <a
            href="#"
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLAnchorElement).style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLAnchorElement).style.textDecoration = "none")
            }
          >
            Privacy Policy
          </a>
          {" · "}
          <a
            href="#"
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLAnchorElement).style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLAnchorElement).style.textDecoration = "none")
            }
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
