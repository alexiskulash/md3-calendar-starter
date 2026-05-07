import { useNavigate } from "react-router-dom";
import "@material/web/icon/icon.js";

interface Account {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

const ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@example.com",
    initials: "AC",
    color: "hsl(var(--md-sys-color-primary))",
  },
  {
    id: "2",
    name: "Work Account",
    email: "alex.work@company.com",
    initials: "W",
    color: "#006A6A", // Material Teal
  },
];

export default function AccountPicker() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsl(var(--md-sys-color-surface))",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 448,
          backgroundColor: "hsl(var(--md-sys-color-surface-container-lowest))",
          borderRadius: 24,
          padding: "36px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid hsl(var(--md-sys-color-outline-variant))",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div
            style={{
              position: "relative",
              width: 48,
              height: 48,
              borderRadius: 12,
              border: "2px solid hsl(var(--md-sys-color-outline-variant))",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 600,
              color: "hsl(var(--md-sys-color-on-surface))",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                height: 8,
                backgroundColor: "hsl(var(--md-sys-color-primary))",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            />
            {new Date().getDate()}
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "hsl(var(--md-sys-color-on-surface))",
              letterSpacing: 0,
            }}
          >
            Calendar
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "hsl(var(--md-sys-color-on-surface))",
            margin: "0 0 8px 0",
            textAlign: "center",
          }}
        >
          Choose an account
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "hsl(var(--md-sys-color-on-surface-variant))",
            margin: "0 0 32px 0",
            textAlign: "center",
          }}
        >
          to continue to Calendar
        </p>

        {/* Account List */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
          {ACCOUNTS.map((account) => (
            <button
              key={account.id}
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                borderRadius: 28,
                transition: "background-color 0.2s",
                textAlign: "left",
                gap: 16,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "hsl(var(--md-sys-color-surface-container-highest))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: account.color,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {account.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 16,
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
                    fontSize: 14,
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

          {/* Divider */}
          <div
            style={{
              height: 1,
              backgroundColor: "hsl(var(--md-sys-color-outline-variant))",
              margin: "12px 0",
            }}
          />

          {/* Add Account */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "12px 16px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              borderRadius: 28,
              transition: "background-color 0.2s",
              textAlign: "left",
              gap: 16,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "hsl(var(--md-sys-color-surface-container-highest))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "hsl(var(--md-sys-color-on-surface-variant))",
              }}
            >
              <md-icon>person_add</md-icon>
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "hsl(var(--md-sys-color-on-surface))",
              }}
            >
              Use another account
            </div>
          </button>
        </div>
      </div>

      {/* Footer links */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 24,
          fontSize: 12,
          color: "hsl(var(--md-sys-color-on-surface-variant))",
        }}
      >
        <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>Help</button>
        <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>Privacy</button>
        <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>Terms</button>
      </div>
    </div>
  );
}
