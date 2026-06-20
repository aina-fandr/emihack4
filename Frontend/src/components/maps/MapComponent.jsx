import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant pour contrôler la carte
function MapControls({ onLocationFound }) {
  const map = useMap();

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  const handleReset = () => {
    map.setView([-18.9137, 47.5361], 13);
  };

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <>
      {/* Contrôles de zoom */}
      <div className="absolute bottom-8 right-6 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white/95 hover:bg-white p-3 rounded-xl shadow-xl border border-slate-200/50 transition hover:scale-105 active:scale-95"
          title="Zoom avant"
        >
          <ZoomIn className="w-5 h-5 text-slate-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white/95 hover:bg-white p-3 rounded-xl shadow-xl border border-slate-200/50 transition hover:scale-105 active:scale-95"
          title="Zoom arrière"
        >
          <ZoomOut className="w-5 h-5 text-slate-700" />
        </button>
        <button
          onClick={handleReset}
          className="bg-white/95 hover:bg-white p-3 rounded-xl shadow-xl border border-slate-200/50 transition hover:scale-105 active:scale-95"
          title="Réinitialiser"
        >
          <RefreshCw className="w-5 h-5 text-slate-700" />
        </button>
        <button
          onClick={handleLocate}
          className="bg-white/95 hover:bg-white p-3 rounded-xl shadow-xl border border-slate-200/50 transition hover:scale-105 active:scale-95"
          title="Ma position"
        >
          <Crosshair className="w-5 h-5 text-blue-500" />
        </button>
      </div>
    </>
  );
}

// Composant principal - Chargement instantané
export default function MapComponent({ center = [-18.9137, 47.5361], zoom = 13, onLocationFound }) {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
        ref={mapRef}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {mapReady && <MapControls onLocationFound={onLocationFound} />}
        
        <Marker position={center}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-black">🚦 TrafficAssist</p>
              <p className="text-sm text-slate-500">Antananarivo</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}