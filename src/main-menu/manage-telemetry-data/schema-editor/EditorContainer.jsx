import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button.jsx';
import { useTheme } from "../../../styles/ThemeContext.jsx";

const EditorContainer = ({ initialData, onSave, onCancel }) => {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const [code, setCode] = useState(JSON.stringify(initialData || {}, null, 2));

  const handleSave = () => {
    try {
      const parsed = JSON.parse(code);
      onSave(parsed); // This is where you'd call your Tauri Rust command
    } catch (e) {
      alert("INVALID SCHEMA FORMAT: Check JSON syntax.");
    }
  };

  return (
    <div style={uiStyles.telemetryEditor.wrapper}>
      <div style={uiStyles.telemetryEditor.header}>
        <span style={{ color: ui.colors.cyan, fontFamily: ui.font.mono, fontSize: ui.text.sm }}>
          SCHEMA_EDITOR.RAW
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="ghost" size="md" outlineColor="#9FA8AF" textColor="#9FA8AF" onClick={onCancel}>
            CANCEL
          </Button>
          <Button variant="solid" size="sm" outlineColor="#49EEF2" textColor="#000" glow onClick={handleSave}>
            SAVE TO CORE
          </Button>
        </div>
      </div>
      <textarea
        style={uiStyles.telemetryEditor.textArea}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
      />
    </div>
  );
};

export default EditorContainer;