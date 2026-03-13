import React from "react";
import Dashboard from "./dashboard.jsx";
import Background from "../background/background.jsx";
import BackgroundEffect from "../background/effect.jsx";
import { useReplay } from "./useReplay";
import { useTheme } from "../styles/ThemeContext.jsx";

/**
 * Replay view: loads a mission save and renders the dashboard with timeline (play/pause/seek/speed).
 */
export default function ReplayDashboardPage({ saveDirName, onExit }) {
  const replay = useReplay(saveDirName);
  const { styles: uiStyles } = useTheme();
  const styles = uiStyles.telemetryDashboard;

  if (!saveDirName) return null;
  if (replay.loadError) {
    return (
      <div style={styles.replayWrapper}>
        <Background>
          <BackgroundEffect />
        </Background>
        <div style={styles.replayOverlay}>
          <h2 style={styles.replayErrorTitle}>Failed to load replay</h2>
          <p style={styles.replayErrorText}>{replay.loadError}</p>
          <button
            type="button"
            onClick={onExit}
            style={styles.replayExitBtn}
          >
            EXIT
          </button>
        </div>
      </div>
    );
  }
  if (!replay.profile) {
    return (
      <div style={styles.replayWrapper}>
        <div style={styles.replayOverlay}>
          <span style={styles.replayLoadingText}>Loading replay…</span>
        </div>
      </div>
    );
  }

  const missionProfile = replay.profile;
  const mission = { mission_metadata: missionProfile?.mission_metadata, data: missionProfile };

  return (
    <div style={styles.replayWrapper}>
      <Background>
        <BackgroundEffect />
      </Background>
      <Dashboard
        profile={missionProfile}
        onAbort={onExit}
        socketUrl={null}
        replay={replay}
      />
    </div>
  );
}
