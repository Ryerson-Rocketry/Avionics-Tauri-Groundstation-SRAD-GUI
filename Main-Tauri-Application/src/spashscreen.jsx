import React, { useState, useMemo, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTelemetry } from "./useTelemetry";
import { SimViewPanel } from "./components/SimViewPanel";
import { ChartPanel } from "./components/ChartPanel.jsx";
import { StatsPanel } from "./components/StatsPanel";
import { TerminalPanel } from "./components/TerminalPanel";
import { HeaderBar } from "./components/HeaderBar";
import { Timeline } from "./components/Timeline";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useTheme } from "../styles/ThemeContext.jsx";

import { getCurrentWindow } from "@tauri-apps/api/window";

import "leaflet/dist/leaflet.css";
import { ChartGroupPanel } from "./components/ChartGroupPanel.jsx";

import "./dashboard.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, map.getZoom());
  }, [coords]);
  return null;
}



export default function SplashScreen() {

  const theme = {
    bg: ui.colors.glassBg,
    accent: ui.colors.cyan,
    text: ui.colors.white,
    textSub: ui.colors.gray,
    terminal: "rgba(0,0,0,0.6)",
    border: "rgba(159, 168, 175, 0.2)",
  };

  return (
    <div style={{ ...(replay ? dash.containerReplay : dash.container), fontFamily: ui.font.orbitron }}>
        TEST
    </div>
  );
}
