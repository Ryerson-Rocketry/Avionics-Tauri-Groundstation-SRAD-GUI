import React, { useState } from 'react';
import LeftPanel from './LeftPanel';
import Background from "../background/background.jsx";
import BackgroundEffect from "../background/effect.jsx";
import CenterNavArchive from "./archive-menu/CenterNavArchive.jsx";
import { useTheme } from "../styles/ThemeContext.jsx";

// IMPORT COMPONENTS
import SchemaManagerRoot from "./manage-telemetry-data/SchemaManagerRoot.jsx";
import SettingsRoot from "./settings/SettingsRoot.jsx";
import NewMissionRoot from "./new-mission-menu/NewMissionRoot.jsx";

const MainMenu = ({ onMissionLinkReady, onReplaySave, onDeleteSave, saves = [] }) => {
  const { styles: uiStyles } = useTheme();
  const [activeMenu, setActiveMenu] = useState('NEW MISSION');

  const handleSearch = (query) => {
    console.log("Global System Search Initiated:", query);
  };

  // Helper function to render center content based on selection
  const renderContent = () => {
    switch (activeMenu) {
      case 'REPLAYS':
        return <CenterNavArchive onSearch={handleSearch} saves={saves} onReplaySave={onReplaySave} onDeleteSave={onDeleteSave} />;

      case 'MANAGE TELEMETRY DATA SCHEMAS':
        return <SchemaManagerRoot />;

      case 'SETTINGS':
        return <SettingsRoot setActiveMenu={setActiveMenu} />;

      case 'NEW MISSION':
        return <NewMissionRoot onMissionLinkReady={onMissionLinkReady} />;

      default:
        return (
          <div style={uiStyles.mainMenu.blankState}>
            <h1 style={uiStyles.mainMenu.placeholderText}>SYSTEM READY // {activeMenu}</h1>
          </div>
        );
    }
  };

  return (
    <div style={uiStyles.mainMenu.appContainer}>
      <Background>
        <BackgroundEffect />
      </Background>

      {/* Navigation Panel */}
      <LeftPanel activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Viewport */}
      {renderContent()}
    </div>
  );
};

export default MainMenu;