import React from 'react';
import { useTheme } from "../../styles/ThemeContext.jsx";
import { labels } from '../../config/labels.jsx';

import logo from '../../../assets/rocketry_logo.png';
const RocketLogo = () => {
    const { styles: uiStyles } = useTheme();
    const styles = uiStyles.leftPanelTitle;

    return (
        <div style={styles.container}>
            <img width={100} src={logo} alt="Logo" />;
            <div style={styles.titleRow}>
                <h1 style={styles.rocketText}>SRAD Groundstation</h1>
                <br/>
                <div style={styles.subheader}>MetRocketry Telemetry GUI</div>
            </div>
            <p style={styles.subtitle}>Avionics Mission Control</p>
        </div>
    );
};

export default RocketLogo;