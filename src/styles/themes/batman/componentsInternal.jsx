// Internal component-level style groups, built on tokens.
// THEME: GOTHAM UNDER SIEGE v7.0 - "ARKHAM PROTOCOL"

import { ui } from './tokens.jsx';

// Shared helpers for style computation
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

// THEME CONSTANTS - DC UNIVERSE EXPANSION
const BAT_GOLD = '#D4AF37';
const GOTHAM_BLACK = '#050505';
const JOKER_GREEN = '#4ECB71';
const JOKER_PURPLE = '#6D21A3';
const ROBIN_RED = '#BE0000';
const CATWOMAN_PURPLE = '#2D1B4E';
const NIGHTWING_BLUE = '#0057B8';
const DANGER_RED = '#8B0000';

const shared = {
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitronMain: {
    fontFamily: ui.font.orbitron,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  // SCROLLBAR UTILITY - FIXED MISSING SCROLLBARS
  customScroll: {
    scrollbarWidth: 'thin',
    scrollbarColor: `${BAT_GOLD} #000`,
    '&::-webkit-scrollbar': { width: '8px' },
    '&::-webkit-scrollbar-track': { background: '#000' },
    '&::-webkit-scrollbar-thumb': {
      background: `linear-gradient(180deg, ${BAT_GOLD}, ${ROBIN_RED})`,
      borderRadius: '0px',
      boxShadow: `0 0 10px ${rgbaFrom(BAT_GOLD, 0.5)}`
    },
  },
  // WAYNE TECH TACTICAL INTERFACE
  glass: {
    backgroundColor: 'rgba(5, 6, 8, 0.3)',
    backdropFilter: 'blur(30px)',
    border: `1px solid ${rgbaFrom(BAT_GOLD, 0.4)}`,
    boxShadow: `0 0 60px rgba(0,0,0,1), inset 0 0 20px ${rgbaFrom(BAT_GOLD, 0.05)}`,
    backgroundImage: `
      repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px),
      linear-gradient(${rgbaFrom(BAT_GOLD, 0.05)} 1px, transparent 1px),
      linear-gradient(90deg, ${rgbaFrom(BAT_GOLD, 0.05)} 1px, transparent 1px)
    `,
    backgroundSize: '100% 2px, 50px 50px, 50px 50px',
    position: 'relative',
    overflow: 'hidden',
  },
  inputBase: {
  width: '100%',
  backgroundColor: 'rgba(5, 6, 8, 0.4)', // Changed from solid #010101
  backdropFilter: 'blur(10px)', // Added for glass effect
  border: `1px solid ${rgbaFrom(BAT_GOLD, 0.2)}`,
  borderRadius: '0px',
  color: '#FFF',
  fontFamily: ui.font.mono,
  outline: 'none',
  boxSizing: 'border-box',
  boxShadow: 'inset 0 0 20px rgba(0,0,0,1)',
  borderLeft: `4px solid ${BAT_GOLD}`,
},
  headerBase: {
    color: BAT_GOLD,
    letterSpacing: '10px',
    borderLeft: `10px solid ${BAT_GOLD}`,
    paddingLeft: '1.5vw',
    fontSize: ui.text.xl,
    fontFamily: ui.font.orbitron,
    textShadow: `0 0 20px ${rgbaFrom(BAT_GOLD, 0.4)}`,
  },
};

const BUTTON_SIZE = {
  sm: { padding: '0.8vh 14px', fontSize: ui.text.sm, borderRadius: '0px' },
  md: { padding: '1.0vh 18px', fontSize: ui.text.md, borderRadius: '0px' },
  lg: { padding: '1.2vh 24px', fontSize: ui.text.lg, borderRadius: '0px' },
};

function computeButtonStyle({
  size = 'md',
  variant = 'outline',
  outlineColor = BAT_GOLD,
  textColor,
  backgroundColor,
  hoverBackgroundColor,
  borderStyle = 'solid',
  glow = true,
  fullWidth = false,
  disabled = false,
  isHovered = false,
  extraStyle = {},
} = {}) {
  const resolvedTextColor = textColor || (variant === 'solid' ? '#000' : outlineColor);
  const baseBg = backgroundColor || (variant === 'solid' ? outlineColor : 'transparent');
  const hoverBg = hoverBackgroundColor || (variant === 'solid' ? rgbaFrom(outlineColor, 0.9) : rgbaFrom(outlineColor, 0.15));
  const sizeStyle = BUTTON_SIZE[size] || BUTTON_SIZE.md;

  return {
    ...shared.flexCenter,
    ...shared.orbitronMain,
    gap: '12px',
    width: fullWidth ? '100%' : undefined,
    background: isHovered && !disabled ? hoverBg : baseBg,
    color: disabled ? '#222' : resolvedTextColor,
    border: `1px ${borderStyle} ${rgbaFrom(outlineColor, 0.3)}`,
    borderLeft: `6px solid ${isHovered ? ROBIN_RED : outlineColor}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
    boxShadow: glow && isHovered ? `0 0 30px ${rgbaFrom(outlineColor, 0.4)}` : 'none',
    clipPath: 'polygon(12% 0, 100% 0, 100% 70%, 88% 100%, 0 100%, 0% 30%)',
    ...sizeStyle,
    ...extraStyle,
  };
}

export const uiStyles = {
  app: {
    wrapper: { margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' },
    text: { color: '#C0C0C0' },
  },

  card: {
    base: {
      ...shared.glass,
      padding: '3vh 2vw',
      borderTop: `8px solid ${BAT_GOLD}`,
      boxShadow: `0 20px 40px rgba(0,0,0,0.8), inset 0 -5px 15px ${rgbaFrom(JOKER_GREEN, 0.1)}`,
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
    backgroundColor: '#020202',
    backgroundImage: `
      linear-gradient(to bottom, transparent 60%, #000 100%),
      repeating-linear-gradient(transparent, transparent 50px, rgba(255, 255, 255, 0.02) 50px, rgba(255, 255, 255, 0.02) 51px),
      url('/backgrounds/batman_background.png')
    `,
    backgroundSize: '100% 100%, 100% 100%, cover',
    backgroundPosition: 'center',
    zIndex: -2,
  },
  overlay: {
    position: 'absolute',
    inset: -1000,
    // The backdropFilter blurs the image in the container behind this div
    backdropFilter: 'blur(12px) brightness(0.8)',
    background: `radial-gradient(circle at 30% 30%, ${rgbaFrom(BAT_GOLD, 0.2)} 0%, transparent 25%)`,
    animation: 'spotlightMove 25s infinite alternate ease-in-out',
    zIndex: -1,
    // filter: 'blur(120px)' is removed as backdropFilter handles the atmospheric softening better here
  },
},

  backgroundEffect: {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: -1,
    // Darker overlay: increased black overlay and reduced gold radial intensity
    backgroundImage: `
      linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)),
      radial-gradient(circle at 50% 30%, ${rgbaFrom(BAT_GOLD, 0.05)} 0%, transparent 60%)
    `,
  },
  star: (s) => ({
    position: 'absolute',
    top: s.top,
    left: s.left,
    width: '1px',
    height: '60px',
    // Static Rain: Pure Blue streaks with no animation
    background: `linear-gradient(to bottom, transparent, ${rgbaFrom(NIGHTWING_BLUE, 0.2)})`,
    opacity: 0.7,
    filter: 'blur(0.5px)',
    pointerEvents: 'none',
  }),
  ship: {
    position: 'absolute',
    width: '280px',
    height: '160px',
    zIndex: 2,
    pointerEvents: 'none',
    backgroundImage: `
      url('https://www.transparenttextures.com/patterns/stardust.png'),
      radial-gradient(ellipse at center, ${rgbaFrom(BAT_GOLD, 0.6)} 0%, ${rgbaFrom(BAT_GOLD, 0.3)} 50%, transparent 80%)
    `,
    backgroundColor: 'transparent',
    borderRadius: '50%',
    WebkitMaskImage: `
      linear-gradient(#000, #000), 
      url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='M0 40 L10 10 L25 40 L50 0 L75 40 L90 10 L100 40 L50 100 Z'/></svg>")
    `,
    maskImage: `
      linear-gradient(#000, #000), 
      url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='M0 40 L10 10 L25 40 L50 0 L75 40 L90 10 L100 40 L50 100 Z'/></svg>")
    `,
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: '100% 100%, 75% 60%',
    filter: `
      blur(3px) 
      drop-shadow(0 0 30px ${rgbaFrom(BAT_GOLD, 0.4)})
      drop-shadow(0 0 10px ${rgbaFrom(JOKER_PURPLE, 0.2)})
      contrast(1.2)
    `,
    animation: 'shipFly 15s linear infinite, batFlicker 4s infinite alternate ease-in-out',
  },
},

  mainMenu: {
    appContainer: { display: 'flex', width: '100vw', height: '100vh', position: 'relative' },
    blankState: { ...shared.flexCenter, flexGrow: 1 },
    placeholderText: {
      ...shared.orbitronMain,
      color: 'rgba(212, 175, 55, 0.02)',
      fontSize: '18vw',
      pointerEvents: 'none',
      fontWeight: '900',
      textShadow: `2px 2px 10px ${rgbaFrom(JOKER_GREEN, 0.05)}`,
    },
    jokerLaugh: {
      fontFamily: '"Permanent Marker", cursive',
      color: JOKER_GREEN,
      fontSize: '3rem',
      opacity: 0.08,
      position: 'absolute',
      bottom: '10%',
      right: '10%',
      textShadow: `4px 4px 0px ${rgbaFrom(JOKER_PURPLE, 0.3)}`,
      transform: 'rotate(-5deg)',
    }
  },

  leftPanel: {
    logoSection: {
      ...shared.flexCenter,
      margin: '4vh 0',
      width: '100%',
      filter: `drop-shadow(0 0 25px ${BAT_GOLD})`,
    },
    navMenu: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '0 1vw',
      flexGrow: 1,
      overflowY: 'auto',
      ...shared.customScroll,
    },
  },

  leftPanelBox: (opacity = 0.98) => ({
    sidebar: {
      ...shared.glass,
      backgroundColor: `rgba(2, 3, 5, ${opacity})`,
      width: '22vw',
      minWidth: '320px',
      height: '100vh',
      margin: 0,
      borderRadius: 0,
      borderRight: `3px solid ${BAT_GOLD}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '2vh 0',
      boxSizing: 'border-box',
    },
  }),

  settings: {
    container: {
      padding: '4vh 3vw',
      flexGrow: 1,
      color: BAT_GOLD,
      ...shared.orbitronMain,
      overflowY: 'auto',
      ...shared.customScroll
    },
    header: { ...shared.headerBase, marginBottom: ui.space.xl },
    section: {
      ...shared.glass, // Now uses the updated glass helper
      maxWidth: '900px',
      padding: '4vh 2.5vw',
      backgroundColor: 'rgba(0,0,0,0.6)', // Overriding for a moody look
      boxShadow: '0 0 40px rgba(0,0,0,1)'
    },
    row: {
      display: 'flex',
      flexDirection: 'column',
      gap: ui.space.sm,
      padding: '2.5vh 0',
      borderBottom: `1px solid ${rgbaFrom(BAT_GOLD, 0.1)}`
    },
    label: { ...shared.orbitronMain, fontSize: ui.text.sm, color: BAT_GOLD },
    displayBox: { ...shared.inputBase, padding: '1.4vh 1vw', color: '#888' },
    backBtn: { marginTop: '4vh' },
    loadingText: { color: BAT_GOLD, fontFamily: ui.font.mono, letterSpacing: '10px' },
  },

  schemaActions: {
    container: { display: 'flex', gap: '1.5vw', marginBottom: '3vh' },
  },

  archive: {
    centerWrapper: { display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '4vh 3vw', overflowY: 'auto', ...shared.customScroll },
    emptyState: {
      ...shared.glass,
      padding: '12vh 3vw',
      margin: '2vh',
      textAlign: 'center',
      color: '#333',
      ...shared.orbitronMain,
      border: `2px dashed ${rgbaFrom(BAT_GOLD, 0.2)}`,
    },
    actionStrip: { display: 'flex', gap: '0.8vw', alignItems: 'center', justifyContent: 'flex-end' },
  },

  profileEntry: (iconColor = BAT_GOLD) => ({
    rowContent: { display: 'flex', alignItems: 'center', width: '100%', height: '100%' },
    iconSection: { width: '5vw', minWidth: '56px', ...shared.flexCenter, color: BAT_GOLD, filter: `drop-shadow(0 0 10px ${BAT_GOLD})` },
    nameSection: {
      ...shared.orbitronMain,
      width: '20%',
      minWidth: '14vw',
      color: '#FFF',
      fontSize: ui.text.lg,
      textShadow: `0 0 15px ${rgbaFrom(BAT_GOLD, 0.5)}`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    dateSection: { width: '9vw', minWidth: '96px', fontFamily: ui.font.orbitron, color: iconColor, fontWeight: 'bold' },
    notesSection: { flexGrow: 1, fontFamily: ui.font.mono, color: 'rgba(255,255,255,0.3)', borderLeft: `2px solid ${rgbaFrom(BAT_GOLD, 0.1)}`, paddingLeft: '2vw', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis' },
    actionSection: { flexShrink: 0, marginLeft: '2vw' },
  }),

  archiveSearch: {
    barWrapper: {
      inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: '1vw' // Fixed icon spacing
      }
    },
    barInput: {
      color: '#FFF',
      fontFamily: ui.font.orbitron,
      letterSpacing: '4px',
      textTransform: 'uppercase',
      background: 'none',
      border: 'none',
      width: '100%',
      outline: 'none'
    },
    barStatus: {
      width: '16px',
      height: '16px',
      backgroundColor: BAT_GOLD,
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      boxShadow: `0 0 15px ${BAT_GOLD}`
    },
    tray: {
      height: '8vh',
      margin: '2vh 1.5vw 1vh 1.5vw',
      backgroundColor: 'rgba(5, 6, 8, 0.4)', // Glassy tray
      backdropFilter: 'blur(20px)',
      border: `1px solid ${BAT_GOLD}`,
      boxShadow: `0 0 30px ${rgbaFrom(BAT_GOLD, 0.1)}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 2vw',
    },
    iconContainer: {
      backgroundColor: 'transparent', // Transparent background
      border: `1px solid ${rgbaFrom(BAT_GOLD, 0.3)}`,
      padding: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
  },

  leftPanelTitle: {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5vh' },
    titleRow: { display: 'flex', gap: '0.8vw', alignItems: 'baseline' },
    rocketText: { ...shared.orbitronMain, color: BAT_GOLD, fontSize: ui.text.xl, textShadow: `0 0 25px ${BAT_GOLD}` },
    viewText: { ...shared.orbitronMain, color: '#FFF', fontSize: ui.text.xl },
    subtitle: { fontFamily: ui.font.mono, fontSize: '10px', color: '#333', letterSpacing: '12px', textTransform: 'uppercase', marginTop: '10px' },
  },

  leftPanelButton: (isActive) => ({
    button: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '6.5vh',
      cursor: 'pointer',
      border: 'none',
      borderLeft: isActive ? `6px solid ${ROBIN_RED}` : '6px solid transparent',
      backgroundColor: isActive ? 'rgba(190, 0, 0, 0.08)' : 'transparent',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      padding: 0,
      position: 'relative',
      overflow: 'hidden',
    },
    contentWrapper: { display: 'flex', alignItems: 'center', paddingLeft: '2.5vw', zIndex: 2 },
    icon: { color: isActive ? ROBIN_RED : '#444', fontSize: '3vh', marginRight: '1.2vw', filter: isActive ? `drop-shadow(0 0 10px ${ROBIN_RED})` : 'none' },
    text: { fontFamily: ui.font.orbitron, fontSize: '0.9rem', color: isActive ? '#FFF' : '#666', fontWeight: '900', letterSpacing: '3px' },
  }),

  telemetryEditor: {
    wrapper: { ...shared.flexCenter, flexDirection: 'column', height: '70vh', backgroundColor: '#000', border: `2px solid ${BAT_GOLD}`, boxShadow: `0 0 60px rgba(0,0,0,1)` },
    header: { padding: '15px 25px', backgroundColor: 'rgba(212, 175, 55, 0.1)', width: '100%', boxSizing: 'border-box', borderBottom: `1px solid ${BAT_GOLD}` },
    textArea: { flexGrow: 1, backgroundColor: 'transparent', color: BAT_GOLD, fontFamily: ui.font.mono, padding: '3vh', outline: 'none', border: 'none', width: '100%', fontSize: '1.1rem', lineHeight: '1.6', ...shared.customScroll },
  },

  telemetryCreator: {
    container: { color: BAT_GOLD, fontFamily: ui.font.orbitron, overflowY: 'auto', maxHeight: '80vh', ...shared.customScroll, paddingRight: '10px' },
    section: { marginBottom: ui.space.md },
    title: { fontSize: ui.text.lg, color: '#FFF', borderBottom: `4px solid ${BAT_GOLD}`, paddingBottom: '1vh', letterSpacing: '6px' },
    roundedInput: { ...shared.inputBase, padding: '1.6vh' },
    inputLabel: { fontSize: ui.text.xs, color: BAT_GOLD, textTransform: 'uppercase', marginBottom: '10px', fontWeight: 'bold' },
    featureRow: { display: 'flex', gap: '1vw', background: 'rgba(212, 175, 55, 0.05)', padding: '2.5vh', border: `1px solid ${rgbaFrom(BAT_GOLD, 0.2)}` },
    infoNote: { fontSize: '11px', color: '#444', fontFamily: ui.font.mono },
    addButton: { marginTop: '2vh' },
  },

  telemetryDataField: {
    row: { padding: '2.5vh', background: '#020202', border: `1px solid ${rgbaFrom(BAT_GOLD, 0.3)}`, marginBottom: '2vh', borderLeft: `4px solid ${ROBIN_RED}`, overflow: 'hidden' },
    grid: { display: 'flex', flexWrap: 'wrap', gap: '1.5vw' },
    inputWrapper: { display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 200px' },
    label: { fontSize: '11px', color: BAT_GOLD, fontWeight: 'bold' },
    input: { ...shared.inputBase, padding: '1vh' },
    removeBtn: { color: DANGER_RED, border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.4rem' },
    iconToggle: { color: BAT_GOLD, fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' },
  },

  telemetryManager: {
    container: { padding: '4vh 3vw', flexGrow: 1, overflowY: 'auto', ...shared.customScroll },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '4vh' },
    header: { ...shared.headerBase, marginBottom: '6vh' },
  },

  newMission: {
    container: { padding: '4vh 3vw', flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', ...shared.customScroll },
    header: { ...shared.headerBase, marginBottom: '5vh' },
    layout: { width: '100%', maxWidth: '1200px' },
    card: {
      ...shared.glass,
      padding: '6vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '4vh',
      borderTop: `10px solid ${BAT_GOLD}`,
      overflowY: 'auto',
    },
    section: { display: 'flex', flexDirection: 'column', gap: '2vh' },
    sectionTitle: { fontFamily: ui.font.orbitron, color: '#FFF', borderBottom: `2px solid ${rgbaFrom(BAT_GOLD, 0.3)}`, letterSpacing: '4px', paddingBottom: '10px' },
    row: { display: 'flex', gap: '2.5vw', flexWrap: 'wrap' },
    column: { flex: '1', minWidth: '300px' },
    label: { fontFamily: ui.font.orbitron, color: BAT_GOLD, fontSize: '12px', letterSpacing: '3px', fontWeight: 'bold' },
    input: { ...shared.inputBase, padding: '1.8vh', fontSize: '1.1rem' },
    select: { appearance: 'none', backgroundColor: '#000', color: BAT_GOLD, border: `1px solid ${BAT_GOLD}`, padding: '1.2vh' },
    helpText: { fontSize: '11px', color: '#444', fontFamily: ui.font.mono },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '15px', color: '#666', fontSize: '13px' },
    checkbox: { accentColor: BAT_GOLD, width: '20px', height: '20px' },
    textarea: { ...shared.inputBase, minHeight: '180px', padding: '1.8vh', lineHeight: '1.7' },
    footerRow: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '5vh' },
    startButton: { padding: '2.2vh 6vw', fontSize: '1.4rem' },
    startError: { color: DANGER_RED, fontSize: '14px', fontWeight: 'bold', marginTop: '12px' },
    schemaPreviewSection: { marginTop: '4vh' },
    schemaPreviewToggle: { color: BAT_GOLD, cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', fontSize: '13px' },
    schemaPreviewCardWrapper: { width: '100%', marginTop: '4vh' },
    schemaPreviewInner: { width: '100%' },
    startedContainer: { padding: '12vh' },
    startedCard: { ...shared.glass, padding: '10vh', textAlign: 'center', border: `4px solid ${BAT_GOLD}` },
    startedTitle: { ...shared.orbitronMain, color: BAT_GOLD, marginBottom: '5vh', fontSize: '2.5rem' },
    startedEndpointRow: { display: 'flex', justifyContent: 'center' },
    startedEndpoint: { padding: '4vh 8vw', border: `3px solid ${BAT_GOLD}`, color: '#FFF', fontFamily: ui.font.mono, fontSize: '3rem', background: '#000', boxShadow: `0 0 50px ${rgbaFrom(BAT_GOLD, 0.4)}` },
    startedSubtitle: { marginTop: '5vh', color: '#444', letterSpacing: '10px', textTransform: 'uppercase' },
  },

  telemetry: {
    schemaCard: {
      card: {
        ...shared.glass,
        padding: '4vh 2.5vw',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderLeft: `2px solid ${BAT_GOLD}`,
        ':hover': {
          transform: 'translateY(-10px)',
          boxShadow: `0 20px 50px rgba(0,0,0,1), 0 0 30px ${rgbaFrom(JOKER_GREEN, 0.2)}`,
          borderColor: JOKER_GREEN,
        }
      },
      title: { fontFamily: ui.font.orbitron, color: BAT_GOLD, fontSize: '1.6rem', letterSpacing: '3px' },
      subtitle: { fontFamily: ui.font.mono, color: '#555', fontSize: '0.9rem', marginTop: '10px' },
      footer: { marginTop: '4vh', borderTop: `1px solid ${rgbaFrom(BAT_GOLD, 0.15)}`, paddingTop: '2vh', display: 'flex', gap: '1.5vw', flexWrap: 'wrap' },
    },
  },

  telemetryDashboard: {
    container: { height: '100vh', backgroundColor: '#000', padding: '1.5vh', color: '#FFF', position: 'relative', overflow: 'hidden' },
    containerReplay: { height: '100vh', backgroundColor: '#000', padding: '1.5vh', paddingBottom: '12vh', overflow: 'hidden' },
    overlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' },
    startCard: { ...shared.glass, padding: '8vh', border: `4px solid ${BAT_GOLD}`, textAlign: 'center' },
    startCardTitle: { ...shared.orbitronMain, color: BAT_GOLD, fontSize: '2.2rem', marginBottom: '4vh' },
    dashboardGrid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gridTemplateRows: '1fr 1fr', gap: '2vh', height: '100%' },
    glassPane: { backgroundColor: 'rgba(2,3,5,0.99)', border: `1px solid ${rgbaFrom(BAT_GOLD, 0.4)}`, borderRadius: '0px', boxShadow: 'inset 0 0 40px rgba(0,0,0,1)', overflow: 'hidden' },
    cardHeader: { background: 'rgba(212,175,55,0.1)', color: BAT_GOLD, padding: '1.4vh 2vw', borderBottom: `3px solid ${BAT_GOLD}`, fontSize: '12px', fontWeight: 'bold', letterSpacing: '4px' },
    navBar: { height: '10vh', backgroundColor: '#000', border: `2px solid ${BAT_GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4vw', marginBottom: '2vh' },
    statLabel: { color: '#444', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '3px' },
    statValue: { color: BAT_GOLD, fontWeight: 'bold', fontSize: '1.6rem', fontFamily: ui.font.mono },
    terminal: { backgroundColor: '#000', color: BAT_GOLD, fontFamily: ui.font.mono, padding: '2.5vh', fontSize: '1rem', overflowY: 'auto', ...shared.customScroll },
    timelineBar: { position: 'fixed', bottom: '2vh', left: '2vw', right: '2vw', background: '#020202', border: `3px solid ${BAT_GOLD}`, padding: '2.5vh', display: 'flex', gap: '3vw', alignItems: 'center', zIndex: 100 },
    timelineBtn: { background: '#050505', border: `1px solid ${BAT_GOLD}`, color: BAT_GOLD, padding: '12px 30px', cursor: 'pointer', fontFamily: ui.font.orbitron, fontWeight: '900' },
    timelineBtnCyan: { border: `1px solid ${NIGHTWING_BLUE}`, color: NIGHTWING_BLUE },
    timelineBtnRed: { border: `3px solid ${DANGER_RED}`, color: DANGER_RED },
    timelineTextDim: { color: '#333', fontWeight: 'bold' },
    timelineTrack: { flex: 1, height: '8px', background: '#111', borderRadius: '0px', overflow: 'hidden' },
    timelineFill: { height: '100%', background: BAT_GOLD, boxShadow: `0 0 20px ${BAT_GOLD}` },
    timelineSpeedLabel: { color: '#555', fontSize: '11px', fontWeight: 'bold' },
    timelineNumberInput: { background: '#000', border: `1px solid ${BAT_GOLD}`, color: BAT_GOLD, width: '60px', padding: '8px', textAlign: 'center', fontFamily: ui.font.mono },
    replayWrapper: { position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' },
    replayOverlay: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, transparent, #000)' },
    replayErrorTitle: { color: DANGER_RED, fontSize: '4rem', textShadow: `0 0 30px ${DANGER_RED}`, fontWeight: '900' },
    replayErrorText: { color: '#666', marginTop: '4vh', fontSize: '1.4rem', fontFamily: ui.font.mono, maxWidth: '900px', textAlign: 'center' },
    replayExitBtn: { border: `4px solid ${DANGER_RED}`, color: DANGER_RED, padding: '2vh 5vw', marginTop: '6vh', background: 'none', cursor: 'pointer', fontWeight: '900', fontSize: '1.5rem' },
    replayLoadingText: { color: BAT_GOLD, letterSpacing: '25px', fontSize: '2rem', fontWeight: '900' },
    statLine: { display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${rgbaFrom(BAT_GOLD, 0.05)}`, padding: '12px 0', color: '#888', fontFamily: ui.font.mono },
  },

  archiveFilters: {
    divider: { width: '2px', height: '35px', backgroundColor: '#222', margin: '0 1.5vw' },
    missionName: {
      container: { display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' },
      label: { color: '#444', fontFamily: ui.font.orbitron, fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' },
      iconGroup: { display: 'flex', flexDirection: 'column', gap: '3px' },
    },
    created: {
      container: { display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' },
      label: { color: '#444', fontFamily: ui.font.orbitron, fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' },
      iconGroup: { display: 'flex', flexDirection: 'column', gap: '3px' },
    },
  },
};