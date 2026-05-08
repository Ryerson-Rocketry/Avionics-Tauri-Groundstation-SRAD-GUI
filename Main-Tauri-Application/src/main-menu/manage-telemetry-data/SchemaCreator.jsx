import React, { useState, useEffect } from 'react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { useTheme } from "../../styles/ThemeContext.jsx";
import DataMapField from './DataMapField';

const SchemaCreator = ({ initialData, onSave, onCancel, readOnly = false }) => {
  const [schema, setSchema] = useState({
    mission_metadata: { name: '', vessel_id: '' },
    features: { enable_3d_view: false, enable_map_view: false, enable_terminal: true },
    data_map: [],
  });

  useEffect(() => {
    if (initialData) setSchema(initialData);
  }, [initialData]);

  const updateFeature = (key) => {
    if (readOnly) return;
    setSchema({ ...schema, features: { ...schema.features, [key]: !schema.features[key] } });
  };

  const { tokens: ui, styles: uiStyles } = useTheme();

  const addDataField = () => {
    const newField = {
      source_key: '',
      label: '',
      unit: '',
      type: 'float',
      mapping: null,
      visualizers: {
        time_series: true,
        stats: [],
        show_in_terminal: false
      }
    };
    setSchema({ ...schema, data_map: [...schema.data_map, newField] });
  };

  const styles = uiStyles.telemetryCreator;

  return (
    <div style={styles.container}>
      <h2
        style={{
          letterSpacing: '4px',
          borderLeft: `4px solid ${ui.colors.cyan}`,
          paddingLeft: '1vw',
          marginBottom: '4vh',
          fontSize: ui.text.xl,
        }}
      >
        {initialData ? 'EDIT MISSION PROFILE' : 'NEW API SCHEMA PROFILE'}
      </h2>

      {/* 01. IDENTITY SECTION */}
      <Card style={styles.section}>
        <div style={styles.title}><span style={{color: '#49EEF2'}}>01</span> IDENTITY</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{flex: 1}}>
            <label style={styles.inputLabel}>SCHEMA NAME</label>
            <input
              style={styles.roundedInput}
              placeholder="e.g. PROJECT_ICARUS_STARK_1"
              value={schema.mission_metadata.name}
              onChange={
                readOnly
                  ? undefined
                  : (e) =>
                      setSchema({
                        ...schema,
                        mission_metadata: {
                          ...schema.mission_metadata,
                          name: e.target.value,
                        },
                      })
              }
              disabled={readOnly}
            />
          </div>
          <div style={{flex: 1}}>
            <label style={styles.inputLabel}>NOTES / VESSEL ID</label>
            <input
              style={styles.roundedInput}
              placeholder="e.g. STARK-01"
              value={schema.mission_metadata.vessel_id}
              onChange={
                readOnly
                  ? undefined
                  : (e) =>
                      setSchema({
                        ...schema,
                        mission_metadata: {
                          ...schema.mission_metadata,
                          vessel_id: e.target.value,
                        },
                      })
              }
              disabled={readOnly}
            />
          </div>
        </div>
      </Card>

      {/* 02. SYSTEM FEATURES */}
      <Card style={styles.section}>
        <div style={styles.title}><span style={{color: '#49EEF2'}}>02</span> CORE MODULES</div>
        {[
          { id: 'enable_3d_view', label: '3D ATTITUDE VISUALIZER', note: 'Requires: Quaternion (w,x,y,z) or Euler (p,r,y) keys in Data Map.' },
          { id: 'enable_map_view', label: 'RECOVERY MAP', note: 'Requires: Global Positioning (lat, lon) keys in Data Map.' },
          { id: 'enable_terminal', label: 'SYSTEM TERMINAL', note: 'Global switch for terminal output window.' }
        ].map(feat => (
          <div key={feat.id} style={styles.featureRow}>
            <input
              type="checkbox"
              checked={schema.features[feat.id]}
              onChange={readOnly ? undefined : () => updateFeature(feat.id)}
              style={{accentColor: '#49EEF2', transform: 'scale(1.5)', cursor: 'pointer'}}
              disabled={readOnly}
            />
            <div>
              <div style={{ fontSize: ui.text.md, color: ui.colors.white }}>{feat.label}</div>
              <div style={styles.infoNote}>{feat.note}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* 03. TELEMETRY MAPPING */}
      <Card style={styles.section}>
        <div style={styles.title}><span style={{color: '#49EEF2'}}>03</span> TELEMETRY MAPPING</div>
        <div style={{maxHeight: '45vh', overflowY: 'auto', paddingRight: '10px'}}>
          {schema.data_map.length === 0 && (
             <p style={{
               color: 'rgba(159, 168, 175, 0.5)',
               fontSize: ui.text.md,
               textAlign: 'center',
               padding: '2vh'
             }}>
               No telemetry keys defined.
             </p>
          )}
          {schema.data_map.map((field, idx) => (
            <DataMapField
              key={idx}
              entry={field}
              updateField={(key, val) => {
                if (readOnly) return;
                const newMap = [...schema.data_map];
                newMap[idx][key] = val;
                setSchema({ ...schema, data_map: newMap });
              }}
              removeField={
                readOnly
                  ? undefined
                  : () =>
                      setSchema({
                        ...schema,
                        data_map: schema.data_map.filter((_, i) => i !== idx),
                      })
              }
              readOnly={readOnly}
            />
          ))}
        </div>

        {!readOnly && (
          <Button
            fullWidth
            size="lg"
            variant="outline"
            outlineColor="#49EEF2"
            textColor="#49EEF2"
            borderStyle="dashed"
            backgroundColor="rgba(73, 238, 242, 0.03)"
            hoverBackgroundColor="rgba(73, 238, 242, 0.08)"
            style={styles.addButton}
            onClick={addDataField}
          >
            + ATTACH NEW TELEMETRY KEY
          </Button>
        )}
      </Card>

      {!readOnly && (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end', paddingBottom: '4vh' }}>
          <Button variant="ghost" size="md" outlineColor="#9FA8AF" textColor="#9FA8AF" onClick={onCancel}>
            CANCEL
          </Button>
          <Button
            variant="solid"
            size="md"
            outlineColor="#49EEF2"
            textColor="#000"
            glow
            onClick={() => onSave(schema)}
          >
            {initialData ? 'SAVE CHANGES' : 'INITIALIZE SCHEMA'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchemaCreator;