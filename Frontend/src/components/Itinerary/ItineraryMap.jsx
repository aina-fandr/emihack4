import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const startIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function ItineraryMap({ startPoint, routePoints, destination, showRoute, avoidTraffic }) {
  const getCenter = () => {
    if (startPoint) return [startPoint.lat, startPoint.lng];
    return [-18.9137, 47.5361];
  };

  const getRouteColor = () => {
    if (avoidTraffic) return '#22c55e';
    return '#2563eb';
  };

  const routePositions = routePoints.map(p => [p.lat, p.lng]);

  return (
    <MapContainer
      center={getCenter()}
      zoom={14}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='OpenStreetMap'
      />

      {showRoute && routePositions.length > 0 && (
        <Polyline
          positions={routePositions}
          color={getRouteColor()}
          weight={4}
          opacity={0.8}
          smoothFactor={1}
        />
      )}

      {startPoint && (
        <Marker position={[startPoint.lat, startPoint.lng]} icon={startIcon}>
          <Popup>Départ</Popup>
        </Marker>
      )}

      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={endIcon}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {avoidTraffic && (
        <div className="absolute top-3 right-3 z-[1000] bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-md">
          Trafic évité
        </div>
      )}
    </MapContainer>
  );
}