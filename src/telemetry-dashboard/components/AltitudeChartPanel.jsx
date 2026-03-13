import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "../../styles/ThemeContext.jsx";

const CHART_INTERVAL_OPTIONS = [0.25, 0.5, 1, 2];

export function AltitudeChartPanel({ data, chartUpdateIntervalSec = 1, onChartUpdateIntervalChange }) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;
  const axisStyle = { fill: "rgba(159, 168, 175, 0.9)", fontSize: 10, fontFamily: ui.font.mono };
  return (
    <div style={{ ...dash.glassPane, padding: "1.2vh 1.2vw" }}>
      <div style={{ ...dash.cardHeader, padding: "0 0 0.8vh 0", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span>ALTITUDE TRAJECTORY</span>
        {onChartUpdateIntervalChange && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
            <label style={{ fontSize: "9px", letterSpacing: "1px", color: "rgba(159, 168, 175, 0.9)" }}>UPDATE</label>
            <select
              value={chartUpdateIntervalSec}
              onChange={(e) => onChartUpdateIntervalChange(Number(e.target.value))}
              style={{
                fontSize: "10px",
                fontFamily: ui.font.mono,
                padding: "2px 6px",
                backgroundColor: "rgba(0,0,0,0.4)",
                color: ui.colors.cyan,
                border: "1px solid rgba(159, 168, 175, 0.3)",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {CHART_INTERVAL_OPTIONS.map((sec) => (
                <option key={sec} value={sec}>{sec}s</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(159, 168, 175, 0.2)" vertical={false} />
          <XAxis
            dataKey="time"
            type="number"
            tick={axisStyle}
            tickFormatter={(v) => `${v.toFixed(0)}`}
            label={{ value: "Time (s)", position: "insideBottom", offset: -4, style: axisStyle }}
          />
          <YAxis
            type="number"
            tick={axisStyle}
            tickFormatter={(v) => `${v.toFixed(0)}`}
            label={{ value: "Altitude (m)", angle: -90, position: "insideLeft", style: axisStyle }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(34, 35, 40, 0.95)", border: "1px solid rgba(159, 168, 175, 0.3)", borderRadius: 4 }}
            labelStyle={axisStyle}
            formatter={(val) => {
              const n = Array.isArray(val) ? val[0] : val;
              const str = n != null && !Number.isNaN(Number(n)) ? Number(n).toFixed(2) : "—";
              return [str, "Altitude"];
            }}
            labelFormatter={(t) => `Time: ${t != null ? Number(t).toFixed(1) : "—"} s`}
          />
          <Line
            type="monotone"
            dataKey="alt"
            stroke={ui.colors.cyan}
            dot={false}
            isAnimationActive={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
