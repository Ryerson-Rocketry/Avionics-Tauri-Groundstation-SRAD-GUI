import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

export function Rocket({ data, position }) {
  const groupRef = useRef();
  const flameRef = useRef();

  const rocketGeometries = useMemo(() => {
    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    bodyGeo.translate(0, 2, 0);
    bodyGeo.rotateX(Math.PI / 2);
    bodyGeo.rotateY(Math.PI);

    const noseGeo = new THREE.ConeGeometry(0.5, 1, 32);
    noseGeo.translate(0, 4.5, 0);
    noseGeo.rotateX(Math.PI / 2);
    noseGeo.rotateY(Math.PI);

    return { bodyGeo, noseGeo };
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !data?.quat) return;

    groupRef.current.position.set(position[0], position[1], position[2]);

    groupRef.current.quaternion.set(
      data.quat.x,
      data.quat.y,
      data.quat.z,
      data.quat.w
    );

    if (flameRef.current) {
      flameRef.current.visible = data.alt > 0.1;
      flameRef.current.scale.z =
        1 + Math.sin(state.clock.getElapsedTime() * 20) * 0.2;
    }
  });

  const labelDist = 8;

  return (
    <group ref={groupRef}>
      {/* LOCAL LABELED AXES - These rotate WITH the rocket */}
      <group>
        <primitive
          object={
            new THREE.ArrowHelper(
              new THREE.Vector3(1, 0, 0),
              new THREE.Vector3(0, 0, 0),
              labelDist,
              0xff0000
            )
          }
        />
        <Text position={[labelDist + 1, 0, 0]} fontSize={1.5} color="#ff0000">
          +X
        </Text>

        <primitive
          object={
            new THREE.ArrowHelper(
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3(0, 0, 0),
              labelDist,
              0x00ff00
            )
          }
        />
        <Text position={[0, labelDist + 1, 0]} fontSize={1.5} color="#00ff00">
          +Y
        </Text>

        <primitive
          object={
            new THREE.ArrowHelper(
              new THREE.Vector3(0, 0, 1),
              new THREE.Vector3(0, 0, 0),
              labelDist,
              0x0000ff
            )
          }
        />
        <Text position={[0, 0, labelDist + 1]} fontSize={1.5} color="#0000ff">
          +Z
        </Text>
      </group>

      {/* Visual Mesh */}
      <mesh geometry={rocketGeometries.bodyGeo} castShadow>
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh geometry={rocketGeometries.noseGeo}>
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Yellow Nose Pointer (Points to -Z in our local setup) */}
      <primitive
        object={
          new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(0, 0, 0),
            12,
            0xffff00
          )
        }
      />

      <group ref={flameRef} position={[0, 0, 0]}>
        <pointLight color="orange" intensity={10} />
      </group>
    </group>
  );
}

