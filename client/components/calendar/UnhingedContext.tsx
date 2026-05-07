import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { UnhingedModal } from "./UnhingedModal";

interface ModalState {
  title: string;
  message: ReactNode;
  type: "alert" | "confirm" | "prompt";
  resolve?: (value: any) => void;
}

export type AppTheme = "light" | "dark" | "90s" | "70s";

interface UnhingedContextValue {
  jargonMode: boolean;
  setJargonMode: Dispatch<SetStateAction<boolean>>;
  ghostMode: boolean;
  setGhostMode: Dispatch<SetStateAction<boolean>>;
  aggressiveTimeBoxing: boolean;
  setAggressiveTimeBoxing: Dispatch<SetStateAction<boolean>>;
  theme: AppTheme;
  setTheme: Dispatch<SetStateAction<AppTheme>>;
  showModal: (title: string, message: ReactNode, type?: "alert" | "confirm" | "prompt") => Promise<any>;
}

export const UnhingedContext = createContext<UnhingedContextValue | null>(null);

export function useUnhinged(): UnhingedContextValue {
  const ctx = useContext(UnhingedContext);
  if (!ctx) throw new Error("useUnhinged must be used within UnhingedProvider");
  return ctx;
}

export function UnhingedProvider({ children }: { children: ReactNode }) {
  const [jargonMode, setJargonMode] = useState(() => {
    try { return localStorage.getItem("unhinged_jargonMode") === "true"; } catch { return false; }
  });
  const [ghostMode, setGhostMode] = useState(() => {
    try { return localStorage.getItem("unhinged_ghostMode") === "true"; } catch { return false; }
  });
  const [aggressiveTimeBoxing, setAggressiveTimeBoxing] = useState(() => {
    try { return localStorage.getItem("unhinged_aggressiveTimeBoxing") === "true"; } catch { return false; }
  });
  const [theme, setTheme] = useState<AppTheme>(() => {
    try { return (localStorage.getItem("unhinged_theme") as AppTheme) || "light"; } catch { return "light"; }
  });

  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [inputValue, setInputValue] = useState("");

  const showModal = (title: string, message: ReactNode, type: "alert" | "confirm" | "prompt" = "alert") => {
    return new Promise<any>((resolve) => {
      setInputValue("");
      setModalState({ title, message, type, resolve });
    });
  };

  const handleConfirm = () => {
    if (!modalState) return;
    if (modalState.type === "prompt") modalState.resolve?.(inputValue);
    else modalState.resolve?.(true);
    setModalState(null);
  };

  const handleCancel = () => {
    if (!modalState) return;
    if (modalState.type === "prompt") modalState.resolve?.(null);
    else modalState.resolve?.(false);
    setModalState(null);
  };

  useEffect(() => {
    try { localStorage.setItem("unhinged_jargonMode", String(jargonMode)); } catch {}
  }, [jargonMode]);

  useEffect(() => {
    try { localStorage.setItem("unhinged_ghostMode", String(ghostMode)); } catch {}
  }, [ghostMode]);

  useEffect(() => {
    try { localStorage.setItem("unhinged_aggressiveTimeBoxing", String(aggressiveTimeBoxing)); } catch {}
  }, [aggressiveTimeBoxing]);

  useEffect(() => {
    try { localStorage.setItem("unhinged_theme", theme); } catch {}

    // Apply theme classes to document root
    const root = document.documentElement;
    root.classList.remove("dark", "theme-90s", "theme-70s");
    if (theme !== "light") {
      root.classList.add(theme === "dark" ? "dark" : `theme-${theme}`);
    }
  }, [theme]);

  return (
    <UnhingedContext.Provider
      value={{
        jargonMode,
        setJargonMode,
        ghostMode,
        setGhostMode,
        aggressiveTimeBoxing,
        setAggressiveTimeBoxing,
        theme,
        setTheme,
        showModal,
      }}
    >
      {children}
      {modalState && (
        <UnhingedModal
          open={!!modalState}
          title={modalState.title}
          message={modalState.message}
          type={modalState.type}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </UnhingedContext.Provider>
  );
}
