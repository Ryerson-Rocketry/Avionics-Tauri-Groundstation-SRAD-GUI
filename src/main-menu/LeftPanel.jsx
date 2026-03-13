import React from 'react';
import RocketLogo from './left-panel-components/LeftPanelTitle';
import LeftPanelButton from './left-panel-components/LeftPanelButton';
import LeftPanelBox from "./left-panel-components/LeftPanelBox.jsx";
import { useTheme } from "../styles/ThemeContext.jsx";

const LeftPanel = ({ activeMenu, setActiveMenu }) => {
  const { styles: uiStyles } = useTheme();
  const menuItems = [
    { label: 'NEW MISSION', icon: '+' },
    { label: 'REPLAYS', icon: '♽' },
    { label: 'MANAGE TELEMETRY DATA SCHEMAS', icon: '⬢' },
    // { label: 'ENABLE MULTI TAB VIEW', icon: '📊' },
    { label: 'SETTINGS', icon: '⚙️' },
  ];

  return (
    <LeftPanelBox>
      <div style={uiStyles.leftPanel.logoSection}>
        <RocketLogo />
      </div>

      <nav style={uiStyles.leftPanel.navMenu}>
        {menuItems.map((item) => (
          <LeftPanelButton
            key={item.label}
            label={item.label}
            icon={item.icon}
            // Check if this button's label matches the active state
            isActive={activeMenu === item.label}
            // Update the global state when clicked
            onClick={() => setActiveMenu(item.label)}
          />
        ))}
      </nav>
    </LeftPanelBox>
  );
};

export default LeftPanel;