import React from 'react';

const ShuttleIcon1 = ({
  color = '#49EEF2FF', // Default Neon Cyan
  size = '100px',      // Default container size
  iconSize = '60%'     // How big the shuttle is inside the circle
}) => {
  const styles = {
    container: {
      width: size,
      height: size,
      /* 1. Rounded darker gray background */
      backgroundColor: '#1A1B1F', // Darker gray for contrast
      borderRadius: '50%',          // Perfect circle

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      /* Optional: A subtle matching glow for the container */
      boxShadow: `0 0 15px ${color}33`, // 33 = ~20% opacity glow
      border: `1px solid ${color}22`,  // Very faint border
    },
    svg: {
      width: iconSize,
      height: iconSize,
    }
  };

  return (
    <div style={styles.container}>
      {/* 2. SVG for the wireframe shuttle */}
      <svg
        viewBox="0 0 24 24"
        style={styles.svg}
        fill="none" // No fill for a wireframe
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          // Custom Shuttle Path
          d="M12 2L8 8V12L4 14V17L8 16V19L12 22L16 19V16L20 17V14L16 12V8L12 2Z"

          /* 3. Stroke gives the wireframe its solid neon color */
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Detail Lines */}
        <path d="M8 8H16" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        <path d="M10 12H14" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

export default ShuttleIcon1;