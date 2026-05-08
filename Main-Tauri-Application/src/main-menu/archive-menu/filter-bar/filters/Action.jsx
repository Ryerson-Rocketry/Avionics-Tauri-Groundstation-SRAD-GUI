import React from 'react';
import { useTheme } from "../../../../styles/ThemeContext.jsx";

const Action = ({ color = "#49EEF2FF" }) => {
  const { tokens: ui } = useTheme();
  const style = {
    color: 'rgba(159, 168, 175, 0.5)', // Muted gray to match other headers
    fontFamily: ui.font.orbitron,
    fontSize: ui.text.md,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textAlign: 'center',
    width: '100px', // Matches the width of the ActionStrip
    flexShrink: 0,
    /* Very subtle glow to indicate it's part of the interactive zone */
    textShadow: `0 0 5px ${color}22`,
    userSelect: 'none'
  };

  return (
    <div style={style}>
      Action
    </div>
  );
};

export default Action;