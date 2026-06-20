import React, { useState, useEffect } from 'react';
import { X, Route, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import ItineraryHeader from './ItineraryHeader';
import ItineraryForm from './ItineraryForm';
import ItinerarySuggestions from './ItinerarySuggestions';
import ItineraryAlerts from './ItineraryAlerts';
import ItineraryBestTime from './ItineraryBestTime';
import ItinerarySummary from './ItinerarySummary';
import ItineraryMap from './ItineraryMap';
import { itineraryService } from '../../services/itinerary.api';

export default function ItineraryPopup({ isOpen, onClose, onCalculate, userLocation }) {
  const [departure, setDeparture] = useState('Ma position actuelle');
  const [destination, setDestination] = useState('');
  const [transportMode, setTransportMode] = useState('voiture');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [avoidTraffic, setAvoidTraffic] = useState(false);
  const [realTimeData, setRealTimeData] = useState(null);

  // Récupérer la position actuelle
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(pos);
        },
        () => {
          setCurrentPosition({ lat: -18.9137, lng: 47.5361 });
        }
      );
    } else {
      setCurrentPosition({ lat: -18.9137, lng: 47.5361 });
    }
  }, []);

  // Récupérer les données de trafic en temps réel (simulé)
  useEffect(() => {
    if (currentPosition) {
      setRealTimeData({
        segments: [
          { id: 1, name: 'Avenue de l\'Indépendance', status: 'fluide', level: 20 },
          { id: 2, name: 'Route d\'Anosizato', status: 'dense', level: 70 },
          { id: 3, name: 'Boulevard Andraharo', status: 'modere', level: 45 },
        ]
      });
    }
  }, [currentPosition]);

  // Générer les points de la route
  const generateRoutePoints = (start, end) => {
    const points = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;
      const curve = Math.sin(t * Math.PI) * 0.005;
      points.push({
        lat: lat + curve * (i % 2 === 0 ? 1 : -1),
        lng: lng + curve * 0.5
      });
    }
    return points;
  };

  // Trouver une destination
  const findDestination = (query) => {
    const places = {
      'anosizato': { lat: -18.9050, lng: 47.5250 },
      'andraharo': { lat: -18.8950, lng: 47.5150 },
      'analakely': { lat: -18.9150, lng: 47.5360 },
      'ivandry': { lat: -18.9200, lng: 47.5450 },
      'ankorondrano': { lat: -18.9100, lng: 47.5300 },
      'mahamasina': { lat: -18.9120, lng: 47.5280 },
      '67ha': { lat: -18.9000, lng: 47.5400 },
      'tanjombato': { lat: -18.9300, lng: 47.5500 },
      'ambohimanarina': { lat: -18.8880, lng: 47.5100 },
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, value] of Object.entries(places)) {
      if (lowerQuery.includes(key)) {
        return { ...value, label: key };
      }
    }
    return {
      lat: -18.9137 + (Math.random() - 0.5) * 0.05,
      lng: 47.5361 + (Math.random() - 0.5) * 0.05,
      label: 'Destination'
    };
  };

  // Calculer l'itinéraire
  const handleCalculate = async () => {
    if (!destination) return;

    setIsCalculating(true);
    setResult(null);
    setShowSuggestions(false);

    try {
      // Tentative d'appel API
      const response = await itineraryService.calculateRoute({
        departure: departure === 'Ma position actuelle' ? currentPosition : { address: departure },
        destination: { address: destination },
        transportMode,
        avoidTraffic
      });

      if (response && response.data) {
        const data = response.data;
        setRoutePoints(data.route || []);
        setResult({
          distance: data.distance || '8.5 km',
          duration: data.duration || '25 min',
          traffic: data.traffic || 'Moyen',
          alerts: data.alerts || [],
          bestTime: data.bestTime || {
            now: '35 min',
            recommended: '14h00',
            recommendedDuration: '20 min'
          }
        });
        setShowSuggestions(true);
        setShowMap(true);
        
        if (onCalculate) {
          onCalculate({
            departure,
            destination,
            transportMode,
            route: data.route || [],
            result: data
          });
        }
      }
    } catch (error) {
      // Fallback: données mockées
      console.log('Utilisation des données mockées pour l\'itinéraire');
      const start = currentPosition || { lat: -18.9137, lng: 47.5361 };
      const end = findDestination(destination);
      
      const route = generateRoutePoints(start, end);
      setRoutePoints(route);

      const alerts = [
        { id: 1, type: 'warning', location: 'Ankorondrano', message: 'Ralentissement modéré' },
        { id: 2, type: 'danger', location: 'Analakely', message: 'Travaux en cours' },
        { id: 3, type: 'warning', location: 'Ivandry', message: 'Accident signalé' },
        { id: 4, type: 'warning', location: 'Mahamasina', message: 'Circulation dense' },
      ];

      const filteredAlerts = avoidTraffic 
        ? alerts.filter(a => a.type !== 'danger')
        : alerts;

      const resultData = {
        distance: (Math.random() * 5 + 5).toFixed(1) + ' km',
        duration: Math.floor(Math.random() * 30 + 15) + ' min',
        traffic: ['Fluide', 'Moyen', 'Modéré', 'Dense'][Math.floor(Math.random() * 4)],
        route: route,
        alerts: filteredAlerts,
        bestTime: {
          now: Math.floor(Math.random() * 20 + 20) + ' min',
          recommended: ['14h00', '15h30', '16h00', '17h00'][Math.floor(Math.random() * 4)],
          recommendedDuration: Math.floor(Math.random() * 15 + 10) + ' min'
        }
      };

      setResult(resultData);
      setShowSuggestions(true);
      setShowMap(true);

      if (onCalculate) {
        onCalculate({
          departure,
          destination,
          transportMode,
          route: route,
          result: resultData
        });
      }
    } finally {
      setIsCalculating(false);
    }
  };

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
                    {avoidTraffic ? 'Éviter trafic' : 'Éviter trafic'}
                  </button>
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition bg-blue-500 text-white hover:bg-blue-600"
                  >
                    {showMap ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showMap ? 'Cacher' : 'Voir'}
                  </button>
                  {currentPosition && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      ✓ Position trouvée
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <ItineraryForm
                    departure={departure}
                    setDeparture={setDeparture}
                    destination={destination}
                    setDestination={setDestination}
                    transportMode={transportMode}
                    setTransportMode={setTransportMode}
                    isCalculating={isCalculating}
                    onCalculate={handleCalculate}
                  />

                  {result && (
                    <>
                      <ItinerarySummary
                        distance={result.distance}
                        duration={result.duration}
                        traffic={result.traffic}
                      />

                      {showSuggestions && (
                        <div className="space-y-4">
                          <ItinerarySuggestions routes={[
                            { id: 1, name: '✅ Recommandé', duration: result.duration, distance: result.distance, traffic: result.traffic, color: 'green' },
                            { id: 2, name: '🔄 Alternatif', duration: (parseInt(result.duration) + 5) + ' min', distance: (parseFloat(result.distance) + 0.7).toFixed(1) + ' km', traffic: 'Modéré', color: 'yellow' },
                            { id: 3, name: '🔄 Éviter bouchons', duration: (parseInt(result.duration) + 15) + ' min', distance: (parseFloat(result.distance) + 2.8).toFixed(1) + ' km', traffic: 'Dense', color: 'red' },
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
              </div>

              {/* Colonne droite - Carte */}
              <div className={`lg:block ${!showMap ? 'hidden' : ''}`}>
                <div className="h-[450px] rounded-2xl overflow-hidden border border-slate-200">
                  <ItineraryMap
                    startPoint={currentPosition}
                    routePoints={routePoints}
                    destination={destination ? findDestination(destination) : null}
                    showRoute={showMap}
                    avoidTraffic={avoidTraffic}
                    realTimeData={realTimeData}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  🗺️ Itinéraire recommandé
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}