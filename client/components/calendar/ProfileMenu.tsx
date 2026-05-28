import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Account } from "../../types/auth";

interface ProfileMenuProps {
  onClose: () => void;
  onOpenSettings: () => void;
}

function Avatar({
  account,
  size,
}: {
  account: Account;
  size: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: account.color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {account.initials}
    </div>
  );
}

export function ProfileMenu({ onClose, onOpenSettings }: ProfileMenuProps) {
  const { activeAccount, accounts, switchAccount, signOut } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const otherAccounts = accounts.filter((a) => a.id !== activeAccount?.id);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleSignOut = () => {
    signOut();
    onClose();
    navigate("/sign-in");
  };

  const handleSwitchAccount = (id: string) => {
    switchAccount(id);
    onClose();
  };

  if (!activeAccount) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: 360,
        backgroundColor: "hsl(var(--md-sys-color-surface-container))",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.16)",
        zIndex: 300,
        overflow: "hidden",
      }}
    >
      {/* Section 1: Current user */}
      <div
        style={{
          padding: "24px 24px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        }}
      >
        <Avatar account={activeAccount} size={56} />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "hsl(var(--md-sys-color-on-surface))",
            }}
          >
            {activeAccount.name}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              marginTop: 2,
            }}
          >
            {activeAccount.email}
          </div>
        </div>
        {/* Manage account button */}
        <button
          style={{
            padding: "8px 20px",
            borderRadius: 20,
            border: "1px solid hsl(var(--md-sys-color-outline))",
            backgroundColor: "transparent",
            fontSize: 14,
            fontWeight: 500,
            color: "hsl(var(--md-sys-color-on-surface))",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Manage your Google Account
        </button>
      </div>

      {/* Section 2: Other accounts */}
      {otherAccounts.length > 0 && (
        <div style={{ borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))" }}>
          <div
            style={{
              padding: "12px 24px 4px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
            }}
          >
            Other accounts
          </div>
          {otherAccounts.map((account) => (
            <button
              key={account.id}
              onClick={() => handleSwitchAccount(account.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "10px 24px",
                border: 0,
                backgroundColor: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "hsl(var(--md-sys-color-surface-container-high))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <Avatar account={account} size={32} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
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
                    fontSize: 12,
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
        </div>
      )}

      {/* Section 3: Actions */}
      <div style={{ borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))" }}>
        <ActionRow
          icon="settings"
          label="Settings"
          onClick={() => { onOpenSettings(); onClose(); }}
        />
        <ActionRow
          icon="logout"
          label="Sign out"
          onClick={handleSignOut}
        />
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 24px",
          fontSize: 12,
          color: "hsl(var(--md-sys-color-on-surface-variant))",
          textAlign: "center",
        }}
      >
        <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
          Privacy Policy
        </a>
        {" · "}
        <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
          Terms of Service
        </a>
      </div>
    </div>
  );
}

function ActionRow({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
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
        transition: "background-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "hsl(var(--md-sys-color-surface-container-high))";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
      }}
    >
      <span
        style={{
          fontFamily: "Material Symbols Outlined",
          fontSize: 20,
          color: "hsl(var(--md-sys-color-on-surface-variant))",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: 14,
          color: "hsl(var(--md-sys-color-on-surface))",
        }}
      >
        {label}
      </span>
    </button>
  );
}
