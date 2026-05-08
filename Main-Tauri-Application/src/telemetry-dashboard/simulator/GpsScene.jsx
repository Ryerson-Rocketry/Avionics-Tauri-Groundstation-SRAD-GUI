import React, { useState, useEffect } from "react";
import TelemetryScene from "./TelemetryScene.jsx";
import { useTheme } from "../../styles/ThemeContext.jsx";
import { ZOOM_MIN, ZOOM_MAX, DEFAULT_ZOOM } from "./TelemetryScene.jsx";


import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import { Marker } from "react-leaflet";

import rocketMarker from "../../../assets/map/normal_marker.png";
import launchMarker from "../../../assets/map/star_marker.png";

import { ZOOM_MAX_GPS, ZOOM_MIN_GPS } from "../components/SimViewPanel.jsx";

var rocketIcon = L.icon({
    iconUrl: rocketMarker,

    iconSize:     [45, 45], // size of the icon
    iconAnchor:   [22, 35], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var launchIcon = L.icon({
    iconUrl: launchMarker,

    iconSize:     [45, 45], // size of the icon
    iconAnchor:   [22, 35], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
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


export function GpsScene({targetPos, zoom, satView}) {
    const [map, setMap] = useState(undefined); 

    return (
        <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={[targetPos.x, targetPos.y]}
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
            url={satView === true ? ESRI_URL : OSM_URL}
        />
            
            <MapRecenter coords={{lat: targetPos.x, lng: targetPos.z}} />
            <MapZoom zoom={zoom}/>
            <Marker position={{lat: targetPos.x, lng: targetPos.z}} />
        </MapContainer>
        
    );
}
