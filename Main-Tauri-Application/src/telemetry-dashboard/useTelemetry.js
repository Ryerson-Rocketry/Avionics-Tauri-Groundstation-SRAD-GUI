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

import { mean, sqrt, variance } from "mathjs";
import { listen } from '@tauri-apps/api/event';


const RECORDING_FLUSH_INTERVAL_MS = 3000;

/** Get nested value from object by dot path, e.g. getByPath(raw, "position.x") */
function getByPath(obj, path) {
  if (path == null || path === "") return obj;
  return path.split(".").reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

function clamp(number, lower, upper) {
  return Math.min(Math.max(number, lower), upper)
}

const DEFAULT_CHART_INTERVAL_SEC = 1;

/**
 * Telemetry hook wired to an externally provided websocket endpoint.
 * `socketUrl` may be a full ws:// URL or a bare "ip:port" string.
 * `profile` (schema) may contain data_map and features; data_map entries with
 * visualizers.show_in_terminal are included in consoleLogs with label/value/unit.
 * `options.chartUpdateIntervalSeconds` throttles how often chart + trajectory update (reduces re-renders).
 */

//where dummy mode = don't actually run the thing
export function useTelemetry(isLive, socketUrl, profile, options = {}, useDemoMode, dummyMode) {


  

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

  const hasRunOnceRef = useRef(false);

  const [telemetry, setTelemetry] = useState({
    alt: 0,
    vel: 0,
    status: "DISCONNECTED",
    time: 0,
    pos: { x: 0, y: 0, z: 0 }, //x = lat, z = long , y = alt
    quat: { x: 0, y: 0, z: 0, w: 1 }, //UNUSED, IGNORE


    pressure: 0,
    stateName: "null",
    acceleration: 0,
    temp: 0,
    battVolt: 0,
    mainVolt: 0,
    drogueVolt: 0,

    //rocket orientation shit
    orientation: {
      pitch: 0,
      roll: 0, 
      yaw: 0 //technically also heading? idk
    }

  });

  const [history, setHistory] = useState([]);
  /*
  const [chartData, setChartData] = useState({dataAlt: {data: [], title: "Altitude", yAxis: "Alt (m)"},
                                   dataVel: {data: [], title: "Velocity", yAxis: "Vel (m/s)"},
                                   dataPress: {data: [], title: "Pressure", yAxis: "Pres (mBar)"},
                                   dataAccel: {data: [], title: "Acceleration", yAxis: "Accel (m/s^2)"},
                                   dataTemp: {data: [], title: "Temperature", yAxis: "Temp (C)"}});
  */
  const chartMetaData = {
    alt: {title: "Altitude", yAxis: "Alt (m)"},
    vel: {title: "Velocity", yAxis: "Vel (m/s)"},
    pressure: {title: "Pressure", yAxis: "Pres (mBar)"},
    acceleration: {title: "Acceleration", yAxis: "Accel (m/s^2"},
    temp: {title: "Temperature", yAxis: "Temp (C)"}
  }

  const statsMetaData = {
    alt: {units: "m"},
    vel: {units: "m/s"},
    pressure: {units: "mBar"},
    acceleration: {units: "m/s²"},
    temp: {units: "°C"},
    battVolt: {units: "V"},
    mainVolt: {units: "V"},
    drogueVolt: {units: "V"},
  }


    
  const [chartData, setChartData] = useState({data: [],
    chartMetaData: chartMetaData
  });

  //mainly used for calculating variance (need to know actual array of data for this)
  const [dataArrays, setDataArrays] = useState({
    alt: [],
    vel: [],
    pressure: [],
    acceleration: [],
    temp: [],
    battVolt: [],
    mainVolt: [],
    drogueVolt: [],
  })

  const [socketOBJ, setSocketOBJ] = useState(undefined);

  const [consoleLogs, setConsoleLogs] = useState([]);
  //python webserver std out/err longs
  const [stdLogs, setStdLogs] = useState([]);



  

  const [rocketPos, setRocketPos] = useState({
    all: [],
    current: {x: 0, y: 0, z: 0},
    apogeePoint: {x: 0, y: 0, z: 0},
    launchPoint: {x: 0, y: 0, z: 0}
  })

  const [stats, setStats] = useState({
    
    /*
    minAlt: 0,
    meanAlt: 0,
    meanVel: 0,
    minBatt: 0,
    meanRssi: 0,
    */

    meanVel: null,
    meanAlt: null,
    meanPressure:null,
    meanAcceleration:null,
    meanTemp:null,
    meanBattVolt:null,
    meanMainVolt:null,
    meanDrogueVolt:null,
    

    maxAlt: 0,
    maxVel: 0,
    maxPressure:0,
    maxAcceleration:0,
    maxTemp:0,
    maxBattVolt:0,
    maxMainVolt:0,
    maxDrogueVolt:0,

    minAlt: null,
    minVel: null,
    minPressure:null,
    minAcceleration:null,
    minTemp:null,
    minBattVolt:null,
    minMainVolt:null,
    minDrogueVolt:null,

    varianceAlt: 0,
    varianceVel: 0,
    variancePressure:0,
    varianceAcceleration:0,
    varianceTemp:0,
    varianceBattVolt:0,
    varianceMainVolt:0,
    varianceDrogueVolt:0,

    //actually maybe don't use (can just sqrt the variance wherever)
    stdDevAlt: 0,
    stdDevVel: 0,
    stdDevPressure:0,
    stdDevAcceleration:0,
    stdDevTemp:0,
    stdDevBattVolt:0,
    stdDevMainVolt:0,
    stdDevDrogueVolt:0,

    alt: 0,
    vel: 0,
    pressure: 0,
    acceleration: 0,
    temp: 0,
    battVolt: 0,
    mainVolt: 0,
    drogueVolt: 0,

    metadata: statsMetaData,

    apogee: 0
  });

  const [lastCloseReason, setLastCloseReason] = useState(null);

  useEffect(() => {
    console.log("dummyMode: " + dummyMode);

  },[dummyMode]);

  //KNOWN ISSUE: WILL CREATE A WEBSOCKET CONNECTION, END IT, THEN CREATE ANOTHER ONE (THAT ACTUALLY FUNCTIONS)
  //moved to separate useffect with no deps so it only creates socket once
  useEffect(() => {
    console.log("INITING SOCKET");

    let url = socketUrl;
    if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
      url = `ws://${url}`;
    }

    let socket;

    try {
      //socketOBJ?.close(); //in case prev socket was never closed
      socket = new WebSocket(url);

      
      setSocketOBJ (socket);

      
      
      socket.onopen = () => {
        //set mode on server
        console.log("SOCKET CREATED");
        console.log("mission setup (useDemoMode) is: " + useDemoMode);
        console.log("mission setup (dummyMode) is: " + dummyMode);
        if (useDemoMode == true){
          socket.send("demo");
        }
        else{
          socket.send("live");
        }
        

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


    } catch (e) {
      console.error("❌ Failed to open telemetry socket:", e);
      return;
    }

    return () => {
      if (socket){
        console.log("DISCONNECTING FROM SOCKET");
        socket.close();

      }     
    }
    

  }, []);

  useEffect(() => {
    if (!isLive || !socketUrl || socketOBJ == undefined || dummyMode == true ) return;

    let url = socketUrl;
    if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
      url = `ws://${url}`;
    }

    let socket = socketOBJ;

    const unlisten = listen('stdout', (event) => {
      console.log(
        `recieved STDOUT as ${event.payload}`
      );  
      setStdLogs((prev) => [event.payload, ...prev].slice(0, 50));
    });

    socket.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);

        const processed = {
          alt: raw.alt ?? raw.altitude ?? 0,
          vel: raw.velocity ?? 0,
          status: raw.state || "IDLE",
          time: raw.timestamp || 0,
          pos: {x: clamp(raw.position.x, -90, 90), y: raw.position.y, z: clamp(raw.position.z, -180, 180) } || { x: 0, y: 0, z: 0 },
          quat: raw.quaternion || { x: 0, y: 0, z: 0, w: 1 },

          //NEW ROWS
          pressure: raw.pressure ?? 0,
          stateName: raw.state || "null",
          acceleration: raw.acceleration ?? 0,
          temp: raw.temp ?? 0,
          battVolt: raw.battVolt ?? 0,
          mainVolt: raw.mainVolt ?? 0,
          drogueVolt: raw.drogueVolt ?? 0,

          battVolt: raw.battVolt ?? 0,
          mainVolt: raw.mainVolt ?? 0,
          drogueVolt: raw.drogueVolt ?? 0,

          orientation: {pitch: raw.orientation.pitch, roll: raw.orientation.roll, yaw: raw.orientation.yaw } || { pitch: 0, roll: 0, yaw: 0 },
          
          
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
          //setChartData((prev) => [...prev, { time: processed.time, alt: processed.alt }].slice(-200));

          //NEW
          //let chartAlt = {data: chartData.data.push(({ time: processed.time, data: processed.alt })), title: "Altitude", yAxis: "Alt (M)"};
          //let chartVel = {dataset:(prev) => [...prev, { time: processed.time, data: processed.velocity }], title: "Velocity", yAxis: "Vel (m/s)"};
          //let chartPress = {dataset: (prev) => [...prev, { time: processed.time, data: processed.pressure }], title: "Pressure", yAxis: "Pres (mBar)"};
          //let chartAccel = {dataset: (prev) => [...prev, { time: processed.time, data: processed.acceleration }], title: "Acceleration", yAxis: "Accel (m/s^2)"};
          //let chartTemp = {dataset: (prev) => [...prev, { time: processed.time, data: processed.temp }], title: "Temperature", yAxis: "Temp (C)"};

          //let chartAll = {datAlt: chartAlt, datVel: chartVel, datPress: chartPress, datTemp: chartTemp};
          //let chartAll = {datAlt: chartAlt};
          //console.log(chartData);
          //console.log(chartAlt);
          
          /*
          setChartData((prev) => ({dataAlt: {data: [...prev.dataAlt.data,{ time: processed.time, data: processed.alt }], title: "Altitude", yAxis: "Alt (m)"},
                                   dataVel: {data: [...prev.dataVel.data,{ time: processed.time, data: processed.velocity }], title: "Velocity", yAxis: "Vel (m/s)"},
                                   dataPress: {data: [...prev.dataPress.data,{ time: processed.time, data: processed.pressure }], title: "Pressure", yAxis: "Pres (mBar)"},
                                   dataAccel: {data: [...prev.dataAccel.data,{ time: processed.time, data: processed.acceleration }], title: "Acceleration", yAxis: "Accel (m/s^2)"},
                                   dataTemp: {data: [...prev.dataTemp.data,{ time: processed.time, data: processed.temp }], title: "Temperature", yAxis: "Temp (C)"},
          }));
          */

          setChartData((prev) => ({data: [...prev.data, { 
            time: processed.time, 
            alt: processed.alt, 
            vel: processed.vel, 
            pressure: processed.pressure, 
            acceleration: processed.acceleration,
            temp: processed.temp }],
            chartMetaData,
          }));

          setDataArrays({
            alt: dataArrays.alt.push(processed.alt),
            vel: dataArrays.vel.push(processed.vel),
            pressure: dataArrays.pressure.push(processed.pressure),
            acceleration: dataArrays.acceleration.push(processed.acceleration),
            temp: dataArrays.temp.push(processed.temp),
            battVolt: dataArrays.battVolt.push(processed.battVolt),
            mainVolt: dataArrays.mainVolt.push(processed.mainVolt),
            drogueVolt: dataArrays.drogueVolt.push(processed.drogueVolt),
          })
        }

        const fields = terminalFieldsRef.current;
        const time = raw.timestamp ?? processed.time;
        let logEntry;
        if (fields.length > 0) {
          logEntry = {
            time,
            fields: fields.map((entry) => {
              const value = getByPath(raw, entry.source_key);
              //const num = typeof value === "number" ? value : Number(value) || 0;
              const num = typeof value === "number" ? value : value || 0;
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

        setRocketPos((prev) => ({
          ...prev,
          all: [...prev.all, processed.pos
          ],
          current: {x: processed.pos.x, y: processed.pos.y, z: processed.pos.z},
          apogeePoint: prev.current.y < processed.pos.y ? {x: processed.pos.x, y: processed.pos.y, z: processed.pos.z} : prev.apogeePoint, //use prev apogee point if new apogee point not reached
          launchPoint: prev.launchPoint.x === 0 ? {x: processed.pos.x, y: processed.pos.y, z: processed.pos.z} : prev.launchPoint, //set launch point as first point
        }));

        setStats((prev) => ({
          ...prev,
          maxAlt: Math.max(prev.maxAlt, processed.alt),
          maxVel: Math.max(prev.maxVel, processed.vel),
          maxBattVolt: Math.max(prev.maxBattVolt, processed.battVolt),
          maxDrogueVolt: Math.max(prev.maxDrogueVolt, processed.drogueVolt),
          maxMainVolt: Math.max(prev.maxMainVolt, processed.mainVolt),
          maxPressure: Math.max(prev.maxPressure, processed.pressure),
          maxTemp: Math.max(prev.maxTemp, processed.temp),
          maxAcceleration: Math.max(prev.maxAcceleration, processed.acceleration),
           
          //if first element, we simply just set it as the very first data point
          minAlt: prev.minAlt === null ? processed.alt : Math.min(prev.minAlt, processed.alt),
          minVel: prev.minVel === null ? processed.vel : Math.min(prev.minVel, processed.vel),
          minBattVolt: prev.minBattVolt === null ? processed.battVolt : Math.min(prev.minBattVolt, processed.battVolt),
          minDrogueVolt: prev.minDrogueVolt === null ? processed.drogueVolt :  Math.min(prev.minDrogueVolt, processed.drogueVolt),
          minMainVolt: prev.minMainVolt === null ? processed.mainVolt :  Math.min(prev.minMainVolt, processed.mainVolt),
          minPressure: prev.minPressure === null ? processed.pressure :  Math.min(prev.minPressure, processed.pressure),
          minTemp: prev.minTemp === null ? processed.temp :  Math.min(prev.minTemp, processed.temp),
          minAcceleration: prev.minAcceleration === null ? processed.acceleration : Math.min(prev.minAcceleration, processed.acceleration),
          
          /*
          meanAlt: prev.minAlt === null ? processed.alt :((prev.meanAlt * (fields.length-1) + processed.alt) / fields.length).toFixed(3),
          meanVel: prev.meanVel === null ? processed.vel :((prev.meanVel * (fields.length-1) + processed.vel) / fields.length).toFixed(3),
          meanBattVolt: prev.meanBattVolt === null ? processed.battVolt :((prev.meanBattVolt * (fields.length-1) + processed.battVolt) / fields.length).toFixed(3),
          meanDrogueVolt:prev.meanDrogueVolt === null ? processed.drogueVolt : ((prev.meanDrogueVolt * (fields.length-1) + processed.drogueVolt) / fields.length).toFixed(3),
          meanMainVolt:prev.meanMainVolt === null ? processed.mainVolt : ((prev.meanMainVolt * (fields.length-1) + processed.mainVolt) / fields.length).toFixed(3),
          meanPressure: prev.meanPressure === null ? processed.pressure : ((prev.meanPressure * (fields.length-1) + processed.pressure) / fields.length).toFixed(3),
          meanTemp:  prev.meanTemp === null ? processed.temp :((prev.meanTemp * (fields.length-1) + processed.temp) / fields.length).toFixed(3),
          meanAcceleration:prev.meanAcceleration === null ? processed.acceleration : ((prev.meanAcceleration * (fields.length-1) + processed.acceleration) / fields.length).toFixed(3),
          */
          meanAlt:  mean(dataArrays.alt).toFixed(3),
          meanVel:  mean(dataArrays.vel).toFixed(3),
          meanBattVolt:  mean(dataArrays.battVolt).toFixed(3),
          meanDrogueVolt:  mean(dataArrays.drogueVolt).toFixed(3),
          meanPressure:  mean(dataArrays.pressure).toFixed(3),
          meanTemp:  mean(dataArrays.temp).toFixed(3),
          meanAcceleration: mean(dataArrays.acceleration).toFixed(3),

          varianceAlt:  variance(dataArrays.alt).toFixed(3),
          varianceVel:  variance(dataArrays.vel).toFixed(3),
          varianceBattVolt:  variance(dataArrays.battVolt).toFixed(3),
          varianceDrogueVolt:  variance(dataArrays.drogueVolt).toFixed(3),
          variancePressure:  variance(dataArrays.pressure).toFixed(3),
          varianceTemp:  variance(dataArrays.temp).toFixed(3),
          varianceAcceleration: variance(dataArrays.acceleration).toFixed(3),

          alt: processed.alt, 
          vel: processed.vel,
          pressure: processed.pressure,
          acceleration: processed.acceleration,
          temp: processed.temp,
          battVolt: processed.battVolt,
          mainVolt: processed.mainVolt,
          drogueVolt: processed.drogueVolt,

          

          metadata: prev.metadata,

          apogee: Math.max(prev.apogee, processed.alt), //ALREADY JUST MAX ALT BUT WHATEVER

          
        }));
        
        //console.log(hasRunOnceRef.current );
       //console.log( " " + dataArrays.alt);

        if (recordingSaveDirRef.current) {
          const tminus = String(raw.timestamp ?? processed.time ?? 0);
          recordingBufferRef.current.push([tminus, event.data]);
        }

        hasRunOnceRef.current = true;
      } catch (e) {
        console.error("❌ Telemetry Mapping Error:", e);
      }
    };

    let flushIntervalId = null;
    if (recordingSaveDirRef.current) {
      flushIntervalId = setInterval(flushRecording, RECORDING_FLUSH_INTERVAL_MS);
    }



    return () => {
      if (flushIntervalId) clearInterval(flushIntervalId);
      flushRecording();
      //moved to new use effect hook
      //if (socket) socket.close();

      console.log("unmounting telemetry function, preparing to remove listener to backend "); 
      unlisten.then( f => f() ); //https://github.com/tauri-apps/tauri/pull/8930
    };
  }, [isLive, socketUrl, flushRecording, socketOBJ, dummyMode]);

  return {
    telemetry,
    history,
    rocketPos,
    chartData,
    consoleLogs,
    stdLogs,
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
