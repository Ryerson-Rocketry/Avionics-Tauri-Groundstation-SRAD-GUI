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

type ComponentStatusGroupProps = {
  componentNames: string[],
  componentStatusBits: number
}

function ComponentStatusGroup({componentNames = [], componentStatusBits}: ComponentStatusGroupProps){
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "1vw" }}>
      

      {
          
        componentNames.map((name: string, componentStatusBitIndex: number) =>
          <div >
            <div style={{ ...dash.statLabel, color: ui.colors.cyan }}>{name}</div>
            <div style={dash.statLine}>
              <span style={{color: ui.colors.cyan }}>Status:</span>
              <span>{componentStatusBits.toString(2).charAt(componentStatusBitIndex) == "1" ? "Working" : "Error"}</span>
            </div>
          </div>
        )
      
      }

    </div>
    
    
    

  );

}

type RadioStatGroupProp = {
  label: string,
  data: number | string
}

function RadioStatGroup({ label, data}: RadioStatGroupProp) {
  //const isAlt = type === "alt";
  //if (!data) return null;
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;

  return (
    <div >
      <div style={{ ...dash.statLabel, marginBottom: "0.5vh", color: ui.colors.cyan }}>{label}</div>
      <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>Current</span>
        <span>{data}</span>
      </div>
    </div>
  );
}

type RadioStatusPanelProps = {
  telemetry: any
}

export function RadioStatusPanel({ telemetry }: RadioStatusPanelProps) {
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
    
          </div>
           
          </div>

      <div style={{ display: "flex", gap: "2vw"  }}>

        <div style={{ display: "flex", width: "50%", flexDirection: "column", gap: "2vw" }}>
          <div style={{ display: "flex", gap: "2vw" }}>
            <RadioStatGroup label={"RSSI (dBm):"} data={telemetry.radioInfo.rssi} />
            <RadioStatGroup label={"SNR (dB): "} data={telemetry.radioInfo.snr} />
            <RadioStatGroup label={"Freq Error: (HZ):"} data={telemetry.radioInfo.freqErr} />
          </div>

          <div style={{ display: "flex", gap: "2vw" }}>
            <RadioStatGroup label={"MISSED PACKETS: "} data={telemetry.radioInfo.missedPackets} />
            <RadioStatGroup label={"TOTAL PACKETS: "} data={telemetry.radioInfo.totalPackets} />
          </div>
        </div>
        
        <ComponentStatusGroup componentNames={["Barometer", "GPS", "SD-Reader", "INA", "IMU", "LORA"]} componentStatusBits={telemetry.statusBits} />
      </div>

      
    </div>
  );
}
