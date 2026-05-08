import React from "react";
import { useTheme } from "../../styles/ThemeContext.jsx";
import Button from "../../components/Button.jsx";
import { labels } from "../../config/labels.jsx";

function HeaderStat({ label, val, unit, isString }) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;
  const data = isString === true ? val : Number(val || 0);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={dash.statLabel}>{label}</div>
      <div style={dash.statValue}>
        {isString === true ? data : data.toFixed(1)}
        <span style={{ fontSize: ui.text.xs, marginLeft: 2 }}>{unit}</span>
      </div>
    </div>
  );
}

export function HeaderBar({
  mission,
  telemetry,
  isLive,
  isFinished,
  isLocked,
  onToggleLock,
  onExit,
  lastCloseReason,
  onTelemetryState,
  telemetryState,
  onFullscreen,
  fullScreenState
}) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;
  const isConnected = isLive && !isFinished && telemetry?.status !== "DISCONNECTED";

  return (
    <nav style={dash.navBar}>
      <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: isConnected ? ui.colors.cyan : ui.colors.red,
            boxShadow: isConnected ? `0 0 10px ${ui.colors.cyan}88` : "none",
          }}
        />
        <div>
          <span style={{ fontFamily: ui.font.orbitron, fontSize: ui.text.md, letterSpacing: "2px", color: ui.colors.white }}>
            {mission?.mission_metadata?.name || "—"}
          </span>
          <div style={{ fontFamily: ui.font.googleSans, fontSize: ui.text.xs, color: ui.colors.gray, letterSpacing: "1px" }}>
            {isConnected ? labels.telemetry.streamConnected : lastCloseReason ? `Disconnected: ${lastCloseReason}` : labels.telemetry.streamDisconnected}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "3vw" }}>
        <HeaderStat label={labels.telemetry.statAltitude} val={telemetry.alt} unit="m" isString={false} />
        <HeaderStat label={labels.telemetry.statVelocity} val={telemetry.vel} unit="m/s" isString={false} />
        <HeaderStat label={labels.telemetry.statMissionTime} val={telemetry.time} unit="s" isString={false} />
        <HeaderStat label={labels.telemetry.statMissionState} val={telemetry.stateName} unit="" isString={true}/>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
        <Button size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={() => onTelemetryState(!telemetryState)} >
          {telemetryState === true ? "Minimize " : "Expand "} Raw Telemetry Stream
        </Button>
        <Button disabled size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} >
          Arrange/Disable Right Data Panels
        </Button>
        <button
          onClick={onToggleLock}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: ui.font.orbitron,
            fontSize: ui.text.xs,
            letterSpacing: "1px",
            color: isLocked ? ui.colors.cyan : ui.colors.gray,
          }}
        >
          {isLocked ? labels.telemetry.lockLocked : labels.telemetry.lockFree}
        </button>
        <Button size="sm" variant="outline" outlineColor={ui.colors.red} textColor={ui.colors.red} onClick={onExit}>
          {labels.telemetry.exit}
        </Button>
        <Button size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={onFullscreen}>
          {fullScreenState === true ? "Fullscreen" : "Minimize"}
        </Button>
      </div>
    </nav>
  );
}
