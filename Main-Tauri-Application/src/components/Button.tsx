import React, { useState } from 'react';
import { useTheme } from '../styles/ThemeContext.jsx';

type ButtonProps = {
  children?: any,
  onClick?: any,
  type?: any,
  disabled?: any,
  size?: any,
  variant?: any, // 'outline' | 'gradient' | 'solid' | 'ghost'
  outlineColor?: any,
  textColor?: any,
  backgroundColor?: any,
  hoverBackgroundColor?: any,
  borderStyle?: any,
  glow?: any,
  fullWidth?: any,
  icon?: any,
  style?: any
}

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  size = 'md',
  variant = 'outline', // 'outline' | 'gradient' | 'solid' | 'ghost'
  outlineColor = '#49EEF2',
  textColor,
  backgroundColor,
  hoverBackgroundColor,
  borderStyle = 'solid',
  glow = false,
  fullWidth = false,
  icon,
  style = {},
  ...rest
}: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const { styles: uiStyles } = useTheme();

  const computedStyle = uiStyles.button.compute({
    size,
    variant,
    outlineColor,
    textColor,
    backgroundColor,
    hoverBackgroundColor,
    borderStyle,
    glow,
    fullWidth,
    disabled,
    isHovered,
    extraStyle: style,
  });

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={computedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {icon ? <span style={uiStyles.button.iconWrapper}>{icon}</span> : null}
      {children}
    </button>
  );
};

export default Button;

