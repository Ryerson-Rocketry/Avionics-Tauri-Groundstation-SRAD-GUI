import React from 'react';
import { useTheme } from "../../../../styles/ThemeContext.jsx";

const Created = ({
  sortOrder = null, // 'asc', 'desc', or null
  onToggle,
  color = "#49EEF2FF"
}) => {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const base = uiStyles.archiveFilters.created;

  return (
    <div style={base.container} onClick={onToggle}>
      <span style={base.label}>Created</span>
    </div>
  );
};

export default Created;