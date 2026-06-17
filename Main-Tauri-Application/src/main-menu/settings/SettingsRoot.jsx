import React, { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";
import Card from '../../components/Card.jsx';
import Button from '../../components/Button';
import { useTheme } from "../../styles/ThemeContext.jsx";

const SettingsRoot = ({ setActiveMenu }) => {
  const { tokens: ui, styles: uiStyles, name: themeName, setTheme, availableThemes } = useTheme();
  const [settings, setSettings] = useState(null);
  const [pendingTheme, setPendingTheme] = useState(themeName || "dark");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // currentData is now the StartupData struct { settings: {...}, available_saves: [...] }
        const currentData = await invoke('initialize_app');

        if (currentData && currentData.settings) {
          // Extract just the settings portion for this view
          setSettings(currentData.settings);
          if (currentData.settings.theme) {
            setPendingTheme(currentData.settings.theme);
          }
        }
      } catch (err) {
        console.error("FS_READ_ERROR: Could not access startup data.", err);
      }
    };
    loadSettings();
  }, []);

  const styles = uiStyles.settings;

  // Loading guard to prevent null pointer errors during async disk fetch
  if (!settings) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>
          INITIALIZING_SYSTEM_ENVIRONMENT...
        </div>
      </div>
    );
  }

  const handleSaveTheme = async () => {
    try {
      setIsSaving(true);
      const nextSettings = { ...settings, theme: pendingTheme };
      await invoke("save_settings", { newSettings: nextSettings });
      setSettings(nextSettings);
      setTheme(pendingTheme);
    } catch (err) {
      console.error("Failed to save settings:", err);
      window.alert("Failed to save settings: " + (err?.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>SYSTEM DIRECTORY</h2>

      <Card style={styles.section}>
        {/* THEME */}
        <div style={styles.row}>
          <label style={styles.label}>INTERFACE_THEME</label>
          <div style={{ display: "flex", gap: "1vw", alignItems: "center", flexWrap: "wrap" }}>
            <select
              value={pendingTheme}
              onChange={(e) => setPendingTheme(e.target.value)}
              style={{
                ...styles.displayBox,
                width: "220px",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {availableThemes.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              variant="outline"
              outlineColor="#49EEF2"
              textColor="#49EEF2"
              hoverBackgroundColor="rgba(73, 238, 242, 0.1)"
              disabled={isSaving || pendingTheme === settings.theme}
              onClick={handleSaveTheme}
            >
              {isSaving ? "SAVING..." : "APPLY & SAVE"}
            </Button>
          </div>
        </div>

        {/* SCHEMAS_PATH */}
        <div style={styles.row}>
          <label style={styles.label}>SCHEMA_REPOSITORY_PATH</label>
          <div style={styles.displayBox}>
            {settings.schemas_path || 'UNDEFINED'}
          </div>
          <span style={{fontSize: ui.text.xs, color: '#666'}}>Architecture definition storage location.</span>
        </div>

        {/* SAVES_PATH */}
        <div style={styles.row}>
          <label style={styles.label}>MISSION_ARCHIVE_PATH</label>
          <div style={styles.displayBox}>
            {settings.saves_path || 'UNDEFINED'}
          </div>
          <span style={{fontSize: ui.text.xs, color: '#666'}}>Default output for mission telemetry logs.</span>
        </div>

        <Button
          size="lg"
          variant="outline"
          outlineColor="#49EEF2"
          textColor="#49EEF2"
          backgroundColor="rgba(73, 238, 242, 0.1)"
          hoverBackgroundColor="rgba(73, 238, 242, 0.2)"
          style={styles.backBtn}
          onClick={() => setActiveMenu('NEW MISSION')}
        >
          ← RETURN TO COMMAND_CENTER
        </Button>
      </Card>
    </div>
  );
};

export default SettingsRoot;