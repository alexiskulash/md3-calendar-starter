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
        top: "calc(100% + 10px)",
        right: 0,
        width: 360,
        backgroundColor: "var(--neu-base)",
        borderRadius: 24,
        boxShadow: "var(--neu-raised)",
        zIndex: 300,
        overflow: "hidden",
      }}
    >
      {/* Section 1: Current user */}
      <div
        style={{
          padding: "28px 24px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: "var(--neu-base)",
            color: "var(--neu-text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 300,
            letterSpacing: 0.5,
            boxShadow: "var(--neu-raised)",
          }}
        >
          {activeAccount.initials}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 400, color: "var(--neu-text)", letterSpacing: 0.2 }}>
            {activeAccount.name}
          </div>
          <div style={{ fontSize: 12, fontWeight: 300, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
            {activeAccount.email}
          </div>
        </div>

        <button
          style={{
            marginTop: 6,
            height: 34,
            padding: "0 22px",
            borderRadius: 17,
            border: 0,
            backgroundColor: "var(--neu-base)",
            color: "var(--neu-text)",
            fontSize: 12,
            fontWeight: 300,
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: 0.3,
            boxShadow: "var(--neu-raised-sm)",
          }}
        >
          Manage your Google Account
        </button>
      </div>

      {/* Soft separator */}
      {otherAccounts.length > 0 && (
        <div style={{ margin: "0 20px", height: 1, backgroundColor: "hsl(var(--md-sys-color-outline-variant))", opacity: 0.4 }} />
      )}

      {/* Section 2: Other accounts */}
      {otherAccounts.length > 0 && (
        <div style={{ padding: "8px 0" }}>
          <div
            style={{
              padding: "8px 24px 6px",
              fontSize: 10,
              fontWeight: 400,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            Other accounts
          </div>
          {otherAccounts.map((account) => (
            <button
              key={account.id}
              onClick={() => { switchAccount(account.id); onClose(); }}
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
                transition: "box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 0 100vw rgba(0,0,0,0.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "var(--neu-base)",
                  color: "var(--neu-text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 400,
                  flexShrink: 0,
                  letterSpacing: 0.5,
                  boxShadow: "var(--neu-raised-sm)",
                }}
              >
                {account.initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 400, color: "var(--neu-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {account.name}
                </div>
                <div style={{ fontSize: 11, fontWeight: 300, color: "hsl(var(--md-sys-color-on-surface-variant))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {account.email}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Soft separator */}
      <div style={{ margin: "0 20px", height: 1, backgroundColor: "hsl(var(--md-sys-color-outline-variant))", opacity: 0.4 }} />

      {/* Section 3: Actions */}
      <div style={{ padding: "8px 0" }}>
        <MenuAction icon="settings" label="Settings" onClick={() => { onOpenSettings(); onClose(); }} />
        <MenuAction icon="logout" label="Sign out" onClick={() => { signOut(); onClose(); }} />
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 24px 16px", display: "flex", gap: 12, justifyContent: "center" }}>
        {["Privacy Policy", "Terms of Service"].map((label, i) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {i > 0 && <span style={{ fontSize: 10, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>·</span>}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ fontSize: 11, fontWeight: 300, color: "hsl(var(--md-sys-color-on-surface-variant))", textDecoration: "none", letterSpacing: 0.2 }}
            >
              {label}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}

function MenuAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 24px",
        border: 0,
        backgroundColor: "transparent",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 0 100vw rgba(0,0,0,0.03)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <md-icon style={{ fontSize: "18px", color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
        {icon}
      </md-icon>
      <span style={{ fontSize: 13, color: "var(--neu-text)", fontWeight: 300, letterSpacing: 0.2 }}>
        {label}
      </span>
    </button>
  );
}
