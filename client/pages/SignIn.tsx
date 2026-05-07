import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '@material/web/icon/icon.js';

export function SignIn() {
  const { accounts, activeAccount, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeAccount) {
      navigate('/');
    }
  }, [activeAccount, navigate]);

  const handleSignIn = (accountId: string) => {
    signIn(accountId);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--md-sys-color-surface-container-lowest)] p-4">
      <div className="w-full max-w-[448px] bg-[var(--md-sys-color-surface-container)] rounded-[28px] p-8 shadow-sm flex flex-col items-center">
        <div className="w-12 h-12 bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] rounded-full flex items-center justify-center mb-6">
          <md-icon>calendar_today</md-icon>
        </div>
        
        <h1 className="text-2xl font-normal text-[var(--md-sys-color-on-surface)] mb-8">Sign in</h1>

        <div className="w-full flex flex-col gap-2">
          {accounts.map(account => (
            <button
              key={account.id}
              onClick={() => handleSignIn(account.id)}
              className="w-full flex items-center gap-4 p-3 rounded-[16px] hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)]"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0"
                style={{ backgroundColor: account.color }}
              >
                {account.initials}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[var(--md-sys-color-on-surface)] font-medium truncate">{account.name}</span>
                <span className="text-[var(--md-sys-color-on-surface-variant)] text-sm truncate">{account.email}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 w-full border-t border-[var(--md-sys-color-outline-variant)] flex justify-center gap-6 text-sm text-[var(--md-sys-color-primary)]">
          <button className="hover:underline">Privacy Policy</button>
          <button className="hover:underline">Terms of Service</button>
        </div>
      </div>
    </div>
  );
}
