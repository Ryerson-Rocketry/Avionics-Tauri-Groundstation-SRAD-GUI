import React from "react";
import { useTheme } from "../../styles/ThemeContext.jsx";
import { useEffect } from "react";


export function StatsPanel({ }) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;

  useEffect(() => {
      console.log(stats);
    }
    ,[stats]);


  return (
    <div style={{ ...dash.glassPane, padding: "1.2vh 1.2vw" }}>
      <div style={{ ...dash.cardHeader, padding: "0 0 1vh 0", border: "none" }}>CONTROL PANEL</div>
      
    </div>
  );
}
