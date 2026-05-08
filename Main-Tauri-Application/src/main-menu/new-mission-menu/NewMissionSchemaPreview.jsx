import React from 'react';
import SchemaCreator from '../manage-telemetry-data/SchemaCreator.jsx';
import { useTheme } from "../../styles/ThemeContext.jsx";

// Read-only schema details panel reused on the New Mission screen.
// Shows the same layout as the Configure view, but without edit actions.

const NewMissionSchemaPreview = ({ selectedSchema, open, onToggle }) => {
  if (!selectedSchema) return null;

  const { styles: uiStyles } = useTheme();
  const styles = uiStyles.newMission;

  return (
    <> 
      <button
        type="button"
        style={styles.schemaPreviewToggle}
        onClick={onToggle}
      >
        {open ? 'Hide schema details' : 'View schema details'}
      </button>
    
      {open && (
            <SchemaCreator
              initialData={selectedSchema}
              readOnly
              onSave={() => {}}
              onCancel={onToggle}
            />
      )}
    </>
  );
};

export default NewMissionSchemaPreview;

