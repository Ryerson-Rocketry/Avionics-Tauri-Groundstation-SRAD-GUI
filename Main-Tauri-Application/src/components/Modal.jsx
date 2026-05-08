import React, { useState } from 'react';
import { useTheme } from '../styles/ThemeContext.jsx';

const Modal = ({InternalComponent = <div></div>}) => {

  const { styles: uiStyles } = useTheme();

  return (
    <div

    >
        {InternalComponent}
    </div>
  );
};

export default Button;

