import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "@material/web/icon/icon.js";
import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import "@material/web/divider/divider.js";

export function SignIn() {
  const { users, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = (userId: string) => {
    signIn(userId);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-variant/30 px-4">
      <div className="w-full max-w-[448px] bg-surface rounded-[28px] p-9 shadow-lg border border-outline-variant/50 flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
            <md-icon style={{ color: "var(--md-sys-color-primary)", fontSize: "24px" }}>calendar_today</md-icon>
          </div>
          <h1 className="text-2xl font-normal text-on-surface text-center m-0 mb-2">Sign in</h1>
          <p className="text-on-surface-variant text-base m-0 text-center">Use your mock Google Account</p>
        </div>

        {/* Account List */}
        <div className="w-full border border-outline-variant rounded-xl overflow-hidden mb-8">
          <md-list>
            {users.map((user, index) => (
              <React.Fragment key={user.id}>
                <md-list-item 
                  type="button" 
                  onClick={() => handleSignIn(user.id)}
                  className="cursor-pointer"
                >
                  <div slot="start" className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm mr-4" style={{ backgroundColor: user.color }}>
                    {user.initials}
                  </div>
                  <div slot="headline" className="font-medium text-on-surface">{user.name}</div>
                  <div slot="supporting-text" className="text-on-surface-variant text-sm">{user.email}</div>
                </md-list-item>
                {index < users.length - 1 && <md-divider></md-divider>}
              </React.Fragment>
            ))}
          </md-list>
        </div>

        {/* Footer */}
        <div className="w-full flex justify-between items-center text-xs font-medium text-on-surface-variant mt-auto pt-4 border-t border-outline-variant/30">
          <div className="flex gap-4">
            <a href="#" className="hover:bg-on-surface/5 px-2 py-1 rounded transition-colors no-underline text-on-surface-variant">Help</a>
            <a href="#" className="hover:bg-on-surface/5 px-2 py-1 rounded transition-colors no-underline text-on-surface-variant">Privacy</a>
            <a href="#" className="hover:bg-on-surface/5 px-2 py-1 rounded transition-colors no-underline text-on-surface-variant">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}
