import React from "react";
import { useTheme } from "../../styles/ThemeContext.jsx";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';



function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

export function GaugeComponent({val, min, max, label, units = "N/A"}) {
    const { tokens: ui, styles: uiStyles } = useTheme();

    return (
        <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
            <GaugeContainer
                width={150}
                height={100}
                startAngle={-110}
                endAngle={110}
                valueMin={min}
                valueMax={max}
                value={val}
                >
                <GaugeReferenceArc />
                <GaugeValueArc />
                <GaugePointer />
            </GaugeContainer>
            <div style={{ fontFamily: ui.font.googleSans, fontSize: ui.text.xs, color: ui.colors.cyan, letterSpacing: "1px" }}>
                {val} ({units})
            </div>
            <div style={{ fontFamily: ui.font.googleSans, fontSize: ui.text.s, color: ui.colors.cyan, letterSpacing: "1px" }}>
                {label}
            </div>
            
        </div>
)};