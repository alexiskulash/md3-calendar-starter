import { ReactNode } from "react";
import "@material/web/icon/icon.js";

interface UnhingedModalProps {
  open: boolean;
  title: string;
  message: ReactNode;
  type: "alert" | "confirm" | "prompt";
  inputValue?: string;
  onInputChange?: (val: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnhingedModal({
  open,
  title,
  message,
  type,
  inputValue,
  onInputChange,
  onConfirm,
  onCancel,
}: UnhingedModalProps) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={type !== "alert" ? onCancel : onConfirm}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1000,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "hsl(var(--md-sys-color-surface-container-high))",
          borderRadius: 24,
          padding: 24,
          width: 400,
          maxWidth: "calc(100vw - 32px)",
          zIndex: 1001,
          boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 24, color: "hsl(var(--md-sys-color-on-surface))" }}>
          {title}
        </h2>
        <div style={{ fontSize: 16, color: "hsl(var(--md-sys-color-on-surface-variant))", whiteSpace: "pre-wrap" }}>
          {message}
        </div>
        
        {type === "prompt" && (
          <input
            autoFocus
            value={inputValue}
            onChange={(e) => onInputChange?.(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onConfirm(); }}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 8,
              border: "1px solid hsl(var(--md-sys-color-outline-variant))",
              backgroundColor: "hsl(var(--md-sys-color-surface-container-highest))",
              color: "hsl(var(--md-sys-color-on-surface))",
              fontSize: 16,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          {type !== "alert" && (
            <button
              onClick={onCancel}
              style={{
                padding: "10px 24px",
                border: 0,
                borderRadius: 20,
                backgroundColor: "transparent",
                color: "hsl(var(--md-sys-color-primary))",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 24px",
              border: 0,
              borderRadius: 20,
              backgroundColor: "hsl(var(--md-sys-color-primary))",
              color: "hsl(var(--md-sys-color-on-primary))",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {type === "alert" ? "OK" : "Confirm"}
          </button>
        </div>
      </div>
    </>
  );
}
