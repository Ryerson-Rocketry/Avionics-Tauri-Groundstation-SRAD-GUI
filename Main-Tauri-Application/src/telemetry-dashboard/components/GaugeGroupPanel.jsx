import React from "react";
import { useTheme } from "../../styles/ThemeContext.jsx";
import { useState, useEffect } from "react";
import { Gauge, gaugeClasses  } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';


import { GaugeComponent } from "./GaugeComponent.jsx";

export function GaugeGroupPanel({stats}) {
    const { tokens: ui, styles: uiStyles } = useTheme();
    const dash = uiStyles.telemetryDashboard;
    const axisStyle = { fill: "rgba(159, 168, 175, 0.9)", fontSize: 10, fontFamily: ui.font.mono };


    //TEMP
    const styles = uiStyles.telemetryDashboard;

    return (
        <div style={{ ...dash.glassPane, padding: "1.2vh 1.2vw", overflow: 'visible', marginTop: 5, height: "14vh"}}>
            <div style={{ ...dash.cardHeader, padding: "0 0 0.8vh 0", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                GAUGE VIEW
            </div>

            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div></div>
                <GaugeComponent val={stats.temp} min={10} max={50} label={"Temp"} units={stats.metadata.temp.units}></GaugeComponent>
                <GaugeComponent val={stats.pressure} min={60000} max={140000} label={"Presure"} units={stats.metadata.pressure.units}></GaugeComponent>
                <GaugeComponent val={Math.abs(stats.vel)} min={0} max={Math.abs(stats.vel) > 350 ? Math.abs(stats.vel) : 350} label={"Velocity"} units={stats.metadata.vel.units}></GaugeComponent>
                <GaugeComponent val={Math.abs(stats.acceleration)} min={0} max={Math.abs(stats.acceleration) > 500 ? Math.abs(stats.acceleration) : 500} label={"Acceleration"} units={stats.metadata.acceleration.units}></GaugeComponent>
            </div>
            
        </div>
    )
};  