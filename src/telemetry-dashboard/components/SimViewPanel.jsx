import React, { useState } from "react";
import TelemetryScene from "../simulator/TelemetryScene.jsx";
import { useTheme } from "../../styles/ThemeContext.jsx";
import { ZOOM_MIN, ZOOM_MAX, DEFAULT_ZOOM } from "../simulator/TelemetryScene.jsx";

export function SimViewPanel({ telemetry, history, rocketPos, isLocked }) {
  const { styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);

  return (
    <section style={{ gridColumn: "1", gridRow: "1", display: "flex" }}>
      <div style={{ ...dash.glassPane, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ ...dash.cardHeader, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span>SPATIAL RECONSTRUCTION</span>
          {isLocked && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
              <label style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(159, 168, 175, 0.9)" }}>ZOOM</label>
              <input
                type="range"
                min={ZOOM_MIN}
                max={ZOOM_MAX}
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                style={{
                  width: "100px",
                  accentColor: "rgba(73, 238, 242, 0.9)",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(159, 168, 175, 0.9)", minWidth: 28 }}>
                {zoomLevel}
              </span>
            </div>
          )}
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <TelemetryScene
            telemetry={telemetry}
            history={history}
            rocketPos={rocketPos}
            isTrackOn={isLocked}
            darkMode={true}
            bgColor="rgba(5,5,8,0.95)"
            zoomDistance={zoomLevel}
          />
        </div>
      </div>
    </section>
  );
}
