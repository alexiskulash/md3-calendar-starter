import React, { useRef, useEffect, useState } from "react";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/divider/divider.js";
import "@material/web/icon/icon.js";
import { useUser, UserAccount } from "../../context/UserContext";

export function AccountDropdown() {
  const { currentUser, accounts, switchAccount, addAccount, signOutAll } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleAddAccount = () => {
    // Mock adding a new account
    const newId = String(Date.now());
    addAccount({
      id: newId,
      name: "New User",
      email: `user${newId.slice(-4)}@example.com`,
      avatarColor: "hsl(var(--md-sys-color-secondary))",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const Avatar = ({ account, size = 32 }: { account: UserAccount; size?: number }) => (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: account.avatarColor,
        color: "#fff", // using white for contrast
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {getInitials(account.name)}
    </div>
  );

  return (
    <div ref={containerRef} style={{ position: "relative", flexShrink: 0 }}>
      {/* Trigger */}
      {currentUser ? (
        <button
          onClick={toggleOpen}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            borderRadius: "50%",
            outline: "none",
          }}
          title={`Google Account\n${currentUser.name}\n${currentUser.email}`}
        >
          <Avatar account={currentUser} size={32} />
        </button>
      ) : (
        <button
          onClick={handleAddAccount}
          style={{
            background: "none",
            border: "none",
            color: "hsl(var(--md-sys-color-primary))",
            cursor: "pointer",
            fontWeight: 500,
            padding: "8px 16px",
            fontSize: "14px",
          }}
        >
          Sign In
        </button>
      )}

      {/* Popover */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 350,
            backgroundColor: "hsl(var(--md-sys-color-surface-container-high))",
            borderRadius: 24,
            boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
            zIndex: 300,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {currentUser && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px 24px 16px",
              }}
            >
              <Avatar account={currentUser} size={72} />
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "hsl(var(--md-sys-color-on-surface))",
                  marginTop: 12,
                }}
              >
                {currentUser.name}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  marginTop: 4,
                  marginBottom: 16,
                }}
              >
                {currentUser.email}
              </div>
              <md-outlined-button style={{ width: "100%" }}>
                Manage your Google Account
              </md-outlined-button>
            </div>
          )}

          <md-divider></md-divider>

          {/* Account List */}
          <div style={{ padding: "8px 0", maxHeight: 200, overflowY: "auto" }}>
            {accounts
              .filter((a) => a.id !== currentUser?.id)
              .map((account) => (
                <button
                  key={account.id}
                  onClick={() => switchAccount(account.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "12px 24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
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
                  <Avatar account={account} size={32} />
                  <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                    <span
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
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "hsl(var(--md-sys-color-on-surface-variant))",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {account.email}
                    </span>
                  </div>
                </button>
              ))}

            <button
              onClick={handleAddAccount}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "12px 24px",
                background: "none",
                border: "none",
                cursor: "pointer",
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
                  width: 32,
                  height: 32,
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
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "hsl(var(--md-sys-color-on-surface))",
                }}
              >
                Add another account
              </span>
            </button>
          </div>

          <md-divider></md-divider>

          <div style={{ padding: "8px", display: "flex", justifyContent: "center" }}>
            <md-text-button onClick={signOutAll}>Sign out of all accounts</md-text-button>
          </div>
        </div>
      )}
    </div>
  );
}
