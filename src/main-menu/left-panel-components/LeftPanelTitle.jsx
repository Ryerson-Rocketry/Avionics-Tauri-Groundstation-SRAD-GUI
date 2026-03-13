import React from 'react';
import { useTheme } from "../../styles/ThemeContext.jsx";
import { labels } from '../../config/labels.jsx';

const RocketLogo = () => {
    const { styles: uiStyles } = useTheme();
    const styles = uiStyles.leftPanelTitle;

    return (
        <div style={styles.container}>
            <div style={styles.titleRow}>
                <h1 style={styles.rocketText}>{labels.app.titlePrimary}</h1>
                <h1 style={styles.viewText}>{labels.app.titleSecondary}</h1>
            </div>
            <p style={styles.subtitle}>{labels.app.subtitle}</p>
        </div>
    );
};

export default RocketLogo;