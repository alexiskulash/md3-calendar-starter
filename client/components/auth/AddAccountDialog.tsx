import React, { useState } from "react";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/textfield/filled-text-field.js";
import { useAuth } from "../../context/AuthContext";

interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddAccountDialog({ open, onClose, onSuccess }: AddAccountDialogProps) {
  const { addAccount } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return;

    // Generate random color from Material Design palettes
    const colors = [
      "hsl(var(--md-sys-color-primary))",
      "hsl(var(--md-sys-color-secondary))",
      "hsl(var(--md-sys-color-tertiary))",
      "hsl(var(--md-sys-color-error))",
      "#4CAF50",
      "#FF9800",
      "#9C27B0",
      "#00BCD4"
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const initials = name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    addAccount({
      name: name.trim(),
      email: email.trim(),
      initials,
      color,
    });
    
    setName("");
    setEmail("");
    onSuccess();
  };

  return (
    <md-dialog
      open={open ? true : undefined}
      onClose={(e: Event) => {
        // Prevent default to avoid closing when clicking outside if we don't want to
        // But for now, just sync state
        onClose();
      }}
    >
      <div slot="headline">Add Account</div>
      
      <form slot="content" id="add-account-form" className="flex flex-col gap-4 py-2" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <md-filled-text-field
          label="Full Name"
          value={name}
          onInput={(e: React.FormEvent<HTMLInputElement>) => setName((e.target as HTMLInputElement).value)}
          required
        ></md-filled-text-field>
        
        <md-filled-text-field
          label="Email"
          type="email"
          value={email}
          onInput={(e: React.FormEvent<HTMLInputElement>) => setEmail((e.target as HTMLInputElement).value)}
          required
        ></md-filled-text-field>
      </form>

      <div slot="actions">
        <md-text-button onClick={onClose}>Cancel</md-text-button>
        <md-filled-button onClick={handleSave} disabled={!name.trim() || !email.trim() ? true : undefined}>
          Add Account
        </md-filled-button>
      </div>
    </md-dialog>
  );
}
