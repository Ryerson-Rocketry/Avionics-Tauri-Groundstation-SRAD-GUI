import React, { useState, useEffect } from "react";
import TelemetryScene from "../simulator/TelemetryScene.jsx";
import { useTheme } from "../../styles/ThemeContext.jsx";
import { ZOOM_MIN, ZOOM_MAX, DEFAULT_ZOOM } from "../simulator/TelemetryScene.jsx";
import { GpsScene } from "../simulator/GpsScene.jsx";
import Button from "../../components/Button.jsx";

import TelemetrCesiumScene from "../simulator/TelemetryCesiumScene.jsx";
import { Altimeter } from "./Altimeter.jsx";

export const DEFAULT_ZOOM_GPS = 14;
export const ZOOM_MIN_GPS = 12;
export const ZOOM_MAX_GPS = 20;

export const DEFAULT_GROUNDLEVEL = 0;
export const GROUNDLEVEL_MAX = 1000;
export const GROUNDLEVEL_MIN = -1000;

import rocketMarker from "../../../assets/map/rocket_marker.png";
import apogeeMarker from "../../../assets/map/apogee_marker.png";
import launchMarker from "../../../assets/map/launch_marker.png";
import Typography from "@mui/material/Typography";
import NavBallScene from "../simulator/NavBallScene.jsx";

export function SimViewPanel({ telemetry, history, rocketPos, isLocked }) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;

  const [gpsZoomLevel, setGpsZoomLevel] = useState(DEFAULT_ZOOM_GPS);

  const [reconstructionZoomLevel, setRecontructionZoomLevel] = useState(DEFAULT_ZOOM);
  const [groundLevelOffset, setGroundLevelOffset] = useState(DEFAULT_GROUNDLEVEL);

  const [reconstructionUpdateSpeed, setReconstructionUpdateSpeed] = useState(1);

  const[mapState, setMapState] = useState(false); //false 3d map/true 2d map
  const[satView, setSatView] = useState(true);
  const[localHosting, setLocalHosting] = useState(false);


  //component control states
  const[showLegend, setShowLegend] = useState(true);
  const[showAlitimeter, setShowAltimeter] = useState(true);

  //map specific component control states
  const[showLabel, setShowLabel] = useState(false);
  const[showPath, setShowPath] = useState(true);

  //TEMP
  const styles = uiStyles.telemetryDashboard;


  const [simOffset, setSimOffset] = useState({x: 0, y: 0, z:0});

  const [moddedRocketPos, setModdedRocketPos] = useState(rocketPos.current); //unused

  //For dealing with resetting visualizer to 0,0,0 (in case telemetry sensors read smth different)
  function onOffset(){
    console.log("UNUSED:");
  }

  useEffect(() => {
      //console.log("COORDS" + rocketPos.current.x +  ", " +  rocketPos.current.z);
      //console.log("COORDSAPOGEE" + rocketPos.apogeePoint.x +  ", " +  rocketPos.apogeePoint.z);
    }
    ,[telemetry, rocketPos]);

  return (
    <section style={{ gridColumn: "1", gridRow: "1", display: "flex", height:"70vh" /*, borderColor: "aqua", borderStyle: "dashed" */ }}>



      <div style={{ ...dash.glassPane, flex: 1, display: "flex", flexDirection: "column" }}>

        <div style={{ ...dash.cardHeader, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span>SPATIAL RECONSTRUCTION</span>
          {isLocked && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
              <label style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(159, 168, 175, 0.9)" }}>GPS ZOOM</label>
              <input
                type="range"
                step={0.1}
                min={ZOOM_MIN_GPS}
                max={ZOOM_MAX_GPS}
                value={gpsZoomLevel}
                onChange={(e) => setGpsZoomLevel(Number(e.target.value))}
                style={{
                  width: "100px",
                  accentColor: "rgba(73, 238, 242, 0.9)",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(159, 168, 175, 0.9)", minWidth: 28 }}>
                {gpsZoomLevel}
              </span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
              <label style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(159, 168, 175, 0.9)" }}>3D ZOOM</label>
              <input
                type="range"
                min={ZOOM_MIN}
                max={ZOOM_MAX}
                value={reconstructionZoomLevel}
                onChange={(e) => setRecontructionZoomLevel(Number(e.target.value))}
                style={{
                  width: "100px",
                  accentColor: "rgba(73, 238, 242, 0.9)",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(159, 168, 175, 0.9)", minWidth: 28 }}>
                {reconstructionZoomLevel}
              </span>
            </div>
          <Button size="sm" variant="outline" outlineColor={localHosting === false ? ui.colors.red: ui.colors.green} textColor={localHosting === false ? ui.colors.red: ui.colors.green} onClick={() => setLocalHosting(!localHosting)}
          >
            Local Data
          </Button>

          <Button size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={() => setSatView(!satView)}>
              {satView === false ? 'Enable Sat Layer' : 'Disable Sat Layer'}
          </Button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
              <label style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(159, 168, 175, 0.9)" }}>Altitude Offset</label>
              <input
                type="range"
                min={GROUNDLEVEL_MIN}
                max={GROUNDLEVEL_MAX}
                value={groundLevelOffset}
                onChange={(e) => setGroundLevelOffset(Number(e.target.value))}
                style={{
                  width: "100px",
                  accentColor: "rgba(73, 238, 242, 0.9)",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(159, 168, 175, 0.9)", minWidth: 28 }}>
                {groundLevelOffset} (M)
              </span>
            </div>

          <Button size="sm" variant="outline" outlineColor={ui.colors.red} textColor={ui.colors.red} onClick={() => setMapState(!mapState)}>
              {mapState === true ? '2D Map' : '3D Map'}
          </Button>

            <Button  size="sm" variant="outline" outlineColor={showLabel === false ? ui.colors.red: ui.colors.green} textColor={showLabel === false ? ui.colors.red: ui.colors.green} onClick={() => setShowLabel(!showLabel)}>
              Labels
          </Button>

          <Button  size="sm" variant="outline" outlineColor={showPath === false ? ui.colors.red: ui.colors.green} textColor={showPath === false ? ui.colors.red: ui.colors.green} onClick={() => setShowPath(!showPath)}>
              Path
          </Button>

          <Button  size="sm" variant="outline" outlineColor={showLegend === false ? ui.colors.red: ui.colors.green} textColor={showLegend === false ? ui.colors.red: ui.colors.green} onClick={() => setShowLegend(!showLegend)}>
            Legend
          </Button>
          
          <Button  size="sm" variant="outline" outlineColor={showAlitimeter === false ? ui.colors.red: ui.colors.green} textColor={showAlitimeter === false ? ui.colors.red: ui.colors.green} onClick={() => setShowAltimeter(!showAlitimeter)}>
            Altimeter
          </Button>

        </div>



        


        <div style={{ flex: 2, minHeight: 0, position: 'relative' }}>
          
          {showLegend === true 
            ?
            <div style={{ ...dash.glassPane,  padding: "1.2vh 1.2vw", overflow: 'visible', display: 'flex', flexDirection:'column', position: "absolute", right: 0, top: 0, marginTop: "auto",marginBottom: "auto", zIndex:1000 }}>
              <Typography> Legend </Typography>
              <div style={{display: 'flex', flexDirection:'row'}}>
                  <img src={rocketMarker} height={20} width={20}/>
                  <Typography> = Rocket </Typography> 
              </div>
              <div style={{display: 'flex', flexDirection:'row'}}>
                  <img src={apogeeMarker} height={20} width={20}/>
                  <Typography> = Apogee Point </Typography> 
              </div>
              <div style={{display: 'flex', flexDirection:'row'}}>
                  <img src={launchMarker} height={20} width={20}/>
                  <Typography> = Launch Site </Typography> 
              </div>
            </div>
            :
            []
          }

          {showAlitimeter === true 
            ?
            <div style={{ ...dash.glassPane,  height: "50%", padding: "1.2vh 1.2vw", overflow: 'visible', display: 'flex', flexDirection:'column', position: "absolute", left: 0, bottom: 0,top: 0, marginTop: "auto",marginBottom: "auto", zIndex:1000 }}>
              {rocketPos.apogeePoint.y < 3000 ? 3000 : (rocketPos.apogeePoint.y + rocketPos.apogeePoint.y*0.05).toFixed()} m
              <Altimeter rocketPos={rocketPos} maxSliderValue={3000}/>
              0 m
            </div>
            :
            []
          }
        
          {mapState === true ?
          <div>
            <TelemetrCesiumScene
              telemetry={telemetry}
              history={history}
              rocketPos={rocketPos}
              isTrackOn={isLocked}
              groundLevelOffset={groundLevelOffset}
              satView={satView}
              darkMode={true}
              bgColor="rgba(5,5,8,0.95)"
              zoomDistance={reconstructionZoomLevel}

              localHosting={localHosting}

              showPath={showPath}
              showLabel={showLabel}
            />
            <div style={{ ...dash.glassPane, width: "25%", height: "25%", position: "absolute", bottom: 10, right: 10, zIndex:100, borderStyle: 'solid', borderWidth: '10px' }}> 

                <GpsScene localHosting={localHosting} satView={satView} targetPos = {rocketPos} zoom = {gpsZoomLevel} showLabel={showLabel} showPath={showPath}></GpsScene>  
      
            </div>
            
            <div style={{ width: "25%", height: "25%", padding: "1.2vh 1.2vw", overflow: 'visible', display: 'flex', flexDirection:'column', position: "absolute", right: 0, left: 0, bottom: 0, marginLeft: "auto",marginRight: "auto", zIndex:1000 }}>
              <NavBallScene orientation={telemetry.orientation}/>
            </div>

          </div>
          
          :
          <GpsScene localHosting={localHosting} satView={satView} targetPos={rocketPos} zoom={gpsZoomLevel} showLabel={showLabel} showPath={showPath}/>
          }
          
        </div>
      </div>
    </section>
  );
}
