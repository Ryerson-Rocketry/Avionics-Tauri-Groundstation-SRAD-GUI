import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader  } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { TextureLoader } from 'three'
import * as THREE from "three";
import Card from "@mui/material/Card";


import navBallTexture from "../../../assets/Models/navball.png";
import Typography from "@mui/material/Typography";

/*
https://r3f.docs.pmnd.rs/tutorials/loading-textures
*/

export function NavBall({ data, orientation}) {
  const groupRef = useRef();
  const flameRef = useRef();
  const colorMap = useLoader(TextureLoader, navBallTexture);



  const rocketGeometries = useMemo(() => {
    const orientationIndicatorGeometry = new THREE.SphereGeometry(1, 16);
    orientationIndicatorGeometry.translate(50, 0, 0); //move shit in front of navball camera wise


    const navBallGeometry = new THREE.SphereGeometry(30, 32);
    navBallGeometry.translate(0, 0, 0);

    //shou;d be from 
    navBallGeometry.rotateY(-THREE.MathUtils.degToRad(orientation.yaw));
    //should be from -90 to 90
    navBallGeometry.rotateZ(-THREE.MathUtils.degToRad(orientation.pitch));
    //Should be from -180 to 180

    //TEMP DISABLE WHEN NEEDED IF TOO CONFUSING
    navBallGeometry.rotateX(-THREE.MathUtils.degToRad(orientation.roll));
    return { navBallGeometry, orientationIndicatorGeometry };
  }, [orientation]);

  /*
  useEffect(() => {
    //var mapped = targetPos.map(item => ({ ["x"]: item.value }) );

    let euler = new THREE.Euler(0,orientation.yaw, 0, 'XYZ');
    let quaternion = new THREE.Quaternion();

    quaternion.setFromEuler(euler);

    rocketGeometries.navBallGeometry.set(quaternion);
  }
  ,[orientation]);
  */

  useFrame((state) => {
    if (!groupRef.current || !data?.quat) return;

    groupRef.current.quaternion.set(
      data.quat.x,
      data.quat.y,
      data.quat.z,
      data.quat.w
    );
  });

  const labelDist = 8;

  return (
    <group ref={groupRef}>
      {/* Visual Mesh */}
      <mesh geometry={rocketGeometries.navBallGeometry} castShadow>
        <meshStandardMaterial map={colorMap} />
      </mesh>

      <mesh geometry={rocketGeometries.orientationIndicatorGeometry} castShadow>
        <meshStandardMaterial color="red" />
      </mesh>

    </group>
  );
}

export default function NavBallScene({orientation}) {

  return (
    <div style={{ width: "100%", height: "100%", alignItems: "center",  display: 'flex', flexDirection:'column' }}>
      <Canvas shadows camera={{ position: [80, 0, 0], fov: 45 }} style={{ display: "block" }}>
        {/*
        <Sky sunPosition={[100, 20, 100]} />
        <directionalLight position={[100, 20, 100]} intensity={2} castShadow />
        */}
        <ambientLight intensity={1.5} />
        

        <NavBall orientation={orientation} />
      </Canvas>

      <Card style={{ width: "75%", height: "5%", paddingBottom: "1.5vh", display: 'flex', flexDirection:'column', position: "absolute", right: 0, left: 0, bottom: 0, marginLeft: "auto", marginRight: "auto", alignItems: "center" }}>  
        <Typography sx={{overflow: "visible"}}>
          Heading: {orientation.yaw.toFixed()}
        </Typography>
      </Card>
    </div>
  );
}

