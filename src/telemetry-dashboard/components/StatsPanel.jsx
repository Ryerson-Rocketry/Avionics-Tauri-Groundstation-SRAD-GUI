import React from "react";
import { useTheme } from "../../styles/ThemeContext.jsx";

function StatGroup({ label, data, type, hideMinMed, dash, ui }) {
  const isAlt = type === "alt";
  if (!data) return null;

  return (
    <div style={{ flex: 1 }}>
      <div style={{ ...dash.statLabel, marginBottom: "0.5vh", color: ui.colors.cyan }}>{label}</div>
      <div style={dash.statLine}>
        <span>MAX</span>
        <span>{(isAlt ? data.maxAlt || 0 : data.maxVel || 0).toFixed(1)}</span>
      </div>
      <div style={dash.statLine}>
        <span>MEAN</span>
        <span>{(isAlt ? data.meanAlt || 0 : data.meanVel || 0).toFixed(1)}</span>
      </div>
      {!hideMinMed && (
        <>
          <div style={dash.statLine}>
            <span>MEDIAN</span>
            <span>{(data.medianAlt || 0).toFixed(1)}</span>
          </div>
          <div style={dash.statLine}>
            <span>MIN</span>
            <span>{(data.minAlt || 0).toFixed(1)}</span>
          </div>
        </>
      )}
    </div>
  );
}

export function StatsPanel({ stats }) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;
  return (
    <div style={{ ...dash.glassPane, padding: "1.2vh 1.2vw" }}>
      <div style={{ ...dash.cardHeader, padding: "0 0 1vh 0", border: "none" }}>DESCRIPTIVE STATISTICS</div>
      <div style={{ display: "flex", gap: "2vw" }}>
        <StatGroup label="ALTITUDE (m)" data={stats} type="alt" dash={dash} ui={ui} />
        <StatGroup label="VELOCITY (m/s)" data={stats} type="vel" hideMinMed dash={dash} ui={ui} />
      </div>
    </div>
  );
}
