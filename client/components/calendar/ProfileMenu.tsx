import "@material/web/icon/icon.js";
import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Account } from "../../types/auth";

interface ProfileMenuProps {
  anchorRef: React.RefObject<HTMLElement>;
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

export function ProfileMenu({ anchorRef, onClose, onOpenSettings }: ProfileMenuProps) {
  const { activeAccount, accounts, switchAccount, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const otherAccounts = accounts.filter((a) => a.id !== activeAccount?.id);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [onClose, anchorRef]);

  if (!activeAccount) return null;

  const sectionDivider = (
    <div
      style={{
        height: 1,
        backgroundColor: "hsl(var(--md-sys-color-outline-variant))",
        margin: "4px 0",
      }}
    />
  );

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: 68,
        right: 8,
        width: 360,
        backgroundColor: "hsl(var(--md-sys-color-surface-container))",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        zIndex: 300,
        overflow: "hidden",
      }}
    >
      {/* Section 1: Current user */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px 20px 16px",
          gap: 8,
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
            marginTop: 4,
            padding: "6px 16px",
            borderRadius: 20,
            border: "1px solid hsl(var(--md-sys-color-outline))",
            backgroundColor: "transparent",
            color: "hsl(var(--md-sys-color-on-surface))",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "hsl(var(--md-sys-color-surface-container-high))";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          Manage your Google Account
        </button>
      </div>

      {sectionDivider}

      {/* Section 2: Other accounts */}
      {otherAccounts.length > 0 && (
        <>
          <div style={{ padding: "8px 20px 4px" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                letterSpacing: "0.3px",
              }}
            >
              Other accounts
            </div>
          </div>

          {otherAccounts.map((account) => (
            <button
              key={account.id}
              onClick={() => { switchAccount(account.id); onClose(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "8px 20px",
                border: 0,
                backgroundColor: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
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

          {sectionDivider}
        </>
      )}

      {/* Section 3: Actions */}
      <div style={{ padding: "4px 0" }}>
        {/* Settings */}
        <button
          onClick={() => { onOpenSettings(); onClose(); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            padding: "10px 20px",
            border: 0,
            backgroundColor: "transparent",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
            color: "hsl(var(--md-sys-color-on-surface))",
            fontSize: 14,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "hsl(var(--md-sys-color-surface-container-high))";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          <md-icon style={{ fontSize: "20px", color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
            settings
          </md-icon>
          Settings
        </button>

        {/* Sign out */}
        <button
          onClick={() => { signOut(); onClose(); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            padding: "10px 20px",
            border: 0,
            backgroundColor: "transparent",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
            color: "hsl(var(--md-sys-color-on-surface))",
            fontSize: 14,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "hsl(var(--md-sys-color-surface-container-high))";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          <md-icon style={{ fontSize: "20px", color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
            logout
          </md-icon>
          Sign out
        </button>
      </div>

      {sectionDivider}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          padding: "10px 20px 14px",
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
  );
}
