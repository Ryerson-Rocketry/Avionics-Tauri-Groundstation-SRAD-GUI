import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "../../styles/ThemeContext.jsx";
import { ChartPanel } from "./ChartPanel.jsx";
import { useState, useEffect } from "react";
import Button from "../../components/Button.jsx";

import "./ChartGroupPanel.css";

const CHART_INTERVAL_OPTIONS = [0.25, 0.5, 1, 2];

//ignore
const enumValue = (name) => Object.freeze({toString: () => name});
const graphState = Object.freeze({
    SINGLE: enumValue("Colors.SINGLE"),
    EXPANDED: enumValue("Colors.EXPANDED"),
    MODAL: enumValue("Colors.MODAL")
});

/* data parameter implementation:
data.dataset: array[int,int] - x,y dataset
data.title: string - title of chart
data.yAxisTitle: string - should include units in brackets
*/

const MIN_GRAPH_ELEMENT_SIZE = 1;
const MAX_GRAPH_ELEMENT_SIZE = 5;
const DEFAULT_GRAPH_ELEMENT_SIZE = 2.5;


const CHART_SINGLE_OPTIONS = ['alt', 'vel', 'acceleration', 'pressure', 'temp'];


export function ChartGroupModal({replay, chartData, chartUpdateIntervalSec = 1, setChartUpdateIntervalSec, stats}) {
    const { tokens: ui, styles: uiStyles } = useTheme();
    const dash = uiStyles.telemetryDashboard;
    const axisStyle = { fill: "rgba(159, 168, 175, 0.9)", fontSize: 10, fontFamily: ui.font.mono };

    const [graphSettings, setGraphSettings] = useState(false); //false = single, true = all
    const [graphSelect, setGraphSelect] = useState('alt');
    const [enableMean, setEnableMean] = useState(false);
    const [enableYAxisAutoscale, setEnableYAxisAutoscale] = useState(true);
    const [useLineGraph, setUseLineGraph] = useState(true);
    const [enableLineDot, setEnableLineDot] = useState(false);

    const [graphElementSize, setGraphElementSize] = useState(DEFAULT_GRAPH_ELEMENT_SIZE);

    const [modalState, setModalState] = useState (false);

    //TEMP
    const styles = uiStyles.telemetryDashboard;

    //deal with resetting graph select to default 'alt'
    useEffect (() => {
        if (graphSettings == false){
            setGraphSelect('alt');
        }
        }, [graphSettings]
    )
    
    return (
        <div style={{ ...dash.glassPane, padding: "1.2vh 1.2vw", scrollbarWidth: 'thin', overflowY: 'scroll', scrollbarColor: 'white black'}}>
            <div style={{ ...dash.glassPane,top: 0,padding: "1.2vh 1.2vw", border: "none", position: "sticky", zIndex: 100}}>
                <div style={{display: "flex", padding: "0 0 1vh 0", border: "none", justifyContent: 'space-between' }}>
                    <div style={{ ...dash.cardHeader}}> Graphical Data</div>
                    <div style={{display: "flex", gap: "10px"}}>
                        <div style={{ ...dash.cardHeaderNoBorder }}> Display Settings: </div>
                        <Button disabled size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={() => !modalState}>
                        Full View
                        </Button>
                        <Button size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={() => setUseLineGraph(!useLineGraph)}>
                            Switch To: {useLineGraph === true ? "Scatter" : "Line"}
                        </Button>
                        <Button size="sm" variant="outline" outlineColor={ui.colors.red} textColor={ui.colors.red} onClick={() => setGraphSettings(!graphSettings)}>
                            {graphSettings === false ? 'Show All' : 'Show Single'}
                        </Button>
                    </div>
                    
                </div>

                <div style={{display: 'flex', alignItems: "center", flexWrap: "wrap" }}>
                    {/*<div style={{ ...dash.cardHeaderNoBorder}}>Graph Settings:</div>*/}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(159, 168, 175, 0.9)" }}>Point Size</label>
                        <input
                            type="range"
                            min={MIN_GRAPH_ELEMENT_SIZE}
                            max={MAX_GRAPH_ELEMENT_SIZE}
                            value={graphElementSize}
                            onChange={(e) => setGraphElementSize(Number(e.target.value))}
                            style={{
                            width: "100px",
                            accentColor: "rgba(73, 238, 242, 0.9)",
                            cursor: "pointer",
                            }}
                        />
                        <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(159, 168, 175, 0.9)", minWidth: 28 }}>
                            {graphElementSize}
                        </span>
                    </div>
                    
                    {/* Ternary for if true is because im unsure how to reset input back to default after reenable*/}
                    {graphSettings === false ? 
                    /*
                    <div style={{marginRight: "0.8vw"}}>
                        <label>
                            <input type="radio" name="myRadio" defaultChecked={true} onChange={e => setGraphSelect('alt')} />
                            Alt
                        </label>
                        <label>
                            <input type="radio" name="myRadio" onChange={e => setGraphSelect('vel')}
                            />
                            Vel
                        </label>
                        <label>
                            <input type="radio" name="myRadio" onChange={e => setGraphSelect('acceleration')} />
                            Accel
                        </label>
                        <label>
                            <input type="radio" name="myRadio" onChange={e => setGraphSelect('pressure')} />
                            Press
                        </label>
                        <label>
                            <input type="radio" name="myRadio" onChange={e => setGraphSelect('temp')} />
                            Temp
                        </label>
                    </div> */
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5vw", marginRight: "5px" }}>
                        <label style={{ fontSize: "9px", letterSpacing: "1px", color: "rgba(159, 168, 175, 0.9)" }}>UPDATE</label>
                        <select
                        value={graphSelect}
                        onChange={(e) => setGraphSelect((e.target.value))}
                        style={{
                            fontSize: "10px",
                            fontFamily: ui.font.mono,
                            padding: "2px 6px",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            color: ui.colors.cyan,
                            border: "1px solid rgba(159, 168, 175, 0.3)",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                        >
                        {CHART_SINGLE_OPTIONS.map((sec) => (
                            <option key={sec} value={sec}>{sec}</option>
                        ))}
                        </select>
                    </div>
                    
                    : 
                    /*
                    <div style={{marginRight: "0.8vw"}}>
                        <label>
                            <input type="radio" name="myRadio" disabled = {graphSettings} defaultChecked={true} onChange={e => setGraphSelect('alt')} />
                            Alt
                        </label>
                        <label>
                            <input type="radio" name="myRadio" disabled = {graphSettings} onChange={e => setGraphSelect('vel')}
                            />
                            Vel
                        </label>
                        <label>
                            <input type="radio" name="myRadio" disabled = {graphSettings} onChange={e => setGraphSelect('acceleration')} />
                            Acceleration
                        </label>
                        <label>
                            <input type="radio" name="myRadio" disabled = {graphSettings}  onChange={e => setGraphSelect('pressure')} />
                            Press
                        </label>
                        <label>
                            <input type="radio" name="myRadio" disabled = {graphSettings} onChange={e => setGraphSelect('temp')} />
                            Temp
                        </label>
                    </div>
                    */
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5vw", marginRight: "5px"}}>
                        <label style={{ fontSize: "9px", letterSpacing: "1px", color: "rgba(159, 168, 175, 0.9)" }}>Select</label>
                        <select
                        disabled
                        value={graphSelect}
                        onChange={(e) => setGraphSelect((e.target.value))}
                        style={{
                            fontSize: "10px",
                            fontFamily: ui.font.mono,
                            padding: "2px 6px",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            color: ui.colors.cyan,
                            border: "1px solid rgba(159, 168, 175, 0.3)",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                        >
                        {CHART_SINGLE_OPTIONS.map((sec) => (
                            <option key={sec} value={sec}>{sec}</option>
                        ))}
                        </select>
                    </div>
                    }
                    <Button disabled = {!useLineGraph} size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={() => setEnableLineDot(!enableLineDot)}>
                        {enableLineDot === false ? 'Show Line Dot' : 'Hide Line Dot'}
                    </Button>
                    <Button disabled = {!useLineGraph} size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={() => setEnableMean(!enableMean)}>
                        {enableMean === false ? 'Show Mean' : 'Hide Mean'}
                    </Button>
                    <Button size="sm" variant="outline" outlineColor={ui.colors.cyan} textColor={ui.colors.cyan} onClick={() => setEnableYAxisAutoscale(!enableYAxisAutoscale)}>
                        {enableYAxisAutoscale === true ? 'Use Y Autoscale' : 'Use Min Max Y Scale'}
                    </Button>
                </div>
                
               
                
            </div>

            
            {
                graphSettings === false ? 
                <div> 
                    <ChartPanel
                        data={chartData}
                        dataKey={graphSelect}
                        chartUpdateIntervalSec={chartUpdateIntervalSec}
                        onChartUpdateIntervalChange={replay ? undefined : setChartUpdateIntervalSec}
                        useLineGraph = {useLineGraph}
                        graphElementSize={graphElementSize}
                        enableLineDot={enableLineDot}
                        meanData={enableMean === true ? stats['mean'+(graphSelect.charAt(0).toUpperCase() + String(graphSelect).slice(1))] : null}
                        enableYAxisAutoScale={enableYAxisAutoscale}
                    />
                </div> : 
                <div>
                    <ChartPanel
                        data={chartData}
                        dataKey={'alt'}
                        chartUpdateIntervalSec={chartUpdateIntervalSec}
                        onChartUpdateIntervalChange={replay ? undefined : setChartUpdateIntervalSec}
                        useLineGraph = {useLineGraph}
                        graphElementSize={graphElementSize}
                        enableLineDot={enableLineDot}
                        meanData={enableMean === true ? stats['meanAlt'] : null}
                        enableYAxisAutoScale={enableYAxisAutoscale}
                    />
                    
                    <ChartPanel
                        data={chartData}
                        dataKey={'vel'}
                        chartUpdateIntervalSec={chartUpdateIntervalSec}
                        onChartUpdateIntervalChange={replay ? undefined : setChartUpdateIntervalSec}
                        useLineGraph = {useLineGraph}
                        graphElementSize={graphElementSize}
                        enableLineDot={enableLineDot}
                        meanData={enableMean === true ?stats['meanVel'] : null}
                        enableYAxisAutoScale={enableYAxisAutoscale}
                    />
                    <ChartPanel
                        data={chartData}
                        dataKey={'acceleration'}
                        chartUpdateIntervalSec={chartUpdateIntervalSec}
                        onChartUpdateIntervalChange={replay ? undefined : setChartUpdateIntervalSec}
                        useLineGraph = {useLineGraph}
                        graphElementSize={graphElementSize}
                        enableLineDot={enableLineDot}
                        meanData={enableMean === true ?stats['meanAcceleration'] : null}
                        enableYAxisAutoScale={enableYAxisAutoscale}
                    />
                    <ChartPanel
                        data={chartData}
                        dataKey={'pressure'}
                        chartUpdateIntervalSec={chartUpdateIntervalSec}
                        onChartUpdateIntervalChange={replay ? undefined : setChartUpdateIntervalSec}
                        useLineGraph = {useLineGraph}
                        graphElementSize={graphElementSize}
                        enableLineDot={enableLineDot}
                        meanData={enableMean === true ? stats['meanPressure'] : null}
                        enableYAxisAutoScale={enableYAxisAutoscale}
                    />
                    <ChartPanel
                        data={chartData}
                        dataKey={'temp'}
                        chartUpdateIntervalSec={chartUpdateIntervalSec}
                        onChartUpdateIntervalChange={replay ? undefined : setChartUpdateIntervalSec}
                        useLineGraph = {useLineGraph}
                        graphElementSize={graphElementSize}
                        enableLineDot={enableLineDot}
                        meanData={enableMean === true ? stats['meanTemp'] : null}
                        enableYAxisAutoScale={enableYAxisAutoscale}
                    />
                </div>
            }
            
          
        </div>
  );
}
