import React from 'react';
import { useTheme } from "../../../styles/ThemeContext.jsx";

const SearchIcon = ({
  color = '#A5F3FC', // Matching your "Rocket" text cyan
  size = '45px',      // Standard icon size for a search bar
  strokeWidth = 2
}) => {
  const { styles: uiStyles } = useTheme();
  const base = uiStyles.archiveSearch.iconContainer;
  const containerStyle = {
    ...base,
    width: size,
    height: size,
    border: `1px solid ${color}22`,
    boxShadow: `0 0 10px ${color}11`,
  };
  const svgStyle = { width: '60%', height: '60%' };

  return (
    <div
      style={containerStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 15px ${color}44`;
        e.currentTarget.style.borderColor = `${color}66`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 10px ${color}11`;
        e.currentTarget.style.borderColor = `${color}22`;
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* The Glass Circle */}
        <circle
          cx="11"
          cy="11"
          r="7"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* The Handle */}
        <path
          d="M21 21L16.65 16.65"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default SearchIcon;