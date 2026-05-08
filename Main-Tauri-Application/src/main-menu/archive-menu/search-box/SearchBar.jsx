import React from 'react';
import SearchPanelBox from "./SearchBox.jsx";
import SearchIcon from "./SearchIcon.jsx";
import { useTheme } from "../../../styles/ThemeContext.jsx";

const SearchBar = ({
  placeholder = "INITIATE SYSTEM SEARCH...",
  onSearchChange,
  color = "#A5F3FC" // Default neon cyan
}) => {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const wrapperStyles = uiStyles.archiveSearch.barWrapper;
  const baseInput = uiStyles.archiveSearch.barInput;
  const baseStatus = uiStyles.archiveSearch.barStatus;

  return (
    <SearchPanelBox opacity={0.4}>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.4; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.4; transform: scale(0.9); }
          }
          /* Custom placeholder color */
          input::placeholder {
            color: rgba(159, 168, 175, 0.5);
            letter-spacing: 3px;
          }
        `}
      </style>

      <div style={wrapperStyles.inputWrapper}>
        {/* Your wireframe magnifying glass */}
        <SearchIcon size="32px" color={color} />

        <input
          type="text"
          placeholder={placeholder}
          style={{ ...baseInput, marginLeft: '20px', textShadow: `0 0 8px ${color}66` }}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />

        {/* Small "System Online" pulse on the far right */}
        <div style={{ ...baseStatus, backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
    </SearchPanelBox>
  );
};

export default SearchBar;