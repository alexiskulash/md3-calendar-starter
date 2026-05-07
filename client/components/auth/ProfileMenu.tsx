import React, { useState, useRef, useEffect } from "react";
import "@material/web/icon/icon.js";
import "@material/web/divider/divider.js";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AddAccountDialog } from "./AddAccountDialog";

interface ProfileMenuProps {
  onOpenSettings: () => void;
}

export function ProfileMenu({ onOpenSettings }: ProfileMenuProps) {
  const { activeAccount, knownAccounts, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const otherAccounts = knownAccounts.filter(a => a.id !== activeAccount?.id);

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

  return (
    <div ref={menuRef} style={{ position: "relative", marginLeft: "4px", flexShrink: 0 }}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Account"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: activeAccount.color,
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          border: isOpen ? "2px solid hsl(var(--md-sys-color-primary))" : "none",
          padding: 0,
          backgroundImage: activeAccount.avatarUrl ? `url(${activeAccount.avatarUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          outline: "none"
        }}
        title={activeAccount.name}
      >
        {!activeAccount.avatarUrl && activeAccount.initials}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            width: 360,
            backgroundColor: "hsl(var(--md-sys-color-surface-container))",
            borderRadius: 20,
            boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
            zIndex: 200,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            color: "hsl(var(--md-sys-color-on-surface))",
            padding: "16px 0 0 0"
          }}
        >
          {/* Section 1: Current User */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px 16px" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: activeAccount.color,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 500,
                marginBottom: 12,
                backgroundImage: activeAccount.avatarUrl ? `url(${activeAccount.avatarUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              {!activeAccount.avatarUrl && activeAccount.initials}
            </div>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 2 }}>{activeAccount.name}</div>
            <div style={{ fontSize: 14, color: "hsl(var(--md-sys-color-on-surface-variant))", marginBottom: 16 }}>
              {activeAccount.email}
            </div>
            <button
              onClick={() => {}}
              style={{
                height: 36,
                padding: "0 16px",
                borderRadius: 18,
                border: "1px solid hsl(var(--md-sys-color-outline))",
                backgroundColor: "transparent",
                color: "hsl(var(--md-sys-color-primary))",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Manage your Google Account
            </button>
          </div>

          <md-divider></md-divider>

          {/* Section 2: Other Accounts */}
          {otherAccounts.length > 0 && (
            <div style={{ padding: "8px 0" }}>
              {otherAccounts.map(account => (
                <div
                  key={account.id}
                  onClick={() => {
                    signIn(account.id);
                    setIsOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: account.color,
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 500,
                      marginRight: 12,
                      backgroundImage: account.avatarUrl ? `url(${account.avatarUrl})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  >
                    {!account.avatarUrl && account.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {account.name}
                    </span>
                    <span style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {account.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Section 3: Add Account */}
          <div
            onClick={() => setIsAddAccountOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))", marginRight: 12, fontSize: 20 }}>
              person_add
            </md-icon>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Add another account</span>
          </div>

          <md-divider></md-divider>

          {/* Section 4: Actions */}
          <div style={{ padding: "8px 0" }}>
            <div
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))", marginRight: 12, fontSize: 20 }}>
                settings
              </md-icon>
              <span style={{ fontSize: 14 }}>Settings</span>
            </div>

            <div
              onClick={() => {
                signOut();
                navigate("/login");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <md-icon style={{ color: "hsl(var(--md-sys-color-on-surface-variant))", marginRight: 12, fontSize: 20 }}>
                logout
              </md-icon>
              <span style={{ fontSize: 14 }}>Sign out</span>
            </div>
          </div>

          <md-divider></md-divider>

          {/* Footer */}
          <div style={{ padding: "12px", display: "flex", justifyContent: "center", gap: 16 }}>
            <a href="#" style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
              Privacy Policy
            </a>
            <span style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>•</span>
            <a href="#" style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
              Terms of Service
            </a>
          </div>
        </div>
      )}
      
      <AddAccountDialog
        open={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onSuccess={() => setIsAddAccountOpen(false)}
      />
    </div>
  );
}
