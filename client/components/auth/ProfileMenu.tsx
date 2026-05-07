import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '@material/web/button/outlined-button.js';
import '@material/web/icon/icon.js';

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeAccount, accounts, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!activeAccount) return null;

  const otherAccounts = accounts.filter(a => a.id !== activeAccount.id);

  const handleSignOut = () => {
    signOut();
    navigate('/sign-in');
    setIsOpen(false);
  };

  const handleSwitchAccount = (accountId: string) => {
    signIn(accountId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium outline-none transition-shadow ${
          isOpen ? 'ring-2 ring-offset-2 ring-offset-[var(--md-sys-color-surface)] ring-[var(--md-sys-color-primary)]' : ''
        }`}
        style={{ backgroundColor: activeAccount.color }}
        aria-label="Account Menu"
      >
        {activeAccount.initials}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-[360px] bg-[var(--md-sys-color-surface-container-high)] rounded-[24px] shadow-lg overflow-hidden flex flex-col z-50">
          {/* Current User Section */}
          <div className="p-4 flex flex-col items-center gap-2">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-medium mt-2"
              style={{ backgroundColor: activeAccount.color }}
            >
              {activeAccount.initials}
            </div>
            <div className="text-center">
              <div className="text-[var(--md-sys-color-on-surface)] font-medium text-lg">{activeAccount.name}</div>
              <div className="text-[var(--md-sys-color-on-surface-variant)] text-sm">{activeAccount.email}</div>
            </div>
            <div className="mt-4 w-full px-4">
              <md-outlined-button className="w-full">
                Manage your Google Account
              </md-outlined-button>
            </div>
          </div>

          {/* Other Accounts Section */}
          {otherAccounts.length > 0 && (
            <div className="border-t border-[var(--md-sys-color-outline-variant)] py-2">
              {otherAccounts.map(account => (
                <button
                  key={account.id}
                  onClick={() => handleSwitchAccount(account.id)}
                  className="w-full flex items-center gap-4 px-6 py-3 hover:bg-[var(--md-sys-color-surface-container-highest)] transition-colors text-left"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
                    style={{ backgroundColor: account.color }}
                  >
                    {account.initials}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[var(--md-sys-color-on-surface)] font-medium text-sm truncate">{account.name}</span>
                    <span className="text-[var(--md-sys-color-on-surface-variant)] text-xs truncate">{account.email}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-[var(--md-sys-color-outline-variant)] py-2">
            <button className="w-full flex items-center gap-4 px-6 py-3 hover:bg-[var(--md-sys-color-surface-container-highest)] transition-colors text-[var(--md-sys-color-on-surface)]">
              <md-icon>settings</md-icon>
              <span className="font-medium text-sm">Settings</span>
            </button>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 px-6 py-3 hover:bg-[var(--md-sys-color-surface-container-highest)] transition-colors text-[var(--md-sys-color-on-surface)]"
            >
              <md-icon>logout</md-icon>
              <span className="font-medium text-sm">Sign out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-[var(--md-sys-color-outline-variant)] p-4 flex justify-center gap-4 text-xs text-[var(--md-sys-color-on-surface-variant)]">
            <button className="hover:text-[var(--md-sys-color-on-surface)]">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-[var(--md-sys-color-on-surface)]">Terms of Service</button>
          </div>
        </div>
      )}
    </div>
  );
}
