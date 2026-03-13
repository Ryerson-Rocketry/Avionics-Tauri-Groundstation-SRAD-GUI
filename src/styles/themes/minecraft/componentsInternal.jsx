// Internal component-level style groups, built on tokens.
// This file holds the detailed style definitions; `components.jsx`
// re-exports a compact `uiStyles` facade for consumers.

import { ui } from './tokens.jsx';

// Shared helpers for style computation (used by components like Button).
function hexToRgb(hex) {
  if (typeof hex !== 'string') return null;
  const raw = hex.trim().replace('#', '');
  const six = raw.length === 6 ? raw : raw.length === 8 ? raw.slice(0, 6) : null;
  if (!six) return null;
  const r = parseInt(six.slice(0, 2), 16);
  const g = parseInt(six.slice(2, 4), 16);
  const b = parseInt(six.slice(4, 6), 16);
  return [r, g, b].some(Number.isNaN) ? null : { r, g, b };
}

function rgbaFrom(color, alpha) {
  const rgb = hexToRgb(color);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : null;
}

// Shared mixins / base styles used across components.
const shared = {
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitronMain: {
    fontFamily: ui.font.mono,
    letterSpacing: '0px',
    textTransform: 'none',
    fontWeight: 'normal',
    textShadow: '2px 2px #3f3f3f',
  },
  glass: {
    backgroundColor: '#C6C6C6',
    border: '4px solid #000',
    // Classic Minecraft GUI border: Top/Left are white, Bottom/Right are dark grey
    boxShadow: 'inset -4px -4px #555, inset 4px 4px #FFF',
    imageRendering: 'pixelated',
  },
  inputBase: {
    width: '100%',
    backgroundColor: '#000',
    border: '4px solid #a0a0a0',
    borderRadius: '0px',
    color: '#e0e0e0',
    fontFamily: ui.font.mono,
    outline: 'none',
    boxSizing: 'border-box',
  },
  headerBase: {
    color: '#FFFFFF',
    letterSpacing: '1px',
    borderLeft: `8px solid #70B048`,
    paddingLeft: '1vw',
    fontSize: ui.text.xl,
    fontFamily: ui.font.mono,
    textShadow: '3px 3px #3f3f3f',
  },
};

const BUTTON_SIZE = {
  sm: { padding: '4px 12px', fontSize: ui.text.sm, borderRadius: '0px' },
  md: { padding: '8px 16px', fontSize: ui.text.md, borderRadius: '0px' },
  lg: { padding: '12px 20px', fontSize: ui.text.lg, borderRadius: '0px' },
};

function computeButtonStyle({
  size = 'md',
  variant = 'outline',
  outlineColor = '#70B048',
  textColor,
  backgroundColor,
  hoverBackgroundColor,
  borderStyle = 'solid',
  glow = false,
  fullWidth = false,
  disabled = false,
  isHovered = false,
  extraStyle = {},
} = {}) {
  const resolvedTextColor = textColor || (disabled ? '#a0a0a0' : isHovered ? '#ffffa0' : '#e0e0e0');
  
  // Base button is the grey stone look, Hover is lighter with a yellow text tint
  const baseBg = backgroundColor || '#6b6b6b';
  const hoverBg = hoverBackgroundColor || '#8b8b8b';

  const sizeStyle = BUTTON_SIZE[size] || BUTTON_SIZE.md;

  return {
    ...shared.flexCenter,
    ...shared.orbitronMain,
    gap: '8px',
    width: fullWidth ? '100%' : undefined,
    background: isHovered && !disabled ? hoverBg : baseBg,
    color: resolvedTextColor,
    border: '4px solid #000',
    // Minecraft Button Shading logic
    boxShadow: isHovered && !disabled
        ? 'inset -4px -4px #333, inset 4px 4px #aaa' 
        : 'inset -4px -4px #333, inset 4px 4px #aaa',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'none',
    opacity: disabled ? 0.5 : 1,
    ...sizeStyle,
    ...extraStyle,
  };
}

export const uiStyles = {
  app: {
    wrapper: { 
        margin: 0, 
        padding: 0, 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', 
        backgroundColor: '#2b1e15', 
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")', // Overlaid dirt grain
        imageRendering: 'pixelated' 
    },
    text: { color: 'white', fontFamily: ui.font.mono },
  },

  card: {
    base: {
      ...shared.glass,
      borderRadius: '0px',
      padding: '3vh 2vw',
    },
  },

  button: {
    compute: computeButtonStyle,
    iconWrapper: {
      ...shared.flexCenter,
    },
  },

  background: {
    container: {
      position: 'fixed',
      inset: 0,
      // Using a dirt texture base
      backgroundColor: '#352922',
      backgroundImage: `repeating-conic-gradient(#4d3225 0% 25%, #352922 0% 50%)`,
      backgroundSize: '64px 64px',
      zIndex: -2,
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: -1,
    },
  },

  backgroundEffect: {
    container: {
      position: 'fixed',
      inset: '-5%',
      backgroundColor: 'transparent',
      zIndex: -1,
    },
    star: (s) => ({
      position: 'absolute',
      top: s.top,
      left: s.left,
      width: '12px',
      height: '12px',
      backgroundColor: '#FFFFFF',
      borderRadius: '0%',
      opacity: s.opacity,
      boxShadow: '4px 4px rgba(0,0,0,0.2)',
    }),
    ship: {
      position: 'absolute',
      width: '40px',
      height: '40px',
      backgroundColor: '#70B048', // Creeper Green
      border: '4px solid #000',
      boxShadow: 'inset -4px -4px #385a24, inset 4px 4px #a9d68d',
      zIndex: 2,
    },
  },

  mainMenu: {
    appContainer: {
      display: 'flex',
      width: '100vw',
      height: '100vh',
      position: 'relative',
    },
    blankState: {
      ...shared.flexCenter,
      flexGrow: 1,
    },
    placeholderText: {
      ...shared.orbitronMain,
      color: '#444',
      fontSize: ui.text.xl,
      textShadow: 'none',
    },
  },

  leftPanel: {
    logoSection: {
      ...shared.flexCenter,
      marginBottom: '6vh',
      width: '100%',
    },
    navMenu: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '0 1.2vw',
      flexGrow: 1,
      width: '100%',
      boxSizing: 'border-box',
    },
  },

  leftPanelBox: (opacity = 0.9) => ({
    sidebar: {
      backgroundColor: '#C6C6C6',
      borderRight: '8px solid #000',
      width: '18vw',
      minWidth: '240px',
      height: 'calc(100vh - 4vh)',
      margin: '2vh 0 2vh 2vh',
      borderRadius: '0px',
      display: 'flex',
      flexDirection: 'column',
      padding: '5vh 0',
      boxSizing: 'border-box',
      flexShrink: 0,
      zIndex: 10,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset -4px -4px #555, inset 4px 4px #FFF',
    },
  }),

  settings: {
    container: {
      padding: '4vh 3vw',
      flexGrow: 1,
      color: '#55FF55',
      ...shared.orbitronMain,
    },
    header: {
      ...shared.headerBase,
      marginBottom: ui.space.xl,
    },
    section: {
      maxWidth: '900px',
      padding: '3vh 2vw',
      backgroundColor: '#C6C6C6',
      border: '4px solid #000',
      boxShadow: 'inset -4px -4px #555, inset 4px 4px #FFF',
    },
    row: {
      display: 'flex',
      flexDirection: 'column',
      gap: ui.space.sm,
      padding: '2vh 0',
      borderBottom: '4px solid #555',
    },
    label: {
      ...shared.orbitronMain,
      fontSize: ui.text.sm,
      color: '#333',
      textShadow: 'none',
    },
    displayBox: {
      ...shared.inputBase,
      padding: '1.4vh 1vw',
      color: '#70B048',
      wordBreak: 'break-all',
    },
    backBtn: { marginTop: '4vh' },
    loadingText: { color: '#70B048', fontFamily: ui.font.mono, letterSpacing: '2px' },
  },

  schemaActions: {
    container: { display: 'flex', gap: '1.5vw', marginBottom: '3vh' },
  },

  archive: {
    centerWrapper: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      padding: '4vh 3vw',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative',
    },
    emptyState: {
      ...shared.glass,
      padding: '4vh 3vw',
      margin: '2vh 1.5vw',
      borderRadius: '0px',
      color: '#444',
      ...shared.orbitronMain,
      textShadow: 'none',
      fontSize: ui.text.md,
      lineHeight: 1.4,
    },
    actionStrip: {
      display: 'flex',
      gap: '0.8vw',
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: '100%',
      flexWrap: 'nowrap',
      marginBottom: 0,
    },
  },

  profileEntry: (iconColor = `#70B048`) => ({
    rowContent: { display: 'flex', alignItems: 'center', width: '100%', height: '100%' },
    iconSection: { width: '5vw', minWidth: '56px', ...shared.flexCenter, flexShrink: 0 },
    nameSection: {
      ...shared.orbitronMain,
      width: '20%',
      minWidth: '14vw',
      color: '#000',
      textShadow: 'none',
      fontSize: ui.text.lg,
      paddingRight: '2vw',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    dateSection: {
      width: '9vw',
      minWidth: '96px',
      flexShrink: 0,
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      color: '#555',
    },
    notesSection: {
      flexGrow: 1,
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      color: '#444',
      borderLeft: '4px solid #555',
      paddingLeft: '2vw',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    actionSection: {
      flexShrink: 0,
      marginLeft: '2vw',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    },
  }),

  archiveSearch: {
    barWrapper: {
      inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      },
    },
    barInput: {
      color: '#FFFFFF',
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      textTransform: 'none',
      textShadow: '2px 2px #000',
    },
    barStatus: {
      width: '12px',
      height: '12px',
      borderRadius: '0px',
      backgroundColor: '#70B048',
      marginLeft: '20px',
      border: '2px solid #000',
    },
    tray: {
      width: 'auto',
      height: '6vh',
      margin: '2vh 1.5vw 1vh 1.5vw',
      borderRadius: '0px',
      border: '4px solid #000',
      backgroundColor: '#444',
      boxShadow: 'inset -4px -4px #222, inset 4px 4px #666',
      display: 'flex',
      alignItems: 'center',
      padding: '0 2vw',
      boxSizing: 'border-box',
      zIndex: 10,
      position: 'relative',
    },
    iconContainer: {
      backgroundColor: '#000',
      borderRadius: '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
  },

  leftPanelTitle: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      position: 'relative',
      zIndex: 1,
    },
    titleRow: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: '0.5vw',
    },
    rocketText: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.xl,
      color: '#70B048',
      textTransform: 'uppercase',
      textShadow: '3px 3px #000',
    },
    viewText: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.xl,
      color: '#FFFFFF',
      textTransform: 'uppercase',
      textShadow: '3px 3px #000',
    },
    subtitle: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.sm,
      color: '#555',
      marginTop: '0.8vh',
      textTransform: 'none',
      textAlign: 'center',
      width: '100%',
    },
  },

  leftPanelButton: (isActive) => ({
    button: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '5vh',
      cursor: 'pointer',
      borderLeft: isActive ? '8px solid #70B048' : '8px solid transparent',
      backgroundColor: isActive ? '#8b8b8b' : 'transparent',
      borderTop: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      padding: 0,
      textAlign: 'left',
      outline: 'none',
    },
    contentWrapper: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '1.8vw',
    },
    icon: {
      fontSize: '2vh',
      marginRight: '1vw',
      color: isActive ? '#ffffa0' : '#444',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1.5vw',
    },
    text: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.sm,
      fontWeight: 'normal',
      textTransform: 'none',
      color: isActive ? '#ffffa0' : '#444',
    },
  }),

  telemetryEditor: {
    wrapper: {
      ...shared.flexCenter,
      flexDirection: 'column',
      height: '70vh',
      width: '100%',
      backgroundColor: '#000',
      borderRadius: '0px',
      border: `4px solid #a0a0a0`,
      overflow: 'hidden',
    },
    header: {
      padding: '10px 20px',
      backgroundColor: '#C6C6C6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `4px solid #000`,
    },
    textArea: {
      flexGrow: 1,
      backgroundColor: 'transparent',
      color: '#70B048',
      fontFamily: ui.font.mono,
      padding: '2vh 2vw',
      border: 'none',
      outline: 'none',
      resize: 'none',
      fontSize: ui.text.md,
      lineHeight: '1.5',
    },
  },

  telemetryCreator: {
    container: {
      color: '#333',
      fontFamily: ui.font.mono,
    },
    section: {
      marginBottom: ui.space.md,
    },
    title: {
      fontSize: ui.text.lg,
      marginBottom: ui.space.md,
      color: '#000',
      display: 'flex',
      alignItems: 'center',
      gap: ui.space.sm,
    },
    roundedInput: {
      ...shared.inputBase,
      padding: '1.2vh 1.4vw',
    },
    inputLabel: {
      fontSize: ui.text.xs,
      color: '#555',
      marginBottom: ui.space.xs,
      display: 'block',
    },
    featureRow: {
      ...shared.flexCenter,
      gap: ui.space.md,
      padding: '1.4vh 1.6vw',
      borderRadius: '0px',
      background: '#C6C6C6',
      marginBottom: ui.space.sm,
      border: `4px solid #000`,
      boxShadow: 'inset -2px -2px #555, inset 2px 2px #FFF',
    },
    infoNote: {
      fontSize: ui.text.xs,
      color: '#555',
      marginTop: ui.space.xs,
      fontFamily: ui.font.mono,
    },
    addButton: { marginTop: ui.space.sm },
  },

  telemetryDataField: {
    row: {
      display: 'flex',
      flexDirection: 'column',
      gap: ui.space.sm,
      padding: '2vh 2vw',
      background: '#C6C6C6',
      borderRadius: '0px',
      border: '4px solid #000',
      marginBottom: ui.space.sm,
      position: 'relative',
      boxShadow: 'inset -4px -4px #555, inset 4px 4px #FFF',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '1.2vw',
      minWidth: 0,
    },
    inputWrapper: { display: 'flex', flexDirection: 'column', gap: ui.space.xs },
    label: { fontSize: ui.text.xs, color: '#333' },
    input: {
      ...shared.inputBase,
      padding: '0.9vh 0.9vw',
    },
    removeBtn: {
      position: 'absolute',
      top: '1vh',
      right: '1vw',
      background: '#FF5555',
      border: '2px solid #000',
      color: '#000',
      cursor: 'pointer',
      fontWeight: 'bold',
      padding: '4px',
    },
    iconToggle: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.4vw',
      fontSize: ui.text.xs,
      color: '#70B048',
    },
  },

  telemetryManager: {
    container: { padding: '4vh 3vw', flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '2.5vh',
    },
    header: {
      ...shared.headerBase,
      marginBottom: '4vh',
    },
  },

  newMission: {
    container: {
      padding: '4vh 3vw',
      flexGrow: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    header: {
      ...shared.headerBase,
      marginBottom: '3vh',
      width: '100%',
      maxWidth: '1200px',
    },
    layout: {
      width: '100%',
      maxWidth: '1200px',
    },
    card: {
      ...shared.glass,
      padding: '3vh 2vw',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5vh',
      maxWidth: '1200px',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: ui.space.sm,
    },
    sectionTitle: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      color: '#000',
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2vw',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    column: {
      flex: '1 1 300px',
      minWidth: '260px',
      maxWidth: '500px',
    },
    label: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      color: '#333',
      marginBottom: ui.space.xs,
      display: 'block',
    },
    input: {
      ...shared.inputBase,
      padding: '1.0vh 1.1vw',
      fontSize: ui.text.md,
    },
    select: {
      appearance: 'none',
      backgroundColor: '#000',
      color: '#FFF',
      border: '4px solid #a0a0a0',
      padding: '1.0vh 1.1vw',
      fontFamily: ui.font.mono,
    },
    helpText: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      color: '#555',
      marginTop: '0.6vh',
    },
    checkboxLabel: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: ui.font.mono,
      fontSize: ui.text.sm,
      color: '#333',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      borderRadius: '0px',
      border: '2px solid #000',
      backgroundColor: '#000',
    },
    textarea: {
      ...shared.inputBase,
      padding: '1.2vh 1.1vw',
      minHeight: '120px',
    },
    footerRow: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '0.8vh',
      marginTop: '1vh',
    },
    startButton: {
      alignSelf: 'flex-end',
    },
    startError: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      color: '#FF5555',
      alignSelf: 'flex-start',
    },
    schemaPreviewSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: ui.space.xs,
    },
    schemaPreviewToggle: {
      alignSelf: 'flex-start',
      background: 'none',
      border: 'none',
      color: '#70B048',
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      cursor: 'pointer',
      padding: 0,
    },
    schemaPreviewCardWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    schemaPreviewInner: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    startedContainer: {
      padding: '4vh 3vw',
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    startedCard: {
      ...shared.glass,
      padding: '4vh 4vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2vh',
      minWidth: '420px',
    },
    startedTitle: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.lg,
      color: '#000',
      textAlign: 'center',
    },
    startedEndpointRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '1vw',
    },
    startedEndpoint: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.xl,
      color: '#70B048',
      padding: '1.5vh 3vw',
      border: '4px solid #000',
      backgroundColor: '#000',
    },
    startedSubtitle: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.sm,
      color: '#555',
      marginTop: '1vh',
      textAlign: 'center',
    },
  },

  telemetry: {
    schemaCard: {
      card: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.0vh',
        backgroundColor: '#C6C6C6',
        border: '4px solid #000',
        boxShadow: 'inset -4px -4px #555, inset 4px 4px #FFF',
        cursor: 'pointer',
        padding: '2vh 1.6vw',
        borderRadius: '0px',
      },
      title: {
        fontFamily: ui.font.mono,
        color: '#000',
        fontSize: ui.text.lg,
        margin: 0,
        textTransform: 'none',
      },
      subtitle: {
        fontFamily: ui.font.mono,
        color: '#555',
        fontSize: ui.text.sm,
        margin: 0,
      },
      footer: {
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTop: '4px solid #555',
        paddingTop: '10px',
        flexWrap: 'wrap',
        rowGap: '8px',
        columnGap: '12px',
      },
    },
  },

  telemetryDashboard: {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.2vh 1.2vw',
      backgroundColor: '#352922',
      color: '#FFF',
      position: 'relative',
      zIndex: 0,
      imageRendering: 'pixelated',
    },
    containerReplay: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.2vh 1.2vw',
      paddingBottom: '12vh',
      backgroundColor: '#352922',
      color: '#FFF',
      position: 'relative',
      zIndex: 0,
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    startCard: {
      backgroundColor: '#C6C6C6',
      border: '8px solid #000',
      padding: '4vh 4vw',
      textAlign: 'center',
      boxShadow: 'inset -4px -4px #555, inset 4px 4px #FFF',
    },
    startCardTitle: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.lg,
      color: '#000',
      margin: '0 0 1.5vh 0',
    },
    dashboardGrid: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1.2fr 1fr',
      gap: '12px',
    },
    glassPane: {
      backgroundColor: '#C6C6C6',
      border: '4px solid #000',
      boxShadow: 'inset -4px -4px #555, inset 4px 4px #FFF',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '1vh 1.2vw',
      fontSize: ui.text.xs,
      fontFamily: ui.font.mono,
      fontWeight: 'bold',
      color: '#FFF',
      borderBottom: '4px solid #000',
      backgroundColor: '#444',
    },
    navBar: {
      height: '8vh',
      minHeight: '56px',
      backgroundColor: '#C6C6C6',
      border: '4px solid #000',
      boxShadow: 'inset -4px -4px #555, inset 4px 4px #FFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5vw',
      marginBottom: '1.2vh',
    },
    statLabel: {
      fontSize: ui.text.xs,
      color: '#555',
      fontFamily: ui.font.mono,
    },
    statValue: {
      fontSize: ui.text.lg,
      fontFamily: ui.font.mono,
      color: '#000',
      fontWeight: 'bold',
    },
    terminal: {
      flex: 1,
      padding: '1.2vh 1.2vw',
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      overflowY: 'auto',
      backgroundColor: '#000',
      color: '#70B048',
    },
    timelineBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '1vw',
      padding: '12px',
      backgroundColor: '#C6C6C6',
      border: '4px solid #000',
      boxShadow: 'inset -4px -4px #555, inset 4px 4px #FFF',
      position: 'fixed',
      left: '1.2vw',
      right: '1.2vw',
      bottom: '1.2vh',
      zIndex: 20,
    },
    timelineBtn: {
      background: '#6b6b6b',
      border: '4px solid #000',
      padding: '4px 10px',
      cursor: 'pointer',
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      color: '#FFF',
    },
    timelineBtnCyan: {
      background: '#70B048',
      color: '#FFF',
    },
    timelineBtnRed: {
      background: '#FF5555',
      color: '#000',
    },
    timelineTextDim: {
      color: '#444',
      fontFamily: ui.font.mono,
    },
    timelineTrack: {
      flex: 1,
      height: '12px',
      backgroundColor: '#000',
      border: '2px solid #555',
      cursor: 'pointer',
      position: 'relative',
    },
    timelineFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      backgroundColor: '#70B048',
      pointerEvents: 'none',
    },
    timelineSpeedLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: '#333',
      fontFamily: ui.font.mono,
    },
    timelineNumberInput: {
      width: 48,
      padding: '2px 6px',
      backgroundColor: '#000',
      border: '2px solid #555',
      color: '#70B048',
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
    },
    replayWrapper: {
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#000',
    },
    replayOverlay: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: ui.font.mono,
      color: '#AAA',
    },
    replayErrorTitle: {
      margin: 0,
      color: '#FF5555',
      fontSize: ui.text.xl,
      textShadow: '3px 3px #000',
    },
    replayErrorText: {
      marginTop: 12,
      maxWidth: '900px',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
    },
    replayExitBtn: {
      marginTop: 24,
      padding: '12px 24px',
      border: `4px solid #000`,
      background: '#FF5555',
      color: '#000',
      cursor: 'pointer',
      fontFamily: ui.font.mono,
      fontWeight: 'bold',
    },
    replayLoadingText: {
      color: '#70B048',
      fontFamily: ui.font.mono,
      fontSize: ui.text.lg,
    },
    statLine: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: ui.text.xs,
      fontFamily: ui.font.mono,
      marginBottom: '2px',
      borderBottom: '2px solid #a0a0a0',
      color: '#333',
    },
  },

  archiveFilters: {
    divider: {
      width: '4px',
      height: '55%',
      backgroundColor: '#000',
      margin: '0 1.2vw',
      flexShrink: 0,
    },
    missionName: {
      container: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        width: '20%',
        minWidth: '14vw',
        userSelect: 'none',
      },
      label: {
        color: '#444',
        fontFamily: ui.font.mono,
        fontSize: ui.text.md,
      },
      iconGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        justifyContent: 'center',
      },
    },
    created: {
      container: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        width: '9vw',
        minWidth: '96px',
        userSelect: 'none',
      },
      label: {
        color: '#444',
        fontFamily: ui.font.mono,
        fontSize: ui.text.md,
      },
      iconGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        justifyContent: 'center',
      },
    },
  },
};