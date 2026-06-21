// Toutes les régions de Madagascar avec leurs zones et coordonnées précises
export const regionsData = {
  'Analamanga': {
    zones: ['Antananarivo', 'Ankorondrano', 'Analakely', 'Anosizato', 'Andraharo', 'Ivandry', 'Mahamasina', '67 Ha', 'Tanjombato', 'Ambohimanarina'],
    coordinates: {
      'Antananarivo': { lat: -18.8792, lng: 47.5079 },
      'Ankorondrano': { lat: -18.9137, lng: 47.5361 },
      'Analakely': { lat: -18.9150, lng: 47.5360 },
      'Anosizato': { lat: -18.9050, lng: 47.5250 },
      'Andraharo': { lat: -18.8950, lng: 47.5150 },
      'Ivandry': { lat: -18.9200, lng: 47.5450 },
      'Mahamasina': { lat: -18.9120, lng: 47.5280 },
      '67 Ha': { lat: -18.9000, lng: 47.5400 },
      'Tanjombato': { lat: -18.9300, lng: 47.5500 },
      'Ambohimanarina': { lat: -18.8880, lng: 47.5100 },
    },
    center: { lat: -18.9137, lng: 47.5361 }
  },
  'Atsinanana': {
    zones: ['Toamasina', 'Brickaville', 'Vatomandry'],
    coordinates: {
      'Toamasina': { lat: -18.1492, lng: 49.4023 },
      'Brickaville': { lat: -18.0833, lng: 49.0667 },
      'Vatomandry': { lat: -19.3333, lng: 48.9833 },
    },
    center: { lat: -18.1492, lng: 49.4023 }
  },
  'Boeny': {
    zones: ['Mahajanga', 'Marovoay'],
    coordinates: {
      'Mahajanga': { lat: -15.7167, lng: 46.3167 },
      'Marovoay': { lat: -16.1000, lng: 46.6333 },
    },
    center: { lat: -15.7167, lng: 46.3167 }
  },
  'Vakinankaratra': {
    zones: ['Antsirabe', 'Betafo', 'Ambatolampy'],
    coordinates: {
      'Antsirabe': { lat: -19.8667, lng: 47.0333 },
      'Betafo': { lat: -19.8333, lng: 46.8500 },
      'Ambatolampy': { lat: -19.3833, lng: 47.4167 },
    },
    center: { lat: -19.8667, lng: 47.0333 }
  },
  'Haute Matsiatra': {
    zones: ['Fianarantsoa', 'Ambalavao'],
    coordinates: {
      'Fianarantsoa': { lat: -21.4500, lng: 47.0833 },
      'Ambalavao': { lat: -21.8333, lng: 46.9333 },
    },
    center: { lat: -21.4500, lng: 47.0833 }
  },
  'Atsimo-Andrefana': {
    zones: ['Toliara', 'Sakaraha', 'Morombe'],
    coordinates: {
      'Toliara': { lat: -23.3500, lng: 43.6667 },
      'Sakaraha': { lat: -22.9000, lng: 44.5333 },
      'Morombe': { lat: -21.7500, lng: 43.3667 },
    },
    center: { lat: -23.3500, lng: 43.6667 }
  },
  'Diana': {
    zones: ['Antsiranana', 'Nosy Be', 'Ambilobe'],
    coordinates: {
      'Antsiranana': { lat: -12.2833, lng: 49.2833 },
      'Nosy Be': { lat: -13.3167, lng: 48.2667 },
      'Ambilobe': { lat: -13.2000, lng: 49.0500 },
    },
    center: { lat: -12.2833, lng: 49.2833 }
  }
};

// Données de trafic
export const trafficData = {
  'Antananarivo': 'Dense',
  'Ankorondrano': 'Modéré',
  'Analakely': 'Dense',
  'Anosizato': 'Très dense',
  'Andraharo': 'Moyen',
  'Ivandry': 'Fluide',
  'Mahamasina': 'Dense',
  '67 Ha': 'Fluide',
  'Tanjombato': 'Moyen',
  'Ambohimanarina': 'Fluide',
  'Toamasina': 'Moyen',
  'Mahajanga': 'Fluide',
  'Antsirabe': 'Moyen',
  'Fianarantsoa': 'Fluide',
  'Toliara': 'Fluide',
  'Antsiranana': 'Fluide',
  'Nosy Be': 'Fluide'
};

// Distances entre les villes (en km)
export const distances = {
  'Antananarivo-Toamasina': 215,
  'Antananarivo-Mahajanga': 570,
  'Antananarivo-Antsirabe': 170,
  'Antananarivo-Fianarantsoa': 420,
  'Antananarivo-Toliara': 940,
  'Antananarivo-Antsiranana': 1090,
  'Antananarivo-Nosy Be': 1070,
  'Toamasina-Mahajanga': 780,
  'Toamasina-Antsirabe': 380,
  'Mahajanga-Antsirabe': 740,
  'Antsirabe-Fianarantsoa': 250,
};

// Temps de trajet (en minutes)
export const travelTimes = {
  'Antananarivo-Toamasina': 240,
  'Antananarivo-Mahajanga': 480,
  'Antananarivo-Antsirabe': 180,
  'Antananarivo-Fianarantsoa': 420,
  'Antananarivo-Toliara': 720,
  'Antananarivo-Antsiranana': 900,
  'Antananarivo-Nosy Be': 960,
  'Toamasina-Mahajanga': 780,
  'Toamasina-Antsirabe': 380,
  'Mahajanga-Antsirabe': 740,
  'Antsirabe-Fianarantsoa': 250,
};

// === DONNÉES SPÉCIFIQUES POUR FIANARANTSOA ===

// Arrêts de bus de Fianarantsoa
export const arretsFianarantsoa = [
  { id: "stationnement", nom: "Stationnement (Gare Routière)", lat: -21.4485, lng: 47.0984 },
  { id: "paositra", nom: "La Paositra (Grande Poste)", lat: -21.4532, lng: 47.0871 },
  { id: "ampasambazaha", nom: "Ampasambazaha", lat: -21.4526, lng: 47.0825 },
  { id: "anjoma", nom: "Anjoma (Marché)", lat: -21.4443, lng: 47.0828 },
  { id: "tribunal", nom: "Tribunal", lat: -21.4402, lng: 47.0854 }
];

// Tracé de la ligne de bus de Fianarantsoa
export const trajetBusFianar = [
  [-21.4485, 47.0984],
  [-21.4510, 47.0945],
  [-21.4542, 47.0912],
  [-21.4532, 47.0871],
  [-21.4523, 47.0848],
  [-21.4526, 47.0825],
  [-21.4495, 47.0818],
  [-21.4468, 47.0821],
  [-21.4443, 47.0828],
  [-21.4421, 47.0838],
  [-21.4402, 47.0854]
];

// === FONCTIONS ===

// Obtenir la région d'une zone
export const getRegionByZone = (zoneName) => {
  for (const [region, data] of Object.entries(regionsData)) {
    if (data.zones && data.zones.includes(zoneName)) {
      return region;
    }
  }
  return null;
};

// Obtenir les coordonnées d'une zone - NE PAS appeler getAllBusStops ici
export const getZoneCoordinates = (zoneName) => {
  if (!zoneName) {
    return { lat: -18.9137, lng: 47.5361 };
  }

  // Chercher dans les coordonnées des régions
  for (const [region, data] of Object.entries(regionsData)) {
    if (data.coordinates && data.coordinates[zoneName]) {
      return data.coordinates[zoneName];
    }
  }

  // Chercher si la zone est dans une région
  for (const [region, data] of Object.entries(regionsData)) {
    if (data.zones && data.zones.includes(zoneName)) {
      return data.center;
    }
  }

  return { lat: -18.9137, lng: 47.5361 };
};

// Obtenir les coordonnées d'un lieu (zone ou arrêt de bus) - SANS boucle infinie
export const getCoordinates = (locationName) => {
  if (!locationName) {
    return { lat: -18.9137, lng: 47.5361 };
  }

  // 1. Vérifier si c'est un arrêt de bus de Fianarantsoa
  const fianarStop = arretsFianarantsoa.find(stop => stop.nom === locationName);
  if (fianarStop) {
    return { lat: fianarStop.lat, lng: fianarStop.lng };
  }

  // 2. Chercher dans les zones (N'utilise PAS getAllBusStops)
  return getZoneCoordinates(locationName);
};

// Vérifier si un nom est un arrêt de bus
export const isBusStop = (locationName) => {
  if (!locationName) return false;
  
  // Vérifier dans les arrêts de Fianarantsoa
  if (arretsFianarantsoa.some(stop => stop.nom === locationName)) {
    return true;
  }
  
  return false;
};

// Obtenir la distance entre deux villes
export const getDistance = (city1, city2) => {
  const key = `${city1}-${city2}`;
  const reverseKey = `${city2}-${city1}`;
  
  if (distances[key]) return distances[key];
  if (distances[reverseKey]) return distances[reverseKey];
  
  const coords1 = getCoordinates(city1);
  const coords2 = getCoordinates(city2);
  
  const R = 6371;
  const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
  const dLon = (coords2.lng - coords1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
};

// Obtenir le temps de trajet entre deux villes
export const getTravelTime = (city1, city2) => {
  const key = `${city1}-${city2}`;
  const reverseKey = `${city2}-${city1}`;
  
  if (travelTimes[key]) return travelTimes[key];
  if (travelTimes[reverseKey]) return travelTimes[reverseKey];
  
  const distance = getDistance(city1, city2);
  return Math.max(Math.round(distance / 50 * 60), 30);
};

// Générer des points de route
export const generateRoutePoints = (startZone, endZone) => {
  const startCoords = getCoordinates(startZone);
  const endCoords = getCoordinates(endZone);
  
  if (!startCoords || !startCoords.lat || !startCoords.lng) {
    return [{ lat: -18.9137, lng: 47.5361 }, { lat: -18.9137, lng: 47.5361 }];
  }
  
  if (!endCoords || !endCoords.lat || !endCoords.lng) {
    return [{ lat: -18.9137, lng: 47.5361 }, { lat: -18.9137, lng: 47.5361 }];
  }
  
  const points = [];
  const steps = 30;
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = startCoords.lat + (endCoords.lat - startCoords.lat) * t;
    const lng = startCoords.lng + (endCoords.lng - startCoords.lng) * t;
    const curve = Math.sin(t * Math.PI) * 0.02;
    points.push({
      lat: lat + curve * (i % 2 === 0 ? 1 : -1),
      lng: lng + curve * 0.5
    });
  }
  
  return points;
};

// Obtenir les alertes pour un trajet
export const getRouteAlerts = (startZone, endZone) => {
  const alerts = [];
  
  const zoneAlerts = {
    'Analakely': { type: 'danger', location: 'Analakely', message: 'Travaux en cours' },
    'Anosizato': { type: 'danger', location: 'Anosizato', message: 'Route barrée' },
    'Ivandry': { type: 'warning', location: 'Ivandry', message: 'Accident signalé' },
    'Mahamasina': { type: 'warning', location: 'Mahamasina', message: 'Circulation dense' },
  };
  
  if (zoneAlerts[endZone]) {
    alerts.push({ id: 1, ...zoneAlerts[endZone] });
  }
  
  return alerts;
};

// Générer les étapes de l'itinéraire
export const generateSteps = (startZone, endZone, transportMode) => {
  const steps = [];
  
  steps.push({
    type: 'start',
    title: 'Départ',
    description: `Départ de ${startZone}`,
    duration: '0 min'
  });

  if (transportMode === 'voiture' || transportMode === 'moto') {
    steps.push({
      type: 'turn',
      title: 'Direction principale',
      description: `Prendre la direction de ${endZone}`,
      duration: '10 min'
    });
  } else if (transportMode === 'bus') {
    steps.push({
      type: 'turn',
      title: 'Arrêt de bus',
      description: 'Prendre le bus direction destination',
      duration: '5 min'
    });
  } else if (transportMode === 'marche') {
    steps.push({
      type: 'turn',
      title: 'Passage piéton',
      description: 'Traverser vers la rue principale',
      duration: '2 min'
    });
  }

  steps.push({
    type: 'end',
    title: 'Arrivée',
    description: `Destination: ${endZone}`,
    duration: '0 min'
  });

  return steps;
};

// Obtenir tous les arrêts de bus - UTILISE getCoordinates mais SANS boucle infinie
export const getAllBusStops = () => {
  const stops = [];
  for (const [region, data] of Object.entries(regionsData)) {
    if (data.zones) {
      data.zones.forEach(zone => {
        // Utiliser getZoneCoordinates au lieu de getCoordinates pour éviter la boucle
        const coords = getZoneCoordinates(zone);
        stops.push({
          name: `Arrêt ${zone}`,
          region: region,
          lat: coords.lat + (Math.random() - 0.5) * 0.01,
          lng: coords.lng + (Math.random() - 0.5) * 0.01
        });
      });
    }
  }
  // Ajouter les arrêts spécifiques de Fianarantsoa
  arretsFianarantsoa.forEach(stop => {
    stops.push({
      name: stop.nom,
      region: 'Fianarantsoa',
      lat: stop.lat,
      lng: stop.lng
    });
  });
  return stops;
};

// Obtenir les arrêts de bus par région
export const getBusStopsByRegion = (regionName) => {
  const region = regionsData[regionName];
  if (!region || !region.zones) return [];
  
  const stops = region.zones.map(zone => {
    const coords = getZoneCoordinates(zone);
    return {
      name: `Arrêt ${zone}`,
      region: regionName,
      lat: coords.lat + (Math.random() - 0.5) * 0.01,
      lng: coords.lng + (Math.random() - 0.5) * 0.01
    };
  });
  
  // Ajouter les arrêts spécifiques de Fianarantsoa
  if (regionName === 'Fianarantsoa') {
    arretsFianarantsoa.forEach(stop => {
      stops.push({
        name: stop.nom,
        region: regionName,
        lat: stop.lat,
        lng: stop.lng
      });
    });
  }
  
  return stops;
};

// Temps optimisé
export const getOptimizedTime = (duration) => {
  const minutes = parseInt(duration);
  const optimized = Math.floor(minutes * 0.85);
  return `${optimized} min`;
};

// Instructions vocales
export const generateVoiceInstructions = (steps, transportMode) => {
  return steps.map((step, index) => ({
    step: index,
    text: step.description || step.title,
    duration: step.duration || '2 min'
  }));
};