import React from 'react';
import Button from '../../components/Button.jsx';
import { useTheme } from "../../styles/ThemeContext.jsx";

const SchemaActions = ({ onUpload, onCreate }) => {
  const { styles: uiStyles } = useTheme();
  return (
    <div style={uiStyles.schemaActions.container}>
      <Button variant="gradient" outlineColor="#49EEF2" glow size="md" onClick={onCreate}>
        + CREATE NEW SCHEMA
      </Button>
      <Button
        variant="outline"
        outlineColor="#9FA8AF66"
        textColor="#9FA8AF"
        size="md"
        onClick={onUpload}
      >
        UPLOAD JSON
      </Button>
    </div>
  );
};

export default SchemaActions;