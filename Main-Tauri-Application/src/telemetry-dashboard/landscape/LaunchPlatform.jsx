import React, { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

function CardinalLabel({ text, position, color = "#00ffcc" }) {
  return (
    <Text
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={3}
      color={color}
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      anchorX="center"
      anchorY="middle"
      maxWidth={10}
    >
      {text}
      <meshStandardMaterial emissive={color} emissiveIntensity={2} />
    </Text>
  );
}

export function LaunchPlatform() {
  const size = 1000;
  const segments = 80;

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);
    const vertices = geo.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter > 15) {
        const bumps =
          Math.sin(x * 0.02) * Math.cos(z * 0.02) * 2.5 +
          Math.sin(x * 0.1) * Math.cos(z * 0.1) * 0.8;
        vertices[i + 1] = bumps;
      } else {
        vertices[i + 1] = 0;
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const labelDist = 25;

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#0a0a0b" roughness={1} metalness={0} />
      </mesh>

      <mesh geometry={geometry} position={[0, 0.01, 0]}>
        <meshStandardMaterial
          color="#00ffcc"
          wireframe
          transparent
          opacity={0.05}
          emissive="#00ffcc"
          emissiveIntensity={0.2}
        />
      </mesh>

      <group position={[0, 2, 0]}>
        <CardinalLabel text="N" position={[0, 0, -labelDist]} color="#ff4444" />
        <CardinalLabel text="S" position={[0, 0, labelDist]} />
        <CardinalLabel text="E" position={[labelDist, 0, 0]} />
        <CardinalLabel text="W" position={[-labelDist, 0, 0]} />

        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[labelDist - 1, labelDist + 1, 4, 1, Math.PI / 4]} />
          <meshBasicMaterial color="#00ffcc" transparent opacity={0.1} />
        </mesh>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[8, 8.1, 64]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

