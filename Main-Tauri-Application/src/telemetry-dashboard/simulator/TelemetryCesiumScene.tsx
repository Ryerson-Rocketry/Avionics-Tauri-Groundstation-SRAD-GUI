import React, { useRef, useEffect, useState } from "react";

import Map, { Layer, MapRef, Marker, Popup } from 'react-map-gl/maplibre';
// @ts-expect-error
import 'maplibre-gl/dist/maplibre-gl.css';

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

// @ts-expect-error
import MODEL_URL from "../../../assets/Models/Argus.glb";


import { ScenegraphLayer } from "@deck.gl/mesh-layers"; 
import {useControl} from 'react-map-gl/maplibre';
import {MapboxOverlay} from '@deck.gl/mapbox';
import {DeckProps} from '@deck.gl/core';

import {LineLayer, PathLayer} from 'deck.gl';


function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}


type FlightPath = {
  start: [longitude: number, latitude: number, altitude: number];
  end: [longitude: number, latitude: number, altitude: number];
};

//aint actually cesium (maplibre instead) but too lazy to change name
export default function TelemetryCesiumScene({ telemetry, history, rocketPos, isTrackOn, zoomDistance, satView, groundLevelOffset = 2, showPath, showLabel } : TelemetryCesiumSceneProps ) {
  const mapRef = useRef<MapRef>(null);
  const [rocketPath, setRocketPath] = useState ([]);
  const [rocketFlightPath, setRocketFlightPath] = useState([]);

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
    scenegraph: MODEL_URL,
    sizeScale: 0.050,
    pickable: true,
    getPosition: (d) => d.position,
    getOrientation: (d) => {
      const pitch = (telemetry.orientation.pitch) ;
      const yaw = telemetry.orientation.yaw;
      // [pitch, yaw, roll]
      return [-telemetry.orientation.pitch + 90,  telemetry.orientation.yaw, 0];
    },
    getScale: [1, 1, 1],
  });

  const line3dLayer = new LineLayer<FlightPath>({
      id: 'flight-paths',
      data: rocketFlightPath,
      opacity: 0.8,
      getSourcePosition: d => d.start,
      getTargetPosition: d => d.end,
      getColor: d => {
        return [100,100,100];
      },
      getWidth: 5,
      pickable: true
    })
  
  useEffect(() => {
    console.log("Rocket Position Changed: " + rocketPos);
    if (mapRef != null){
      mapRef.current?.setZoom(zoomDistance);
      mapRef.current?.setCenter([rocketPos.current.z, rocketPos.current.x]);
      mapRef.current?.setCenterElevation(rocketPos.current.y + groundLevelOffset);

      /*
      let lineGeo = mapRef.current?.queryRenderedFeatures();

      if (lineGeo != undefined){
        for (var i = 0; i < lineGeo?.length; i++){
          
          if (lineGeo[i].geometry.type.toString() == "LineString"){
            //console.log(lineGeo[i].geometry.type);
  

          }
          
        }
      }
      */
      
    }
  }, [mapRef, rocketPos, zoomDistance, groundLevelOffset]);

  


  
  useEffect(() => {
      //console.log("PATH" + rocketPath.length);
      //var mapped = targetPos.map(item => ({ ["x"]: item.value }) );
      
      var temp = [];
      var flightTemp = [] as FlightPath[];
      for (var i = 0; i < rocketPos.all.length; i++){
        temp.push([rocketPos.all[i].z, rocketPos.all[i].x, rocketPos.current.y]);

        if (i < rocketPos.all.length - 1 && i > 0){ //cannot create a path from the very first line vertice or the last
          flightTemp.push({
            start: [rocketPos.all[i-1].z, rocketPos.all[i-1].x, rocketPos.all[i-1].y + groundLevelOffset],
            end: [rocketPos.all[i].z, rocketPos.all[i].x, rocketPos.all[i].y + groundLevelOffset]})
        }
      }
      // @ts-expect-error
      setRocketPath(temp);
      // @ts-expect-error
      setRocketFlightPath(flightTemp);
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
                "exaggeration": 1
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
        <DeckGLOverlay layers={[layer, line3dLayer]} interleaved/>
      </Map>


    </div>
  );
}

