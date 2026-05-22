import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import * as THREE from "three";

import { Rocket } from "../objects/Rocket.jsx";
import { LaunchPlatform } from "../landscape/LaunchPlatform.jsx";
import { Trajectory } from "../landscape/Trajectory.jsx";
import { GpsScene } from "./GpsScene.jsx";

import Map, { Layer, MapRef, Marker, Popup } from 'react-map-gl/maplibre';
// @ts-expect-error
import 'maplibre-gl/dist/maplibre-gl.css';

import styleJson from '../../../assets/maplibre/stylespec.json';


type TelemetryCesiumSceneProps = {
  telemetry: any,
  history: any,
  rocketPos: any,
  isTrackOn : any,
  zoomDistance: any
};


export default function TelemetryCesiumScene({ telemetry, history, rocketPos, isTrackOn, zoomDistance } : TelemetryCesiumSceneProps ) {
  const mapRef = useRef<MapRef>(null);

  /*
  useEffect(() => {
    console.log("Rocket Position Changed: " + rocketPos);
    if (mapRef != null){
      console.log(mapRef.current);
      mapRef.current?.flyTo({center: [rocketPos.z, rocketPos.x], duration: 2000});
    }
  }, [mapRef]);

  */

  useEffect(() => {
    
    if (mapRef != null){

    }
  }, [mapRef]);

  return (
    <div style={{ width: "100%", height: "100%", position: "fixed" }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: rocketPos.z,
          latitude: rocketPos.x,
          zoom: 14,
          pitch: 60, //degrees
          bearing: -30 //degrees
          
        }}
        // @ts-expect-error
        mapStyle= {styleJson}
        longitude = {rocketPos.z}
        latitude = {rocketPos.x}

        dragPan = {false}
        scrollZoom = {false}
        doubleClickZoom = {false}

        zoom={zoomDistance}
      >

        <Marker latitude={rocketPos.x} longitude={rocketPos.z}></Marker>
        {/*<Layer></Layer>*/}
      </Map>

    </div>
  );
}

