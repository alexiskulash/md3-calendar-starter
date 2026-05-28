import "@material/web/icon/icon.js";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { UserAccount } from "../../types/auth";

interface ProfileMenuProps {
  onClose: () => void;
  onSettingsClick: () => void;
}

function OtherAccountRow({
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
        gap: 12,
        width: "100%",
        padding: "8px 16px",
        border: 0,
        backgroundColor: hovered
          ? "hsl(var(--md-sys-color-surface-container-high))"
          : "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        transition: "background-color 0.15s",
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
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {account.initials}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "hsl(var(--md-sys-color-on-surface))",
            lineHeight: 1.3,
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

function ActionRow({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "10px 16px",
        border: 0,
        backgroundColor: hovered
          ? "hsl(var(--md-sys-color-surface-container-high))"
          : "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        transition: "background-color 0.15s",
        color: "hsl(var(--md-sys-color-on-surface))",
      }}
    >
      <md-icon style={{ fontSize: "20px", color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
        {icon}
      </md-icon>
      <span style={{ fontSize: 14 }}>{label}</span>
    </button>
  );
}

export function ProfileMenu({ onClose, onSettingsClick }: ProfileMenuProps) {
  const { activeAccount, knownAccounts, signOut, switchAccount } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const otherAccounts = knownAccounts.filter((a) => a.id !== activeAccount?.id);

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

  const handleSwitch = (id: string) => {
    switchAccount(id);
    onClose();
  };

  const handleSettings = () => {
    onSettingsClick();
    onClose();
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

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
        boxShadow: "0 4px 20px rgba(0,0,0,0.18), 0 1px 6px rgba(0,0,0,0.1)",
        zIndex: 300,
        overflow: "hidden",
      }}
    >
      {/* Section 1 — Current user */}
      <div style={{ padding: "20px 16px 16px" }}>
        {/* Large avatar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
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
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {activeAccount.initials}
          </div>
        </div>

        {/* Name + email */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "hsl(var(--md-sys-color-on-surface))",
              marginBottom: 2,
            }}
          >
            {activeAccount.name}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
            }}
          >
            {activeAccount.email}
          </div>
        </div>

        {/* Manage account button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              border: "1px solid hsl(var(--md-sys-color-outline))",
              backgroundColor: "transparent",
              color: "hsl(var(--md-sys-color-on-surface))",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onClick={() => {}}
          >
            Manage your Google Account
          </button>
        </div>
      </div>

      {/* Divider */}
      {otherAccounts.length > 0 && (
        <>
          <div style={{ height: 1, backgroundColor: "hsl(var(--md-sys-color-outline-variant))" }} />

          {/* Section 2 — Other accounts */}
          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                padding: "4px 16px 8px",
                fontSize: 11,
                fontWeight: 600,
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                letterSpacing: "0.6px",
                textTransform: "uppercase",
              }}
            >
              Other accounts
            </div>
            {otherAccounts.map((account) => (
              <OtherAccountRow
                key={account.id}
                account={account}
                onSelect={() => handleSwitch(account.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "hsl(var(--md-sys-color-outline-variant))" }} />

      {/* Section 3 — Actions */}
      <div style={{ padding: "8px 0" }}>
        <ActionRow icon="settings" label="Settings" onClick={handleSettings} />
        <ActionRow icon="logout" label="Sign out" onClick={handleSignOut} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "hsl(var(--md-sys-color-outline-variant))" }} />

      {/* Footer */}
      <div
        style={{
          padding: "10px 16px",
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
  );
}
