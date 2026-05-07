import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "@material/web/icon/icon.js";

export function ProfileMenu() {
  const { activeAccount, accounts, switchAccount, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  if (!activeAccount) return null;

  const inactiveAccounts = accounts.filter((a) => a.id !== activeAccount.id);

  const handleLogout = () => {
    logout();
    navigate("/account-picker");
  };

  const handleSettings = () => {
    // Placeholder for settings action as per PRD
    console.log("Settings clicked");
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} style={{ position: "relative", marginLeft: "auto", flexShrink: 0 }}>
      {/* Avatar Button */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: activeAccount.color,
          color: "#ffffff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          outline: isOpen ? "2px solid hsl(var(--md-sys-color-primary))" : "none",
          outlineOffset: "2px",
          transition: "outline 0.2s",
        }}
        title={activeAccount.name}
        aria-label="Account"
      >
        {activeAccount.initials}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            right: 0,
            width: 360,
            backgroundColor: "hsl(var(--md-sys-color-surface-container-highest))",
            borderRadius: 20,
            boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
            zIndex: 300,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid hsl(var(--md-sys-color-outline-variant))",
          }}
        >
          {/* Section 1: Current User */}
          <div
            style={{
              padding: "24px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "hsl(var(--md-sys-color-surface-container))",
              borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: activeAccount.color,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              {activeAccount.initials}
            </div>
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
                fontSize: 14,
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                marginBottom: 16,
              }}
            >
              {activeAccount.email}
            </div>
            <button
              style={{
                padding: "8px 16px",
                borderRadius: 100,
                border: "1px solid hsl(var(--md-sys-color-outline))",
                backgroundColor: "transparent",
                color: "hsl(var(--md-sys-color-primary))",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "background-color 0.2s",
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

          {/* Section 2: Other Accounts */}
          {inactiveAccounts.length > 0 && (
            <div
              style={{
                padding: "16px 0",
                borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
              }}
            >
              <div
                style={{
                  padding: "0 24px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  marginBottom: 8,
                }}
              >
                Other accounts
              </div>
              {inactiveAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    switchAccount(account.id);
                    setIsOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "12px 24px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 16,
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "hsl(var(--md-sys-color-surface-container-high))";
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
                      backgroundColor: account.color,
                      color: "#ffffff",
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
                  <div style={{ flex: 1, minWidth: 0 }}>
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
          <div style={{ padding: "8px 0" }}>
            <button
              onClick={handleSettings}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "12px 24px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                gap: 16,
                color: "hsl(var(--md-sys-color-on-surface))",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "hsl(var(--md-sys-color-surface-container-high))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
                settings
              </md-icon>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Settings</span>
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "12px 24px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                gap: 16,
                color: "hsl(var(--md-sys-color-on-surface))",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "hsl(var(--md-sys-color-surface-container-high))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
                logout
              </md-icon>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Sign out</span>
            </button>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "16px",
              display: "flex",
              justifyContent: "center",
              gap: 16,
              fontSize: 12,
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              backgroundColor: "hsl(var(--md-sys-color-surface-container))",
              borderTop: "1px solid hsl(var(--md-sys-color-outline-variant))",
            }}
          >
            <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
              Privacy Policy
            </button>
            <span>•</span>
            <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
              Terms of Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
