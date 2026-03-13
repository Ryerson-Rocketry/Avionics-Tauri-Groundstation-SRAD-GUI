import React from 'react';
import { useTheme } from '../styles/ThemeContext.jsx';

const Card = ({ children, style = {}, ...rest }) => {
  const { styles: uiStyles } = useTheme();
  const baseStyle = uiStyles.card.base;

  return (
    <div style={{ ...baseStyle, ...style }} {...rest}>
      {children}
    </div>
  );
};

export default Card;

