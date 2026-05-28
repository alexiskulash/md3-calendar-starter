import { useEffect, useState } from "react";

const STORAGE_KEY = "calendar-dark-mode";

function getInitial(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "true";
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useDarkMode(): [boolean, (v: boolean) => void] {
  const [dark, setDark] = useState(getInitial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem(STORAGE_KEY, String(dark)); } catch {}
  }, [dark]);

  return [dark, setDark];
}
