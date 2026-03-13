import React from 'react';
import SearchIcon from './SearchIcon.jsx';
import Card from '../../../components/Card.jsx';
import { useTheme } from "../../../styles/ThemeContext.jsx";

const SearchBar = ({ onSearch, placeholder = "SEARCH_DATABASE..." }) => {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const tray = uiStyles.archiveSearch.tray;

  return (
    <Card style={tray}>
      {/* Search Icon scales with vh */}
      <SearchIcon size="3.5vh" color="#A5F3FC" />

      <input
        type="text"
        placeholder={placeholder}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#FFFFFF',
          fontFamily: ui.font.orbitron,
          fontSize: ui.text.md,
          letterSpacing: '2px',
          marginLeft: '1vw',
          width: '100%',
          textTransform: 'uppercase',
        }}
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />

      <div style={{
        width: '0.8vh',
        height: '0.8vh',
        borderRadius: '50%',
        backgroundColor: '#A5F3FC',
        boxShadow: '0 0 8px #A5F3FC',
        opacity: 0.6
      }} />
    </Card>
  );
};

export default SearchBar;