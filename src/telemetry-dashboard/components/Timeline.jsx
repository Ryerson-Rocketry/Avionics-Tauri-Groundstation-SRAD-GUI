import React from "react";
import { useTheme } from "../../styles/ThemeContext.jsx";

export function Timeline({
  currentTime,
  duration,
  playing,
  onPlayPause,
  onSeek,
  speed,
  onSpeedChange,
  onExit,
}) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;
  const safeDuration = duration > 0 ? duration : 1;
  const percent = Math.min(100, (currentTime / safeDuration) * 100);
  const timeStr = (t) => (Number.isFinite(t) ? t.toFixed(1) : "0") + " s";

  return (
    <div
      style={dash.timelineBar}
    >
      <button
        type="button"
        onClick={onPlayPause}
        style={{ ...dash.timelineBtn, ...dash.timelineBtnCyan }}
      >
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>
      <span style={{ ...dash.timelineTextDim, minWidth: "52px" }}>{timeStr(currentTime)}</span>
      <div
        style={dash.timelineTrack}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const t = Math.max(0, Math.min(duration, x * safeDuration));
          onSeek(t);
        }}
      >
        <div
          style={{ ...dash.timelineFill, width: `${percent}%` }}
        />
      </div>
      <span style={{ ...dash.timelineTextDim, minWidth: "52px" }}>{timeStr(duration)}</span>
      <label style={dash.timelineSpeedLabel}>
        Speed
        <input
          type="range"
          min="0.25"
          max="4"
          step="0.25"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          style={{ width: 80, accentColor: ui.colors.cyan }}
        />
        <span style={{ minWidth: 32 }}>{speed}x</span>
      </label>
      <input
        type="number"
        min="0.25"
        max="4"
        step="0.25"
        value={speed}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) onSpeedChange(Math.max(0.25, Math.min(4, v)));
        }}
        style={dash.timelineNumberInput}
      />
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          style={{ ...dash.timelineBtn, ...dash.timelineBtnRed }}
        >
          EXIT
        </button>
      )}
    </div>
  );
}
