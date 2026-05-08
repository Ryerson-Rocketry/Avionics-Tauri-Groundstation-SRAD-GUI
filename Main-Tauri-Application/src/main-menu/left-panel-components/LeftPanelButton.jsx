import React from 'react';
import { useTheme } from "../../styles/ThemeContext.jsx";

const LeftPanelButton = ({ label, icon, isActive, onClick }) => {
  const { styles: uiStyles } = useTheme();
  const styles = uiStyles.leftPanelButton(isActive);

  const handleInternalClick = (e) => {
    onClick(); // Changes the menu
    e.currentTarget.blur(); // FIX: Forces the gray focus/hover box to die immediately
  };

  return (
    <button
      style={styles.button}
      onClick={handleInternalClick}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'rgba(159, 168, 175, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        // Returns to transparent or your active light blue tint
        e.currentTarget.style.backgroundColor = isActive
          ? 'rgba(73, 238, 242, 0.05)'
          : 'transparent';
      }}
    >
      <div style={styles.contentWrapper}>
        {icon && <span style={styles.icon}>{icon}</span>}
        <span style={styles.text}>{label}</span>
      </div>
    </button>
  );
};

export default LeftPanelButton;