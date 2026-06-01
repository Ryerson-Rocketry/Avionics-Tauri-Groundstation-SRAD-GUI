import React from "react";
import { useStat, useEffect, useState } from "react";
import { useTheme } from "../../styles/ThemeContext.jsx";

import Button from "../../components/Button.jsx";


import { listen } from '@tauri-apps/api/event';

function formatValue(value, unit) {
  if (value == null) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return unit ? `${n.toFixed(2)} ${unit}` : n.toFixed(2);
}

export function TerminalPanel({ consoleLogs, stdLogs, fullWidth }) {



  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;

  const [showWebserverStd, setShowWebserverStd] = useState (false);

    useEffect(() => {
        console.log(stdLogs);
        console.log(consoleLogs);
      }
      ,[stdLogs, consoleLogs]);


  return (
    <div
      style={{
        ...dash.glassPane,
        gridColumn: fullWidth ? "1 / -1" : "1",
        gridRow: "2",
        display: "flex",
        flexDirection: "column",
      }}
    >
      

      <div style={{display: "flex", padding: "0 0 1vh 0", border: "none", justifyContent: 'space-between', marginRight: "10px"}}>
          <div style={dash.cardHeader}>Console ({showWebserverStd === true ? "WEBSERVER I/O LOGS" : "RAW TELEMETRY STREAM"})</div>
          <Button size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={() => setShowWebserverStd(!showWebserverStd)}>
            {showWebserverStd === true ? "Show Telemetry Stream" : "Show Server STDOUT/ERR"}
          </Button>
      </div>

      <div style={dash.terminal}>
        {showWebserverStd === true ? 
          stdLogs.map((log, i) => {
            return (
              <div key={stdLogs.length-i} style={log.toString().includes("ERR:") === true ? {color:'red', marginBottom: "2px", whiteSpace: "nowrap" } : (log.toString().includes("SUCCESS:") === true ? {color:'green', marginBottom: "2px", whiteSpace: "nowrap" } : {color:'gray', marginBottom: "2px", whiteSpace: "nowrap" })}>
                <span style={{ opacity: 0.6 }}>[STDOut#:{stdLogs.length-i}]</span>
                  <> {" "}
                    {log}
                  </>
              </div>
            )
          }) :         
          (consoleLogs || []).map((log, i) => {
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
          })
        }

      </div>
    </div>
  );
}
