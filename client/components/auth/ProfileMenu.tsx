import { Account, useAuth } from "../../context/AuthContext";

interface ProfileMenuProps {
  onClose: () => void;
}

export function ProfileMenu({ onClose }: ProfileMenuProps) {
  const { currentUser, accounts, switchAccount, signOut } = useAuth();

  if (!currentUser) return null;

  const otherAccounts = accounts.filter((a) => a.id !== currentUser.id);

  const handleSwitch = (account: Account) => {
    switchAccount(account);
    onClose();
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <>
      {/* Backdrop for outside-click dismiss */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 299,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 68,
          right: 16,
          width: 360,
          backgroundColor: "hsl(var(--md-sys-color-surface-container))",
          borderRadius: 20,
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          zIndex: 300,
          overflow: "hidden",
        }}
      >
        {/* Section 1 — Current user */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px 24px 16px",
            gap: 8,
          }}
        >
          {/* Large avatar */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: currentUser.color,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {currentUser.initials}
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "hsl(var(--md-sys-color-on-surface))",
              }}
            >
              {currentUser.name}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "hsl(var(--md-sys-color-on-surface-variant))",
              }}
            >
              {currentUser.email}
            </div>
          </div>

          {/* Manage account button (non-functional, P1) */}
          <button
            style={{
              marginTop: 4,
              height: 32,
              padding: "0 16px",
              borderRadius: 16,
              border: "1px solid hsl(var(--md-sys-color-outline))",
              backgroundColor: "transparent",
              color: "hsl(var(--md-sys-color-on-surface))",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onClick={(e) => e.preventDefault()}
          >
            Manage your Google Account
          </button>
        </div>

        {/* Section 2 — Other accounts */}
        {otherAccounts.length > 0 && (
          <>
            <div style={{ height: 1, backgroundColor: "hsl(var(--md-sys-color-outline-variant))" }} />
            <div
              style={{
                padding: "8px 16px 4px",
                fontSize: 12,
                fontWeight: 500,
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                letterSpacing: "0.4px",
                textTransform: "uppercase",
              }}
            >
              Other accounts
            </div>
            {otherAccounts.map((account) => (
              <OtherAccountRow key={account.id} account={account} onSelect={handleSwitch} />
            ))}
          </>
        )}

        {/* Section 3 — Actions */}
        <div style={{ height: 1, backgroundColor: "hsl(var(--md-sys-color-outline-variant))" }} />

        <MenuActionRow
          icon="settings"
          label="Settings"
          onClick={(e) => e.preventDefault()}
        />
        <MenuActionRow
          icon="logout"
          label="Sign out"
          onClick={handleSignOut}
        />

        {/* Footer */}
        <div style={{ height: 1, backgroundColor: "hsl(var(--md-sys-color-outline-variant))" }} />
        <div
          style={{
            padding: "10px 16px",
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <a
            href="#"
            style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))", textDecoration: "none" }}
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </a>
          <span style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))" }}>·</span>
          <a
            href="#"
            style={{ fontSize: 12, color: "hsl(var(--md-sys-color-on-surface-variant))", textDecoration: "none" }}
            onClick={(e) => e.preventDefault()}
          >
            Terms of Service
          </a>
        </div>
      </div>
    </>
  );
}

function OtherAccountRow({ account, onSelect }: { account: Account; onSelect: (a: Account) => void }) {
  return (
    <button
      onClick={() => onSelect(account)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "8px 16px",
        border: 0,
        backgroundColor: "transparent",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        transition: "background-color 0.1s",
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
            fontSize: 13,
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
  );
}

function MenuActionRow({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        padding: "12px 16px",
        border: 0,
        backgroundColor: "transparent",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        color: "hsl(var(--md-sys-color-on-surface))",
        fontSize: 14,
        transition: "background-color 0.1s",
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
      {label}
    </button>
  );
}
