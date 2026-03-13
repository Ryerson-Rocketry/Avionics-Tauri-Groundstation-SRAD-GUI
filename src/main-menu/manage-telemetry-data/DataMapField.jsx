import React from 'react';
import { useTheme } from "../../styles/ThemeContext.jsx";

const DataMapField = ({ entry, updateField, removeField, readOnly = false }) => {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const types = ['float', 'int', 'string', 'bool', 'quaternion', 'gps_coord'];
  const units = ['m', 'm/s', 'm/s²', 'deg', 'rad', 'Pa', 'C', 'V', 'A'];
  // Removed 'backend_message' from mappings as it's now a toggle
  const mappings = [null, 'z_axis', 'latitude', 'longitude', 'tilt_x', 'tilt_y'];
  const statsList = ['min', 'mean', 'median', 'max', 'var', 'std'];

  const toggleStat = (stat) => {
    if (readOnly) return;
    const current = entry.visualizers.stats || [];
    const next = current.includes(stat) ? current.filter(s => s !== stat) : [...current, stat];
    updateField('visualizers', { ...entry.visualizers, stats: next });
  };

  const styles = uiStyles.telemetryDataField;

  return (
    <div style={styles.row}>
      {!readOnly && (
        <button onClick={removeField} style={styles.removeBtn}>✕</button>
      )}

      <div style={styles.grid}>
        <div style={styles.inputWrapper}>
          <label style={styles.label}>SOURCE KEY</label>
          <input
            style={styles.input}
            value={entry.source_key}
            onChange={readOnly ? undefined : (e) => updateField('source_key', e.target.value)}
            placeholder="telemetry.alt"
            disabled={readOnly}
          />
        </div>
        <div style={styles.inputWrapper}>
          <label style={styles.label}>DISPLAY LABEL</label>
          <input
            style={styles.input}
            value={entry.label}
            onChange={readOnly ? undefined : (e) => updateField('label', e.target.value)}
            placeholder="Altitude"
            disabled={readOnly}
          />
        </div>
        <div style={styles.inputWrapper}>
          <label style={styles.label}>DATA TYPE</label>
          <select
            style={styles.input}
            value={entry.type}
            onChange={readOnly ? undefined : (e) => updateField('type', e.target.value)}
            disabled={readOnly}
          >
             {types.map(t => <option key={t} value={t} style={{background: '#1A1B1F'}}>{t.toUpperCase()}</option>)}
          </select>
        </div>
        <div style={styles.inputWrapper}>
          <label style={styles.label}>UNIT</label>
          <input
            list="unit-list"
            style={styles.input}
            value={entry.unit}
            onChange={readOnly ? undefined : (e) => updateField('unit', e.target.value)}
            placeholder="m"
            disabled={readOnly}
          />
          <datalist id="unit-list">{units.map(u => <option key={u} value={u}/>)}</datalist>
        </div>
        <div style={styles.inputWrapper}>
          <label style={styles.label}>SYSTEM MAPPING</label>
          <select
            style={styles.input}
            value={entry.mapping || ''}
            onChange={readOnly ? undefined : (e) => updateField('mapping', e.target.value || null)}
            disabled={readOnly}
          >
            <option value="" style={{background: '#1A1B1F'}}>GENERIC</option>
            {mappings.filter(m => m !== null).map(m => (
              <option key={m} value={m} style={{background: '#1A1B1F'}}>{m.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(159, 168, 175, 0.1)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* TIME SERIES TOGGLE */}
          <label style={{ ...styles.iconToggle, color: entry.visualizers.time_series ? '#49EEF2' : '#666' }}>
            <input
              type="checkbox"
              checked={entry.visualizers.time_series}
              onChange={
                readOnly
                  ? undefined
                  : (e) =>
                      updateField('visualizers', {
                        ...entry.visualizers,
                        time_series: e.target.checked,
                      })
              }
              style={{ accentColor: '#49EEF2' }}
              disabled={readOnly}
            />
            📈 GRAPH
          </label>

          {/* TERMINAL TOGGLE */}
          <label style={{ ...styles.iconToggle, color: entry.visualizers.show_in_terminal ? '#49EEF2' : '#666' }}>
            <input
              type="checkbox"
              checked={entry.visualizers.show_in_terminal || false}
              onChange={
                readOnly
                  ? undefined
                  : (e) =>
                      updateField('visualizers', {
                        ...entry.visualizers,
                        show_in_terminal: e.target.checked,
                      })
              }
              style={{ accentColor: '#49EEF2' }}
              disabled={readOnly}
            />
            📟 TERMINAL
          </label>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8vw' }}>
          {statsList.map(s => (
            <label
              key={s}
              style={{
                fontSize: ui.text.xs,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4vw',
                cursor: 'pointer',
                color: entry.visualizers.stats?.includes(s) ? '#FFF' : '#666',
              }}
              >
                <input
                  type="checkbox"
                  checked={entry.visualizers.stats?.includes(s)}
                  onChange={readOnly ? undefined : () => toggleStat(s)}
                  style={{ accentColor: '#49EEF2' }}
                  disabled={readOnly}
                />
              {s.toUpperCase()}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataMapField;