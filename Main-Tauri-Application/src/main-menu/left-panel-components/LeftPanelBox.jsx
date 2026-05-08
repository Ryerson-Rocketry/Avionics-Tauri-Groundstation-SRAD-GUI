import React from 'react';
import { useTheme } from "../../styles/ThemeContext.jsx";

const LeftPanelBox = ({ children, opacity = 0.3 }) => {
  const { styles: uiStyles } = useTheme();
  const styles = uiStyles.leftPanelBox(opacity);

  return (
    <aside style={styles.sidebar}>
      {children}
    </aside>
  );
};

export default LeftPanelBox;