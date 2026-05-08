import React from 'react';
import SearchBar from "./search-box/SearchBar.jsx";
import FilterComponentBar from "./filter-bar/FilterComponentBar.jsx";
import ProfileEntry from "./profile-entry/ProfileEntry.jsx";
import { useTheme } from "../../styles/ThemeContext.jsx";

const CenterNavArchive = ({ children, onSearch, saves = [], onReplaySave, onDeleteSave }) => {
  const { styles: uiStyles } = useTheme();
  const styles = uiStyles.archive;

  return (
    <div style={styles.centerWrapper}>
      <style>
        {`
          /* Hide scrollbar for Chrome/Safari/Tauri */
          .content-area::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <SearchBar onSearchChange={onSearch} />
      <FilterComponentBar />
      {saves.length === 0 ? (
        <div style={styles.emptyState}>
          No saved missions yet. Run a mission with "Save mission data to disk" enabled to see replays here.
        </div>
      ) : (
        saves.map((save) => (
          <ProfileEntry
            key={save.name}
            missionName={save.name}
            date="—"
            notes="Click Replay to open"
            onReplay={onReplaySave ? () => onReplaySave(save.name) : undefined}
            onDelete={
              onDeleteSave
                ? () => {
                    if (window.confirm(`Delete replay \"${save.name}\"? This cannot be undone.`)) {
                      onDeleteSave(save.name);
                    }
                  }
                : undefined
            }
          />
        ))
      )}
    </div>
  );
};

export default CenterNavArchive;