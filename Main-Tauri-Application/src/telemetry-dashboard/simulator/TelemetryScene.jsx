import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import * as THREE from "three";

import { Rocket } from "../objects/Rocket.jsx";
import { LaunchPlatform } from "../landscape/LaunchPlatform.jsx";
import { Trajectory } from "../landscape/Trajectory.jsx";
import { GpsScene } from "./GpsScene.jsx";

const DEFAULT_ZOOM = 56;
const ZOOM_MIN = 20;
const ZOOM_MAX = 120;
const CAM_DIR = new THREE.Vector3(30, 15, 45).normalize();

function CameraRig({ targetPos, isTrackOn, controlsRef, zoomDistance }) {
  const vTarget = new THREE.Vector3();
  const vCam = new THREE.Vector3();
  const dist = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomDistance ?? DEFAULT_ZOOM));
  const offset = CAM_DIR.clone().multiplyScalar(dist);

  useFrame((state, delta) => {
    if (!isTrackOn || !controlsRef.current) return;
    const controls = controlsRef.current;
    const t = 1 - Math.exp(-3.5 * delta);

    vTarget.set(targetPos.x, targetPos.y, targetPos.z);
    controls.target.lerp(vTarget, t);
    vCam.set(targetPos.x + offset.x, targetPos.y + offset.y, targetPos.z + offset.z);
    controls.object.position.lerp(vCam, t);
    controls.update();
  });
  return null;
}

const KEY_MAP = { w: "w", a: "a", s: "s", d: "d", q: "q", e: "e", arrowup: "w", arrowdown: "s", arrowleft: "a", arrowright: "d" };
const MOVE_SPEED = 45;

function KeyboardCameraController({ controlsRef, keysRef, enabled }) {
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  useFrame((state, delta) => {
    if (!enabled || !controlsRef?.current || !keysRef?.current) return;
    const controls = controlsRef.current;
    const camera = controls.object;
    const target = controls.target;

    const k = keysRef.current;
    if (!k.w && !k.a && !k.s && !k.d && !k.q && !k.e) return;

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, up).normalize();

    const move = new THREE.Vector3(0, 0, 0);
    if (k.w) move.add(forward);
    if (k.s) move.sub(forward);
    if (k.d) move.add(right);
    if (k.a) move.sub(right);
    if (k.e) move.add(up);
    if (k.q) move.sub(up);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(MOVE_SPEED * delta);
      camera.position.add(move);
      target.add(move);
      controls.update();
    }
  });
  return null;
}

export default function TelemetryScene({ telemetry, history, rocketPos, isTrackOn, zoomDistance }) {
  const controlsRef = useRef();
  const keysRef = useRef({ w: false, a: false, s: false, d: false, q: false, e: false });

  useEffect(() => {
    const onKey = (e) => {
      const key = KEY_MAP[e.key?.toLowerCase()];
      if (key) {
        keysRef.current[key] = e.type === "keydown";
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "fixed" }}>


      <Canvas shadows camera={{ position: [80, 80, 80], fov: 45 }} style={{ display: "block" }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[100, 20, 100]} intensity={2} castShadow />

        <CameraRig
          targetPos={rocketPos}
          isTrackOn={isTrackOn}
          controlsRef={controlsRef}
          zoomDistance={zoomDistance}
        />
        <KeyboardCameraController
          controlsRef={controlsRef}
          keysRef={keysRef}
          enabled={!isTrackOn}
        />

        <Trajectory history={history} />
        <Rocket data={telemetry} position={[rocketPos.x, rocketPos.y, rocketPos.z]} />
        <LaunchPlatform />

        <OrbitControls ref={controlsRef} makeDefault enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}

export { ZOOM_MIN, ZOOM_MAX, DEFAULT_ZOOM };
