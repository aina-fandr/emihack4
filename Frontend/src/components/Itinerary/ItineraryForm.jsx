import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, Bus, Footprints, Bike, Search, Loader2 } from 'lucide-react';
import { regionsData, getAllBusStops, getBusStopsByRegion, arretsFianarantsoa } from '../../data/madagascar.data';
import { getAllBusStopsFromLines, getBusLinesByCity, getAllBusLines } from '../../data/busData';

const transportModes = [
  { id: 'voiture', label: 'Voiture', icon: <Car className="w-4 h-4" /> },
  { id: 'bus', label: 'Bus', icon: <Bus className="w-4 h-4" /> },
  { id: 'marche', label: 'Marche', icon: <Footprints className="w-4 h-4" /> },
  { id: 'moto', label: 'Moto', icon: <Bike className="w-4 h-4" /> },
];

export default function ItineraryForm({
  departure,
  setDeparture,
  destination,
  setDestination,
  transportMode,
  setTransportMode,
  isCalculating,
  onCalculate,
  availableDestinations = []
}) {
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [showBusStops, setShowBusStops] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [busStops, setBusStops] = useState([]);
  const [allBusStops, setAllBusStops] = useState([]);
  const [isLocating, setIsLocating] = useState(false);

  // Charger tous les arrêts de bus au montage
  useEffect(() => {
    try {
      // 1. Récupérer les arrêts depuis madagascar.data.js
      const legacyStops = getAllBusStops();
      
      // 2. Récupérer les arrêts depuis busData.js (nouvelles lignes)
      const busLineStops = getAllBusStopsFromLines();
      
      // 3. Ajouter les arrêts spécifiques de Fianarantsoa
      const fianarStops = arretsFianarantsoa.map(stop => ({
        name: stop.nom,
        region: 'Fianarantsoa',
        lat: stop.lat,
        lng: stop.lng,
        isSpecific: true,
        ligne: 'Ligne Fianarantsoa'
      }));
      
      // 4. Combiner tous les arrêts en évitant les doublons
      const allStopsMap = new Map();
      
      // Ajouter les arrêts des lignes de bus (priorité)
      busLineStops.forEach(stop => {
        allStopsMap.set(stop.nom, {
          name: stop.nom,
          region: stop.ville || 'Inconnu',
          lat: stop.lat,
          lng: stop.lng,
          ligne: stop.ligne || 'Bus',
          couleur: stop.couleur || '#3b82f6'
        });
      });
      
      // Ajouter les arrêts legacy (si pas déjà présents)
      legacyStops.forEach(stop => {
        if (!allStopsMap.has(stop.name)) {
          allStopsMap.set(stop.name, {
            name: stop.name,
            region: stop.region || 'Inconnu',
            lat: stop.lat,
            lng: stop.lng,
            ligne: 'Arrêt standard'
          });
        }
      });
      
      // Ajouter les arrêts spécifiques de Fianarantsoa
      fianarStops.forEach(stop => {
        if (!allStopsMap.has(stop.name)) {
          allStopsMap.set(stop.name, {
            name: stop.name,
            region: stop.region,
            lat: stop.lat,
            lng: stop.lng,
            ligne: 'Ligne Fianarantsoa',
            isSpecific: true
          });
        }
      });
      
      const combinedStops = Array.from(allStopsMap.values());
      setAllBusStops(combinedStops);
      setBusStops(combinedStops);
      
      console.log('Arrêts de bus chargés:', combinedStops.length);
    } catch (error) {
      console.error('Erreur lors du chargement des arrêts de bus:', error);
      // Fallback: utiliser uniquement les arrêts legacy
      const legacyStops = getAllBusStops();
      setAllBusStops(legacyStops);
      setBusStops(legacyStops);
    }
  }, []);

  // Filtrer les suggestions (incluant les arrêts de bus)
  const getSuggestions = (input, list) => {
    if (!input || input.length < 2) return [];
    const lower = input.toLowerCase();
    
    // Rechercher dans les zones
    const zoneResults = list.filter(item => 
      item.toLowerCase().includes(lower)
    ).slice(0, 5);
    
    // Rechercher dans les arrêts de bus
    const busStopResults = allBusStops.filter(stop =>
      stop.name.toLowerCase().includes(lower)
    ).slice(0, 5);
    
    // Combiner et retourner les résultats uniques
    const combined = [...zoneResults, ...busStopResults.map(s => s.name)];
    return [...new Set(combined)].slice(0, 8);
  };

  // Filtrer les arrêts de bus par région
  const handleRegionFilter = (region) => {
    setSelectedRegion(region);
    if (region) {
      // Chercher dans les arrêts de bus par région
      const regionStops = allBusStops.filter(stop => 
        stop.region && stop.region.toLowerCase().includes(region.toLowerCase())
      );
      setBusStops(regionStops);
    } else {
      setBusStops(allBusStops);
    }
  };

  // Gérer la saisie du départ
  const handleDepartureChange = (value) => {
    setDeparture(value);
    if (value !== 'Ma position actuelle') {
      const suggestions = getSuggestions(value, availableDestinations);
      setDepartureSuggestions(suggestions);
      setShowDepartureSuggestions(suggestions.length > 0);
    } else {
      setDepartureSuggestions([]);
      setShowDepartureSuggestions(false);
    }
  };

  // Gérer la saisie de la destination
  const handleDestinationChange = (value) => {
    setDestination(value);
    const suggestions = getSuggestions(value, availableDestinations);
    setDestinationSuggestions(suggestions);
    setShowDestinationSuggestions(suggestions.length > 0);
  };

  // Utiliser la position actuelle
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDeparture(`Position actuelle (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
          alert('Impossible de récupérer votre position. Veuillez la saisir manuellement.');
        }
      );
    } else {
      setIsLocating(false);
      alert('Votre navigateur ne supporte pas la géolocalisation.');
    }
  };

  // Sélectionner une suggestion
  const selectSuggestion = (place, type) => {
    if (type === 'departure') {
      setDeparture(place);
      setDepartureSuggestions([]);
      setShowDepartureSuggestions(false);
    } else {
      setDestination(place);
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Point de départ */}
      <div>
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
          <MapPin className="w-4 h-4 text-green-500" />
          Départ
        </label>
        <div className="relative">
          <div className="flex gap-2">
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition bg-green-500 text-white hover:bg-green-600 whitespace-nowrap disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Localisation...
                </>
              ) : (
                <>
                  📍 Ma position
                </>
              )}
            </button>
            <input
              type="text"
              value={departure === 'Ma position actuelle' ? '' : departure}
              onChange={(e) => handleDepartureChange(e.target.value)}
              placeholder="Saisir une ville, zone ou arrêt de bus..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
            />
          </div>
          
          {/* Suggestions de départ */}
          {showDepartureSuggestions && departureSuggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {departureSuggestions.map((place, index) => {
                const isBusStop = allBusStops.some(s => s.name === place);
                const busStop = allBusStops.find(s => s.name === place);
                return (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(place, 'departure')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    {isBusStop ? (
                      <Bus className="w-3 h-3 text-blue-500" />
                    ) : (
                      <MapPin className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{place}</span>
                    {isBusStop && busStop?.ligne && (
                      <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                        {busStop.ligne}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Destination */}
      <div>
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
          <Navigation className="w-4 h-4 text-red-500" />
          Destination
        </label>
        <div className="relative">
          <input
            type="text"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            placeholder="Ex: Toamasina, Mahajanga, Arrêt Mahamasina..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
          />
          
          {/* Suggestions de destination */}
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {destinationSuggestions.map((place, index) => {
                const isBusStop = allBusStops.some(s => s.name === place);
                const busStop = allBusStops.find(s => s.name === place);
                return (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(place, 'destination')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    {isBusStop ? (
                      <Bus className="w-3 h-3 text-blue-500" />
                    ) : (
                      <Navigation className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{place}</span>
                    {isBusStop && busStop?.ligne && (
                      <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                        {busStop.ligne}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          💡 Exemples: Toamasina, Mahajanga, Arrêt Mahamasina, Stationnement (Fianarantsoa)
        </p>
      </div>

      {/* Afficher les arrêts de bus par région */}
      <div>
        <button
          onClick={() => setShowBusStops(!showBusStops)}
          className="flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 transition"
        >
          <Bus className="w-3 h-3" />
          {showBusStops ? 'Masquer les arrêts de bus' : 'Voir les arrêts de bus par région'}
        </button>
        
        {showBusStops && (
          <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="mb-2">
              <select
                value={selectedRegion}
                onChange={(e) => handleRegionFilter(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les régions</option>
                {Object.keys(regionsData).map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
                <option value="Fianarantsoa">Fianarantsoa</option>
                <option value="Antananarivo">Antananarivo</option>
              </select>
            </div>
            
            <div className="max-h-32 overflow-y-auto space-y-1">
              {busStops.length > 0 ? (
                busStops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg transition cursor-pointer">
                    <Bus className="w-3 h-3 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-slate-700">{stop.name}</span>
                    {stop.ligne && (
                      <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full ml-auto">
                        {stop.ligne}
                      </span>
                    )}
                    {stop.region && !stop.ligne && (
                      <span className="text-xs text-slate-400 ml-auto">📍 {stop.region}</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">Aucun arrêt de bus dans cette région</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mode de transport */}
      <div>
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
          🚗 Mode de transport
        </label>
        <div className="grid grid-cols-4 gap-2">
          {transportModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setTransportMode(mode.id)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border transition ${
                transportMode === mode.id
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              {mode.icon}
              <span className="text-[10px] font-medium">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bouton calculer */}
      <button
        onClick={onCalculate}
        disabled={isCalculating || !destination}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {isCalculating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Calcul en cours...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Rechercher l'itinéraire
          </>
        )}
      </button>
    </div>
  );
}