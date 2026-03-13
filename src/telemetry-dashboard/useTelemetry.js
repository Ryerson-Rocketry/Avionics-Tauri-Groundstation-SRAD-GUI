// import { useState, useEffect } from "react";
// import * as THREE from "three";
//
// export function useTelemetry(isLive) {
//     const [telemetry, setTelemetry] = useState({
//         alt: 0,
//         vel: 0,
//         status: "DISCONNECTED",
//         time: 0,
//         pos: { x: 0, y: 0, z: 0 },
//         rot: { x: 0, y: 0, z: 0 }
//     });
//
//     const [history, setHistory] = useState([]);
//     const [chartData, setChartData] = useState([]);
//     const [consoleLogs, setConsoleLogs] = useState([]);
//     const [stats, setStats] = useState({
//         maxAlt: 0, minAlt: 0, meanAlt: 0, medianAlt: 0,
//         maxVel: 0, meanVel: 0
//     });
//
//     useEffect(() => {
//         let socket;
//         let reconnectTimer;
//
//         const connect = () => {
//             if (!isLive) return;
//             socket = new WebSocket("ws://192.168.50.83:8765");
//
//             socket.onmessage = (event) => {
//                 try {
//                     const raw = JSON.parse(event.data);
//
//                     // Direct Mapping from your Backend Packet
//                     const processed = {
//                         alt: raw.altitude || 0,
//                         vel: raw.velocity || 0,
//                         status: raw.status || "IDLE",
//                         time: raw.timestamp || 0,
//                         pos: raw.position || { x: 0, y: 0, z: 0 },
//                         rot: raw.rotation || { x: 0, y: 0, z: 0 },
//                         pitch: raw.rotation?.x || 0 // Keep for UI components looking for .pitch
//                     };
//
//                     setTelemetry(processed);
//
//                     // Update History with actual coordinates
//                     const newPoint = new THREE.Vector3(processed.pos.x, processed.pos.y, processed.pos.z);
//                     setHistory(prev => [...prev, newPoint].slice(-500));
//
//                     // Update UI Chart
//                     setChartData(prev => [...prev, { time: raw.timestamp, alt: processed.alt }].slice(-100));
//
//                     // Update Terminal
//                     setConsoleLogs(prev => [[raw.timestamp, processed.alt], ...prev].slice(0, 20));
//
//                     // Update Stats
//                     setStats(prev => ({
//                         ...prev,
//                         maxAlt: Math.max(prev.maxAlt, processed.alt),
//                         maxVel: Math.max(prev.maxVel, processed.vel),
//                     }));
//
//                     // This won't crash now because processed.pos is guaranteed!
//                     console.log(`POS: ${processed.pos.y.toFixed(2)}m | VEL: ${processed.vel.toFixed(2)}m/s`);
//
//                 } catch (e) {
//                     console.error("❌ Telemetry Mapping Error:", e);
//                 }
//             };
//
//             socket.onclose = () => {
//                 setTelemetry(t => ({ ...t, status: "DISCONNECTED" }));
//                 if (isLive) reconnectTimer = setTimeout(connect, 2000);
//             };
//         };
//
//         connect();
//         return () => { if (socket) socket.close(); clearTimeout(reconnectTimer); };
//     }, [isLive]);
//
//     return { telemetry, history, rocketPos: telemetry.pos, rocketRot: telemetry.rot, chartData, consoleLogs, stats };
// }


import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import * as THREE from "three";

const RECORDING_FLUSH_INTERVAL_MS = 3000;

/** Get nested value from object by dot path, e.g. getByPath(raw, "position.x") */
function getByPath(obj, path) {
  if (path == null || path === "") return obj;
  return path.split(".").reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

const DEFAULT_CHART_INTERVAL_SEC = 1;

/**
 * Telemetry hook wired to an externally provided websocket endpoint.
 * `socketUrl` may be a full ws:// URL or a bare "ip:port" string.
 * `profile` (schema) may contain data_map and features; data_map entries with
 * visualizers.show_in_terminal are included in consoleLogs with label/value/unit.
 * `options.chartUpdateIntervalSeconds` throttles how often chart + trajectory update (reduces re-renders).
 */
export function useTelemetry(isLive, socketUrl, profile, options = {}) {
  const chartIntervalSec = Math.max(0.1, Number(options.chartUpdateIntervalSeconds) || DEFAULT_CHART_INTERVAL_SEC);
  const chartIntervalMs = chartIntervalSec * 1000;
  const recordingSaveDirName = options.recordingSaveDirName ?? null;

  const recordingBufferRef = useRef([]);
  const recordingSaveDirRef = useRef(recordingSaveDirName);
  recordingSaveDirRef.current = recordingSaveDirName;

  const flushRecording = useCallback(async () => {
    const dir = recordingSaveDirRef.current;
    const buf = recordingBufferRef.current;
    if (!dir || buf.length === 0) return;
    const rows = buf.splice(0, buf.length);
    try {
      await invoke("append_telemetry_chunk", { saveDirName: dir, rows });
    } catch (e) {
      console.error("[RocketView] Failed to flush recording chunk:", e);
    }
  }, []);

  const terminalFields = useMemo(() => {
    const dataMap = profile?.data_map ?? profile?.data?.data_map ?? [];
    return Array.isArray(dataMap)
      ? dataMap.filter((e) => e?.visualizers?.show_in_terminal === true)
      : [];
  }, [profile]);

  const terminalFieldsRef = useRef(terminalFields);
  terminalFieldsRef.current = terminalFields;

  const lastChartUpdateRef = useRef(0);
  const chartIntervalMsRef = useRef(chartIntervalMs);
  chartIntervalMsRef.current = chartIntervalMs;

  const [telemetry, setTelemetry] = useState({
    alt: 0,
    vel: 0,
    status: "DISCONNECTED",
    time: 0,
    pos: { x: 0, y: 0, z: 0 },
    quat: { x: 0, y: 0, z: 0, w: 1 },
  });

  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [consoleLogs, setConsoleLogs] = useState([]);

  const [stats, setStats] = useState({
    maxAlt: 0,
    minAlt: 0,
    meanAlt: 0,
    maxVel: 0,
    meanVel: 0,
    minBatt: 0,
    meanRssi: 0,
  });

  const [lastCloseReason, setLastCloseReason] = useState(null);

  useEffect(() => {
    if (!isLive || !socketUrl) return;

    let url = socketUrl;
    if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
      url = `ws://${url}`;
    }

    let socket;

    try {
      socket = new WebSocket(url);
    } catch (e) {
      console.error("❌ Failed to open telemetry socket:", e);
      return;
    }

    socket.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);

        const processed = {
          alt: raw.alt ?? raw.altitude ?? 0,
          vel: raw.velocity ?? 0,
          status: raw.status || "IDLE",
          time: raw.timestamp || 0,
          pos: raw.position || { x: 0, y: 0, z: 0 },
          quat: raw.quaternion || { x: 0, y: 0, z: 0, w: 1 },
        };

        setTelemetry(processed);

        const newPoint = new THREE.Vector3(
          processed.pos.x,
          processed.pos.y,
          processed.pos.z
        );
        setHistory((prev) => [...prev, newPoint].slice(-500));

        const now = Date.now();
        if (now - lastChartUpdateRef.current >= chartIntervalMsRef.current) {
          lastChartUpdateRef.current = now;
          setChartData((prev) => [...prev, { time: processed.time, alt: processed.alt }].slice(-200));
        }

        const fields = terminalFieldsRef.current;
        const time = raw.timestamp ?? processed.time;
        let logEntry;
        if (fields.length > 0) {
          logEntry = {
            time,
            fields: fields.map((entry) => {
              const value = getByPath(raw, entry.source_key);
              const num = typeof value === "number" ? value : Number(value) || 0;
              return {
                label: entry.label ?? entry.source_key,
                value: num,
                unit: entry.unit ?? "",
              };
            }),
          };
        } else {
          logEntry = { time, fields: [{ label: "Mission Time", value: time, unit: "s" }, { label: "Altitude", value: processed.alt, unit: "m" }] };
        }
        setConsoleLogs((prev) => [logEntry, ...prev].slice(0, 50));

        setStats((prev) => ({
          ...prev,
          maxAlt: Math.max(prev.maxAlt, processed.alt),
          maxVel: Math.max(prev.maxVel, processed.vel),
        }));

        if (recordingSaveDirRef.current) {
          const tminus = String(raw.timestamp ?? processed.time ?? 0);
          recordingBufferRef.current.push([tminus, event.data]);
        }
      } catch (e) {
        console.error("❌ Telemetry Mapping Error:", e);
      }
    };

    let flushIntervalId = null;
    if (recordingSaveDirRef.current) {
      flushIntervalId = setInterval(flushRecording, RECORDING_FLUSH_INTERVAL_MS);
    }

    socket.onopen = () => {
      setLastCloseReason(null);
    };

    socket.onerror = (ev) => {
      console.error("[RocketView] WebSocket error:", ev);
      setLastCloseReason("Connection error");
    };

    socket.onclose = (ev) => {
      const msg = `code ${ev.code}${ev.reason ? `: ${ev.reason}` : ""} (${describeCloseCode(ev.code)})`;
      console.error("[RocketView] WebSocket closed:", msg);
      setLastCloseReason(msg);
      setTelemetry((t) => ({ ...t, status: "DISCONNECTED" }));
    };

    return () => {
      if (flushIntervalId) clearInterval(flushIntervalId);
      flushRecording();
      if (socket) socket.close();
    };
  }, [isLive, socketUrl, flushRecording]);

  return {
    telemetry,
    history,
    rocketPos: telemetry.pos,
    chartData,
    consoleLogs,
    stats,
    lastCloseReason,
    flushRecording,
  };
}

function describeCloseCode(code) {
  const map = {
    1000: "normal closure",
    1001: "going away (e.g. page/tab close or navigation)",
    1002: "protocol error",
    1003: "unsupported data",
    1005: "no status received (connection closed without close frame)",
    1006: "abnormal closure",
  };
  return map[code] ?? "unknown";
}
