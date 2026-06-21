import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllBusLines, getBusLinesByCity } from '../../data/busData';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icônes pour les marqueurs
const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icône pour les arrêts de bus
const busStopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIxIi8+PGNpcmNsZSBjeD0iMTUiIGN5PSI5IiByPSIxIi8+PC9zdmc+',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

export default function ItineraryMap({ 
  startPoint, 
  routePoints, 
  destination, 
  destinationName,
  showRoute, 
  avoidTraffic,
  steps = [],
  reliability = 'élevée',
  userLocation
}) {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [showBusStops, setShowBusStops] = useState(true);
  const [busLines, setBusLines] = useState([]);

  // Charger les lignes de bus
  useEffect(() => {
    const allLines = getAllBusLines();
    setBusLines(Object.values(allLines));
  }, []);

  // Centrer la carte sur le trajet
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    
    const map = mapRef.current;
    
    if (routePoints && routePoints.length > 1) {
      const positions = routePoints.map(p => [p.lat, p.lng]);
      
      try {
        const lats = positions.map(p => p[0]);
        const lngs = positions.map(p => p[1]);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        
        const latPadding = Math.max((maxLat - minLat) * 0.2, 0.05);
        const lngPadding = Math.max((maxLng - minLng) * 0.2, 0.05);
        
        const bounds = [
          [minLat - latPadding, minLng - lngPadding],
          [maxLat + latPadding, maxLng + lngPadding]
        ];
        
        map.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 14
        });
      } catch (e) {
        console.warn('Erreur fitBounds:', e);
        if (positions.length > 0) {
          map.setView(positions[0], 12);
        }
      }
    } 
    else if (startPoint && destination) {
      const centerLat = (startPoint.lat + destination.lat) / 2;
      const centerLng = (startPoint.lng + destination.lng) / 2;
      map.setView([centerLat, centerLng], 10);
    }
    else if (startPoint && startPoint.lat && startPoint.lng) {
      map.setView([startPoint.lat, startPoint.lng], 13);
    }
    else if (userLocation && userLocation.lat && userLocation.lng) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [routePoints, startPoint, destination, userLocation, mapReady]);

  const routePositions = routePoints && routePoints.length > 0 
    ? routePoints.map(p => [p.lat, p.lng]) 
    : [];

  // Vérifier si la destination est dans une ville avec des lignes de bus
  const currentCity = destinationName?.includes('Fianarantsoa') ? 'Fianarantsoa' :
                      destinationName?.includes('Antananarivo') ? 'Antananarivo' : null;

  // Couleur de la route - BLEU pour le chemin principal
  const getMainRouteColor = () => {
    return '#2563eb'; // Bleu
  };

  // Couleur de l'itinéraire suggéré - VERT pointillé
  const getSuggestedRouteColor = () => {
    return '#22c55e'; // Vert
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : [-18.9137, 47.5361]}
        zoom={13}
        className="w-full h-full"
        zoomControl={true}
        ref={mapRef}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* === ROUTE PRINCIPALE - LIGNE BLEUE CONTINUE === */}
        {showRoute && routePositions.length > 0 && (
          <>
            <Polyline
              positions={routePositions}
              color={getMainRouteColor()}
              weight={7}
              opacity={0.9}
              smoothFactor={1}
            />
            
            {/* Effet de lueur bleue */}
            <Polyline
              positions={routePositions}
              color="rgba(37, 99, 235, 0.15)"
              weight={18}
              opacity={0.3}
              smoothFactor={1}
            />
          </>
        )}

        {/* === ITINÉRAIRE SUGGÉRÉ - LIGNE VERTE POINTILLÉE === */}
        {showRoute && routePositions.length > 0 && (
          <>
            <Polyline
              positions={routePositions}
              color={getSuggestedRouteColor()}
              weight={5}
              opacity={0.7}
              smoothFactor={1}
              dashArray="10, 8"
            />
            
            {/* Effet de lueur verte pointillée */}
            <Polyline
              positions={routePositions}
              color="rgba(34, 197, 94, 0.1)"
              weight={14}
              opacity={0.2}
              smoothFactor={1}
              dashArray="10, 8"
            />
          </>
        )}

        {/* === LIGNES DE BUS === */}
        {showBusStops && currentCity && (
          <>
            {busLines
              .filter(line => line.ville === currentCity)
              .map((line) => (
                <React.Fragment key={line.id}>
                  <Polyline
                    positions={line.trace}
                    color={line.couleur}
                    weight={3}
                    opacity={0.5}
                    dashArray="6, 4"
                  />
                  
                  {line.arrets.map((arret) => (
                    <Marker key={arret.id} position={[arret.lat, arret.lng]} icon={busStopIcon}>
                      <Popup>
                        <div className="font-sans p-1">
                          <p className="font-bold text-slate-900 text-sm">🚌 {arret.nom}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{line.nom}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </React.Fragment>
              ))}
          </>
        )}

        {/* === MARQUEUR 1: POSITION ACTUELLE (VERT) === */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-green-600 text-lg">📍 Ma position</p>
                  <p className="text-xs text-slate-500">Vous êtes ici</p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={80}
              color="#22c55e"
              fillColor="#22c55e"
              fillOpacity={0.1}
            />
          </>
        )}

        {/* === MARQUEUR 2: DÉPART (ROUGE) === */}
        {startPoint && startPoint.lat && startPoint.lng && (
          <>
            <Marker position={[startPoint.lat, startPoint.lng]} icon={startIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-red-600 text-lg">🚗 Départ</p>
                  <p className="text-xs text-slate-500">Point de départ</p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[startPoint.lat, startPoint.lng]}
              radius={100}
              color="#ef4444"
              fillColor="#ef4444"
              fillOpacity={0.08}
            />
          </>
        )}

        {/* === MARQUEUR 3: DESTINATION (BLEU) === */}
        {destination && destination.lat && destination.lng && (
          <>
            <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-blue-600 text-lg">🎯 Destination</p>
                  <p className="text-xs text-slate-500">{destinationName || 'Destination'}</p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[destination.lat, destination.lng]}
              radius={120}
              color="#3b82f6"
              fillColor="#3b82f6"
              fillOpacity={0.08}
            />
          </>
        )}

        {/* Légende */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-slate-600">Ma position</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-red-500"></div>
              <span className="text-slate-600">Départ</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span className="text-slate-600">Arrivée</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-blue-500" style={{ border: '2px solid #2563eb' }}></div>
              <span className="text-slate-600">Route</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-green-500 border-2 border-dashed border-green-500"></div>
              <span className="text-slate-600">Itinéraire</span>
            </div>
            {currentCity && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-blue-400" style={{ border: '2px dashed #3b82f6' }}></div>
                <span className="text-slate-600">Bus</span>
              </div>
            )}
          </div>
        </div>
      </MapContainer>

      {/* Badge route principale */}
      <div className="absolute top-4 right-4 z-[1000] bg-blue-500/95 text-white px-3 py-1.5 rounded-xl text-xs font-medium shadow-lg border border-blue-400">
        <div className="flex items-center gap-2">
          <span>🔵</span>
          <span>Route principale</span>
        </div>
      </div>

      {/* Badge itinéraire suggéré */}
      <div className="absolute top-16 right-4 z-[1000] bg-green-500/95 text-white px-3 py-1.5 rounded-xl text-xs font-medium shadow-lg border border-green-400">
        <div className="flex items-center gap-2">
          <span>🟢</span>
          <span>Itinéraire suggéré</span>
        </div>
      </div>

      {/* Badge fiabilité */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-medium shadow-lg">
        <div className="flex items-center gap-2">
          <span>🛡️</span>
          <span>Fiabilité: {reliability === 'élevée' ? '🟢 Élevée' : reliability === 'moyenne' ? '🟡 Moyenne' : '🔴 Faible'}</span>
        </div>
      </div>

      {/* Information destination */}
      {destinationName && (
        <div className="absolute top-4 left-4 z-[1000] bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-medium">
          🎯 {destinationName}
        </div>
      )}

      {/* Info bus */}
      {currentCity && (
        <div className="absolute bottom-20 left-4 z-[1000] bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-medium shadow-lg">
          🚌 Lignes de bus disponibles
        </div>
      )}
    </div>
  );
}