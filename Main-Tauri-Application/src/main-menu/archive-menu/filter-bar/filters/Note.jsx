import React from 'react';
import { useTheme } from "../../../../styles/ThemeContext.jsx";

const Notes = () => {
  const { tokens: ui } = useTheme();
  const style = {
    // Fills remaining space just like the notesSection in ProfileEntry
    flexGrow: 1,

    // Standardized typography
    color: 'rgba(159, 168, 175, 0.5)',
    fontFamily: ui.font.orbitron,
    fontSize: ui.text.md,
    letterSpacing: '2px',
    textTransform: 'uppercase',

    // Alignment Gutter
    paddingLeft: '20px',

    userSelect: 'none'
  };

  return (
    <div style={style}>
      Notes
    </div>
  );
};

export default Notes;