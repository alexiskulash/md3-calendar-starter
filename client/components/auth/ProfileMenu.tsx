import "@material/web/icon/icon.js";
import { useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface ProfileMenuProps {
  onClose: () => void;
  onOpenSettings: () => void;
}

export function ProfileMenu({ onClose, onOpenSettings }: ProfileMenuProps) {
  const { activeAccount, accounts, switchAccount, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (!activeAccount) return null;

  const otherAccounts = accounts.filter((a) => a.id !== activeAccount.id);

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
        boxShadow: "0 8px 24px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.1)",
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
          gap: 8,
          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        }}
      >
        {/* 56px avatar */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: activeAccount.color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          {activeAccount.initials}
        </div>

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
            }}
          >
            {activeAccount.email}
          </div>
        </div>

        <button
          style={{
            marginTop: 4,
            height: 32,
            padding: "0 20px",
            borderRadius: 16,
            border: "1px solid hsl(var(--md-sys-color-outline))",
            backgroundColor: "transparent",
            color: "hsl(var(--md-sys-color-on-surface))",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Manage your Google Account
        </button>
      </div>

      {/* Section 2: Other accounts */}
      {otherAccounts.length > 0 && (
        <div
          style={{
            borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
          }}
        >
          <div
            style={{
              padding: "12px 24px 4px",
              fontSize: 12,
              fontWeight: 500,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              letterSpacing: "0.4px",
            }}
          >
            Other accounts
          </div>
          {otherAccounts.map((account) => (
            <button
              key={account.id}
              onClick={() => {
                switchAccount(account.id);
                onClose();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 24px",
                border: 0,
                backgroundColor: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "hsl(var(--md-sys-color-surface-container-high))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: account.color,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {account.initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
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
                    fontSize: 12,
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
          ))}
        </div>
      )}

      {/* Section 3: Actions */}
      <div style={{ borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))" }}>
        <MenuAction
          icon="settings"
          label="Settings"
          onClick={() => {
            onOpenSettings();
            onClose();
          }}
        />
        <MenuAction
          icon="logout"
          label="Sign out"
          onClick={() => {
            signOut();
            onClose();
          }}
        />
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 24px",
          display: "flex",
          gap: 12,
          justifyContent: "center",
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
        <span style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
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
  );
}

function MenuAction({
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
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 24px",
        border: 0,
        backgroundColor: "transparent",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        transition: "background-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          "hsl(var(--md-sys-color-surface-container-high))";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      <md-icon
        style={{
          fontSize: "20px",
          color: "hsl(var(--md-sys-color-on-surface-variant))",
        }}
      >
        {icon}
      </md-icon>
      <span
        style={{
          fontSize: 14,
          color: "hsl(var(--md-sys-color-on-surface))",
          fontWeight: 400,
        }}
      >
        {label}
      </span>
    </button>
  );
}
