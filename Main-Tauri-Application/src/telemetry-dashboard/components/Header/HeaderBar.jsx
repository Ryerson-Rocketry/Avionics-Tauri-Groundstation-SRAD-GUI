import React from "react";
import { useTheme } from "../../../styles/ThemeContext.jsx";
import Button from "../../../components/Button.jsx";
import { labels } from "../../../config/labels.jsx";
import { useState } from "react";
import { TimeDisplay } from "./TimeDisplay.jsx";
import Divider from '@mui/material/Divider';

import logo from '../../../../assets/rocketry_logo.png';


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
  stats,
  isLive,
  isFinished,
  isLocked,
  onToggleLock,
  onExit,
  lastCloseReason,
  onTelemetryState,
  telemetryState,
  onFullscreen,
  fullScreenState,
  dummyMode,
  onStartMission,
  craftName
}) {


  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;
  const isConnected = isLive && !isFinished && telemetry?.status !== "DISCONNECTED";

  const [time, setTime] = useState(new Date());


  React.useEffect(() => {
    const timer = setInterval(() => { 
      setTime(new Date());
    }, 25);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  }, []);

  return (
    <nav style={dash.navBar}>
      <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
        <img width={50} src={logo} alt="Logo" />
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
            Craft: {craftName || "—"}
          </div>
          <div style={{ fontFamily: ui.font.googleSans, fontSize: ui.text.xs, color: ui.colors.gray, letterSpacing: "1px" }}>
            {isConnected ? labels.telemetry.streamConnected : lastCloseReason ? `Disconnected: ${lastCloseReason}` : labels.telemetry.streamDisconnected}
          </div>
          <div style={{ fontFamily: ui.font.googleSans, fontSize: ui.text.xs, color: ui.colors.gray, letterSpacing: "1px" }}>
            MISSION STATE: {telemetry.stateName}
          </div>
          
        </div>
      </div>
        
      
      <Divider variant="middle" orientation="vertical"  style={{backgroundColor: "gray", marginRight: 4}} flexItem height={30}  />
      <div style={{ display: "flex", alignItems: "center", flexDirection:"column"}}>
         
        
        <div style={{ display: "flex", alignItems: "center", flexDirection:"row", fontFamily: ui.font.googleSans, fontSize: ui.text.s, color: ui.colors.white, letterSpacing: "1px" }}>
          Time - 
          <TimeDisplay time={time.getDate()} label={"Day"} padding={2}/>
          <TimeDisplay time={time.getHours()} label={"Hour"} padding={2}/>  
          <TimeDisplay time={time.getMinutes()} label={"Min"} padding={2}/> 
          <TimeDisplay time={time.getSeconds()} label={"Sec"} padding={2}/>
          <TimeDisplay time={time.getMilliseconds()} label={"Milisec"} padding={3}/>
          
        </div>

        <div style={{ marginRight: "8px", display: "flex", alignItems: "center", flexDirection:"row", fontFamily: ui.font.googleSans, fontSize: ui.text.s, color: ui.colors.white, letterSpacing: "1px" }}>
          <div>(T{Number(telemetry.time) < 0 ? "-" : "+"}) -</div>
          <TimeDisplay time={0} label={"Day"} padding={2}/>
          <TimeDisplay time={Math.floor(Math.abs(telemetry.time) / 3600)} label={"Hour"} padding={2}/>  
          <TimeDisplay time={Math.floor(Math.abs(telemetry.time)  / 60)} label={"Min"} padding={2}/> 
          <TimeDisplay time={(Math.abs(telemetry.time)   - Math.floor(Math.abs(telemetry.time)  / 60) * 60).toFixed(0)} label={"Sec"} padding={2}/>
          
          <TimeDisplay time={Number(Math.abs(telemetry.time) ).toFixed(0)} label={"Raw"} padding={2}/>
          
          </div>
      </div>


      <Divider variant="middle" orientation="vertical"  style={{backgroundColor: "gray", marginRight: 4}} flexItem height={30}  />

      <div style={{ display: "flex",  flexDirection:"column" , alignItems: "center" }}>
        <div style={{ display: "flex",  alignItems: "center", gap: "1vw"}}>
          <HeaderStat label={labels.telemetry.statAltitude} val={telemetry.alt} unit="m" isString={false} />
          <HeaderStat label={labels.telemetry.statVelocity} val={telemetry.vel} unit="m/s" isString={false} />
          {/*<HeaderStat label={labels.telemetry.statMissionTime} val={telemetry.time} unit="s" isString={false} />*/}
          <HeaderStat label={"ACCELERATION"} val={telemetry.acceleration} unit="m/s^2" isString={false}/>
        </div>
        <div style={{ display: "flex",  alignItems: "center", gap: "1vw"}}>
          <HeaderStat label={"APOGEE"} val={stats.apogee} unit="m" isString={false} />
          <HeaderStat label={"PITCH"} val={telemetry.orientation.pitch} unit="°" isString={false} />
          <HeaderStat label={"ROLL"} val={telemetry.orientation.roll} unit="°" isString={false} />
          <HeaderStat label={"YAW"} val={telemetry.orientation.yaw} unit="°" isString={false} />
        </div>  
      </div>

      <Divider variant="middle" orientation="vertical"  style={{backgroundColor: "gray"}} flexItem height={30}  />

      <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
        <Button size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={() => onTelemetryState(!telemetryState)} >
          {telemetryState === true ? "Minimize " : "Expand "} Console
        </Button>
        <Button disabled size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} >
          Manage View Panel
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
        <Button disabled={dummyMode === true ? false : true} size="sm" variant="outline" outlineColor={ui.colors.yellow} textColor={ui.colors.yellow} onClick={onStartMission}>
          START MISSION
        </Button>
      </div>
    </nav>
  );
}
