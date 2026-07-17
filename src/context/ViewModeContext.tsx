import { createContext, useContext, useState, type ReactNode } from "react";
import type { ViewMode } from "../types";

const STORAGE_KEY = "yamane-portfolio-view-mode";

interface ViewModeContextValue {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextValue>({
  mode: "quick",
  setMode: () => {},
});

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved === "deep" ? "deep" : "quick";
    } catch {
      return "quick";
    }
  });

  const setMode = (nextMode: ViewMode) => {
    setModeState(nextMode);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextMode);
    } catch {
      // Storage may be unavailable in private browsing or restricted embeds.
    }
  };

  return (
    <ViewModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  return useContext(ViewModeContext);
}
