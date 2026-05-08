import React from 'react';
import { useTheme } from "../../../../styles/ThemeContext.jsx";

const MissionName = ({
  sortOrder = null, // 'asc' (A-Z), 'desc' (Z-A), or null
  onToggle,
  color = "#49EEF2FF"
}) => {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const base = uiStyles.archiveFilters.missionName;

  return (
    <div style={base.container} onClick={onToggle}>
      <span style={base.label}>Name</span>
    </div>
  );
};

export default MissionName;