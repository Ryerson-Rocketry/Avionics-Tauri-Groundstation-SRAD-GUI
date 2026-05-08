import React from 'react';
import Card from '../../../components/Card.jsx';
import MissionName from "./filters/MissionName.jsx";
import Created from "./filters/Created.jsx";
import Notes from "./filters/Note.jsx";
import Action from "./filters/Action.jsx";
import { useTheme } from "../../../styles/ThemeContext.jsx";


const FilterComponentBar = ({
  nameSortOrder,
  onToggleNameSort,
  dateSortOrder,
  onToggleDateSort,
  themeColor = "#49EEF2FF"
}) => {
  const { styles: uiStyles } = useTheme();
  const dividerStyle = uiStyles.archiveFilters.divider;
  return (
    <Card
      style={{
        width: 'auto',
        height: '6vh',
        margin: '0.5vh 1.5vw',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2vw',
        boxSizing: 'border-box',
        zIndex: 5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* COLUMN 1: ICON SPACER
          Matches the iconSection width of ProfileEntry */}
      <div style={{ width: '5vw', minWidth: '56px', flexShrink: 0 }} />

      {/* COLUMN 2: MISSION NAME
          Matches the 20% width / 150px minWidth */}
      <MissionName
        sortOrder={nameSortOrder}
        onToggle={onToggleNameSort}
        color={themeColor}
      />

      <div style={dividerStyle} />

      {/* COLUMN 3: CREATED DATE
          Matches the 120px width */}
      <Created
        sortOrder={dateSortOrder}
        onToggle={onToggleDateSort}
        color={themeColor}
      />

      <div style={dividerStyle} />

      {/* COLUMN 4: SYSTEM NOTES
          Matches the flexGrow: 1 and left border logic */}
      <Notes />

      <div style={dividerStyle} />

      {/* COLUMN 5: ACTION LABEL
          Matches the ActionStrip area on the far right */}
      <Action color={themeColor} />
    </Card>
  );
};

export default FilterComponentBar;