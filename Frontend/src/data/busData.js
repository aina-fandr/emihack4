// =========================================================================
// 1. LIGNES DE BUS - ANTANANARIVO
// =========================================================================
export const tanaBusLines = {
  ligneNord: {
    id: 'tana-ligneNord',
    nom: "Ligne Nord (Alarobia - Analakely) [Tana]",
    couleur: "#3b82f6",
    ville: "Antananarivo",
    distanceKm: 5.5,
    conditionRoute: "BONNE",
    arrets: [
      { id: "tana-alarobia", nom: "Terminus Alarobia (Tana)", lat: -18.8782, lng: 47.5204 },
      { id: "tana-ivandry", nom: "Arrêt Ivandry [Rond-point] (Tana)", lat: -18.8854, lng: 47.5209 },
      { id: "tana-ankorondrano", nom: "Ankorondrano [Madauto] (Tana)", lat: -18.8942, lng: 47.5218 },
      { id: "tana-soarano", nom: "Gare Soarano (Tana)", lat: -18.9052, lng: 47.5251 },
      { id: "tana-analakely", nom: "Analakely Arcades (Tana)", lat: -18.9083, lng: 47.5271 }
    ],
    trace: [
      [-18.8782, 47.5204], [-18.8821, 47.5206], [-18.8854, 47.5209],
      [-18.8910, 47.5213], [-18.8942, 47.5218], [-18.8995, 47.5255],
      [-18.9030, 47.5253], [-18.9052, 47.5251], [-18.9070, 47.5262],
      [-18.9083, 47.5271]
    ]
  },
  ligneSudFasanyKarana: {
    id: 'tana-ligneSudFasanyKarana',
    nom: "Ligne Sud (Analakely - Fasan'ny Karana) [Tana]",
    couleur: "#10b981",
    ville: "Antananarivo",
    distanceKm: 6.2,
    conditionRoute: "MOYENNE",
    arrets: [
      { id: "tana-analakely-sud", nom: "Analakely [Esplanade] (Tana)", lat: -18.9095, lng: 47.5275 },
      { id: "tana-anosy-sud", nom: "Anosy [Près du Lac] (Tana)", lat: -18.9155, lng: 47.5228 },
      { id: "tana-tsimbazaza", nom: "Tsimbazaza [Carrefour] (Tana)", lat: -18.9292, lng: 47.5259 },
      { id: "tana-anamalhamy", nom: "Anjanamasina / Analamahitsy Sud (Tana)", lat: -18.9385, lng: 47.5280 },
      { id: "tana-fasany-karana", nom: "Gare Routière Fasan'ny Karana (Tana)", lat: -18.9448, lng: 47.5312 }
    ],
    trace: [
      [-18.9095, 47.5275], [-18.9125, 47.5242], [-18.9155, 47.5228],
      [-18.9210, 47.5235], [-18.9255, 47.5248], [-18.9292, 47.5259],
      [-18.9340, 47.5268], [-18.9385, 47.5280], [-18.9420, 47.5298],
      [-18.9448, 47.5312]
    ]
  },
  ligneEst: {
    id: 'tana-ligneEst',
    nom: "Ligne Est (Ankatso - Analakely) [Tana]",
    couleur: "#ec4899",
    ville: "Antananarivo",
    distanceKm: 4.8,
    conditionRoute: "MOYENNE",
    arrets: [
      { id: "tana-ankatso", nom: "Terminus Université Ankatso (Tana)", lat: -18.9158, lng: 47.5544 },
      { id: "tana-ambanidia", nom: "Ambanidia [Marché] (Tana)", lat: -18.9202, lng: 47.5388 },
      { id: "tana-ambohijatovo", nom: "Ambohijatovo Jardin (Tana)", lat: -18.9145, lng: 47.5289 },
      { id: "tana-analakely-esp", nom: "Analakely Esplanade (Tana)", lat: -18.9095, lng: 47.5275 }
    ],
    trace: [
      [-18.9158, 47.5544], [-18.9175, 47.5490], [-18.9190, 47.5442],
      [-18.9202, 47.5388], [-18.9185, 47.5330], [-18.9160, 47.5302],
      [-18.9145, 47.5289], [-18.9115, 47.5278], [-18.9095, 47.5275]
    ]
  },
  ligneOuest: {
    id: 'tana-ligneOuest',
    nom: "Ligne Sud-Ouest (Anosizato - Analakely) [Tana]",
    couleur: "#ef4444",
    ville: "Antananarivo",
    distanceKm: 5.0,
    conditionRoute: "MAUVAISE",
    arrets: [
      { id: "tana-anosizato", nom: "Anosizato Rond-point (Tana)", lat: -18.9372, lng: 47.5095 },
      { id: "tana-anosibe", nom: "Anosibe Tsena (Tana)", lat: -18.9288, lng: 47.5191 },
      { id: "tana-anosy", nom: "Anosy [Lac/Ministères] (Tana)", lat: -18.9155, lng: 47.5228 },
      { id: "tana-analakely-pav", nom: "Analakely Pavillons (Tana)", lat: -18.9080, lng: 47.5265 }
    ],
    trace: [
      [-18.9372, 47.5095], [-18.9340, 47.5135], [-18.9288, 47.5191],
      [-18.9220, 47.5210], [-18.9175, 47.5218], [-18.9155, 47.5228],
      [-18.9125, 47.5242], [-18.9102, 47.5255], [-18.9080, 47.5265]
    ]
  },
  ligne67Ha: {
    id: 'tana-ligne67Ha',
    nom: "Ligne Rocade (67Ha - Mahamasina) [Tana]",
    couleur: "#a855f7",
    ville: "Antananarivo",
    distanceKm: 3.9,
    conditionRoute: "MOYENNE",
    arrets: [
      { id: "tana-67ha-terminus", nom: "Terminus 67Ha (Tana)", lat: -18.9032, lng: 47.5115 },
      { id: "tana-isotry", nom: "Isotry [Marché] (Tana)", lat: -18.9075, lng: 47.5162 },
      { id: "tana-ampefiloha", nom: "Ampefiloha [Près du Lycée] (Tana)", lat: -18.9134, lng: 47.5158 },
      { id: "tana-mahamasina", nom: "Stade Kianja Barea Mahamasina (Tana)", lat: -18.9194, lng: 47.5245 }
    ],
    trace: [
      [-18.9032, 47.5115], [-18.9055, 47.5138], [-18.9075, 47.5162],
      [-18.9105, 47.5152], [-18.9134, 47.5158], [-18.9162, 47.5190],
      [-18.9194, 47.5245]
    ]
  }
};

// =========================================================================
// 2. LIGNES DE BUS - FIANARANTSOA
// =========================================================================
export const fianarBusLines = {
  lignePrincipale: {
    id: 'fianar-lignePrincipale',
    nom: "Ligne 1 (Stationnement - Tribunal) [Fianar]",
    couleur: "#f59e0b",
    ville: "Fianarantsoa",
    distanceKm: 3.2,
    conditionRoute: "BONNE",
    arrets: [
      { id: "fianar-stationnement", nom: "Stationnement Nord (Fianar)", lat: -21.4485, lng: 47.0984 },
      { id: "fianar-fce", nom: "Gare FCE (Fianar)", lat: -21.4542, lng: 47.0912 },
      { id: "fianar-paositra", nom: "La Paositra (Fianar)", lat: -21.4532, lng: 47.0871 },
      { id: "fianar-ampasambazaha", nom: "Ampasambazaha (Fianar)", lat: -21.4526, lng: 47.0825 },
      { id: "fianar-anjoma", nom: "Anjoma Grand Marché (Fianar)", lat: -21.4443, lng: 47.0828 },
      { id: "fianar-tribunal", nom: "Tribunal (Fianar)", lat: -21.4402, lng: 47.0854 }
    ],
    trace: [
      [-21.4485, 47.0984], [-21.4510, 47.0945], [-21.4542, 47.0912],
      [-21.4532, 47.0871], [-21.4523, 47.0848], [-21.4526, 47.0825],
      [-21.4495, 47.0818], [-21.4468, 47.0821], [-21.4443, 47.0828],
      [-21.4421, 47.0838], [-21.4402, 47.0854]
    ]
  },
  ligneUniversitaire: {
    id: 'fianar-ligneUniversitaire',
    nom: "Ligne 2 (Tambohobe - Andrainjato) [Fianar]",
    couleur: "#10b981",
    ville: "Fianarantsoa",
    distanceKm: 6.8,
    conditionRoute: "MOYENNE",
    arrets: [
      { id: "fianar-tambohobe", nom: "Tambohobe (Fianar)", lat: -21.4410, lng: 47.0745 },
      { id: "fianar-hauteville", nom: "Ville Haute Antranobiriky (Fianar)", lat: -21.4442, lng: 47.0708 },
      { id: "fianar-ampasambazaha-corr", nom: "Ampasambazaha Correspondance (Fianar)", lat: -21.4526, lng: 47.0825 },
      { id: "fianar-tsianolondroa", nom: "Tsianolondroa (Fianar)", lat: -21.4565, lng: 47.0888 },
      { id: "fianar-andrainjato", nom: "Université d'Andrainjato (Fianar)", lat: -21.4722, lng: 47.1121 }
    ],
    trace: [
      [-21.4410, 47.0745], [-21.4431, 47.0720], [-21.4442, 47.0708],
      [-21.4490, 47.0760], [-21.4526, 47.0825], [-21.4545, 47.0855],
      [-21.4565, 47.0888], [-21.4602, 47.0950], [-21.4655, 47.1025],
      [-21.4722, 47.1121]
    ]
  },
  ligneAmbalavao: {
    id: 'fianar-ligneAmbalavao',
    nom: "Ligne Régionale RN7 (Fianarantsoa - Ambalavao)",
    couleur: "#dc2626",
    ville: "Fianarantsoa",
    distanceKm: 55.0,
    conditionRoute: "MOYENNE",
    arrets: [
      { id: "fianar-stationnement-sud", nom: "Gare Routière Sud (Fianar)", lat: -21.4611, lng: 47.0924 },
      { id: "fianar-alakamisy", nom: "Alakamisy Ambohimaha (RN7)", lat: -21.6152, lng: 47.0421 },
      { id: "fianar-ambalavao-terminus", nom: "Stationnement Ambalavao Tsena", lat: -21.8331, lng: 46.9388 }
    ],
    trace: [
      [-21.4611, 47.0924], [-21.4850, 47.0810], [-21.5210, 47.0680],
      [-21.5740, 47.0540], [-21.6152, 47.0421], [-21.6720, 46.9950],
      [-21.7310, 46.9720], [-21.7850, 46.9540], [-21.8331, 46.9388]
    ]
  }
};

// =========================================================================
// 3. DONNÉES DE TRAFIC EN TEMPS RÉEL
// =========================================================================
export const mockTrafficSegments = [
  { id: "seg-anosizato", nom: "Rond-point Anosizato (RN1)", ville: "Antananarivo", status: "ROUGE" },
  { id: "seg-fasany-karana", nom: "Zone Stationnement Fasan'ny Karana (RN7)", ville: "Antananarivo", status: "ROUGE" },
  { id: "seg-fianar-ampas", nom: "Carrefour Ampasambazaha", ville: "Fianarantsoa", status: "ROUGE" },
  { id: "seg-rn7-ambalavao", nom: "Axe RN7 vers Ambalavao", ville: "Fianarantsoa", status: "ORANGE" }
];

// =========================================================================
// 4. MOTEUR DE CALCUL AVANCÉ (VÉHICULE + TRAFIC + ÉTAT DE LA ROUTE)
// =========================================================================

/**
 * Calcule une estimation précise du temps de trajet
 * @param {number} distanceKm - Distance en kilomètres
 * @param {string} typeVehicule - 'moto', 'voiture', 'bus', 'marche'
 * @param {string} trafficStatus - 'VERT', 'ORANGE', 'ROUGE'
 * @param {string} conditionRoute - 'BONNE', 'MOYENNE', 'MAUVAISE'
 */
export const estimateTravelTime = (distanceKm, typeVehicule = 'voiture', trafficStatus = 'VERT', conditionRoute = 'BONNE') => {
  
  // 1. Vitesses de base par véhicule sur une "Bonne Route" fluide
  const baseSpeeds = {
    'moto': 50,
    'voiture': 45,
    'bus': 35,
    'marche': 5
  };
  let speed = baseSpeeds[typeVehicule] || 40;

  // 2. Impact de l'état de la route
  const roadPenalties = {
    'BONNE': { moto: 1.0, voiture: 1.0, bus: 1.0, marche: 1.0 },
    'MOYENNE': { moto: 0.9, voiture: 0.75, bus: 0.75, marche: 0.9 },
    'MAUVAISE': { moto: 0.75, voiture: 0.5, bus: 0.55, marche: 0.8 }
  };

  const penaltyMap = roadPenalties[conditionRoute] || roadPenalties['BONNE'];
  const vehiclePenalty = penaltyMap[typeVehicule] || 0.8;
  
  speed = speed * vehiclePenalty;

  // 3. Impact du Trafic
  const trafficMultipliers = {
    'VERT': { moto: 1.0, voiture: 1.0, bus: 1.0, marche: 1.0 },
    'ORANGE': { moto: 1.05, voiture: 1.25, bus: 1.3, marche: 1.0 },
    'ROUGE': { moto: 1.15, voiture: 1.5, bus: 1.6, marche: 1.0 }
  };

  const trafficMap = trafficMultipliers[trafficStatus] || trafficMultipliers['VERT'];
  const currentMultiplier = trafficMap[typeVehicule] || 1.2;

  let durationHours = (distanceKm / speed) * currentMultiplier;

  // 4. Pour la marche, ajouter un facteur de fatigue
  if (typeVehicule === 'marche' && distanceKm > 5) {
    durationHours = durationHours * 1.1; // 10% de plus pour les longues distances
  }

  // Formater le résultat
  const totalMinutes = Math.round(durationHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    hours,
    minutes,
    totalMinutes,
    label: hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
  };
};

// =========================================================================
// 5. FONCTIONS COMPLÉMENTAIRES
// =========================================================================
export const getAllBusLines = () => {
  return { ...tanaBusLines, ...fianarBusLines };
};

export const getBusLinesByCity = (city) => {
  const allLines = getAllBusLines();
  const result = {};
  for (const [key, line] of Object.entries(allLines)) {
    if (line.ville && line.ville.toLowerCase() === city.toLowerCase()) {
      result[key] = line;
    }
  }
  return result;
};

export const getAllBusStopsFromLines = () => {
  const allLines = getAllBusLines();
  const stops = [];
  for (const [key, line] of Object.entries(allLines)) {
    if (line.arrets) {
      line.arrets.forEach(arret => {
        stops.push({
          ...arret,
          ligneNom: line.nom,
          ligneId: line.id,
          ville: line.ville,
          couleur: line.couleur
        });
      });
    }
  }
  return stops;
};

export const getTrafficByCity = (city) => {
  return mockTrafficSegments.filter(seg => 
    seg.ville && seg.ville.toLowerCase() === city.toLowerCase()
  );
};

export const getTrafficStatus = (status) => {
  const colors = {
    'VERT': '#22c55e',
    'ORANGE': '#f97316',
    'ROUGE': '#ef4444'
  };
  return colors[status] || '#22c55e';
};

export const getTrafficLabel = (status) => {
  const labels = {
    'VERT': 'Fluide',
    'ORANGE': 'Ralentissement',
    'ROUGE': 'Bloqué'
  };
  return labels[status] || 'Fluide';
};

// =========================================================================
// 6. FONCTION POUR LE TEMPS DE TRAJET EN FONCTION DU MODE DE TRANSPORT
// =========================================================================
export const getTravelTimeByMode = (distanceKm, transportMode, trafficStatus = 'VERT', conditionRoute = 'BONNE') => {
  // Mapping des modes de transport vers les types de véhicule
  const modeMapping = {
    'voiture': 'voiture',
    'bus': 'bus',
    'marche': 'marche',
    'moto': 'moto'
  };
  
  const vehicleType = modeMapping[transportMode] || 'voiture';
  return estimateTravelTime(distanceKm, vehicleType, trafficStatus, conditionRoute);
};