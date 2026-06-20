import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, Bus, Footprints, Bike, Search, Loader2 } from 'lucide-react';

const transportModes = [
  { id: 'voiture', label: 'Voiture', icon: <Car className="w-4 h-4" /> },
  { id: 'bus', label: 'Bus', icon: <Bus className="w-4 h-4" /> },
  { id: 'marche', label: 'Marche', icon: <Footprints className="w-4 h-4" /> },
  { id: 'moto', label: 'Moto', icon: <Bike className="w-4 h-4" /> },
];

// Liste des lieux pour les suggestions
const PLACES = [
  'Analakely', 'Anosizato', 'Andraharo', 'Ivandry', 'Ankorondrano',
  'Mahamasina', '67 Ha', 'Tanjombato', 'Ambohimanarina', 'Ampefiloha',
  'Antaninarenina', 'Soarano', 'Ankadifotsy', 'Faravohitra', 'Isotry',
  'Ambohijatovo', 'Andavamamba', 'Anjohy', 'Anosibe', 'Antsahavola'
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
  onUseCurrentLocation
}) {
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Filtrer les suggestions
  const getSuggestions = (input) => {
    if (!input || input.length < 2) return [];
    const lower = input.toLowerCase();
    return PLACES.filter(place => 
      place.toLowerCase().includes(lower)
    ).slice(0, 5);
  };

  // Gérer la saisie du départ
  const handleDepartureChange = (value) => {
    setDeparture(value);
    if (value !== 'Ma position actuelle') {
      const suggestions = getSuggestions(value);
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
    const suggestions = getSuggestions(value);
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
          if (onUseCurrentLocation) {
            onUseCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          }
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
              placeholder="Saisir une adresse..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
            />
          </div>
          
          {/* Suggestions de départ */}
          {showDepartureSuggestions && departureSuggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {departureSuggestions.map((place, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(place, 'departure')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {place}
                </button>
              ))}
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
            placeholder="Ex: Analakely, Anosizato..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
          />
          
          {/* Suggestions de destination */}
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {destinationSuggestions.map((place, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(place, 'destination')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Navigation className="w-3 h-3 text-slate-400" />
                  {place}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          💡 Exemples: Analakely, Anosizato, Andraharo, Ivandry
        </p>
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