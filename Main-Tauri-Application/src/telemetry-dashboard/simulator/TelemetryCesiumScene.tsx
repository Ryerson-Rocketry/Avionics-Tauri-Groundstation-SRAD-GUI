import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";


import { Rocket } from "../objects/Rocket.jsx";
import { LaunchPlatform } from "../landscape/LaunchPlatform.jsx";
import { Trajectory } from "../landscape/Trajectory.jsx";
import { GpsScene } from "./GpsScene.jsx";

import Map, { Layer, MapRef, Marker, Popup } from 'react-map-gl/maplibre';
// @ts-expect-error
import 'maplibre-gl/dist/maplibre-gl.css';

import styleJson from '../../../assets/maplibre/stylespec.json';

// @ts-expect-error
import rocketMarker from "../../../assets/map/rocket_marker.png";
// @ts-expect-error
import apogeeMarker from "../../../assets/map/apogee_marker.png";
// @ts-expect-error
import launchMarker from "../../../assets/map/launch_marker.png";


type TelemetryCesiumSceneProps = {
  telemetry: any,
  history: any,
  rocketPos: any,
  isTrackOn : any,
  zoomDistance: any,
  satView: boolean,
  groundLevelOffset: number,
  
  showPath: boolean,
  showLabel: boolean
};

//const MODEL_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb";


import { ScenegraphLayer } from "@deck.gl/mesh-layers"; 
import DeckGL from "@deck.gl/react";


import {useControl} from 'react-map-gl/maplibre';
import {MapboxOverlay} from '@deck.gl/mapbox';
import {DeckProps} from '@deck.gl/core';
function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

//aint actually cesium (maplibre instead) but too lazy to change name
export default function TelemetryCesiumScene({ telemetry, history, rocketPos, isTrackOn, zoomDistance, satView, groundLevelOffset = 2, showPath, showLabel } : TelemetryCesiumSceneProps ) {
  const mapRef = useRef<MapRef>(null);

  const rocketModel = [{
    lat: rocketPos.current.x,   
    lng: rocketPos.current.z,
    altitude: rocketPos.current.y,
    heading: 4,
    position: [rocketPos.current.z, rocketPos.current.x, rocketPos.current.y+groundLevelOffset-10]
  }];
  
  const layer = new ScenegraphLayer({
    id: "airplane-layer",
    data: rocketModel,
    scenegraph: "../../../assets/Models/argus.glb",
    sizeScale: 0.010,
    pickable: true,
    getPosition: (d) => d.position,
    getOrientation: (d) => {
      const pitch = 0;
      const yaw = -d.heading;
      return [pitch, yaw, 0];
    },
    getScale: [1, 1, 1],
  });


  
  useEffect(() => {
    console.log("Rocket Position Changed: " + rocketPos);
    if (mapRef != null){
      mapRef.current?.setZoom(zoomDistance);
      mapRef.current?.setCenter([rocketPos.current.z, rocketPos.current.x]);
      mapRef.current?.setCenterElevation(rocketPos.current.y + groundLevelOffset);
      
    }
  }, [mapRef, rocketPos, zoomDistance, groundLevelOffset]);

  

  const [rocketPath, setRocketPath] = useState ([]);
  
  useEffect(() => {
      //console.log("PATH" + rocketPath.length);
      //var mapped = targetPos.map(item => ({ ["x"]: item.value }) );
      
      var temp = [];
      for (var i = 0; i < rocketPos.all.length; i++){
        temp.push([rocketPos.all[i].z, rocketPos.all[i].x]);
      }
      // @ts-expect-error
      setRocketPath(temp);
      
    }
  ,[rocketPos]);

  {/*
  return (
    <div style={{ width: "100%", height: "100%", position: "fixed" }}>
      <DeckGL
        initialViewState={{
          'latitude': rocketPos.current.x,
          'longitude': rocketPos.current.z,
          'zoom': zoomDistance,
          'bearing': 60,
          'pitch': -30,
        }}
        controller={true}
        layers={[layer]}

      >

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: rocketPos.current.z,
          latitude: rocketPos.current.x,
          zoom: zoomDistance,
          pitch: 60, //degrees
          bearing: -30 //degrees
          
        }}

        mapStyle= {{   
          "version": 8,
            "sources": {
                "osm": {
                    "type": "raster",
                    "tiles": [satView === false ? "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
                    "tileSize": 256,
                    "attribution": "&copy; OpenStreetMap Contributors",
                    "maxzoom": 20
                },
                
                "terrainSource": {
                    "type": "raster-dem",
                    "url": "https://tiles.mapterhorn.com/tilejson.json"
                },
                "hillshadeSource": {
                    "type": "raster-dem",
                    "url": "https://tiles.mapterhorn.com/tilejson.json"
                },
                'route': {
                  'type': 'geojson',
                  'data': {
                      'type': 'Feature',
                      'properties': {},
                      'geometry': {
                          'type': 'LineString',
                          'coordinates': 
                            showPath === true ? rocketPath : []
                          
                      }
                  }
              }
            },
            "layers": [
                {
                    "id": "osm",
                    "type": "raster",
                    "source": "osm"
                },
                {
                    "id": "hills",
                    "type": "hillshade",
                    "source": "hillshadeSource",
                    "layout": {"visibility": "visible"},
                    "paint": {"hillshade-shadow-color": "#1a170f"}
                },
                
                {
                  'id': 'route',
                  'type': 'line',
                  'source': 'route',
                  'layout': {
                      'line-join': 'round',
                      'line-cap': 'round'
                  },
                  'paint': {
                      'line-color': '#001aff',
                      'line-width': 5
                  }
                },
            ],
            "terrain": {
                "source": "terrainSource",
                "exaggeration": exaggerationLevel
            },
            
          "sky": {}
        }}
        longitude = {rocketPos.current.z}
        latitude = {rocketPos.current.x}

        dragPan = {false}
        scrollZoom = {false}
        doubleClickZoom = {false}

        zoom={zoomDistance}
      >
        <Marker latitude={rocketPos.launchPoint.x} longitude={rocketPos.launchPoint.z}>
           <img src={launchMarker} height={25}/>
        </Marker>
        <Marker latitude={rocketPos.apogeePoint.x} longitude={rocketPos.apogeePoint.z}>
           <img src={apogeeMarker} height={25}/>
        </Marker>
        <Marker latitude={rocketPos.current.x} longitude={rocketPos.current.z}>
          <img src={rocketMarker} height={25}/>
        </Marker>



      </Map>

      </DeckGL>
    </div>
  );
  */}

  return (
    <div style={{ width: "100%", height: "100%", position: "fixed" }}>
     

      <Map
        ref={mapRef}
        
        initialViewState={{
          longitude: rocketPos.current.z,
          latitude: rocketPos.current.x,
          zoom: zoomDistance,
          pitch: 60, //degrees
          bearing: -30 //degrees
          
        }}
        
        centerClampedToGround={false}
        maxPitch={180}
      

        mapStyle= {{   
          "version": 8,
            "sources": {
                "osm": {
                    "type": "raster",
                    "tiles": [satView === false ? "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
                    "tileSize": 256,
                    "attribution": "&copy; OpenStreetMap Contributors",
                    "maxzoom": 20
                },
                
                "terrainSource": {
                    "type": "raster-dem",
                    "url": "https://tiles.mapterhorn.com/tilejson.json"
                },
                "hillshadeSource": {
                    "type": "raster-dem",
                    "url": "https://tiles.mapterhorn.com/tilejson.json"
                },
                'route': {
                  'type': 'geojson',
                  'data': {
                      'type': 'Feature',
                      'properties': {},
                      'geometry': {
                          'type': 'LineString',
                          'coordinates': 
                            showPath === true ? rocketPath : []
                          
                      }
                  }
              }
            },
            "layers": [
                {
                    "id": "osm",
                    "type": "raster",
                    "source": "osm"
                },
                {
                    "id": "hills",
                    "type": "hillshade",
                    "source": "hillshadeSource",
                    "layout": {"visibility": "visible"},
                    "paint": {"hillshade-shadow-color": "#1a170f"}
                },
                
                {
                  'id': 'route',
                  'type': 'line',
                  'source': 'route',
                  'layout': {
                      'line-join': 'round',
                      'line-cap': 'round'
                  },
                  'paint': {
                      'line-color': '#001aff',
                      'line-width': 5
                  }
                },
            ],
            "terrain": {
                "source": "terrainSource",
                "exaggeration": 2
            },
            
          "sky": {}
        }}


        dragPan = {false}
        scrollZoom = {false}
        doubleClickZoom = {false}

      >
        <Marker latitude={rocketPos.launchPoint.x} longitude={rocketPos.launchPoint.z}>
           <img src={launchMarker} height={25}/>
        </Marker>
        <Marker latitude={rocketPos.apogeePoint.x} longitude={rocketPos.apogeePoint.z}>
           <img src={apogeeMarker} height={25}/>
        </Marker>
        <Marker latitude={rocketPos.current.x} longitude={rocketPos.current.z}>
          <img src={rocketMarker} height={25}/>
        </Marker>

        {/* @ts-expect-error */}
        <DeckGLOverlay layers={[layer]} interleaved/>
      </Map>


    </div>
  );
}

