import React from 'react';
import Card from "../../../components/Card.jsx";
import ActionStrip from "../action-buttons/ActionStrip.jsx";
import ShuttleIcon1 from "../../../mission-icons/icon1.jsx";
import { useTheme } from "../../../styles/ThemeContext.jsx";
// import ShuttleIcon2 from "../../mission-icons/icon2.jsx";
// import ShuttleIcon3 from "../../mission-icons/icon3.jsx";

const ProfileEntry = ({
  iconIndex = 1,
  missionName = "",
  date = "",
  notes = "",
  iconColor = "#49EEF2FF",
  onReplay,
  onDelete
}) => {
  const { styles: uiStyles } = useTheme();
  const IconComponent = {
    1: ShuttleIcon1,
    // 2: ShuttleIcon2,
    // 3: ShuttleIcon3
  }[iconIndex] || ShuttleIcon1;

  const styles = uiStyles.profileEntry(iconColor);

  return (
    <Card
      style={{
        width: 'auto',
        height: 'max(8vh, 64px)',
        margin: '1vh 1.5vw',
        padding: '0 2vw',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div style={styles.rowContent}>

        {/* Col 1: Icon */}
        <div style={styles.iconSection}>
          <IconComponent color={iconColor} size="50px" iconSize="60%" />
        </div>

        {/* Col 2: Name */}
        <div style={styles.nameSection}>
          {missionName}
        </div>

        {/* Col 3: Date */}
        <div style={styles.dateSection}>
          [{date}]
        </div>

        {/* Col 4: Notes */}
        <div style={styles.notesSection}>
          {notes}
        </div>

        {/* Col 5: Actions */}
        <div style={styles.actionSection}>
          <ActionStrip onReplay={onReplay} onDelete={onDelete} />
        </div>

      </div>
    </Card>
  );
};

export default ProfileEntry;