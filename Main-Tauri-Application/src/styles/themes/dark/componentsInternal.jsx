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
    fontFamily: ui.font.orbitron,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  glass: {
    backgroundColor: ui.colors.glassBg,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: ui.border.hair,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  inputBase: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    border: '1px solid rgba(73, 238, 242, 0.35)',
    borderRadius: ui.radius.md,
    color: ui.colors.white,
    fontFamily: ui.font.mono,
    outline: 'none',
    boxSizing: 'border-box',
  },
  headerBase: {
    color: ui.colors.gray,
    letterSpacing: '4px',
    borderLeft: `4px solid ${ui.colors.cyan}`,
    paddingLeft: '1vw',
    fontSize: ui.text.xl,
    fontFamily: ui.font.orbitron,
  },
};

const BUTTON_SIZE = {
  sm: { padding: '0.7vh 12px', fontSize: ui.text.sm, borderRadius: ui.radius.sm },
  md: { padding: '0.9vh 16px', fontSize: ui.text.md, borderRadius: ui.radius.md },
  lg: { padding: '1.1vh 20px', fontSize: ui.text.lg, borderRadius: ui.radius.lg },
};

function computeButtonStyle({
  size = 'md',
  variant = 'outline',
  outlineColor = '#49EEF2',
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
  const resolvedTextColor = textColor || (variant === 'solid' ? '#000' : outlineColor);
  const hoverBg =
    hoverBackgroundColor ||
    (variant === 'solid'
      ? rgbaFrom(outlineColor, 0.85) || 'rgba(255,255,255,0.08)'
      : rgbaFrom(outlineColor, 0.12) || 'rgba(255,255,255,0.06)');

  const baseBg =
    backgroundColor ||
    (variant === 'gradient'
      ? `linear-gradient(135deg, ${rgbaFrom(outlineColor, 0.2)}, ${rgbaFrom(outlineColor, 0.05)})`
      : variant === 'solid'
        ? outlineColor
        : 'transparent');

  const sizeStyle = BUTTON_SIZE[size] || BUTTON_SIZE.md;
  const border =
    variant === 'ghost' || variant === 'solid' ? 'none' : `1px ${borderStyle} ${outlineColor}`;

  return {
    ...shared.flexCenter,
    ...shared.orbitronMain,
    gap: '8px',
    width: fullWidth ? '100%' : undefined,
    background: isHovered && !disabled ? hoverBg : baseBg,
    color: disabled ? 'rgba(159, 168, 175, 0.5)' : resolvedTextColor,
    border,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: glow ? `0 0 15px ${rgbaFrom(outlineColor, 0.2)}` : undefined,
    opacity: disabled ? 0.7 : 1,
    ...sizeStyle,
    ...extraStyle,
  };
}

export const uiStyles = {
  app: {
    wrapper: { margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden' },
    text: { color: 'white' },
  },

  card: {
    base: {
      ...shared.glass,
      borderRadius: ui.radius.lg,
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
      backgroundImage: 'url("/backgrounds/background-main-menu.jpg")',
      backgroundSize: 'cover',
      backgroundColor: '#020305',
      zIndex: -2,
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      zIndex: -1,
    },
  },

  backgroundEffect: {
    container: {
      position: 'fixed',
      inset: '-5%',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: -1,
      backdropFilter: 'blur(25px)',
      animation: 'nebulaPulse 40s ease-in-out infinite alternate',
    },
    star: (s) => ({
      position: 'absolute',
      top: s.top,
      left: s.left,
      width: s.size,
      height: s.size,
      backgroundColor: '#FFFFFF',
      borderRadius: '50%',
      boxShadow: `0 0 ${parseInt(s.size, 10) * 2}px #FFFFFF`,
      opacity: s.opacity,
      animation: `individualTwinkle ${s.duration} linear infinite`,
      animationDelay: s.delay,
    }),
    ship: {
      position: 'absolute',
      width: '180px',
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #49EEF2FF, #FFFFFF)',
      boxShadow: '0 0 15px rgba(73, 238, 242, 0.8)',
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
      color: 'rgba(73, 238, 242, 0.2)',
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
      gap: ui.space.sm,
      padding: '0 1.2vw',
      flexGrow: 1,
      width: '100%',
      boxSizing: 'border-box',
    },
  },

  leftPanelBox: (opacity = 0.3) => ({
    sidebar: {
      ...shared.glass,
      backgroundColor: `rgba(34, 35, 40, ${opacity})`,
      width: '18vw',
      minWidth: '240px',
      height: 'calc(100vh - 4vh)',
      margin: '2vh 0 2vh 2vh',
      borderRadius: '2.4vh',
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
      color: ui.colors.cyan,
      ...shared.orbitronMain,
    },
    header: {
      ...shared.headerBase,
      marginBottom: ui.space.xl,
    },
    section: {
      maxWidth: '900px',
      padding: '3vh 2vw',
    },
    row: {
      display: 'flex',
      flexDirection: 'column',
      gap: ui.space.sm,
      padding: '2vh 0',
      borderBottom: '1px solid rgba(73, 238, 242, 0.1)',
    },
    label: {
      ...shared.orbitronMain,
      fontSize: ui.text.sm,
      color: ui.colors.cyan,
      opacity: 0.8,
    },
    displayBox: {
      ...shared.inputBase,
      padding: '1.4vh 1vw',
      color: ui.colors.gray,
      wordBreak: 'break-all',
    },
    backBtn: { marginTop: '4vh' },
    loadingText: { color: ui.colors.cyan, fontFamily: ui.font.mono, letterSpacing: '2px' },
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
      borderRadius: ui.radius.lg,
      color: ui.colors.gray,
      ...shared.orbitronMain,
      fontSize: ui.text.md,
      letterSpacing: '1px',
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

  profileEntry: (iconColor = `${ui.colors.cyan}FF`) => ({
    rowContent: { display: 'flex', alignItems: 'center', width: '100%', height: '100%' },
    iconSection: { width: '5vw', minWidth: '56px', ...shared.flexCenter, flexShrink: 0 },
    nameSection: {
      ...shared.orbitronMain,
      width: '20%',
      minWidth: '14vw',
      color: ui.colors.white,
      fontSize: ui.text.lg,
      textShadow: `0 0 10px ${iconColor}44`,
      paddingRight: '2vw',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    dateSection: {
      width: '9vw',
      minWidth: '96px',
      flexShrink: 0,
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.md,
      color: iconColor,
      letterSpacing: '1px',
    },
    notesSection: {
      flexGrow: 1,
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.md,
      color: 'rgba(159, 168, 175, 0.6)',
      letterSpacing: '1px',
      borderLeft: '1px solid rgba(159, 168, 175, 0.2)',
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
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.md,
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    barStatus: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      marginLeft: '20px',
    },
    tray: {
      width: 'auto',
      height: '6vh',
      margin: '2vh 1.5vw 1vh 1.5vw',
      borderRadius: '1.5vh',
      border: '1px solid #9FA8AF33',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 2vw',
      boxSizing: 'border-box',
      zIndex: 10,
      position: 'relative',
    },
    iconContainer: {
      backgroundColor: '#1A1B1F',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
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
      flexDirection: 'column',
      alignItems: 'baseline',
      justifyContent: 'center',
      textAlign: 'center',
      flexWrap: 'nowrap',
    },
    rocketText: {
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.xl,
      fontWeight: '400',
      color: '#A5F3FC',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      margin: 0,
      whiteSpace: 'nowrap',
      textShadow:
        '0 0 10px rgba(79, 209, 237, 0.8), 0 0 30px rgba(79, 209, 237, 0.4)',
    },
    viewText: {
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.xl,
      fontWeight: '400',
      color: '#D1D5DB',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      margin: 0,
      whiteSpace: 'nowrap',
    },
    subtitle: {
      fontFamily: ui.font.googleSans,
      fontSize: ui.text.sm,
      color: '#4B5563',
      letterSpacing: '2px',
      marginTop: '0.8vh',
      textTransform: 'uppercase',
      opacity: 0.9,
      textAlign: 'center',
      width: '100%',
    },
    subheader: {
      fontFamily: ui.font.googleSans,
      fontSize: ui.text.md,
      color: '#3967a7',
      letterSpacing: '2px',
      marginTop: '0.8vh',
      textTransform: 'uppercase',
      opacity: 0.9,
      textAlign: 'center',
      width: '100%',
    }
  },

  leftPanelButton: (isActive) => ({
    button: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '4.5vh',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      borderLeft: isActive ? '4px solid #49EEF2FF' : '4px solid transparent',
      backgroundColor: isActive ? 'rgba(73, 238, 242, 0.05)' : 'transparent',
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
      paddingLeft: isActive ? '1.8vw' : '2.1vw',
    },
    icon: {
      fontSize: '2vh',
      marginRight: '1vw',
      color: isActive ? '#49EEF2FF' : '#9FA8AFFF',
      textShadow: isActive
        ? '0 0 12px rgba(73, 238, 242, 0.6), 0 0 4px rgba(73, 238, 242, 0.4)'
        : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1.5vw',
    },
    text: {
      fontFamily: ui.font.googleSans,
      fontSize: ui.text.sm,
      fontWeight: '500',
      letterSpacing: '0.15vw',
      textTransform: 'uppercase',
      color: isActive ? '#49EEF2FF' : '#9FA8AFFF',
      transition: 'all 0.2s ease',
      textShadow: isActive
        ? '0 0 8px rgba(73, 238, 242, 0.5), 0 0 2px rgba(73, 238, 242, 0.3)'
        : 'none',
    },
  }),

  telemetryEditor: {
    wrapper: {
      ...shared.flexCenter,
      flexDirection: 'column',
      height: '70vh',
      width: '100%',
      backgroundColor: 'rgba(20, 21, 25, 0.8)',
      borderRadius: ui.radius.md,
      border: `1px solid ${rgbaFrom(ui.colors.cyan, 0.2)}`,
      overflow: 'hidden',
    },
    header: {
      padding: '10px 20px',
      backgroundColor: rgbaFrom(ui.colors.cyan, 0.1),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${rgbaFrom(ui.colors.cyan, 0.2)}`,
    },
    textArea: {
      flexGrow: 1,
      backgroundColor: 'transparent',
      color: '#A5F3FC',
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
      color: ui.colors.cyan,
      fontFamily: ui.font.orbitron,
    },
    section: {
      marginBottom: ui.space.md,
    },
    title: {
      fontSize: ui.text.lg,
      marginBottom: ui.space.md,
      color: ui.colors.white,
      letterSpacing: '2px',
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
      color: ui.colors.cyan,
      marginBottom: ui.space.xs,
      display: 'block',
      letterSpacing: '1px',
    },
    featureRow: {
      ...shared.flexCenter,
      gap: ui.space.md,
      padding: '1.4vh 1.6vw',
      borderRadius: ui.radius.md,
      background: 'rgba(0,0,0,0.2)',
      marginBottom: ui.space.sm,
      border: `1px solid ${rgbaFrom(ui.colors.cyan, 0.1)}`,
    },
    infoNote: {
      fontSize: ui.text.xs,
      color: ui.colors.gray,
      marginTop: ui.space.xs,
      fontFamily: 'sans-serif',
    },
    addButton: { marginTop: ui.space.sm },
  },

  telemetryDataField: {
    row: {
      display: 'flex',
      flexDirection: 'column',
      gap: ui.space.sm,
      padding: '2vh 2vw',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: ui.radius.lg,
      border: ui.border.cyanFaint,
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
    label: { fontSize: ui.text.xs, color: ui.colors.cyan, letterSpacing: '1px' },
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
      color: '#FF5F5F',
      cursor: 'pointer',
      fontSize: ui.text.lg,
    },
    iconToggle: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.4vw',
      fontSize: ui.text.xs,
      transition: 'color 0.2s',
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
      fontFamily: ui.font.orbitron,
      color: ui.colors.gray,
      marginBottom: '4vh',
      letterSpacing: '4px',
      borderLeft: `4px solid ${ui.colors.cyan}`,
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
      fontFamily: ui.font.orbitron,
      color: ui.colors.gray,
      marginBottom: '3vh',
      letterSpacing: '4px',
      borderLeft: `4px solid ${ui.colors.cyan}`,
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
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: ui.space.sm,
    },
    sectionTitle: {
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.md,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: ui.colors.white,
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
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.xs,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: ui.colors.cyan,
      marginBottom: ui.space.xs,
      display: 'block',
    },
    input: {
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      border: '1px solid rgba(73, 238, 242, 0.35)',
      borderRadius: ui.radius.md,
      padding: '1.0vh 1.1vw',
      color: ui.colors.white,
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      outline: 'none',
      boxSizing: 'border-box',
    },
    select: {
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      backgroundImage:
        'linear-gradient(45deg, transparent 50%, rgba(159,168,175,0.7) 50%), linear-gradient(135deg, rgba(159,168,175,0.7) 50%, transparent 50%)',
      backgroundPosition: 'calc(100% - 12px) 50%, calc(100% - 6px) 50%',
      backgroundSize: '6px 6px, 6px 6px',
      backgroundRepeat: 'no-repeat',
    },
    helpText: {
      fontFamily: ui.font.googleSans,
      fontSize: ui.text.xs,
      color: ui.colors.gray,
      marginTop: '0.6vh',
    },
    checkboxLabel: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: ui.font.googleSans,
      fontSize: ui.text.sm,
      color: ui.colors.gray,
    },
    checkbox: {
      width: '14px',
      height: '14px',
      borderRadius: '3px',
    },
    textarea: {
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      border: '1px solid rgba(73, 238, 242, 0.25)',
      borderRadius: ui.radius.md,
      padding: '1.2vh 1.1vw',
      color: ui.colors.white,
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
      fontFamily: ui.font.googleSans,
      fontSize: ui.text.xs,
      color: ui.colors.red,
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
      color: ui.colors.cyan,
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.xs,
      letterSpacing: '2px',
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
    },
    startedTitle: {
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.lg,
      letterSpacing: '4px',
      textTransform: 'uppercase',
      color: ui.colors.gray,
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
      color: ui.colors.cyan,
      padding: '1.5vh 3vw',
      borderRadius: ui.radius.lg,
      border: ui.border.cyanFaint,
      backgroundColor: 'rgba(0,0,0,0.4)',
      letterSpacing: '2px',
    },
    startedSubtitle: {
      fontFamily: ui.font.googleSans,
      fontSize: ui.text.sm,
      color: ui.colors.gray,
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
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        padding: '2vh 1.6vw',
        borderRadius: '1.6vh',
      },
      title: {
        fontFamily: ui.font.orbitron,
        color: ui.colors.cyan,
        fontSize: ui.text.lg,
        letterSpacing: '2px',
        margin: 0,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      subtitle: {
        fontFamily: ui.font.mono,
        color: '#4B5563',
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
        borderTop: '1px solid rgba(159, 168, 175, 0.1)',
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

      //borderStyle: 'dotted',

      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: ui.font.orbitron,
      backgroundColor: 'transparent',
      color: ui.colors.white,
      position: 'relative',
      zIndex: 0,
    },
    containerReplay: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
  
      paddingBottom: '10vh', // leave room for fixed replay controls
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: ui.font.orbitron,
      backgroundColor: 'transparent',
      color: ui.colors.white,
      position: 'relative',
      zIndex: 0,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    startCard: {
      padding: '4vh 4vw',
      borderRadius: ui.radius.xl,
      textAlign: 'center',
      backgroundColor: ui.colors.glassBg,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: ui.border.cyanFaint,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    },
    startCardTitle: {
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.lg,
      letterSpacing: '4px',
      textTransform: 'uppercase',
      color: ui.colors.gray,
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
      backgroundColor: ui.colors.glassBg,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: ui.radius.lg,
      border: ui.border.hair,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '1vh 1.2vw',
      fontSize: ui.text.xs,
      fontFamily: ui.font.orbitron,
      fontWeight: 'bold',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: ui.colors.cyan,
      borderBottom: ui.border.faint,
    },
    cardHeaderNoBorder: {
      padding: '1vh 1.2vw',
      fontSize: ui.text.xs,
      fontFamily: ui.font.orbitron,
      fontWeight: 'bold',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: ui.colors.cyan,
    },
    navBar: {
      height: '8vh',
      minHeight: '56px',
      borderRadius: ui.radius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5vw',
      marginBottom: '1.2vh',
      backgroundColor: ui.colors.glassBg,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: ui.border.hair,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    },
    statLabel: {
      fontSize: ui.text.xs,
      color: ui.colors.gray,
      fontFamily: ui.font.orbitron,
      letterSpacing: '1px',
    },
    label: {
      color: ui.colors.gray,
      fontFamily: ui.font.orbitron,
      letterSpacing: '1px',
    },
    statValue: {
      fontSize: ui.text.lg,
      fontFamily: ui.font.mono,
      color: ui.colors.cyan,
      fontWeight: 'bold',
    },
    terminal: {
      flex: 1,
      padding: '1.2vh 1.2vw',
      fontFamily: ui.font.mono,
      fontSize: ui.text.xs,
      overflowY: 'auto',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: ui.colors.cyan,
      borderTop: ui.border.faint,
    },
    timelineBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '1vw',
      padding: '0.8vh 1.2vw',
      backgroundColor: ui.colors.glassBg,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: ui.border.hair,
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
      borderRadius: ui.radius.lg,
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.xs,
      letterSpacing: '1px',
      zIndex: 20,
      position: 'fixed',
      left: '1.2vw',
      right: '1.2vw',
      bottom: '1.2vh',
    },
    timelineBtn: {
      background: 'none',
      padding: '4px 10px',
      borderRadius: 4,
      cursor: 'pointer',
      fontFamily: ui.font.orbitron,
      fontSize: ui.text.xs,
      letterSpacing: '1px',
    },
    timelineBtnCyan: {
      border: '1px solid rgba(73, 238, 242, 0.5)',
      color: ui.colors.cyan,
    },
    timelineBtnRed: {
      border: '1px solid rgba(239, 68, 68, 0.5)',
      color: ui.colors.red,
    },
    timelineTextDim: {
      color: 'rgba(159, 168, 175, 0.9)',
    },
    timelineTrack: {
      flex: 1,
      height: '6px',
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderRadius: 3,
      cursor: 'pointer',
      position: 'relative',
    },
    timelineFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      backgroundColor: ui.colors.cyan,
      borderRadius: 3,
      pointerEvents: 'none',
    },
    timelineSpeedLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'rgba(159, 168, 175, 0.9)',
    },
    timelineNumberInput: {
      width: 48,
      padding: '2px 6px',
      backgroundColor: 'rgba(0,0,0,0.4)',
      border: '1px solid rgba(159, 168, 175, 0.3)',
      borderRadius: 4,
      color: ui.colors.cyan,
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
      fontFamily: ui.font.orbitron,
      color: ui.colors.gray,
    },
    replayErrorTitle: {
      margin: 0,
      color: ui.colors.red,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontSize: ui.text.xl,
    },
    replayErrorText: {
      marginTop: 12,
      maxWidth: '900px',
      textAlign: 'center',
      color: 'rgba(159, 168, 175, 0.9)',
      fontFamily: ui.font.mono,
      fontSize: ui.text.md,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    replayExitBtn: {
      marginTop: 24,
      padding: '8px 20px',
      borderRadius: 6,
      border: `1px solid ${ui.colors.red}`,
      background: 'transparent',
      color: ui.colors.red,
      cursor: 'pointer',
      fontFamily: ui.font.orbitron,
      letterSpacing: '2px',
    },
    replayLoadingText: {
      color: ui.colors.gray,
      fontFamily: ui.font.orbitron,
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    statLine: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: ui.text.xs,
      fontFamily: ui.font.mono,
      marginBottom: '2px',
      borderBottom: '1px solid rgba(159, 168, 175, 0.08)',
      color: ui.colors.gray,
    },
  },

  archiveFilters: {
    divider: {
      width: '1px',
      height: '55%',
      backgroundColor: 'rgba(159, 168, 175, 0.16)',
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
        color: 'rgba(159, 168, 175, 0.5)',
        fontFamily: ui.font.orbitron,
        fontSize: ui.text.md,
        letterSpacing: '2px',
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
        color: 'rgba(159, 168, 175, 0.5)',
        fontFamily: ui.font.orbitron,
        fontSize: ui.text.md,
        letterSpacing: '2px',
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

