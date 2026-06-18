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

function StatGroup({ label, data, type, hideMinMed, dash, ui, showDetailed, showUnits }) {
  //const isAlt = type === "alt";
  //if (!data) return null;

  return (
    <div style={{ flex: 1 }}>
      <div style={{ ...dash.statLabel, marginBottom: "0.5vh", color: ui.colors.cyan }}>{label}</div>
      <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>Current</span>
        <span>{data.curr}{showUnits === true ? "("+data.metadata.units+")" : <div/>}</span>
        <span style={{color: ui.colors.cyan }}>Mean</span>
        <span>{data.mean}{showUnits === true ? "("+data.metadata.units+")" : <div/>}</span>
      </div>
      <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>Max</span>
        <span>{data.max}{showUnits === true ? "("+data.metadata.units+")" : <div/>}</span>
        <span style={{color: ui.colors.cyan }}>Min</span>
        <span>{data.min}{showUnits === true ? "("+data.metadata.units+")" : <div/>}</span>
      </div>
      {showDetailed === true ? <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>STD Dev (Sqrt(Var))</span>
        <span>{Math.sqrt(data.variance).toFixed(3)}</span>
      </div> :
      <div/>}
      {showDetailed === true ?
      <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>Variance (Var)</span>
        <span>{data.variance}</span>
      </div> :
      <div/>}
    </div>
  );
}


function StatGroupAcceleration({ label, data, type, hideMinMed, dash, ui, showDetailed, showUnits }) {
  //const isAlt = type === "alt";
  //if (!data) return null;

  return (
    <div style={{ flex: 1 }}>
      <div style={{ ...dash.statLabel, marginBottom: "0.5vh", color: ui.colors.cyan }}>{label}</div>
      <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>Current</span>
        <span>{data.curr}{showUnits === true ? "("+data.metadata.units+")" : <div/>}</span>
      </div>
      <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>X</span>
        <span>{data.x}{showUnits === true ? "("+data.metadata.units+")" : <div/>}</span>
        <span style={{color: ui.colors.cyan }}>Y</span>
        <span>{data.y}{showUnits === true ? "("+data.metadata.units+")" : <div/>}</span>
        <span style={{color: ui.colors.cyan }}>Z</span>
        <span>{data.z}{showUnits === true ? "("+data.metadata.units+")" : <div/>}</span>
      </div>
      {showDetailed === true ? <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>STD Dev (Sqrt(Var))</span>
        <span>{Math.sqrt(data.variance).toFixed(3)}</span>
      </div> :
      <div/>}
      {showDetailed === true ?
      <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>Variance (Var)</span>
        <span>{data.variance}</span>
      </div> :
      <div/>}
    </div>
  );
}


function StatGroupGyro({ label, data, type, hideMinMed, dash, ui, showDetailed, showUnits }) {
  //const isAlt = type === "alt";
  //if (!data) return null;

  return (
    <div style={{ flex: 1 }}>
      <div style={{ ...dash.statLabel, marginBottom: "0.5vh", color: ui.colors.cyan }}>{label}</div>
      <div style={dash.statLine}>
        <span style={{color: ui.colors.cyan }}>X</span>
        <span>{data.x}{showUnits === true ? "(rad/s)" : <div/>}</span>
        <span style={{color: ui.colors.cyan }}>Y</span>
        <span>{data.y}{showUnits === true ? "(rad/s)" : <div/>}</span>
        <span style={{color: ui.colors.cyan }}>Z</span>
        <span>{data.z}{showUnits === true ? "(rad/s)" : <div/>}</span>
      </div>
    </div>
  );
}


export function StatsPanel({ stats, telemetry }) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;

  const [showUnits, setShowUnits] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);
  

  useEffect(() => {
      //console.log(stats);
    }
    ,[stats]);


  return (
    <div style={{ ...dash.glassPane, padding: "1.2vh 1.2vw", overflow: 'visible'}}>
      <div style={{ ...dash.cardHeader, display: "flex", padding: "0 0 1vh 0", border: "none", justifyContent: 'space-between'}}> 
        <div> NUMERICAL STATISTICS </div> 
          <div style={{display: "flex", gap: "10px"}}>
            <Button size="sm" variant="outline" outlineColor={showUnits === true ? ui.colors.green : ui.colors.red} textColor={ui.colors.blue} onClick={() => setShowUnits(!showUnits)}>
              {showUnits === false ? "Show Units" : "Hide Units"}
            </Button>   
            <Button size="sm" variant="outline"  outlineColor={showDetailed === true ? ui.colors.green : ui.colors.red} textColor={ui.colors.blue} onClick={() => setShowDetailed(!showDetailed)}>
              {showDetailed === false ? "Show Detailed" : "Hide Detailed"}
            </Button>  
          </div>
           
          </div>
      <div style={{ display: "flex", gap: "2vw", marginBottom: "1vw" }}>
        <StatGroup showDetailed = {showDetailed} showUnits={showUnits} label={"ALTITUDE ("+stats.metadata.alt.units+")"} data={{curr: stats.alt, max: stats.maxAlt, min: stats.minAlt, mean: stats.meanAlt, metadata: stats.metadata.alt, variance: stats.varianceAlt}} type="alt" dash={dash} ui={ui} />
        <StatGroup showDetailed = {showDetailed} showUnits={showUnits} label={"PRESSURE ("+stats.metadata.pressure.units+")"} data={{curr:stats.pressure, max: stats.maxPressure, min: stats.minPressure, mean: stats.meanPressure, metadata: stats.metadata.pressure , variance: stats.variancePressure}} type="pressure" hideMinMed dash={dash} ui={ui} />
        <StatGroupAcceleration showDetailed = {showDetailed} showUnits={showUnits} label={"ACCELERATION ("+stats.metadata.acceleration.units+")"} data={{x:telemetry.accelAxis.x , y:telemetry.accelAxis.y , z:telemetry.accelAxis.z , curr:stats.acceleration, max: stats.maxAcceleration, min: stats.minAcceleration, mean: stats.meanAcceleration, metadata: stats.metadata.acceleration , variance: stats.varianceAcceleration}} type="acceleration" hideMinMed dash={dash} ui={ui} />
      </div>

      <div style={{ display: "flex", gap: "2vw" }}>
        <StatGroup showDetailed = {showDetailed} showUnits={showUnits} label={"Temperature ("+stats.metadata.temp.units+")"} data={{curr:stats.temp, max: stats.maxTemp, min: stats.minTemp, mean: stats.meanTemp, metadata: stats.metadata.temp , variance: stats.varianceTemp}} type="temp" hideMinMed dash={dash} ui={ui} />
        <StatGroupGyro showDetailed = {showDetailed} showUnits={showUnits} label={"GYRO (rad/s)"} data={{x:telemetry.gyroAxis.x , y:telemetry.gyroAxis.y , z:telemetry.gyroAxis.z , curr:stats.acceleration, max: stats.maxAcceleration, min: stats.minAcceleration, mean: stats.meanAcceleration, metadata: stats.metadata.acceleration , variance: stats.varianceAcceleration}} type="acceleration" hideMinMed dash={dash} ui={ui} />
      </div>

      
    </div>
  );
}
