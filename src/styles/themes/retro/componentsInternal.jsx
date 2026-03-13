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
    fontFamily: ui.font.mono, // Retro: Swapped to Mono
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  glass: {
    backgroundColor: 'rgba(10, 15, 10, 0.9)', // Retro: Dark Terminal Green Tint
    backdropFilter: 'none', // Retro: Disabling blur for that sharp CRT feel
    WebkitBackdropFilter: 'none',
    border: `1px solid ${ui.colors.cyan}`, // Hard borders
    boxShadow: 'inset 0 0 15px rgba(73, 238, 242, 0.1)',
  },
  inputBase: {
    width: '100%',
    backgroundColor: '#050505',
    border: '1px solid #49EEF2',
    borderRadius: '0px', // Retro: Sharp corners
    color: '#49EEF2',
    fontFamily: ui.font.mono,
    outline: 'none',
    boxSizing: 'border-box',
  },
  headerBase: {
    color: '#FFB800', // Retro: Amber headers
    letterSpacing: '2px',
    borderLeft: `4px solid #FFB800`,
    paddingLeft: '1vw',
    fontSize: ui.text.xl,
    fontFamily: ui.font.mono,
  },
};

const BUTTON_SIZE = {
  sm: { padding: '4px 8px', fontSize: ui.text.sm, borderRadius: '0px' },
  md: { padding: '8px 16px', fontSize: ui.text.md, borderRadius: '0px' },
  lg: { padding: '12px 24px', fontSize: ui.text.lg, borderRadius: '0px' },
};

function computeButtonStyle({
  size = 'md',
  variant = 'outline',
  outlineColor = '#49EEF2',
  textColor,
  backgroundColor,
  hoverBackgroundColor,
  borderStyle = 'solid',
  glow = true, // Default to glow for retro neon effect
  fullWidth = false,
  disabled = false,
  isHovered = false,
  extraStyle = {},
} = {}) {
  const resolvedTextColor = textColor || (variant === 'solid' ? '#000' : outlineColor);
  const hoverBg =
    hoverBackgroundColor ||
    (variant === 'solid'
      ? outlineColor
      : rgbaFrom(outlineColor, 0.2));

  const baseBg =
    backgroundColor ||
    (variant === 'solid' ? outlineColor : 'transparent');

  const sizeStyle = BUTTON_SIZE[size] || BUTTON_SIZE.md;
  const border =
    variant === 'ghost' ? 'none' : `1px ${borderStyle} ${outlineColor}`;

  return {
    ...shared.flexCenter,
    ...shared.orbitronMain,
    gap: '8px',
    width: fullWidth ? '100%' : undefined,
    background: isHovered && !disabled ? hoverBg : baseBg,
    color: disabled ? '#224444' : resolvedTextColor,
    border,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'none', // Retro: Instant transitions
    boxShadow: glow ? `0 0 10px ${rgbaFrom(outlineColor, 0.4)}` : undefined,
    opacity: disabled ? 0.5 : 1,
    ...sizeStyle,
    ...extraStyle,
  };
}

export const uiStyles = {
  app: {
    wrapper: { margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' },
    text: { color: '#49EEF2', fontFamily: ui.font.mono },
  },

  card: {
    base: {
      ...shared.glass,
      borderRadius: '0px',
      padding: '3vh 2vw',
      border: '2px solid #49EEF2',
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
      background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)', // Retro: Simple dark gradient
      backgroundColor: '#000',
      zIndex: -2,
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
      backgroundSize: '100% 4px, 3px 100%', // Retro: Scanline effect
      zIndex: -1,
      pointerEvents: 'none',
    },
  },

  backgroundEffect: {
    container: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'transparent',
      zIndex: -1,
    },
    star: (s) => ({
      position: 'absolute',
      top: s.top,
      left: s.left,
      width: '1px',
      height: '1px',
      backgroundColor: '#49EEF2', // Retro: Pixel stars
      opacity: s.opacity,
    }),
    ship: {
      position: 'absolute',
      width: '100px',
      height: '1px',
      background: '#FFB800', // Retro: Amber streak
      boxShadow: '0 0 8px #FFB800',
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
      color: '#1a3a3a',
      fontSize: ui.text.xl,
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
      gap: '0px', // Retro: Stacked rows
      padding: '0',
      flexGrow: 1,
      width: '100%',
      boxSizing: 'border-box',
    },
  },

  leftPanelBox: (opacity = 0.9) => ({
    sidebar: {
      backgroundColor: '#050505',
      borderRight: '2px solid #49EEF2',
      width: '18vw',
      minWidth: '240px',
      height: '100vh',
      margin: '0',
      borderRadius: '0',
      display: 'flex',
      flexDirection: 'column',
      padding: '5vh 0',
      boxSizing: 'border-box',
      flexShrink: 0,
      zIndex: 10,
      position: 'relative',
      overflow: 'hidden',
    },
  }),

  settings: {
    container: {
      padding: '4vh 3vw',
      flexGrow: 1,
      color: '#49EEF2',
      fontFamily: ui.font.mono,
    },
    header: {
      ...shared.headerBase,
      marginBottom: ui.space.xl,
    },
    section: {
      maxWidth: '900px',
      padding: '3vh 2vw',
      border: '1px solid #49EEF2',
    },
    row: {
      display: 'flex',
      flexDirection: 'column',
      gap: ui.space.sm,
      padding: '2vh 0',
      borderBottom: '1px solid #1a3a3a',
    },
    label: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.sm,
      color: '#FFB800',
    },
    displayBox: {
      ...shared.inputBase,
      padding: '1.4vh 1vw',
      color: '#49EEF2',
      wordBreak: 'break-all',
    },
    backBtn: { marginTop: '4vh' },
    loadingText: { color: '#49EEF2', fontFamily: ui.font.mono, letterSpacing: '2px' },
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
      color: '#49EEF2',
      fontFamily: ui.font.mono,
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

  profileEntry: (iconColor = `#49EEF2`) => ({
    rowContent: { display: 'flex', alignItems: 'center', width: '100%', height: '100%', borderBottom: '1px solid #1a3a3a' },
    iconSection: { width: '5vw', minWidth: '56px', ...shared.flexCenter, flexShrink: 0 },
    nameSection: {
      fontFamily: ui.font.mono,
      width: '20%',
      minWidth: '14vw',
      color: '#FFF',
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
      color: '#FFB800',
    },
    notesSection: {
      flexGrow: 1,
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      color: '#49EEF2',
      opacity: 0.6,
      borderLeft: '1px solid #1a3a3a',
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
      color: '#49EEF2',
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    barStatus: {
      width: '8px',
      height: '8px',
      borderRadius: '0',
      marginLeft: '20px',
      backgroundColor: '#49EEF2',
    },
    tray: {
      width: 'auto',
      height: '6vh',
      margin: '2vh 1.5vw 1vh 1.5vw',
      borderRadius: '0',
      border: '1px solid #49EEF2',
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      padding: '0 2vw',
      boxSizing: 'border-box',
      zIndex: 10,
      position: 'relative',
    },
    iconContainer: {
      backgroundColor: 'transparent',
      borderRadius: '0',
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
      backgroundColor: 'transparent',
      width: '100%',
      position: 'relative',
      zIndex: 1,
      overflow: 'visible',
    },
    titleRow: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      margin: 0,
      gap: '0.5vw',
      flexWrap: 'nowrap',
    },
    rocketText: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.xl,
      fontWeight: 'bold',
      color: '#49EEF2',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      margin: 0,
      whiteSpace: 'nowrap',
    },
    viewText: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.xl,
      fontWeight: '400',
      color: '#FFB800',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      margin: 0,
      whiteSpace: 'nowrap',
    },
    subtitle: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      color: '#49EEF2',
      letterSpacing: '1px',
      marginTop: '0.8vh',
      textTransform: 'uppercase',
      opacity: 0.7,
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
      borderLeft: isActive ? '6px solid #49EEF2' : '6px solid transparent',
      backgroundColor: isActive ? '#1a3a3a' : 'transparent',
      borderTop: 'none',
      borderRight: 'none',
      borderBottom: '1px solid #1a3a3a',
      padding: 0,
      textAlign: 'left',
      outline: 'none',
      transition: 'none',
    },
    contentWrapper: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '1.5vw',
    },
    icon: {
      fontSize: '2vh',
      marginRight: '1vw',
      color: isActive ? '#FFF' : '#49EEF2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1.5vw',
    },
    text: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.sm,
      fontWeight: '500',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: isActive ? '#FFF' : '#49EEF2',
    },
  }),

  telemetryEditor: {
    wrapper: {
      ...shared.flexCenter,
      flexDirection: 'column',
      height: '70vh',
      width: '100%',
      backgroundColor: '#050505',
      borderRadius: '0px',
      border: `2px solid #49EEF2`,
      overflow: 'hidden',
    },
    header: {
      padding: '10px 20px',
      backgroundColor: '#49EEF2',
      color: '#000',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid #49EEF2`,
    },
    textArea: {
      flexGrow: 1,
      backgroundColor: 'transparent',
      color: '#49EEF2',
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
      color: '#49EEF2',
      fontFamily: ui.font.mono,
    },
    section: {
      marginBottom: ui.space.md,
    },
    title: {
      fontSize: ui.text.lg,
      marginBottom: ui.space.md,
      color: '#FFB800',
      letterSpacing: '1px',
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
      color: '#49EEF2',
      marginBottom: ui.space.xs,
      display: 'block',
      letterSpacing: '1px',
    },
    featureRow: {
      ...shared.flexCenter,
      gap: ui.space.md,
      padding: '1.4vh 1.6vw',
      borderRadius: '0',
      background: '#0a0a0a',
      marginBottom: ui.space.sm,
      border: `1px solid #1a3a3a`,
    },
    infoNote: {
      fontSize: ui.text.xs,
      color: '#FFB800',
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
      background: '#000',
      borderRadius: '0',
      border: '1px solid #49EEF2',
      marginBottom: ui.space.sm,
      position: 'relative',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns:
        'minmax(0, 1.4fr) minmax(0, 1.1fr) minmax(0, 0.9fr) minmax(0, 0.9fr) minmax(0, 1.1fr)',
      gap: '1.2vw',
      minWidth: 0,
    },
    inputWrapper: { display: 'flex', flexDirection: 'column', gap: ui.space.xs },
    label: { fontSize: ui.text.xs, color: '#FFB800', letterSpacing: '1px' },
    input: {
      ...shared.inputBase,
      padding: '0.9vh 0.9vw',
    },
    removeBtn: {
      position: 'absolute',
      top: '1vh',
      right: '1vw',
      background: 'none',
      border: 'none',
      color: '#FF0000',
      cursor: 'pointer',
      fontSize: ui.text.lg,
    },
    iconToggle: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.4vw',
      fontSize: ui.text.xs,
      transition: 'none',
    },
  },

  telemetryManager: {
    container: { padding: '4vh 3vw', flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '2vh',
    },
    header: {
      fontFamily: ui.font.mono,
      color: '#FFB800',
      marginBottom: '4vh',
      letterSpacing: '2px',
      borderLeft: `4px solid #49EEF2`,
      paddingLeft: '1vw',
      fontSize: ui.text.xl,
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
      fontFamily: ui.font.mono,
      color: '#FFB800',
      marginBottom: '3vh',
      letterSpacing: '2px',
      borderLeft: `4px solid #49EEF2`,
      paddingLeft: '1vw',
      fontSize: ui.text.xl,
      width: '100%',
      maxWidth: '1200px',
      boxSizing: 'border-box',
    },
    layout: {
      width: '100%',
      maxWidth: '1200px',
    },
    card: {
      padding: '3vh 2vw',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5vh',
      maxWidth: '1200px',
      border: '2px solid #49EEF2',
      backgroundColor: '#050505',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: ui.space.sm,
    },
    sectionTitle: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: '#FFF',
      margin: 0,
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
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: '#49EEF2',
      marginBottom: ui.space.xs,
      display: 'block',
    },
    input: {
      width: '100%',
      backgroundColor: '#000',
      border: '1px solid #49EEF2',
      borderRadius: '0',
      padding: '1.0vh 1.1vw',
      color: '#49EEF2',
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      outline: 'none',
      boxSizing: 'border-box',
    },
    select: {
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      backgroundColor: '#000',
      color: '#49EEF2',
      border: '1px solid #49EEF2',
      backgroundImage: 'none',
    },
    helpText: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      color: '#FFB800',
      marginTop: '0.6vh',
    },
    checkboxLabel: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: ui.font.mono,
      fontSize: ui.text.sm,
      color: '#49EEF2',
    },
    checkbox: {
      width: '14px',
      height: '14px',
      borderRadius: '0px',
      border: '1px solid #49EEF2',
    },
    textarea: {
      width: '100%',
      backgroundColor: '#000',
      border: '1px solid #49EEF2',
      borderRadius: '0',
      padding: '1.2vh 1.1vw',
      color: '#49EEF2',
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      outline: 'none',
      resize: 'vertical',
      minHeight: '120px',
      boxSizing: 'border-box',
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
      color: '#FF0000',
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
      color: '#FFB800',
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      letterSpacing: '1px',
      textTransform: 'uppercase',
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
      padding: '4vh 4vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2vh',
      minWidth: '420px',
      border: '3px solid #49EEF2',
      backgroundColor: '#000',
    },
    startedTitle: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.lg,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: '#FFB800',
      margin: 0,
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
      color: '#49EEF2',
      padding: '1.5vh 3vw',
      borderRadius: '0',
      border: '2px solid #49EEF2',
      backgroundColor: '#050505',
      letterSpacing: '2px',
    },
    startedSubtitle: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.sm,
      color: '#49EEF2',
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
        transition: 'none',
        cursor: 'pointer',
        padding: '2vh 1.6vw',
        borderRadius: '0',
        border: '1px solid #1a3a3a',
        backgroundColor: '#050505',
      },
      title: {
        fontFamily: ui.font.mono,
        color: '#49EEF2',
        fontSize: ui.text.lg,
        letterSpacing: '1px',
        margin: 0,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      subtitle: {
        fontFamily: ui.font.mono,
        color: '#FFB800',
        fontSize: ui.text.sm,
        margin: 0,
        letterSpacing: '1px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      footer: {
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTop: '1px solid #1a3a3a',
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
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: ui.font.mono,
      backgroundColor: '#000',
      color: '#49EEF2',
      position: 'relative',
      zIndex: 0,
    },
    containerReplay: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.2vh 1.2vw',
      paddingBottom: '10vh',
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: ui.font.mono,
      backgroundColor: '#000',
      color: '#49EEF2',
      position: 'relative',
      zIndex: 0,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    startCard: {
      padding: '4vh 4vw',
      borderRadius: '0',
      textAlign: 'center',
      backgroundColor: '#050505',
      border: '4px double #49EEF2',
    },
    startCardTitle: {
      fontFamily: ui.font.mono,
      fontSize: ui.text.lg,
      letterSpacing: '4px',
      textTransform: 'uppercase',
      color: '#FFB800',
      margin: '0 0 1.5vh 0',
    },
    dashboardGrid: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1.2fr 1fr',
      gap: '1.2vh 1.2vw',
      overflow: 'hidden',
    },
    glassPane: {
      backgroundColor: '#050505',
      borderRadius: '0',
      border: '2px solid #49EEF2',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '1vh 1.2vw',
      fontSize: ui.text.xs,
      fontFamily: ui.font.mono,
      fontWeight: 'bold',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      backgroundColor: '#49EEF2',
      color: '#000',
    },
    navBar: {
      height: '8vh',
      minHeight: '56px',
      borderRadius: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5vw',
      marginBottom: '1.2vh',
      backgroundColor: '#000',
      border: '2px solid #49EEF2',
    },
    statLabel: {
      fontSize: ui.text.xs,
      color: '#FFB800',
      fontFamily: ui.font.mono,
      letterSpacing: '1px',
    },
    statValue: {
      fontSize: ui.text.lg,
      fontFamily: ui.font.mono,
      color: '#49EEF2',
      fontWeight: 'bold',
    },
    terminal: {
      flex: 1,
      padding: '1.2vh 1.2vw',
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      overflowY: 'auto',
      backgroundColor: '#000',
      color: '#49EEF2',
      borderTop: '1px solid #49EEF2',
    },
    timelineBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '1vw',
      padding: '0.8vh 1.2vw',
      backgroundColor: '#050505',
      border: '2px solid #FFB800',
      borderRadius: '0',
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      zIndex: 20,
      position: 'fixed',
      left: '1.2vw',
      right: '1.2vw',
      bottom: '1.2vh',
    },
    timelineBtn: {
      background: 'none',
      padding: '4px 10px',
      borderRadius: 0,
      cursor: 'pointer',
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
    },
    timelineBtnCyan: {
      border: '1px solid #49EEF2',
      color: '#49EEF2',
    },
    timelineBtnRed: {
      border: '1px solid #FF0000',
      color: '#FF0000',
    },
    timelineTextDim: {
      color: '#49EEF2',
      opacity: 0.6,
    },
    timelineTrack: {
      flex: 1,
      height: '10px',
      backgroundColor: '#1a1a1a',
      borderRadius: 0,
      cursor: 'pointer',
      position: 'relative',
      border: '1px solid #49EEF2',
    },
    timelineFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      backgroundColor: '#49EEF2',
      borderRadius: 0,
      pointerEvents: 'none',
    },
    timelineSpeedLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: '#FFB800',
    },
    timelineNumberInput: {
      width: 48,
      padding: '2px 6px',
      backgroundColor: '#000',
      border: '1px solid #49EEF2',
      borderRadius: 0,
      color: '#49EEF2',
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
    },
    replayWrapper: {
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
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
      color: '#49EEF2',
    },
    replayErrorTitle: {
      margin: 0,
      color: '#FF0000',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontSize: ui.text.xl,
    },
    replayErrorText: {
      marginTop: 12,
      maxWidth: '900px',
      textAlign: 'center',
      color: '#49EEF2',
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    replayExitBtn: {
      marginTop: 24,
      padding: '8px 20px',
      borderRadius: 0,
      border: `2px solid #FF0000`,
      background: 'transparent',
      color: '#FF0000',
      cursor: 'pointer',
      fontFamily: ui.font.mono,
      letterSpacing: '2px',
    },
    replayLoadingText: {
      color: '#FFB800',
      fontFamily: ui.font.mono,
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    statLine: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: ui.text.xs,
      fontFamily: ui.font.mono,
      marginBottom: '2px',
      borderBottom: '1px solid #1a3a3a',
      color: '#49EEF2',
    },
  },

  archiveFilters: {
    divider: {
      width: '2px',
      height: '55%',
      backgroundColor: '#49EEF2',
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
        paddingRight: '12px',
      },
      label: {
        color: '#FFB800',
        fontFamily: ui.font.mono,
        fontSize: ui.text.md,
        letterSpacing: '1px',
        textTransform: 'uppercase',
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
        color: '#FFB800',
        fontFamily: ui.font.mono,
        fontSize: ui.text.md,
        letterSpacing: '1px',
        textTransform: 'uppercase',
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