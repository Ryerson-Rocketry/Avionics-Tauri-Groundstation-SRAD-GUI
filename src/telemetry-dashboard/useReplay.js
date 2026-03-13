import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import * as THREE from "three";

function getByPath(obj, path) {
  if (path == null || path === "") return obj;
  return path.split(".").reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

function rowToTelemetry(row) {
  let raw = {};
  try {
    raw = typeof row.raw_json === "string" ? JSON.parse(row.raw_json) : row.raw_json;
  } catch (_) {
    return null;
  }
  const processed = {
    alt: raw.alt ?? raw.altitude ?? 0,
    vel: raw.velocity ?? 0,
    status: raw.status || "IDLE",
    time: Number(row.tminus) || 0,
    pos: raw.position || { x: 0, y: 0, z: 0 },
    quat: raw.quaternion || { x: 0, y: 0, z: 0, w: 1 },
  };
  return { raw, processed };
}

/**
 * Load a mission save and expose replay state: telemetry, history, chartData, etc.
 * driven by currentTime. Returns same shape as useTelemetry plus timeline state.
 */
export function useReplay(saveDirName) {
  const [loadError, setLoadError] = useState(null);
  const [saveMeta, setSaveMeta] = useState(null);
  const [schema, setSchema] = useState(null);
  const [rows, setRows] = useState([]);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const lastFrameRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!saveDirName) return;
    setLoadError(null);
    invoke("load_mission_save", { saveDirName })
      .then((data) => {
        setSaveMeta(data.save_meta ?? null);
        setSchema(data.schema ?? null);
        const list = Array.isArray(data.rows) ? data.rows : [];
        setRows(list);
        setCurrentTimeState(0);
      })
      .catch((e) => setLoadError(typeof e === "string" ? e : e?.message || String(e)));
  }, [saveDirName]);

  const duration = useMemo(() => {
    if (rows.length === 0) return 0;
    const last = rows[rows.length - 1];
    const t = Number(last?.tminus);
    return Number.isFinite(t) ? t : 0;
  }, [rows]);

  const currentIndex = useMemo(() => {
    const t = Number(currentTime);
    if (!Number.isFinite(t) || rows.length === 0) return 0;
    let i = 0;
    for (let j = 0; j < rows.length; j++) {
      if (Number(rows[j].tminus) <= t) i = j;
      else break;
    }
    return i;
  }, [rows, currentTime]);

  const setCurrentTime = useCallback((value) => {
    const t = Math.max(0, Number(value));
    setCurrentTimeState(Number.isFinite(t) ? t : 0);
  }, []);

  useEffect(() => {
    if (!playing || rows.length === 0) return;
    const tick = (now) => {
      const delta = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;
      setCurrentTimeState((prev) => {
        const next = prev + delta * speed;
        return Math.min(next, duration);
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, speed, duration, rows.length]);

  const { telemetry, history, chartData, consoleLogs, stats } = useMemo(() => {
    const defaultTelemetry = {
      alt: 0,
      vel: 0,
      status: "IDLE",
      time: 0,
      pos: { x: 0, y: 0, z: 0 },
      quat: { x: 0, y: 0, z: 0, w: 1 },
    };
    const defaultStats = { maxAlt: 0, minAlt: 0, meanAlt: 0, maxVel: 0, meanVel: 0 };
    if (rows.length === 0) {
      return {
        telemetry: defaultTelemetry,
        history: [],
        chartData: [],
        consoleLogs: [],
        stats: defaultStats,
      };
    }
    const idx = Math.min(currentIndex, rows.length - 1);
    const row = rows[idx];
    const parsed = rowToTelemetry(row);
    const processed = parsed?.processed ?? defaultTelemetry;
    const historyPoints = rows.slice(0, idx + 1).map((r) => {
      const p = rowToTelemetry(r)?.processed;
      if (!p?.pos) return new THREE.Vector3(0, 0, 0);
      return new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z);
    });
    const chartPoints = rows.slice(0, idx + 1).map((r) => {
      const p = rowToTelemetry(r)?.processed;
      return { time: p?.time ?? 0, alt: p?.alt ?? 0 };
    });
    let logEntry = { time: processed.time, fields: [{ label: "Mission Time", value: processed.time, unit: "s" }, { label: "Altitude", value: processed.alt, unit: "m" }] };
    if (parsed?.raw && schema?.data_map) {
      const fields = schema.data_map.filter((e) => e?.visualizers?.show_in_terminal === true);
      if (fields.length > 0) {
        logEntry = {
          time: processed.time,
          fields: fields.map((entry) => {
            const value = getByPath(parsed.raw, entry.source_key);
            const num = typeof value === "number" ? value : Number(value) || 0;
            return { label: entry.label ?? entry.source_key, value: num, unit: entry.unit ?? "" };
          }),
        };
      }
    }
    let maxAlt = 0,
      maxVel = 0;
    chartPoints.forEach((p) => {
      maxAlt = Math.max(maxAlt, p.alt);
    });
    rows.slice(0, idx + 1).forEach((r) => {
      const p = rowToTelemetry(r)?.processed;
      if (p) maxVel = Math.max(maxVel, p.vel);
    });
    return {
      telemetry: processed,
      history: historyPoints,
      chartData: chartPoints,
      consoleLogs: [logEntry],
      stats: { ...defaultStats, maxAlt, maxVel },
    };
  }, [rows, currentIndex, schema]);

  return {
    loadError,
    saveMeta,
    profile: schema,
    telemetry,
    history,
    rocketPos: telemetry.pos,
    chartData,
    consoleLogs,
    stats,
    lastCloseReason: null,
    currentTime,
    setCurrentTime,
    duration,
    playing,
    setPlaying,
    speed,
    setSpeed,
    rowCount: rows.length,
  };
}
