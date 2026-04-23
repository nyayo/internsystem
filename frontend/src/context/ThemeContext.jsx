/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const THEME_KEY = "internship_theme_dark";

function getStoredThemeMode() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "true";
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(getStoredThemeMode);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-theme-variables");
    } else {
      document.body.classList.remove("dark-theme-variables");
    }

    try {
      localStorage.setItem(THEME_KEY, String(isDarkMode));
    } catch {
      // Ignore storage write errors and keep UI responsive.
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => setIsDarkMode((previousMode) => !previousMode), []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
