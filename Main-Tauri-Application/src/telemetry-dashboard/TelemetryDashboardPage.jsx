import React from "react";
import Dashboard from "./dashboard.jsx";
import Background from "../background/background.jsx";
import BackgroundEffect from "../background/effect.jsx";
import { useTheme } from "../styles/ThemeContext.jsx";

/**
 * Full-screen wrapper for the telemetry dashboard.
 * Uses the same background as the main menu; rendered when in telemetry view.
 */
export default function TelemetryDashboardPage({ mission, onExit }) {
  if (!mission) return null;

  const { ip, port, endpoint, profile } = mission;

  let socketUrl = endpoint || "";
  if (!socketUrl && ip && port) {
    socketUrl = `${ip}:${port}`;
  }
  if (socketUrl && !socketUrl.startsWith("ws://") && !socketUrl.startsWith("wss://")) {
    socketUrl = `ws://${socketUrl}`;
  }

  const missionProfile = profile || mission;

  const { styles: uiStyles } = useTheme();

  return (
    <div style={uiStyles.telemetryDashboard.container}>
      <Background>
        <BackgroundEffect />
      </Background>
      <Dashboard
        profile={missionProfile}
        onAbort={onExit}
        socketUrl={socketUrl}
        saveDirName={mission.saveDirName}
      />
    </div>
  );
}

