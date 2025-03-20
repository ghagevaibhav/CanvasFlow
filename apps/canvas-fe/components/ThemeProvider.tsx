"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

type Theme = "dark" | "light";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

type CustomThemeProviderProps = Omit<ThemeProviderProps, 'defaultTheme'> & {
  defaultTheme?: Theme;
};

export function ThemeProvider({ children, defaultTheme = "light", storageKey = "canvasflow-theme", ...props }: CustomThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  
  useEffect(() => {
    // Only access localStorage on the client after initial render
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => setTheme(theme),
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <NextThemesProvider attribute="class" defaultTheme={defaultTheme} enableSystem>
        {children}
      </NextThemesProvider>
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
