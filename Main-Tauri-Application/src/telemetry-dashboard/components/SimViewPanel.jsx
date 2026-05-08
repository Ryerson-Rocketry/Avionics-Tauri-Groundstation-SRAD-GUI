import React, { useState, useEffect } from "react";
import TelemetryScene from "../simulator/TelemetryScene.jsx";
import { useTheme } from "../../styles/ThemeContext.jsx";
import { ZOOM_MIN, ZOOM_MAX, DEFAULT_ZOOM } from "../simulator/TelemetryScene.jsx";
import { GpsScene } from "../simulator/GpsScene.jsx";
import Button from "../../components/Button.jsx";



export const DEFAULT_ZOOM_GPS = 14;
export const ZOOM_MIN_GPS = 12;
export const ZOOM_MAX_GPS = 20;


export function SimViewPanel({ telemetry, history, rocketPos, isLocked }) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;

  const [gpsZoomLevel, setGpsZoomLevel] = useState(DEFAULT_ZOOM_GPS);
  const [reconstructionZoomLevel, setRecontructionZoomLevel] = useState(DEFAULT_ZOOM);

  const [reconstructionUpdateSpeed, setReconstructionUpdateSpeed] = useState(1);

  const[mapState, setMapState] = useState(false); //false 3d map/true 2d map
  const[satView, setSatView] = useState(true);

  //TEMP
  const styles = uiStyles.telemetryDashboard;


  const [simOffset, setSimOffset] = useState({x: 0, y: 0, z:0});

  const [moddedRocketPos, setModdedRocketPos] = useState(rocketPos);

  //For dealing with resetting visualizer to 0,0,0 (in case telemetry sensors read smth different)
  function onOffset(){
    console.log("Calibrating:" + rocketPos.y  + rocketPos.z  + rocketPos.x);
    setSimOffset(rocketPos);
  }

  useEffect(() => {
      var temp = rocketPos;
      if (simOffset != {x: 0, y: 0, z:0}){
        var temp = telemetry.pos;
        console.log("Calibrating:" + rocketPos.y + " " + rocketPos.z + " "   + rocketPos.x);
        
        temp.x = rocketPos.x - simOffset.x;
        temp.y = rocketPos.y - simOffset.y;
        temp.z = rocketPos.z - simOffset.z;

        //temp until map scale is properly adjusted (given that rocket can move 1000+ m upwards)
      }

      temp.y = temp.y/10;
      setModdedRocketPos(temp);
    }
    ,[telemetry]);

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
          <Button size="sm" variant="outline" outlineColor={ui.colors.red} textColor={ui.colors.red} onClick={onOffset}
          >
            Calibrate
          </Button>

          <Button size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={() => setSatView(!satView)}>
              {satView === false ? 'Enable Sat Layer' : 'Disable Sat Layer'}
          </Button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
              <label style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(159, 168, 175, 0.9)" }}>3D Map Update Speed</label>
              <input
                type="range"
                disabled
                min={1}
                max={5}
                value={reconstructionUpdateSpeed}
                onChange={(e) => setReconstructionUpdateSpeed(Number(e.target.value))}
                style={{
                  width: "100px",
                  accentColor: "rgba(73, 238, 242, 0.9)",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(159, 168, 175, 0.9)", minWidth: 28 }}>
                {reconstructionUpdateSpeed}
              </span>
            </div>

          <Button size="sm" variant="outline" outlineColor={ui.colors.red} textColor={ui.colors.red} onClick={() => setMapState(!mapState)}>
              {mapState === true ? 'Show 2D Map' : 'Show 3D Reconstruction'}
          </Button>
        </div>





        <div style={{ flex: 2, minHeight: 0 }}>
          {mapState === true ?
          <div>
            <TelemetryScene
              telemetry={telemetry}
              history={history}
              rocketPos={moddedRocketPos}
              isTrackOn={isLocked}
              darkMode={true}
              bgColor="rgba(5,5,8,0.95)"
              zoomDistance={reconstructionZoomLevel}
            />
            <div style={{ width: "25%", height: "25%", position: "absolute", bottom: 10, right: 10, zIndex:100 }}> 
              <GpsScene satView={satView} targetPos = {rocketPos} zoom = {15}></GpsScene>  
            </div>
          </div>
          
          :
          <GpsScene satView={satView} targetPos={rocketPos} zoom={gpsZoomLevel}/>
          }
          
        </div>
      </div>
    </section>
  );
}
