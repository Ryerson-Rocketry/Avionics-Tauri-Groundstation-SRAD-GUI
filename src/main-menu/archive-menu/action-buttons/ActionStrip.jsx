import React from 'react';

import Button from '../../../components/Button.jsx';
import { useTheme } from "../../../styles/ThemeContext.jsx";

const ActionStrip = ({ onReplay, onDelete, replayLabel, deleteLabel }) => {
  const { styles: uiStyles } = useTheme();
  return (
    <div style={uiStyles.archive.actionStrip}>
      <Button
        variant="gradient"
        glow
        size="sm"
        outlineColor="#50FA7B"
        textColor="#50FA7B"
        onClick={onReplay}
      >
        {replayLabel || 'REPLAY'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        outlineColor="#FF5555"
        textColor="#FF5555"
        hoverBackgroundColor="rgba(255, 85, 85, 0.1)"
        onClick={onDelete}
      >
        {deleteLabel || 'DELETE'}
      </Button>
    </div>
  );
};

export default ActionStrip;