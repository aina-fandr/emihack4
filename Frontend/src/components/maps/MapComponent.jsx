import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

// Forcer le déplacement fluide de la carte lors des changements de zone
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { animate: true, duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

function MapControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-8 right-6 z-[1000] flex flex-col gap-2">
      <button onClick={() => map.zoomIn()} className="bg-white/95 p-3 rounded-xl shadow-xl border border-slate-200/50 hover:bg-slate-50 transition-colors"><ZoomIn className="w-5 h-5 text-slate-700" /></button>
      <button onClick={() => map.zoomOut()} className="bg-white/95 p-3 rounded-xl shadow-xl border border-slate-200/50 hover:bg-slate-50 transition-colors"><ZoomOut className="w-5 h-5 text-slate-700" /></button>
      <button onClick={() => map.setView([-18.9137, 47.5361], 13)} className="bg-white/95 p-3 rounded-xl shadow-xl border border-slate-200/50 hover:bg-slate-50 transition-colors"><RefreshCw className="w-5 h-5 text-slate-700" /></button>
    </div>
  );
}

export default function MapComponent({ center = [-18.9137, 47.5361], zoom = 12, trafficPoints = [] }) {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

  const getTrafficColor = (status) => {
    switch (status) {
      case 'fluide': return '#22c55e';   // Green-500
      case 'modere': return '#eab308';   // Yellow-500
      case 'dense': return '#f97316';    // Orange-500
      case 'bloque': return '#ef4444';   // Red-500
      default: return '#22c55e';
    }
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer center={center} zoom={zoom} className="w-full h-full" zoomControl={false} ref={mapRef} whenReady={() => setMapReady(true)}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        <ChangeView center={center} zoom={zoom} />
        {mapReady && <MapControls />}
        
        {/* 🗺️ TRACÉ DES AXES AVEC NOM FLOTTANT SANS RÉPÉTITION */}
        {trafficPoints.map((axis) => {
          if (axis.lat_start && axis.lng_start && axis.lat_end && axis.lng_end) {
            const positions = [
              [parseFloat(axis.lat_start), parseFloat(axis.lng_start)],
              [parseFloat(axis.lat_end), parseFloat(axis.lng_end)]
            ];

            return (
              <Polyline
                key={`route-${axis.id}`}
                positions={positions}
                pathOptions={{
                  color: getTrafficColor(axis.status),
                  weight: 6,         
                  opacity: 0.85,
                  lineCap: 'round'
                }}
              >
                {/* Si l'axe est marqué pour afficher son libellé flottant */}
                {axis.showLabelOnMap && (
                  <Tooltip 
                    permanent 
                    direction="center" 
                    sticky
                    className="bg-slate-900/90 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-md border border-slate-700 pointer-events-none uppercase tracking-wide opacity-90"
                  >
                    {axis.road}
                  </Tooltip>
                )}

                <Popup>
                  <div className="text-slate-800 p-1">
                    <p className="font-bold text-sm border-b pb-1 mb-1">{axis.road}</p>
                    <p className="text-xs">🏙️ Ville : {axis.city}</p>
                    <p className="text-xs font-semibold">
                      État : <span style={{ color: getTrafficColor(axis.status) }}>{axis.status.toUpperCase()} ({axis.level}%)</span>
                    </p>
                  </div>
                </Popup>
              </Polyline>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
}