import React, { useState } from "react";
import { useTheme } from "../../styles/ThemeContext.jsx";
import { useEffect } from "react";
import Button from "../../components/Button.jsx";

//old
/*
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
*/

function StatGroup({ label, data, type, dash, ui }) {
  //const isAlt = type === "alt";
  //if (!data) return null;

  return (
    <div style={{ flex: 1 }}>
      <div style={{ ...dash.statLabel, marginBottom: "0.5vh", color: ui.colors.cyan }}>{label}</div>
      <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>Current</span>
        <span>{data}</span>
      </div>
    </div>
  );
}

export function RadioStatusPanel({ telemetry }) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;

  useEffect(() => {
      //console.log(stats);
    }
    ,[]);


  return (
    <div style={{ ...dash.glassPane, height: "100%", padding: "1.2vh 1.2vw", overflow: 'visible'}}>
      <div style={{ ...dash.cardHeader, display: "flex", border: "none", justifyContent: 'space-between'}}> 
        <div> RADIO STATUS </div> 
        <div> CALLSIGN: {telemetry.radioInfo.callsign} </div> 
          <div style={{display: "flex", gap: "10px"}}>
            <Button disabled size="sm" variant="outline" outlineColor={ui.colors.green} textColor={ui.colors.blue}>
              PLACEHOLDER
            </Button>   
          </div>
           
          </div>

      <div style={{ display: "flex", gap: "2vw"  }}>

        <div style={{ display: "flex", width: "50%", flexDirection: "column", gap: "2vw" }}>
          <div style={{ display: "flex", gap: "2vw" }}>
            <StatGroup label={"RSSI (dBm):"} data={telemetry.radioInfo.rssi} type="na" dash={dash} ui={ui} />
            <StatGroup label={"SNR (dB):"} data={telemetry.radioInfo.snr} type="na" dash={dash} ui={ui} />
            <StatGroup label={"Freq Error: (HZ):"} data={telemetry.radioInfo.freqErr} type="na" dash={dash} ui={ui} />
          </div>

          <div style={{ display: "flex", gap: "2vw" }}>
            <StatGroup label={"MISSED PACKETS (# - TO DO):"} data={-1} type="na" dash={dash} ui={ui} />
            <StatGroup label={"TOTAL PACKETS (# - TO DO):"} data={-1} type="na" dash={dash} ui={ui} />
          </div>
        </div>
        
        
        <div>
          PLACEHOLDER STATUS BITS STUFF HERE
        </div>
      </div>

      
    </div>
  );
}
