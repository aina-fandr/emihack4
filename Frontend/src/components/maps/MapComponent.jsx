// components/maps/MapComponent.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Correction des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Coordonnées des routes de Madagascar
const ROADS_DATA = [
  {
    road: 'RN1',
    name: 'Route Nationale 1',
    region: 'Analamanga',
    city: 'Antananarivo',
    coordinates: [
      [-18.91368, 47.53613],
      [-18.90500, 47.52500],
      [-18.89500, 47.51500],
      [-18.87919, 47.50794]
    ]
  },
  {
    road: 'RN2',
    name: 'Route Nationale 2',
    region: 'Analamanga',
    city: 'Antananarivo',
    coordinates: [
      [-18.90378, 47.52634],
      [-18.91500, 47.53500],
      [-18.92500, 47.54300],
      [-18.93044, 47.54647]
    ]
  },
  {
    road: 'RN3',
    name: 'Route Nationale 3',
    region: 'Analamanga',
    city: 'Antananarivo',
    coordinates: [
      [-18.91124, 47.51488],
      [-18.90300, 47.51000],
      [-18.89350, 47.50868]
    ]
  },
  {
    road: 'RN4',
    name: 'Route Nationale 4',
    region: 'Atsinanana',
    city: 'Toamasina',
    coordinates: [
      [-18.15523, 49.39237],
      [-18.14700, 49.39800],
      [-18.14193, 49.40578]
    ]
  },
  {
    road: 'RN6',
    name: 'Route Nationale 6',
    region: 'Boeny',
    city: 'Mahajanga',
    coordinates: [
      [-15.71667, 46.31667],
      [-15.72400, 46.32800],
      [-15.72987, 46.33558]
    ]
  },
  {
    road: 'RN7',
    name: 'Route Nationale 7',
    region: 'Vakinankaratra',
    city: 'Antsirabe',
    coordinates: [
      [-19.86583, 47.03333],
      [-19.85500, 47.04800],
      [-19.84526, 47.06376]
    ]
  },
  {
    road: 'RN10',
    name: 'Route Nationale 10',
    region: 'Diana',
    city: 'Antsiranana',
    coordinates: [
      [-12.27823, 49.29171],
      [-12.28300, 49.29900],
      [-12.28660, 49.30550]
    ]
  },
  {
    road: 'RN11',
    name: 'Route Nationale 11',
    region: 'Diana',
    city: 'Nosy Be',
    coordinates: [
      [-13.31500, 48.26760],
      [-13.32000, 48.27400],
      [-13.32228, 48.27893]
    ]
  }
];

// Couleurs selon le statut du trafic
const TRAFFIC_COLORS = {
  fluide: '#22c55e',
  modere: '#eab308',
  dense: '#f97316',
  bloque: '#ef4444'
};

export default function MapComponent({ center, zoom, userLocation, trafficData, searchResults }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const routesLayer = useRef(null);
  const markersLayer = useRef(null);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Créer la carte
    mapInstance.current = L.map(mapContainer.current, {
      center: center || [-18.9137, 47.5361],
      zoom: zoom || 13,
      zoomControl: true,
      attributionControl: false
    });

    // Ajouter le fond de carte OpenStreetMap (gratuit)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Créer des groupes de couches
    routesLayer.current = L.layerGroup().addTo(mapInstance.current);
    markersLayer.current = L.layerGroup().addTo(mapInstance.current);

    // Ajouter le contrôle d'échelle
    L.control.scale({
      imperial: false,
      position: 'bottomleft'
    }).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  // Mettre à jour le centre
  useEffect(() => {
    if (mapInstance.current && center) {
      mapInstance.current.setView(center, zoom || 13, {
        animate: true,
        duration: 1
      });
    }
  }, [center, zoom]);

  // Dessiner les routes de trafic
  useEffect(() => {
    if (!mapInstance.current || !routesLayer.current || !trafficData?.length) return;

    // Nettoyer les anciennes routes
    routesLayer.current.clearLayers();

    // Pour chaque donnée de trafic, trouver et dessiner la route
    trafficData.forEach(traffic => {
      const roadData = ROADS_DATA.find(r => r.road === traffic.road);
      if (!roadData) return;

      const color = TRAFFIC_COLORS[traffic.status] || '#22c55e';
      const coordinates = roadData.coordinates.map(coord => [coord[0], coord[1]]);

      // Ligne principale
      const routeLine = L.polyline(coordinates, {
        color: color,
        weight: 5,
        opacity: 0.8,
        smoothFactor: 1,
        className: 'traffic-route'
      });

      // Effet de lueur
      const glowLine = L.polyline(coordinates, {
        color: color,
        weight: 12,
        opacity: 0.2,
        smoothFactor: 1
      });

      // Ajouter les lignes au groupe
      glowLine.addTo(routesLayer.current);
      routeLine.addTo(routesLayer.current);

      // Ajouter des marqueurs aux extrémités
      const startMarker = L.circleMarker(coordinates[0], {
        radius: 5,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      });

      const endMarker = L.circleMarker(coordinates[coordinates.length - 1], {
        radius: 5,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      });

      startMarker.addTo(routesLayer.current);
      endMarker.addTo(routesLayer.current);

      // Popup avec infos trafic
      routeLine.bindPopup(`
        <div style="font-family: sans-serif; padding: 5px;">
          <strong style="font-size: 14px;">${traffic.road} - ${traffic.roadName || roadData.name}</strong><br>
          <span style="font-size: 12px;">${traffic.city}, ${traffic.region}</span><br>
          <span style="font-size: 13px; font-weight: bold; color: ${color};">
            ${traffic.status.toUpperCase()} - ${traffic.level}%
          </span>
          ${traffic.currentSpeed ? `<br><span style="font-size: 11px;">Vitesse: ${traffic.currentSpeed} km/h</span>` : ''}
        </div>
      `);
    });
  }, [trafficData]);

  // Afficher la position utilisateur
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current || !userLocation) return;

    markersLayer.current.clearLayers();

    // Marqueur utilisateur
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon
    }).bindPopup('Vous êtes ici');

    userMarker.addTo(markersLayer.current);

    // Cercle de précision
    const accuracyCircle = L.circle([userLocation.lat, userLocation.lng], {
      radius: 100,
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      weight: 1
    });

    accuracyCircle.addTo(markersLayer.current);
  }, [userLocation]);

  // Résultats de recherche
  useEffect(() => {
    if (!mapInstance.current || !searchResults?.length) return;

    searchResults.forEach(result => {
      const roadData = ROADS_DATA.find(r => r.road === result.road);
      if (!roadData) return;

      const coords = roadData.coordinates[0];
      
      L.popup({
        className: 'search-popup'
      })
        .setLatLng(coords)
        .setContent(`
          <div style="padding: 8px; font-family: sans-serif;">
            <strong>${result.road}</strong><br>
            <span style="font-size: 12px;">${result.city} - ${result.region}</span><br>
            <span style="color: ${TRAFFIC_COLORS[result.status]}; font-weight: bold;">
              ${result.status.toUpperCase()} - ${result.level}%
            </span>
          </div>
        `)
        .openOn(mapInstance.current);
    });
  }, [searchResults]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ backgroundColor: '#1e293b' }}
    />
  );
}