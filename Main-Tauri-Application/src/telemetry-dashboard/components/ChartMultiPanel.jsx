import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  ResponsiveContainer,
  Tooltip,
  ScatterChart,
  Scatter,
  Dot,
  ReferenceLine,
  Label,
  Legend
} from "recharts";
import { useTheme } from "../../styles/ThemeContext.jsx";

const CHART_INTERVAL_OPTIONS = [0.25, 0.5, 1, 2];

/* data parameter implementation:
data.dataset: array[int,int] - x,y dataset
data.title: string - title of chart
data.yAxisTitle: string - should include units in brackets
*/


const RenderDot = ({ cx, cy, color, elementSize }) => {
  return (
    <Dot cx={cx} cy={cy} fill={color} r={elementSize} />
  )
}



export function ChartPanel({ data, chartUpdateIntervalSec = 1, onChartUpdateIntervalChange, dataKeys, useLineGraph = true, graphElementSize, enableLineDot, meanData = null, enableYAxisAutoScale }) {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const dash = uiStyles.telemetryDashboard;
  const axisStyle = { fill: "rgba(159, 168, 175, 0.9)", fontSize: 10, fontFamily: ui.font.mono };

  

  return (
    <div style={{ ...dash.glassPane, padding: "1.2vh 1.2vw", overflow: 'visible'}}>
      <div style={{ ...dash.cardHeader, padding: "0 0 0.8vh 0", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span> {data.chartMetaData[dataKey].title}</span> 
      </div>
      <ResponsiveContainer width="100%" height='150'>
        {useLineGraph === true ?
        <LineChart  data={data.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(159, 168, 175, 0.2)" vertical={false} />
          <XAxis
            dataKey="time"
            type="number"
            tick={axisStyle}
            tickFormatter={(v) => `${v.toFixed(0)}`}
            label={{ value: "Time (s)", position: "insideBottom", offset: -4, style: axisStyle }}
            domain={data.data.length > 2 ? [data.data[0].time - 2, data.data[data.data.length-1].time] : undefined}
          />
          <YAxis
            type="number"
            tick={axisStyle}
            tickFormatter={(v) => `${v.toFixed(0)}`}
            label={{ value: data.chartMetaData[dataKey].yAxis , angle: -90, style: axisStyle }}
            domain={enableYAxisAutoScale === true ? ['datamin', 'datamax'] : undefined}

          />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(34, 35, 40, 0.95)", border: "1px solid rgba(159, 168, 175, 0.3)", borderRadius: 4 }}
            labelStyle={axisStyle}
            formatter={(val) => {
              const n = Array.isArray(val) ? val[0] : val;
              const str = n != null && !Number.isNaN(Number(n)) ? Number(n).toFixed(2) : "—";
              return [str, data.chartMetaData[dataKey].title];
            }}
            labelFormatter={(t) => `Time: ${t != null ? Number(t).toFixed(1) : "—"} s`}
          />
          <Line
            type="monotone"
            name= {dataKey}
            dataKey={dataKey}
            stroke={ui.colors.cyan}
            dot={enableLineDot === true ? <RenderDot color={ui.colors.cyan} elementSize={graphElementSize}/> : false}
            isAnimationActive={false}
            strokeWidth={graphElementSize}
          />
          {meanData ===null ? [] :
            <ReferenceLine name = "mean" y={meanData} strokeDasharray="10 10" stroke="#a6ff00"/>
          }
          {meanData === null ? [] : <Line name={"Mean = " + meanData} type="monotone" dataKey="series1" stroke="#a6ff00" />}
          {meanData === null ? [] : <Legend verticalAlign="top"/>}


        </LineChart>
        :
        <ScatterChart isAnimationActive = {false}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(159, 168, 175, 0.2)" vertical={false} />
          <XAxis
            dataKey="time"
            type="number"
            tick={axisStyle}
            tickFormatter={(v) => `${v.toFixed(0)}`}
            label={{ value: "Time (s)", position: "insideBottom", offset: -4, style: axisStyle }}
            domain={data.data.length > 2 ? [data.data[0].time - 2, data.data[data.data.length-1].time] : undefined}
          />
          <YAxis
            dataKey={dataKey}
            type="number"
            tick={axisStyle}
            tickFormatter={(v) => `${v.toFixed(0)}`}
            label={{ value: data.chartMetaData[dataKey].yAxis , angle: -90, style: axisStyle }}
            domain={enableYAxisAutoScale === true ? ['datamin', 'datamax'] : undefined}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(34, 35, 40, 0.95)", border: "1px solid rgba(159, 168, 175, 0.3)", borderRadius: 4 }}
            labelStyle={axisStyle}
            formatter={(val) => {
              const n = Array.isArray(val) ? val[0] : val;
              const str = n != null && !Number.isNaN(Number(n)) ? Number(n).toFixed(2) : "—";
              return [str, data.chartMetaData[dataKey].title];
            }}
            labelFormatter={(t) => `Time: ${t != null ? Number(t).toFixed(1) : "—"} s`}
          />
          <Scatter isAnimationActive = {false} activeShape={{ fill: 'red' }} data={data.data} fill="#8884d8" shape={<RenderDot color={ui.colors.cyan} elementSize={graphElementSize}/>} />
        </ScatterChart>}
      </ResponsiveContainer>
    </div>
  );
}
