import React from 'react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { useTheme } from "../../styles/ThemeContext.jsx";

const SchemaCard = ({ schema, onEdit, onDelete, hideActions = false }) => {
  const title = schema.mission_metadata?.name || "—";
  const subtitle = schema.mission_metadata?.vessel_id || "—";

  const { styles: uiStyles } = useTheme();
  const styles = uiStyles.telemetry.schemaCard;

  const handleCardClick = () => {
    if (hideActions || !onEdit) return;
    onEdit(schema);
  };

  return (
    <Card
      style={styles.card}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#49EEF2')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(159, 168, 175, 0.2)')}
      onClick={handleCardClick}
    >
      <div>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>

      <div style={styles.footer}>
        <span style={{ fontSize: '9px', color: '#9FA8AF' }}>{schema.date || ''}</span>

        {!hideActions && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              size="sm"
              variant="outline"
              outlineColor="#F87171"
              textColor="#F87171"
              hoverBackgroundColor="rgba(248, 113, 113, 0.1)"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete ${title}?`)) onDelete?.(schema.id);
              }}
            >
              DELETE
            </Button>

            <Button
              size="sm"
              variant="outline"
              outlineColor="#49EEF2"
              textColor="#49EEF2"
              hoverBackgroundColor="rgba(73, 238, 242, 0.08)"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(schema);
              }}
            >
              CONFIGURE
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SchemaCard;