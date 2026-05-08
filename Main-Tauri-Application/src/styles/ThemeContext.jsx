import React, { createContext, useContext, useMemo, useState } from "react";
import { getTheme, listThemes } from "./themeRegistry.jsx";

const ThemeContext = createContext({
  name: "dark",
  setTheme: () => {},
  tokens: getTheme("dark").tokens,
  styles: getTheme("dark").styles,
  availableThemes: listThemes(),
});

export function ThemeProvider({ initialTheme = "dark", children }) {
  const [name, setName] = useState(initialTheme || "dark");
  const theme = useMemo(() => getTheme(name), [name]);

  const value = useMemo(
    () => ({
      name,
      setTheme: setName,
      tokens: theme.tokens,
      styles: theme.styles,
      availableThemes: listThemes(),
    }),
    [name, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

