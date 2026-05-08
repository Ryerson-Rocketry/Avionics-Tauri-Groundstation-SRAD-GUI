import React, { useMemo } from 'react';
import { useTheme } from '../styles/ThemeContext.jsx';

const BackgroundEffect = () => {
  const starCount = 600;

  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  const { styles: uiStyles } = useTheme();
  const styles = uiStyles.backgroundEffect;

  return (
    <div style={styles.container}>
      <style>
        {`
          /* Slow growth and drifting motion for the blurred nebula background */
          @keyframes nebulaPulse {
            0% { transform: scale(1) translate(0, 0); }
            50% { transform: scale(1.1) translate(-1%, 1%); }
            100% { transform: scale(1.05) translate(1%, -1%); }
          }

          @keyframes individualTwinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          @keyframes shipFly {
            0% { transform: translate(-20vw, 40vh) rotate(-5deg); opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { transform: translate(120vw, 20vh) rotate(-5deg); opacity: 0; }
          }
        `}
      </style>

      {stars.map((s) => (
        <div key={s.id} style={styles.star(s)} />
      ))}

      <div style={{ ...styles.ship, animation: 'shipFly 15s linear infinite', animationDelay: '2s' }} />
      <div style={{ ...styles.ship, animation: 'shipFly 25s linear infinite', animationDelay: '12s', top: '20%' }} />
    </div>
  );
};

export default BackgroundEffect;