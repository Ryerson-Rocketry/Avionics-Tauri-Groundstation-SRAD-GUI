// Dark theme design tokens (colors, typography, spacings).
// Copied from the original global tokens file.

export const ui = {
  colors: {
    cyan: '#49EEF2',
    gray: '#9FA8AF',
    white: '#FFFFFF',
    black: '#000000',
    red: '#FF5555',
    green: '#50FA7B',
    glassBg: 'rgba(34, 35, 40, 0.4)',
  },
  font: {
    orbitron: '"Orbitron", sans-serif',
    googleSans: '"GoogleSans", sans-serif',
    mono: 'monospace',
  },
  text: {
    xs: '11px',
    sm: '11px',
    md: '14px',
    lg: '17px',
    xl: '17px',
  },
  space: {
    xs: '0.6vh',
    sm: '1.0vh',
    md: '1.6vh',
    lg: '2.4vh',
    xl: '4vh',
  },
  radius: {
    sm: '0.6vh',
    md: '1.0vh',
    lg: '1.6vh',
    xl: '2.4vh',
  },
  border: {
    hair: '1px solid rgba(159, 168, 175, 0.2)',
    faint: '1px solid rgba(159, 168, 175, 0.1)',
    cyanFaint: '1px solid rgba(73, 238, 242, 0.15)',
  },
  typography: {
    heading: {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: '17px',
      letterSpacing: '4px',
      textTransform: 'uppercase',
    },
    subheading: {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: '14px',
      letterSpacing: '3px',
      textTransform: 'uppercase',
    },
    label: {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: '11px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    body: {
      fontFamily: '"GoogleSans", sans-serif',
      fontSize: 'clamp(11px, calc(0.7vh + 0.4vw), 15px)',
    },
    mono: {
      fontFamily: 'monospace',
      fontSize: 'clamp(11px, calc(0.7vh + 0.4vw), 15px)',
    },
    caption: {
      fontFamily: '"GoogleSans", sans-serif',
      fontSize: 'clamp(9px, calc(0.5vh + 0.3vw), 11px)',
    },
  },
};

