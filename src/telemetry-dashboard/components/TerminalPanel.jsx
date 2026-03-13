import React from "react";
import { useTheme } from "../../styles/ThemeContext.jsx";

function formatValue(value, unit) {
  if (value == null) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return unit ? `${n.toFixed(2)} ${unit}` : n.toFixed(2);
}

export function TerminalPanel({ consoleLogs, fullWidth }) {
  const { styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;
  return (
    <div
      style={{
        ...dash.glassPane,
        gridColumn: fullWidth ? "1 / -1" : "2",
        gridRow: "2",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={dash.cardHeader}>RAW TELEMETRY STREAM</div>
      <div style={dash.terminal}>
        {(consoleLogs || []).map((log, i) => {
          const isRich = log && typeof log === "object" && "fields" in log;
          const time = isRich ? log.time : (Array.isArray(log) ? log[0] : 0);
          const timeStr = (typeof time === "number" ? time : Number(time) || 0).toFixed(1);
          return (
            <div key={i} style={{ marginBottom: "2px", whiteSpace: "nowrap" }}>
              <span style={{ opacity: 0.6 }}>[{timeStr}s]</span>
              {isRich ? (
                <>{" "}
                  {log.fields.map((f, j) => (
                    <span key={j}>
                      {j > 0 && " · "}
                      {f.label}: {formatValue(f.value, f.unit)}
                    </span>
                  ))}
                </>
              ) : (
                <> DATA_PKT: ALT_{Array.isArray(log) ? log[1] ?? 0 : 0}</>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
