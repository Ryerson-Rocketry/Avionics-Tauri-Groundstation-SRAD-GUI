import React, { useState, useEffect } from "react";
import TelemetryScene from "./TelemetryScene.jsx";
import { useTheme } from "../../styles/ThemeContext.jsx";
import { ZOOM_MIN, ZOOM_MAX, DEFAULT_ZOOM } from "./TelemetryScene.jsx";


import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import { Marker, Polyline, Tooltip } from "react-leaflet";

import rocketMarker from "../../../assets/map/rocket_marker.png";
import apogeeMarker from "../../../assets/map/apogee_marker.png";
import launchMarker from "../../../assets/map/launch_marker.png";

import { ZOOM_MAX_GPS, ZOOM_MIN_GPS } from "../components/SimViewPanel.jsx";

import "./GpsScene.css";

var rocketIcon = L.icon({
    iconUrl: rocketMarker,

    iconSize:     [25, 25], // size of the icon
    iconAnchor:   [12.5,12.5], // point of the icon which will correspond to marker's location
    tooltipAnchor:  [0, 12.5] // point from which the popup should open relative to the iconAnchor
});

var apogeeIcon = L.icon({
    iconUrl: apogeeMarker,

    iconSize:     [50,50], // size of the icon
    iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
    tooltipAnchor:  [0, -25] // point from which the popup should open relative to the iconAnchor
});

var launchIcon = L.icon({
    iconUrl: launchMarker,

    iconSize:     [25, 25], // size of the icon
    iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
    tooltipAnchor:  [0, 12.5] // point from which the popup should open relative to the iconAnchor
});

function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, map.getZoom());
  }, [coords]);
  return null;
}

function MapZoom({zoom }) {
  const map = useMap();
  useEffect(() => {
    if (zoom) map.setZoom(zoom);
  }, [zoom]);
  return null;
}

const ESRI_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTRIB = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
const OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIB = '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const LOCAL_URL = "http://localhost:3000/MAIN/{z}/{x}/{y}";

export function GpsScene({targetPos, zoom, satView, showLabel, showPath, localHosting}) {
    const [map, setMap] = useState(undefined); 
    const [rocketPath, setRocketPath] = useState ([]);

    useEffect(() => {
        //var mapped = targetPos.map(item => ({ ["x"]: item.value }) );

        var temp = [];
        for (var i = 0; i < targetPos.all.length; i++){
          temp.push([targetPos.all[i].x, targetPos.all[i].z]);
        }
        setRocketPath(temp);
      }
      ,[targetPos]);

    return (
        <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={[targetPos.current.x, targetPos.current.y]}
        zoom={zoom}
        maxZoom={ZOOM_MAX_GPS}
        minZoom={ZOOM_MIN_GPS}
        scrollWheelZoom= {false}
        zoomControl={false}
        // @ts-ignore
        ref={setMap}
        attributionControl={false}
        >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={localHosting === true ? LOCAL_URL : satView === true ? ESRI_URL : OSM_URL}
        />
            
            <MapRecenter coords={{lat: targetPos.current.x, lng: targetPos.current.z}} />
            <MapZoom zoom={zoom}/>
            <Marker  zIndexOffset={1000} icon={rocketIcon} position={{lat: targetPos.current.x, lng: targetPos.current.z}} >
              {/*<Tooltip direction="bottom"  opacity={0.1} permanent>Rocket</Tooltip>*/}
            </Marker>
          
            { //don't let apogee point show if current point is the apogee
              targetPos.apogeePoint.x != targetPos.current.x ?             
            
              <Marker icon={apogeeIcon} position={{lat: targetPos.apogeePoint.x, lng: targetPos.apogeePoint.z}} >
                {showLabel === true ? <Tooltip className="tooltip" direction="top" offset={[0, 0]} opacity={1} permanent>Apogee Point</Tooltip> : []}
              </Marker>

              :

              []

            }

            {showPath === true ? <Polyline positions={rocketPath}> </Polyline> : [] }

                      
            <Marker icon={launchIcon} position={{lat: targetPos.launchPoint.x, lng: targetPos.launchPoint.z}} >
              {showLabel === true ? <Tooltip className="tooltip" direction="bottom" offset={[0, 0]} opacity={1} permanent>Launchpad</Tooltip> : []}
            </Marker>

        </MapContainer>
        
    );
}
