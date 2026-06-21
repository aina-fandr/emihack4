import React, { useState, useEffect } from 'react';
import { X, Route, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import ItineraryHeader from './ItineraryHeader';
import ItineraryForm from './ItineraryForm';
import ItinerarySuggestions from './ItinerarySuggestions';
import ItineraryAlerts from './ItineraryAlerts';
import ItineraryBestTime from './ItineraryBestTime';
import ItinerarySummary from './ItinerarySummary';
import ItineraryMap from './ItineraryMap';
import ItinerarySteps from './ItinerarySteps';
import { 
  getRouteAlerts,
  getZoneCoordinates,
  regionsData,
  trafficData,
  getAllBusStops,
  generateSteps,
  arretsFianarantsoa
} from '../../data/madagascar.data';
import { 
  tanaBusLines, 
  fianarBusLines,
  getAllBusStopsFromLines,
  estimateTravelTime,
  getTravelTimeByMode
} from '../../data/busData';

export default function ItineraryPopup({ isOpen, onClose, onCalculate, userLocation }) {
  const [departure, setDeparture] = useState('Ma position actuelle');
  const [destination, setDestination] = useState('');
  const [transportMode, setTransportMode] = useState('voiture');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [departureCoords, setDepartureCoords] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [avoidTraffic, setAvoidTraffic] = useState(false);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [busStopsList, setBusStopsList] = useState([]);
  const [steps, setSteps] = useState([]);
  const [optimizedTime, setOptimizedTime] = useState('');
  const [destinationCoords, setDestinationCoords] = useState(null);

  // ============================================================
  // 1. INITIALISATION DES DESTINATIONS
  // ============================================================
  useEffect(() => {
    try {
      const allZones = [];
      for (const [region, data] of Object.entries(regionsData)) {
        if (data?.zones) {
          data.zones.forEach(zone => allZones.push(zone));
        }
      }

      const legacyBusStops = getAllBusStops();
      const legacyStopNames = legacyBusStops.map(stop => stop.name);

      const tanaStops = [];
      Object.values(tanaBusLines).forEach(line => {
        if (line.arrets) {
          line.arrets.forEach(arret => tanaStops.push(arret.nom));
        }
      });

      const fianarStops = [];
      Object.values(fianarBusLines).forEach(line => {
        if (line.arrets) {
          line.arrets.forEach(arret => fianarStops.push(arret.nom));
        }
      });

      const fianarLegacyStops = arretsFianarantsoa.map(stop => stop.nom);

      const allDestinationsSet = new Set([
        ...allZones,
        ...legacyStopNames,
        ...tanaStops,
        ...fianarStops,
        ...fianarLegacyStops
      ]);
      
      setAvailableDestinations(Array.from(allDestinationsSet));

      const allBusStops = [];

      Object.values(tanaBusLines).forEach(line => {
        if (line.arrets) {
          line.arrets.forEach(arret => {
            allBusStops.push({
              name: arret.nom,
              region: 'Antananarivo',
              lat: arret.lat,
              lng: arret.lng,
              ligne: line.nom,
              couleur: line.couleur
            });
          });
        }
      });

      Object.values(fianarBusLines).forEach(line => {
        if (line.arrets) {
          line.arrets.forEach(arret => {
            allBusStops.push({
              name: arret.nom,
              region: 'Fianarantsoa',
              lat: arret.lat,
              lng: arret.lng,
              ligne: line.nom,
              couleur: line.couleur
            });
          });
        }
      });

      legacyBusStops.forEach(stop => {
        if (!allBusStops.some(s => s.name === stop.name)) {
          allBusStops.push({
            name: stop.name,
            region: stop.region || 'Inconnu',
            lat: stop.lat,
            lng: stop.lng,
            ligne: 'Arrêt standard'
          });
        }
      });

      arretsFianarantsoa.forEach(stop => {
        if (!allBusStops.some(s => s.name === stop.nom)) {
          allBusStops.push({
            name: stop.nom,
            region: 'Fianarantsoa',
            lat: stop.lat,
            lng: stop.lng,
            ligne: 'Ligne Fianarantsoa'
          });
        }
      });

      setBusStopsList(allBusStops);

    } catch (error) {
      console.error('Erreur:', error);
      const allZones = [];
      for (const [region, data] of Object.entries(regionsData)) {
        if (data?.zones) {
          data.zones.forEach(zone => allZones.push(zone));
        }
      }
      setAvailableDestinations(allZones);
    }
  }, []);

  // ============================================================
  // 2. GÉOLOCALISATION
  // ============================================================
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(pos);
          setDepartureCoords(pos);
        },
        () => {
          const pos = { lat: -18.9137, lng: 47.5361 };
          setCurrentPosition(pos);
          setDepartureCoords(pos);
        }
      );
    } else {
      const pos = { lat: -18.9137, lng: 47.5361 };
      setCurrentPosition(pos);
      setDepartureCoords(pos);
    }
  }, []);

  // ============================================================
  // 3. FONCTIONS DE RECHERCHE DE COORDONNÉES
  // ============================================================
  const findCoordinates = (locationName) => {
    if (!locationName) return null;

    const lowerName = locationName.toLowerCase().trim();

    const busStop = busStopsList.find(stop => 
      stop.name.toLowerCase() === lowerName ||
      stop.name.toLowerCase().includes(lowerName) ||
      lowerName.includes(stop.name.toLowerCase())
    );
    if (busStop) {
      return { lat: busStop.lat, lng: busStop.lng, name: busStop.name };
    }

    const fianarStop = arretsFianarantsoa.find(stop => 
      stop.nom.toLowerCase() === lowerName ||
      stop.nom.toLowerCase().includes(lowerName)
    );
    if (fianarStop) {
      return { lat: fianarStop.lat, lng: fianarStop.lng, name: fianarStop.nom };
    }

    const zoneCoords = getZoneCoordinates(locationName);
    if (zoneCoords && zoneCoords.lat && zoneCoords.lng) {
      return { lat: zoneCoords.lat, lng: zoneCoords.lng, name: locationName };
    }

    return null;
  };

  const isValidLocation = (locationName) => {
    if (!locationName) return false;
    const lowerName = locationName.toLowerCase().trim();
    
    return availableDestinations.some(z => 
      z.toLowerCase() === lowerName ||
      z.toLowerCase().includes(lowerName) ||
      lowerName.includes(z.toLowerCase())
    );
  };

  // ============================================================
  // 4. CALCUL DE L'ITINÉRAIRE
  // ============================================================
  const handleCalculate = async () => {
    if (!destination) {
      alert('Veuillez saisir une destination.');
      return;
    }

    if (!isValidLocation(destination)) {
      alert(`La destination "${destination}" n'est pas reconnue.`);
      return;
    }

    setIsCalculating(true);
    setResult(null);
    setShowSuggestions(false);
    setRoutePoints([]);

    try {
      let startCoords;
      let startName = 'Antananarivo';
      
      if (departure === 'Ma position actuelle') {
        startCoords = currentPosition || { lat: -18.9137, lng: 47.5361 };
        startName = 'Ma position';
      } else {
        const startData = findCoordinates(departure);
        if (startData) {
          startCoords = { lat: startData.lat, lng: startData.lng };
          startName = startData.name || departure;
        } else {
          startCoords = currentPosition || { lat: -18.9137, lng: 47.5361 };
        }
      }

      const endData = findCoordinates(destination);
      if (!endData) {
        alert(`Impossible de trouver les coordonnées de "${destination}"`);
        setIsCalculating(false);
        return;
      }
      
      const endCoords = { lat: endData.lat, lng: endData.lng };
      setDestinationCoords(endCoords);
      setDepartureCoords(startCoords);

      console.log('=== CALCUL ITINÉRAIRE ===');
      console.log('Départ:', startName, startCoords);
      console.log('Destination:', destination, endCoords);

      // Générer la route
      const route = generateRouteFromCoords(startCoords, endCoords);
      setRoutePoints(route);

      // Calculer la distance
      const distance = calculateDistance(startCoords, endCoords);
      
      // Déterminer le statut du trafic
      const trafficStatus = getTrafficStatusForRoute(destination);
      const conditionRoute = getConditionRouteForDestination(destination);
      
      // Calculer le temps selon le mode de transport
      const travelTime = getTravelTimeByMode(
        distance, 
        transportMode, 
        trafficStatus,
        conditionRoute
      );

      // Générer les étapes
      const generatedSteps = generateSteps(
        departure === 'Ma position actuelle' ? 'Ma position' : departure,
        destination,
        transportMode
      );
      setSteps(generatedSteps);

      const duration = travelTime.totalMinutes;
      const optimized = getOptimizedTime(duration);
      setOptimizedTime(optimized);

      const alerts = getRouteAlerts(startName, destination);
      const filteredAlerts = avoidTraffic 
        ? alerts.filter(a => a.type !== 'danger')
        : alerts;

      const trafficLevel = trafficData[destination] || 'Moyen';

      const hours = ['08h00', '09h30', '10h00', '11h30', '13h00', '14h00', '15h30', '16h00', '17h00'];
      const randomHour = hours[Math.floor(Math.random() * hours.length)];
      const randomDuration = Math.floor(duration * (0.6 + Math.random() * 0.2));

      const resultData = {
        distance: `${distance.toFixed(1)} km`,
        duration: travelTime.label,
        durationMinutes: duration,
        optimizedDuration: `${optimized}`,
        traffic: trafficLevel,
        route: route,
        alerts: filteredAlerts,
        steps: generatedSteps,
        startPoint: startCoords,
        endPoint: endCoords,
        bestTime: {
          now: travelTime.label,
          optimized: `${optimized}`,
          recommended: randomHour,
          recommendedDuration: `${randomDuration} min`
        }
      };

      setResult(resultData);
      setShowSuggestions(true);
      setShowMap(true);

      if (onCalculate) {
        onCalculate({
          departure: startName,
          destination,
          transportMode,
          route: route,
          result: resultData
        });
      }

    } catch (error) {
      console.error('Erreur de calcul:', error);
      alert('Une erreur est survenue lors du calcul de l\'itinéraire.');
    } finally {
      setIsCalculating(false);
    }
  };

  // ============================================================
  // 5. FONCTIONS DE GÉNÉRATION DE ROUTE
  // ============================================================
  const generateRouteFromCoords = (start, end) => {
    const points = [];
    const steps = 30;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;
      const curve = Math.sin(t * Math.PI) * 0.02;
      points.push({
        lat: lat + curve * (i % 2 === 0 ? 1 : -1),
        lng: lng + curve * 0.5
      });
    }
    
    return points;
  };

  const calculateDistance = (start, end) => {
    const R = 6371;
    const dLat = (end.lat - start.lat) * Math.PI / 180;
    const dLon = (end.lng - start.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getTrafficStatusForRoute = (destination) => {
    // Simuler le statut du trafic en fonction de la destination
    const statuses = ['VERT', 'ORANGE', 'ROUGE'];
    const weights = { 'VERT': 0.4, 'ORANGE': 0.4, 'ROUGE': 0.2 };
    let random = Math.random();
    let cumulative = 0;
    for (const status of statuses) {
      cumulative += weights[status];
      if (random <= cumulative) return status;
    }
    return 'VERT';
  };

  const getConditionRouteForDestination = (destination) => {
    // Simuler l'état de la route
    const conditions = ['BONNE', 'MOYENNE', 'MAUVAISE'];
    const weights = { 'BONNE': 0.4, 'MOYENNE': 0.4, 'MAUVAISE': 0.2 };
    let random = Math.random();
    let cumulative = 0;
    for (const condition of conditions) {
      cumulative += weights[condition];
      if (random <= cumulative) return condition;
    }
    return 'BONNE';
  };

  const getOptimizedTime = (duration) => {
    const optimized = Math.floor(duration * 0.85);
    const hours = Math.floor(optimized / 60);
    const minutes = optimized % 60;
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  };

  // ============================================================
  // 6. NETTOYAGE
  // ============================================================
  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setRoutePoints([]);
      setShowSuggestions(false);
    }
  }, [isOpen]);

  // ============================================================
  // 7. RENDU
  // ============================================================
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-[3000]"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3001] w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
          
          <ItineraryHeader onClose={onClose} />

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Colonne gauche */}
              <div className="max-h-[450px] overflow-y-auto pr-3">
                
                <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-xl mb-4">
                  <button
                    onClick={() => setAvoidTraffic(!avoidTraffic)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      avoidTraffic
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {avoidTraffic ? '🚫 Éviter trafic' : '🚦 Éviter trafic'}
                  </button>
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition bg-blue-500 text-white hover:bg-blue-600"
                  >
                    {showMap ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showMap ? 'Cacher carte' : 'Voir carte'}
                  </button>
                  <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition bg-purple-500 text-white hover:bg-purple-600"
                  >
                    {showSteps ? '📋 Étapes' : '📋 Étapes'}
                  </button>
                  {currentPosition && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      📍 Position trouvée
                    </span>
                  )}
                </div>

                <ItineraryForm
                  departure={departure}
                  setDeparture={setDeparture}
                  destination={destination}
                  setDestination={setDestination}
                  transportMode={transportMode}
                  setTransportMode={setTransportMode}
                  isCalculating={isCalculating}
                  onCalculate={handleCalculate}
                  availableDestinations={availableDestinations}
                />

                {result && (
                  <>
                    <ItinerarySummary
                      distance={result.distance}
                      duration={result.duration}
                      traffic={result.traffic}
                      transportMode={transportMode}
                    />

                    {result.optimizedDuration && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-700">⚡ Temps optimisé</span>
                          <span className="text-sm font-bold text-green-700">{result.optimizedDuration}</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          ✨ Gain de temps par rapport au trajet standard
                        </p>
                      </div>
                    )}

                    {showSteps && steps.length > 0 && (
                      <ItinerarySteps
                        steps={steps}
                        transportMode={transportMode}
                        duration={result.optimizedDuration || result.duration}
                        distance={result.distance}
                      />
                    )}

                    {showSuggestions && (
                      <div className="space-y-4">
                        <ItinerarySuggestions routes={[
                          { 
                            id: 1, 
                            name: '✅ Recommandé', 
                            duration: result.optimizedDuration || result.duration, 
                            distance: result.distance, 
                            traffic: result.traffic, 
                            color: 'green' 
                          },
                          { 
                            id: 2, 
                            name: '🔄 Alternatif', 
                            duration: (parseInt(result.duration) + 15) + ' min', 
                            distance: (parseFloat(result.distance) + 12).toFixed(1) + ' km', 
                            traffic: 'Modéré', 
                            color: 'yellow' 
                          },
                          { 
                            id: 3, 
                            name: '🔄 Éviter bouchons', 
                            duration: (parseInt(result.duration) + 30) + ' min', 
                            distance: (parseFloat(result.distance) + 25).toFixed(1) + ' km', 
                            traffic: 'Dense', 
                            color: 'red' 
                          },
                        ]} />

                        {result.alerts && result.alerts.length > 0 && (
                          <ItineraryAlerts alerts={result.alerts} />
                        )}

                        {result.bestTime && (
                          <ItineraryBestTime bestTime={result.bestTime} />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Colonne droite - Carte */}
              <div className={`lg:block ${!showMap ? 'hidden' : ''}`}>
                <div className="h-[450px] rounded-2xl overflow-hidden border border-slate-200">
                  <ItineraryMap
                    startPoint={departureCoords || currentPosition}
                    routePoints={routePoints}
                    destination={destinationCoords}
                    destinationName={destination}
                    showRoute={showMap}
                    avoidTraffic={avoidTraffic}
                    steps={steps}
                    userLocation={currentPosition}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400">
                    🗺️ {destination ? `Itinéraire vers ${destination}` : 'Sélectionnez une destination'}
                  </p>
                  {result?.optimizedDuration && (
                    <p className="text-xs text-green-600 font-medium">
                      ⚡ {result.optimizedDuration}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}