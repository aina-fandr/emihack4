import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icône verte pour l'utilisateur
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icône pour les résultats de recherche
const searchIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Couleurs de trafic
const trafficColors = {
  'Fluide': '#22c55e',
  'Moyen': '#eab308',
  'Modéré': '#f97316',
  'Dense': '#ef4444',
  'Très dense': '#dc2626'
};

// Couleurs pour les cercles
const getTrafficColor = (traffic) => {
  return trafficColors[traffic] || '#22c55e';
};

export default function MapComponent({ 
  center = [-18.9137, 47.5361], 
  zoom = 6, // Zoom plus large pour voir toute l'île
  userLocation,
  selectedLocation,
  searchResults = [],
  allRegions = {},
  trafficData = {}
}) {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

  // Centrer la carte sur le résultat sélectionné
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const map = mapRef.current;
      map.setView([selectedLocation.lat, selectedLocation.lng], 12);
    }
  }, [selectedLocation]);

  // Afficher les résultats de recherche sur la carte
  useEffect(() => {
    if (searchResults.length > 0 && mapRef.current) {
      const bounds = searchResults.map(r => [r.lat, r.lng]);
      if (bounds.length > 0) {
        const map = mapRef.current;
        const padding = 0.5;
        const lats = bounds.map(b => b[0]);
        const lngs = bounds.map(b => b[1]);
        const minLat = Math.min(...lats) - padding;
        const maxLat = Math.max(...lats) + padding;
        const minLng = Math.min(...lngs) - padding;
        const maxLng = Math.max(...lngs) + padding;
        map.fitBounds([[minLat, minLng], [maxLat, maxLng]]);
      }
    }
  }, [searchResults]);

  // Centrer sur la position de l'utilisateur
  useEffect(() => {
    if (userLocation && mapRef.current) {
      const map = mapRef.current;
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [userLocation]);

  // Générer les marqueurs pour toutes les régions
  const generateRegionMarkers = () => {
    const markers = [];
    for (const [region, data] of Object.entries(allRegions)) {
      // Marqueur pour la région
      markers.push({
        id: `region-${region}`,
        name: region,
        type: 'Region',
        lat: data.center.lat,
        lng: data.center.lng,
        traffic: 'Moyen',
        isRegion: true,
        zones: data.zones
      });
      
      // Marqueurs pour les zones de la région
      data.zones.forEach(zone => {
        const traffic = trafficData[zone] || 'Fluide';
        const coords = {
          lat: data.center.lat + (Math.random() - 0.5) * 0.05,
          lng: data.center.lng + (Math.random() - 0.5) * 0.05
        };
        markers.push({
          id: `${region}-${zone}`,
          name: zone,
          type: 'Zone',
          region: region,
          lat: coords.lat,
          lng: coords.lng,
          traffic: traffic,
          isRegion: false
        });
      });
    }
    return markers;
  };

  const allMarkers = generateRegionMarkers();

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
        ref={mapRef}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Marqueur de la position de l'utilisateur (VERT) */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-green-600">📍 Vous êtes ici</p>
                <p className="text-xs text-slate-500">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Tous les marqueurs des zones (VERTS) */}
        {allMarkers.map((marker) => (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.lng]}
            radius={marker.isRegion ? 8 : 5}
            color={marker.isRegion ? '#22c55e' : getTrafficColor(marker.traffic)}
            fillColor={marker.isRegion ? '#22c55e' : getTrafficColor(marker.traffic)}
            fillOpacity={marker.isRegion ? 0.5 : 0.7}
            weight={marker.isRegion ? 3 : 2}
            eventHandlers={{
              click: () => {
                const map = mapRef.current;
                if (map) map.setView([marker.lat, marker.lng], 12);
              }
            }}
          >
            <Popup>
              <div className="text-center max-w-xs">
                <p className="font-bold text-slate-800 text-lg">{marker.name}</p>
                <p className="text-sm text-slate-500">{marker.isRegion ? 'Région' : marker.region || 'Zone'}</p>
                {!marker.isRegion && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: getTrafficColor(marker.traffic) }}
                    ></span>
                    <span className="text-sm font-medium">{marker.traffic}</span>
                  </div>
                )}
                {marker.isRegion && marker.zones && (
                  <div className="mt-2 text-xs text-slate-500">
                    <p>{marker.zones.length} zones</p>
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Résultats de recherche sur la carte */}
        {searchResults.map((result) => (
          <CircleMarker
            key={result.id}
            center={[result.lat, result.lng]}
            radius={10}
            color={getTrafficColor(result.traffic)}
            fillColor={getTrafficColor(result.traffic)}
            fillOpacity={0.8}
            weight={3}
            eventHandlers={{
              click: () => {
                const map = mapRef.current;
                if (map) map.setView([result.lat, result.lng], 14);
              }
            }}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold text-slate-800">{result.name}</p>
                <p className="text-sm text-slate-500">{result.region}</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: getTrafficColor(result.traffic) }}
                  ></span>
                  <span className="text-sm font-medium">{result.traffic}</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Résultat sélectionné (marqueur rouge spécial) */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={searchIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-red-600">📍 {selectedLocation.name}</p>
                <p className="text-sm text-slate-500">{selectedLocation.region}</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: getTrafficColor(selectedLocation.traffic) }}
                  ></span>
                  <span className="text-sm font-medium">{selectedLocation.traffic}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}