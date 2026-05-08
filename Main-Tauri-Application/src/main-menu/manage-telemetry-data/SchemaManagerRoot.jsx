import React, { useState, useEffect, useRef } from 'react';
import { invoke } from "@tauri-apps/api/core";
import SchemaActions from './SchemaActions';
import SchemaCreator from "./SchemaCreator";
import SchemaList from "./components/SchemaList.jsx";
import { useTheme } from "../../styles/ThemeContext.jsx";

const SchemaManagerRoot = () => {
  const { styles: uiStyles } = useTheme();
  const [view, setView] = useState('LIST');
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [schemas, setSchemas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  // FETCH ON MOUNT: Reloads every time the user enters this view
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const data = await invoke('load_schemas');
      setSchemas(data);
    } catch (err) {
      console.error("Disk Load Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (finalSchema) => {
    try {
      await invoke('save_schema', { schema: finalSchema });
      await fetchProfiles(); // Refresh list from disk
      setView('LIST');
      setSelectedSchema(null);
    } catch (err) {
      alert("FS_ERROR: Failed to commit schema to hardware storage.");
    }
  };

  const handleDelete = async (schemaId) => {
    if (!window.confirm("ARE YOU SURE? THIS WILL PERMANENTLY ERASE THIS SCHEMA FROM DISK.")) return;

    try {
      await invoke('delete_schema', { id: schemaId });
      await fetchProfiles();
      console.log(`Resource ${schemaId} decommissioned.`);
    } catch (err) {
      console.error("Deletion failed:", err);
      alert("SYSTEM ERROR: Could not erase file from storage.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const uploaded = JSON.parse(evt.target.result);
        setSelectedSchema(uploaded);
        setView('EDITOR');
      } catch (err) {
        alert("JSON_DECODE_ERROR: File integrity check failed.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const styles = uiStyles.telemetryManager;

  if (view === 'EDITOR') {
    return (
      <div style={styles.container}>
        <SchemaCreator
          initialData={selectedSchema}
          onSave={handleSave}
          onCancel={() => { setView('LIST'); setSelectedSchema(null); }}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json" onChange={handleFileChange} />

      <h2 style={styles.header}>TELEMETRY SCHEMA REPOSITORY</h2>

      <SchemaActions
        onCreate={() => { setSelectedSchema(null); setView('EDITOR'); }}
        onUpload={() => fileInputRef.current.click()}
      />

      {isLoading ? (
        <div style={{color: '#49EEF2', fontFamily: 'monospace'}}>SCANNING DIRECTORY...</div>
      ) : (
        <div style={styles.grid}>
          <SchemaList
            schemas={schemas}
            onEdit={(schema) => { setSelectedSchema(schema); setView('EDITOR'); }}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default SchemaManagerRoot;