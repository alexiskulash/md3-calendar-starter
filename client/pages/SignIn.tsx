import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@material/web/icon/icon.js";
import "@material/web/button/text-button.js";
import "@material/web/divider/divider.js";
import { useAuth } from "../context/AuthContext";
import { AddAccountDialog } from "../components/auth/AddAccountDialog";

export default function SignIn() {
  const { knownAccounts, signIn } = useAuth();
  const navigate = useNavigate();
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  const handleSignIn = (accountId: string) => {
    signIn(accountId);
    navigate("/");
  };

  const handleKeyDown = (e: React.KeyboardEvent, accountId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSignIn(accountId);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-surface"
      style={{ backgroundColor: "hsl(var(--md-sys-color-background))" }}
    >
      <div 
        className="w-full max-w-[448px] bg-surface p-10 flex flex-col items-center"
        style={{ 
          backgroundColor: "hsl(var(--md-sys-color-surface))",
          borderRadius: "28px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-center mb-4"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "24px",
            backgroundColor: "hsl(var(--md-sys-color-primary-container))",
            color: "hsl(var(--md-sys-color-on-primary-container))"
          }}
        >
          <md-icon>calendar_today</md-icon>
        </div>
        
        <h1 
          className="mb-2"
          style={{ 
            fontSize: "24px", 
            fontWeight: 400,
            color: "hsl(var(--md-sys-color-on-surface))" 
          }}
        >
          Sign in
        </h1>
        
        <p 
          className="mb-8 text-center"
          style={{ color: "hsl(var(--md-sys-color-on-surface-variant))" }}
        >
          Choose an account to continue to Calendar
        </p>

        {/* Account List */}
        <div className="w-full flex flex-col gap-1 mb-8">
          {knownAccounts.map((account) => (
            <div
              key={account.id}
              onClick={() => handleSignIn(account.id)}
              onKeyDown={(e) => handleKeyDown(e, account.id)}
              tabIndex={0}
              className="flex items-center p-3 cursor-pointer rounded-full transition-colors hover:bg-[hsl(var(--md-sys-color-surface-container))] outline-none focus:ring-2 focus:ring-primary"
            >
              {/* Avatar */}
              <div
                className="flex items-center justify-center flex-shrink-0 mr-4 text-white"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "20px",
                  backgroundColor: account.color,
                  backgroundImage: account.avatarUrl ? `url(${account.avatarUrl})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                {!account.avatarUrl && <span style={{ fontSize: "16px", fontWeight: 500 }}>{account.initials}</span>}
              </div>

              {/* User Info */}
              <div className="flex flex-col flex-grow min-w-0">
                <span 
                  className="truncate"
                  style={{ fontSize: "15px", fontWeight: 500, color: "hsl(var(--md-sys-color-on-surface))" }}
                >
                  {account.name}
                </span>
                <span 
                  className="truncate"
                  style={{ fontSize: "13px", color: "hsl(var(--md-sys-color-on-surface-variant))" }}
                >
                  {account.email}
                </span>
              </div>
            </div>
          ))}

          <md-divider className="my-2"></md-divider>

          {/* Add Account row */}
          <div
            onClick={() => setIsAddAccountOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsAddAccountOpen(true);
              }
            }}
            tabIndex={0}
            className="flex items-center p-3 cursor-pointer rounded-full transition-colors hover:bg-[hsl(var(--md-sys-color-surface-container))] outline-none focus:ring-2 focus:ring-primary"
          >
            <div
              className="flex items-center justify-center flex-shrink-0 mr-4"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "20px",
                color: "hsl(var(--md-sys-color-on-surface-variant))"
              }}
            >
              <md-icon>account_circle</md-icon>
            </div>
            <span style={{ fontSize: "15px", fontWeight: 500, color: "hsl(var(--md-sys-color-on-surface))" }}>
              Use another account
            </span>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex gap-4"
          style={{ fontSize: "12px", color: "hsl(var(--md-sys-color-on-surface-variant))" }}
        >
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>

      <AddAccountDialog 
        open={isAddAccountOpen} 
        onClose={() => setIsAddAccountOpen(false)}
        onSuccess={() => {
          setIsAddAccountOpen(false);
          navigate("/");
        }}
      />
    </div>
  );
}
