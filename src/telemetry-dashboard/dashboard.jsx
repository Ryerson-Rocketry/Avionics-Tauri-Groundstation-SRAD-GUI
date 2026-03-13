import React, { useState, useMemo, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTelemetry } from "./useTelemetry";
import { SimViewPanel } from "./components/SimViewPanel";
import { AltitudeChartPanel } from "./components/AltitudeChartPanel";
import { StatsPanel } from "./components/StatsPanel";
import { TerminalPanel } from "./components/TerminalPanel";
import { HeaderBar } from "./components/HeaderBar";
import { Timeline } from "./components/Timeline";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useTheme } from "../styles/ThemeContext.jsx";

import "leaflet/dist/leaflet.css";

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

export default function Dashboard({ profile, onAbort, socketUrl, saveDirName, replay }) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;
  const [isLive] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [chartUpdateIntervalSec, setChartUpdateIntervalSec] = useState(1);

  const live = useTelemetry(
    !replay && isLive && !isFinished,
    socketUrl || "",
    profile,
    {
      chartUpdateIntervalSeconds: chartUpdateIntervalSec,
      recordingSaveDirName: saveDirName || null,
    }
  );

  const handleExit = useCallback(async () => {
    if (replay) {
      await onAbort?.();
      return;
    }
    if (saveDirName && typeof live.flushRecording === "function") {
      await live.flushRecording();
      try {
        const total = await invoke("finalize_mission_save", { saveDirName });
        window.alert(`Mission saved. ${total} telemetry rows merged into telemetry.csv.`);
      } catch (e) {
        console.error("[RocketView] Finalize save failed:", e);
        window.alert("Save failed: " + (e?.message || String(e)));
      }
    }
    await onAbort?.();
  }, [replay, saveDirName, live, onAbort]);

  const telemetry = replay?.telemetry ?? live.telemetry;
  const history = replay?.history ?? live.history;
  const rocketPos = replay?.rocketPos ?? live.rocketPos;
  const chartData = replay?.chartData ?? live.chartData;
  const consoleLogs = replay?.consoleLogs ?? live.consoleLogs;
  const stats = replay?.stats ?? live.stats;
  const lastCloseReason = replay?.lastCloseReason ?? live.lastCloseReason;

  const mission = profile?.data || profile;
  const launchSite = useMemo(() => [43.6532, -79.3832], []);
  const currentGPS = useMemo(() => {
    const latOffset = (telemetry.alt || 0) / 111320;
    const lngOffset = (telemetry.vel || 0) / 111320;
    return [launchSite[0] + latOffset, launchSite[1] + lngOffset];
  }, [telemetry.alt, telemetry.vel, launchSite]);

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
      {replay && (
        <Timeline
          currentTime={replay.currentTime}
          duration={replay.duration}
          playing={replay.playing}
          onPlayPause={() => replay.setPlaying(!replay.playing)}
          onSeek={replay.setCurrentTime}
          speed={replay.speed}
          onSpeedChange={replay.setSpeed}
          onExit={handleExit}
        />
      )}
      <HeaderBar
        mission={mission}
        telemetry={telemetry}
        isLive={!replay && isLive}
        isFinished={isFinished}
        isLocked={isLocked}
        onToggleLock={() => setIsLocked(!isLocked)}
        onExit={handleExit}
        lastCloseReason={lastCloseReason}
      />

      <main style={dash.dashboardGrid}>
        <SimViewPanel
          telemetry={telemetry}
          history={history}
          rocketPos={rocketPos}
          isLocked={isLocked}
        />

        <aside style={{ gridColumn: "2", gridRow: "1", display: "flex", flexDirection: "column", gap: "1.2vh", overflowY: "auto" }}>
          <AltitudeChartPanel
            data={chartData}
            chartUpdateIntervalSec={chartUpdateIntervalSec}
            onChartUpdateIntervalChange={replay ? undefined : setChartUpdateIntervalSec}
          />
          <StatsPanel stats={stats} />
        </aside>

        {profile?.features?.enable_map_view === true && (
          <div style={{ ...dash.glassPane, gridColumn: "1", gridRow: "2", display: "flex", flexDirection: "column" }}>
            <div style={dash.cardHeader}>GPS RECOVERY POSITION</div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <MapContainer
                center={launchSite}
                zoom={16}
                style={{ height: "100%", filter: "grayscale(1) invert(1)" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapRecenter coords={currentGPS} />
                <Marker position={currentGPS} />
              </MapContainer>
            </div>
          </div>
        )}

        <TerminalPanel
          consoleLogs={consoleLogs}
          fullWidth={profile?.features?.enable_map_view !== true}
        />
      </main>
    </div>
  );
}
