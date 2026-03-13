import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

export function Trajectory({ history }) {
  const limits = useRef({ min: Infinity, max: -Infinity });
  const toVec = (p) => new THREE.Vector3(p.x, p.y, p.z);

  const { points, colors } = useMemo(() => {
    if (history.length < 2) return { points: [], colors: [] };

    const speeds = history.map((point, i) => {
      if (i === 0) return 0;
      return toVec(point).distanceTo(toVec(history[i - 1]));
    });

    speeds.forEach((s) => {
      if (s > limits.current.max) limits.current.max = s;
      if (s < limits.current.min) limits.current.min = s;
    });

    const { min, max } = limits.current;
    const range = max - min || 1;

    const vertexColors = speeds.map((s) => {
      const t = (s - min) / range;
      const hue = (1 - t) * 0.7;
      return new THREE.Color().setHSL(hue, 1, 0.5);
    });

    return { points: history, colors: vertexColors };
  }, [history]);

  const prediction = useMemo(() => {
    if (history.length < 5) return [];

    const last = toVec(history[history.length - 1]);
    const prev = toVec(history[history.length - 4]);

    let direction = new THREE.Vector3()
      .subVectors(last, prev)
      .multiplyScalar(0.33);

    let p = last.clone();
    const path = [];
    const gravity = new THREE.Vector3(0, -0.005, 0);

    for (let i = 0; i < 30; i++) {
      direction.add(gravity);
      p.add(direction);

      if (p.y < 0) break;
      path.push(p.clone());
    }
    return path;
  }, [history]);

  return (
    <group>
      {points.length > 1 && (
        <Line points={points} vertexColors={colors} lineWidth={2.5} />
      )}

      {prediction.length > 1 && (
        <Line
          points={prediction}
          color="#ffffff"
          lineWidth={1.2}
          dashed
          dashSize={0.4}
          gapSize={0.2}
          transparent
          opacity={0.4}
        />
      )}
    </group>
  );
}

