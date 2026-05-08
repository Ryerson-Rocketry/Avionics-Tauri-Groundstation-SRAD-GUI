import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";

import { REAL_WORLD_SCALES as SCALE } from "../simulator/scaleConstants.js";

function PopIn({ children, delay = 0 }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    if (state.clock.elapsedTime < delay) {
      ref.current.scale.set(0, 0, 0);
      return;
    }
    ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
  });

  return (
    <group ref={ref} scale={[0, 0, 0]}>
      {children}
    </group>
  );
}

export function HeightLandmarks() {
  return (
    <group position={[-15, 0, -10]}>
      <PopIn delay={0.5}>
        <group position={[0, 0, 0]}>
          <mesh position={[0, SCALE.CAR_HEIGHT / 2, 0]} castShadow>
            <boxGeometry args={[1.5, SCALE.CAR_HEIGHT, 3]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <Text
            position={[0, SCALE.CAR_HEIGHT + 0.5, 0]}
            fontSize={0.5}
            color="white"
          >
            Car (1.5m)
          </Text>
        </group>
      </PopIn>

      <PopIn delay={0.8}>
        <group position={[8, 0, 0]}>
          <mesh position={[0, 3, 0]} castShadow>
            <boxGeometry args={[6, 6, 6]} />
            <meshStandardMaterial color="#444" />
          </mesh>
          <mesh
            position={[0, 8, 0]}
            rotation={[0, Math.PI / 4, 0]}
            castShadow
          >
            <coneGeometry args={[5, 4, 4]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <Text position={[0, 11, 0]} fontSize={1} color="white">
            House (10m)
          </Text>
        </group>
      </PopIn>

      <PopIn delay={1.2}>
        <Float speed={1.5} rotationIntensity={0.1}>
          <group position={[15, SCALE.AIRPLANE_ALT, -20]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1, 1, 10, 32]} />
              <meshStandardMaterial color="#eee" />
            </mesh>
            <Text position={[0, 3, 0]} fontSize={2} color="white">
              Airplane (100m alt)
            </Text>
          </group>
        </Float>
      </PopIn>

      <PopIn delay={1.5}>
        <group position={[40, 0, -30]}>
          <mesh position={[0, SCALE.CN_TOWER_HEIGHT / 2, 0]} castShadow>
            <cylinderGeometry args={[1, 5, SCALE.CN_TOWER_HEIGHT, 32]} />
            <meshStandardMaterial color="#555" metalness={0.8} />
          </mesh>
          <mesh position={[0, 350, 0]} castShadow>
            <cylinderGeometry args={[12, 12, 8, 32]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <Text
            position={[0, SCALE.CN_TOWER_HEIGHT + 10, 0]}
            fontSize={10}
            color="white"
          >
            CN Tower (553m)
          </Text>
        </group>
      </PopIn>
    </group>
  );
}

