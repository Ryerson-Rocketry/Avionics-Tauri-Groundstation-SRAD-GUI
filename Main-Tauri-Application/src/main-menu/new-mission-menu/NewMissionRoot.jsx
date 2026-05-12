import React, { useEffect, useRef, useState } from 'react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import NewMissionSchemaPreview from './NewMissionSchemaPreview.jsx';
import { useTheme } from "../../styles/ThemeContext.jsx";
import { invoke } from '@tauri-apps/api/core';

// User runs their Python WebSocket server first, then enters IP:port here.
// We try to connect; only when connection is established do we open the dashboard.

const CONNECT_TIMEOUT_MS = 8000;
const SAVE_CREATE_TIMEOUT_MS = 6000;

function withTimeout(promise, timeoutMs, timeoutMessage) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

const NewMissionRoot = ({ onMissionLinkReady }) => {
  const { tokens: ui, styles: uiStyles } = useTheme();
  const [missionName, setMissionName] = useState('');
  const [craftName, setCraftName] = useState('');
  const [savePath, setSavePath] = useState('Default RocketView saves location');
  const [schemaId, setSchemaId] = useState('');
  const [saveData, setSaveData] = useState(true);
  const [notes, setNotes] = useState('');

  const [telemetryIp, setTelemetryIp] = useState('127.0.0.1');
  const [telemetryPort, setTelemetryPort] = useState('8765');

  const [schemas, setSchemas] = useState([]);
  const [isLoadingSchemas, setIsLoadingSchemas] = useState(true);
  const [schemaPreviewOpen, setSchemaPreviewOpen] = useState(false);

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const [useDemoMode, setUseDemoMode] = useState(false);
  const [useImmediateStartMode, setUseImmediateStartMode] = useState(true);

  const wsRef = useRef(null);
  const connectTimeoutRef = useRef(null);

  const canConnect =
    //dont allow start unless these are filled in
    missionName.trim().length > 0 &&
    schemaId.trim().length > 0 &&
    telemetryIp.trim().length > 0 &&
    telemetryPort.trim().length > 0;

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        setIsLoadingSchemas(true);
        const data = await invoke('load_schemas');
        setSchemas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load schemas for new mission:', err);
        setSchemas([]);
      } finally {
        setIsLoadingSchemas(false);
      }
    };
    fetchSchemas();
  }, []);

  const selectedSchema = schemas.find((s) => String(s.id) === String(schemaId)) || null;

  const cleanupConnectAttempt = () => {
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.onopen = null;
        wsRef.current.onerror = null;
        wsRef.current.onclose = null;
        wsRef.current.onmessage = null;
        wsRef.current.close();
      } catch (_) {
        // ignore
      }
      wsRef.current = null;
    }
  };

  useEffect(() => {
    return () => cleanupConnectAttempt();
  }, []);

  const handleConnect = () => {
    if (!canConnect || isConnecting || typeof onMissionLinkReady !== 'function') return;

    const ip = telemetryIp.trim();
    const port = telemetryPort.trim();
    const url = `ws://${ip}:${port}`;

    setIsConnecting(true);
    setConnectionError(null);

    cleanupConnectAttempt();

    let ws;
    try {
      ws = new WebSocket(url);
    } catch (e) {
      setConnectionError('Invalid address. Please check the IP and port.');
      setIsConnecting(false);
      return;
    }
    wsRef.current = ws;

    connectTimeoutRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
        cleanupConnectAttempt();
        setConnectionError('Connection timed out. Is your Python WebSocket server running on ' + ip + ':' + port + '?');
        setIsConnecting(false);
      }
    }, CONNECT_TIMEOUT_MS);

    ws.onopen = async () => {
      cleanupConnectAttempt();
      setIsConnecting(false);
      setConnectionError(null);
      let saveDirName = null;
      if (saveData && selectedSchema) {
        try {
          saveDirName = await withTimeout(
            invoke('create_mission_save', {
              missionName: missionName.trim(),
              schema: selectedSchema,
            }),
            SAVE_CREATE_TIMEOUT_MS,
            'Save creation timed out. Try again.'
          );
        } catch (err) {
          const msg = typeof err === 'string' ? err : err?.message || String(err);
          setConnectionError(msg);
          return;
        }
      }
      onMissionLinkReady({
        ip,
        port,
        endpoint: `${ip}:${port}`,
        missionName: missionName.trim(),
        craftName: craftName.trim(),
        schema: selectedSchema,
        profile: selectedSchema,
        saveDirName: saveDirName ?? undefined,
        saveData: !!saveData,
        mode: useDemoMode,
        immediateStartMode: useImmediateStartMode
      });
    };

    ws.onerror = () => {
      const stillConnecting = ws.readyState === WebSocket.CONNECTING;
      cleanupConnectAttempt();
      if (stillConnecting) {
        setConnectionError('Connection failed. Check that your Python server is running and the IP:port are correct.');
        setIsConnecting(false);
      }
    };

    ws.onclose = () => {
      const stillConnecting = ws.readyState === WebSocket.CONNECTING;
      cleanupConnectAttempt();
      if (stillConnecting) {
        setConnectionError('Connection refused or closed. Is the server running at ' + ip + ':' + port + '?');
        setIsConnecting(false);
      }
    };
  };

  const handleCancelConnect = () => {
    if (!isConnecting) return;
    cleanupConnectAttempt();
    setIsConnecting(false);
    setConnectionError('Connection cancelled.');
  };

  const styles = uiStyles.newMission;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>CREATE NEW MISSION</h1>

      <div style={styles.layout}>
        <Card style={styles.card}>
          {/* Mission metadata */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Mission Details</h2>
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Mission Name</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. ORBITAL_TEST_01"
                  value={missionName}
                  onChange={(e) => setMissionName(e.target.value)}
                />
              </div>
               <div style={styles.column}>
                <label style={styles.label}>Craft Name</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. Artemis II"
                  value={craftName}
                  onChange={(e) => setCraftName(e.target.value)}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Save Path</label>
                <div style={uiStyles.settings.displayBox}>{savePath}</div>
                <span style={styles.helpText}>Using default folder for now.</span>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Schema</label>
                <select
                  style={{ ...styles.input, ...styles.select }}
                  value={schemaId}
                  onChange={(e) => setSchemaId(e.target.value)}
                  disabled={isLoadingSchemas || schemas.length === 0}
                >
                  <option value="">Select a saved schema</option>
                  {schemas.map((schema) => {
                    const title = schema.mission_metadata?.name || schema.id || "—";
                    const vessel = schema.mission_metadata?.vessel_id || '';
                    const label = vessel ? `${title} | ${vessel}` : title;
                    return (
                      <option key={schema.id} value={schema.id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={saveData}
                  onChange={(e) => setSaveData(e.target.checked)}
                  style={styles.checkbox}
                />
                <span>Save mission data to disk</span>
              </label>
            </div>
          </div>

          {/* Telemetry connection */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Telemetry connection</h2>
            <p style={{ ...styles.helpText, marginBottom: 12 }}>
              Run your Python WebSocket server first, then enter its address and click Connect.
            </p>
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Server IP (Ignore)</label>
                <input
                  disabled
                  style={styles.input}
                  type="text"
                  placeholder="e.g. 127.0.0.1 or 192.168.50.83"
                  value={telemetryIp}
                  onChange={(e) => setTelemetryIp(e.target.value)}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Port (Ignore)</label>
                <input
                  disabled
                  style={styles.input}
                  type="text"
                  placeholder="e.g. 8765"
                  value={telemetryPort}
                  onChange={(e) => setTelemetryPort(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Launch Notes</h2>
            <textarea
              style={styles.textarea}
              rows={4}
              placeholder="Weather, location, crew, issues, tests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {selectedSchema && (
            <NewMissionSchemaPreview
              selectedSchema={selectedSchema}
              open={schemaPreviewOpen}
              onToggle={() => setSchemaPreviewOpen((prev) => !prev)}
            />
          )}

          <div style={styles.footerRow}>
            {connectionError && (
              <div style={styles.startError}>{connectionError}</div>
            )}
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={useDemoMode}
                onChange={(e) => (setUseDemoMode(e.target.checked))}
                style={styles.checkbox}
              />
              <span>Use Demo Mode</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={useImmediateStartMode}
                onChange={(e) => (setUseImmediateStartMode(e.target.checked))}
                style={styles.checkbox}
              />
              <span>Start Mission Immediately on Telemetry Server Connect</span>
            </label>
            <Button
              size="md"
              variant="gradient"
              outlineColor={ui.colors.cyan}
              glow={canConnect && !isConnecting}
              disabled={!canConnect || isConnecting}
              onClick={handleConnect}
              style={styles.startButton}
            >
              {isConnecting ? 'CONNECTING…' : 'CONNECT & OPEN DASHBOARD'}
            </Button>
            {isConnecting && (
              <Button
                size="md"
                variant="outline"
                outlineColor={ui.colors.red}
                textColor={ui.colors.red}
                hoverBackgroundColor="rgba(255, 85, 85, 0.1)"
                onClick={handleCancelConnect}
              >
                CANCEL
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NewMissionRoot;
