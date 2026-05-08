import React from 'react';
import { useTheme } from '../styles/ThemeContext.jsx';

const Background = ({ children }) => {
  const { styles: uiStyles } = useTheme();
  const styles = uiStyles.background;

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      {children}
    </div>
  );
};

export default Background;