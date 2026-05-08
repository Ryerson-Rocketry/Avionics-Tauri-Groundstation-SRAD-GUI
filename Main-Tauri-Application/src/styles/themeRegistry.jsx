import { darkTheme } from "./themes/dark/index.jsx";

const THEMES = {
  dark: darkTheme,
};

export function getTheme(name) {
  return THEMES[name] || darkTheme;
}

export function listThemes() {
  return Object.keys(THEMES);
}

