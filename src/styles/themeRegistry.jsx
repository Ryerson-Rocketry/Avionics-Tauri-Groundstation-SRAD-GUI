import { darkTheme } from "./themes/dark/index.jsx";
import { lightTheme } from "./themes/light/index.jsx";
import {retroTheme} from "./themes/retro/index.jsx";
import {eightBitTheme} from "./themes/8bit/index.jsx";
import {minecraftTheme} from "./themes/minecraft/index.jsx";
import {batmanTheme} from "./themes/batman/index.jsx";

const THEMES = {
  dark: darkTheme,
  light: lightTheme,
  retro: retroTheme,
  eightBit: eightBitTheme,
  minecraft: minecraftTheme,
  batman: batmanTheme
};

export function getTheme(name) {
  return THEMES[name] || darkTheme;
}

export function listThemes() {
  return Object.keys(THEMES);
}

