import { useState, useEffect } from 'react';
import MapComponent from '../components/maps/MapComponent';
import Legend from '../components/common/Legend';
import ChatAssistant from '../components/common/ChatAssistant';
import ItineraryPopup from '../components/Itinerary/ItineraryPopup';
import PredictionPopup from '../components/Prediction/PredictionPopup';
import { regionsData, getZoneCoordinates, trafficData } from '../data/madagascar.data';

export default function Accueil() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  // Générer toutes les données de recherche
  const generateSearchData = () => {
    const data = [];
    
    // Vérifier que regionsData existe et est un objet
    if (!regionsData || typeof regionsData !== 'object') {
      console.warn('regionsData n\'est pas disponible');
      return data;
    }
    
    try {
      for (const [region, info] of Object.entries(regionsData)) {
        // Vérifier que info et info.zones existent
        if (info && info.zones && Array.isArray(info.zones)) {
          info.zones.forEach(zone => {
            const coords = getZoneCoordinates(zone);
            data.push({
              id: `${region}-${zone}`,
              name: zone,
              type: 'Zone',
              region: region,
              lat: coords.lat || -18.9137,
              lng: coords.lng || 47.5361,
              traffic: trafficData[zone] || 'Fluide'
            });
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la génération des données de recherche:', error);
    }
    
    return data;
  };

  const searchData = generateSearchData();

  // Fonction de recherche
  const handleSearch = (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const lowerQuery = query.toLowerCase();
    
    setTimeout(() => {
      const results = searchData.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) ||
        (item.region && item.region.toLowerCase().includes(lowerQuery))
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  // Gérer la sélection d'un résultat
  const handleSelectResult = (result) => {
    setSelectedResult(result);
    setSearchQuery(result.name);
    setSearchOpen(false);
    setSearchResults([]);
  };

  // Récupérer la position de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ lat: -18.9137, lng: 47.5361 });
        }
      );
    } else {
      setUserLocation({ lat: -18.9137, lng: 47.5361 });
    }
  }, []);

  const handleItineraryCalculate = (data) => {
    console.log('Itinéraire calculé:', data);
  };

  // Obtenir la couleur du trafic
  const getTrafficColor = (traffic) => {
    const colors = {
      'Fluide': '#22c55e',
      'Moyen': '#eab308',
      'Modéré': '#f97316',
      'Dense': '#ef4444',
      'Très dense': '#dc2626'
    };
    return colors[traffic] || '#22c55e';
  };

  return (
    <div className="w-full h-full relative">
      {/* Carte */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
          userLocation={userLocation}
          selectedLocation={selectedResult}
          searchResults={searchResults}
          allRegions={regionsData}
          trafficData={trafficData}
        />
      </div>

      {/* Légende */}
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-[1000]">
        <Legend />
      </div>

      {/* Menu des actions latérales */}
      {!showItinerary && !showPrediction && (
        <div className="absolute top-20 md:top-24 right-4 md:right-8 z-[1000] flex flex-col gap-2 md:gap-3">
          <button
            onClick={() => setActiveMenu(activeMenu === 'signaler' ? null : 'signaler')}
            className={`w-36 md:w-44 bg-red-500/90 hover:bg-red-600 text-white font-semibold py-2 md:py-3 px-3 md:px-4 rounded-xl border border-red-400/30 text-xs md:text-sm tracking-wide transition-all duration-300 transform hover:scale-105 hover:translate-x-[-4px] flex items-center gap-2 md:gap-3 ${
              activeMenu === 'signaler' 
                ? 'ring-2 ring-red-400/50 ring-offset-2 ring-offset-black shadow-[0_8px_30px_rgba(239,68,68,0.4)]' 
                : 'shadow-[0_8px_25px_rgba(239,68,68,0.35)] hover:shadow-[0_12px_35px_rgba(239,68,68,0.5)]'
            }`}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Signaler
          </button>

          <button
            onClick={() => setShowItinerary(true)}
            className={`w-36 md:w-44 bg-blue-500/90 hover:bg-blue-600 text-white font-semibold py-2 md:py-3 px-3 md:px-4 rounded-xl border border-blue-400/30 text-xs md:text-sm tracking-wide transition-all duration-300 transform hover:scale-105 hover:translate-x-[-4px] flex items-center gap-2 md:gap-3 ${
              activeMenu === 'itineraire' 
                ? 'ring-2 ring-blue-400/50 ring-offset-2 ring-offset-black shadow-[0_8px_30px_rgba(59,130,246,0.4)]' 
                : 'shadow-[0_8px_25px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_35px_rgba(59,130,246,0.5)]'
            }`}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Itinéraire
          </button>

          <button
            onClick={() => setShowPrediction(true)}
            className={`w-36 md:w-44 bg-purple-500/90 hover:bg-purple-600 text-white font-semibold py-2 md:py-3 px-3 md:px-4 rounded-xl border border-purple-400/30 text-xs md:text-sm tracking-wide transition-all duration-300 transform hover:scale-105 hover:translate-x-[-4px] flex items-center gap-2 md:gap-3 ${
              activeMenu === 'prediction' 
                ? 'ring-2 ring-purple-400/50 ring-offset-2 ring-offset-black shadow-[0_8px_30px_rgba(168,85,247,0.4)]' 
                : 'shadow-[0_8px_25px_rgba(168,85,247,0.35)] hover:shadow-[0_12px_35px_rgba(168,85,247,0.5)]'
            }`}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm12 0v-3a2 2 0 00-2-2h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            Prédiction
          </button>
        </div>
      )}

      {/* Popups */}
      <ItineraryPopup
        isOpen={showItinerary}
        onClose={() => setShowItinerary(false)}
        onCalculate={handleItineraryCalculate}
        userLocation={userLocation}
      />

      <PredictionPopup
        isOpen={showPrediction}
        onClose={() => setShowPrediction(false)}
      />

      {/* Bouton de recherche flottant */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="transition-all duration-300">
          {!searchOpen ? (
            <button 
              onClick={() => setSearchOpen(true)}
              className="bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-600 hover:to-blue-700 p-3 md:p-5 rounded-2xl shadow-2xl border border-blue-400/30 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-12 animate-bounce-slow shadow-[0_8px_30px_rgba(59,130,246,0.4)]"
            >
              <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          ) : (
            <div className="bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-500/30 overflow-hidden w-80 md:w-96 animate-fade-in-up shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4">
                <svg onClick={() => setSearchOpen(false)} className="w-4 h-4 md:w-5 md:h-5 text-blue-400 cursor-pointer hover:text-blue-300 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Rechercher une ville, une zone..." 
                  className="w-full bg-transparent text-xs md:text-sm font-medium text-white placeholder-slate-400 focus:outline-none"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
                {isSearching && (
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                )}
                <button 
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="text-slate-400 hover:text-white transition flex-shrink-0"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Résultats */}
              {searchResults.length > 0 && (
                <div className="border-t border-slate-700 max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result)}
                      className="w-full flex items-center justify-between px-4 md:px-6 py-2.5 hover:bg-slate-800 transition text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getTrafficColor(result.traffic) }}
                        ></div>
                        <div>
                          <p className="text-sm text-white font-medium">{result.name}</p>
                          <p className="text-xs text-slate-400">{result.region || 'Région inconnue'}</p>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        <span className="px-2 py-0.5 rounded-full bg-slate-700">
                          {result.traffic}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                <div className="px-4 md:px-6 py-4 text-center text-slate-400 text-sm border-t border-slate-700">
                  <p>Aucun résultat trouvé pour "{searchQuery}"</p>
                </div>
              )}

              {searchQuery.length > 0 && searchQuery.length < 2 && (
                <div className="px-4 md:px-6 py-3 text-center text-slate-500 text-xs border-t border-slate-700">
                  Tapez au moins 2 caractères
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Résultat sélectionné */}
      {selectedResult && (
        <div className="absolute top-24 left-4 z-[1000] bg-black/80 backdrop-blur-md rounded-xl px-4 py-2 border border-blue-500/30">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getTrafficColor(selectedResult.traffic) }}
            ></div>
            <span className="text-sm text-white font-medium">{selectedResult.name}</span>
            <span className="text-xs text-slate-400">• {selectedResult.region || 'Région inconnue'}</span>
            <button 
              onClick={() => setSelectedResult(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Assistant IA */}
      <ChatAssistant />
    </div>
  );
}