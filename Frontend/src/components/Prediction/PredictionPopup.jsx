import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, TrendingUp, 
  AlertCircle, BarChart3, LineChart, Activity,
  Loader2, Car, Bus, Bike, Footprints
} from 'lucide-react';
import { regionsData, getAllBusStops, arretsFianarantsoa } from '../../data/madagascar.data';
import { 
  getAllBusStopsFromLines
} from '../../data/busData';

// Données pour les prédictions
const predictionLevels = {
  'Fluide': { color: '#22c55e', icon: '🟢', level: 1, label: 'Fluide' },
  'Moyen': { color: '#eab308', icon: '🟡', level: 2, label: 'Moyen' },
  'Modéré': { color: '#f97316', icon: '🟠', level: 3, label: 'Modéré' },
  'Dense': { color: '#ef4444', icon: '🔴', level: 4, label: 'Dense' },
  'Très dense': { color: '#dc2626', icon: '🔴', level: 5, label: 'Très dense' }
};

export default function PredictionPopup({ isOpen, onClose }) {
  const [province, setProvince] = useState('Analamanga');
  const [zone, setZone] = useState('Antananarivo');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hour, setHour] = useState('17:00');
  const [transportMode, setTransportMode] = useState('voiture');
  const [predictions, setPredictions] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hourlyData, setHourlyData] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [zonesList, setZonesList] = useState([]);
  const [allZones, setAllZones] = useState([]);

  // Initialiser toutes les zones disponibles
  useEffect(() => {
    try {
      if (!regionsData || typeof regionsData !== 'object') {
        console.warn('regionsData n\'est pas disponible');
        return;
      }

      const zones = [];
      for (const [region, data] of Object.entries(regionsData)) {
        if (data?.zones && Array.isArray(data.zones)) {
          data.zones.forEach(zone => {
            zones.push({
              name: zone,
              region: region
            });
          });
        }
      }
      
      try {
        const legacyStops = getAllBusStops();
        if (legacyStops && Array.isArray(legacyStops)) {
          legacyStops.forEach(stop => {
            if (!zones.some(z => z.name === stop.name)) {
              zones.push({
                name: stop.name,
                region: stop.region || 'Inconnu'
              });
            }
          });
        }
      } catch (e) {
        console.warn('Erreur chargement arrêts legacy:', e);
      }
      
      try {
        const busLineStops = getAllBusStopsFromLines();
        if (busLineStops && Array.isArray(busLineStops)) {
          busLineStops.forEach(stop => {
            if (!zones.some(z => z.name === stop.nom)) {
              zones.push({
                name: stop.nom,
                region: stop.ville || 'Inconnu'
              });
            }
          });
        }
      } catch (e) {
        console.warn('Erreur chargement arrêts bus:', e);
      }
      
      try {
        if (arretsFianarantsoa && Array.isArray(arretsFianarantsoa)) {
          arretsFianarantsoa.forEach(stop => {
            if (!zones.some(z => z.name === stop.nom)) {
              zones.push({
                name: stop.nom,
                region: 'Fianarantsoa'
              });
            }
          });
        }
      } catch (e) {
        console.warn('Erreur chargement arrêts Fianarantsoa:', e);
      }
      
      setAllZones(zones);
      
      const filteredZones = zones
        .filter(z => z.region === province)
        .map(z => z.name);
      
      setZonesList(filteredZones);
      
      if (filteredZones.length > 0 && !filteredZones.includes(zone)) {
        setZone(filteredZones[0]);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des zones:', error);
      if (regionsData && regionsData[province]) {
        setZonesList(regionsData[province].zones || []);
      }
    }
  }, []);

  // Mettre à jour les zones quand la province change
  useEffect(() => {
    if (province && allZones.length > 0) {
      const filteredZones = allZones
        .filter(z => z.region === province)
        .map(z => z.name);
      
      setZonesList(filteredZones);
      
      if (filteredZones.length > 0 && !filteredZones.includes(zone)) {
        setZone(filteredZones[0]);
      } else if (filteredZones.length === 0) {
        setZone('');
      }
    }
  }, [province, allZones]);

  // Générer les prédictions horaires
  const generateHourlyPredictions = (selectedHour, mode) => {
    const hours = [];
    const baseHour = parseInt(selectedHour.split(':')[0]);
    const today = new Date().getDay();
    const isWeekend = today === 0 || today === 6;
    
    for (let i = 0; i < 7; i++) {
      const h = (baseHour + i) % 24;
      const hourStr = `${String(h).padStart(2, '0')}:00`;
      
      let traffic = 'Fluide';
      let level = 1;
      
      if ((h >= 7 && h <= 9) || (h >= 16 && h <= 18)) {
        if (!isWeekend) {
          traffic = 'Très dense';
          level = 5;
        } else {
          traffic = 'Moyen';
          level = 2;
        }
      } 
      else if (h >= 12 && h <= 14) {
        traffic = 'Modéré';
        level = 3;
      }
      else if (h >= 20 && h <= 22) {
        traffic = 'Moyen';
        level = 2;
      }
      else if (h >= 23 || h <= 5) {
        traffic = 'Fluide';
        level = 1;
      }

      if (mode === 'moto' && (traffic === 'Très dense' || traffic === 'Dense')) {
        const levels = ['Fluide', 'Moyen', 'Modéré', 'Dense', 'Très dense'];
        const currentIndex = levels.indexOf(traffic);
        if (currentIndex > 1) {
          traffic = levels[currentIndex - 1];
          level = level - 1;
        }
      }

      if (mode === 'marche') {
        traffic = 'Moyen';
        level = 2;
      }

      hours.push({
        hour: hourStr,
        traffic: traffic,
        level: level,
        icon: predictionLevels[traffic]?.icon || '🟢',
        color: predictionLevels[traffic]?.color || '#22c55e',
        label: predictionLevels[traffic]?.label || 'Fluide'
      });
    }
    return hours;
  };

  // Calculer la recommandation
  const calculateRecommendation = (data, mode) => {
    const denseHours = data.filter(d => d.traffic === 'Très dense' || d.traffic === 'Dense');
    const fluidHours = data.filter(d => d.traffic === 'Fluide' || d.traffic === 'Moyen');
    
    if (denseHours.length > 0) {
      const densePeriod = denseHours.map(d => d.hour).join(' - ');
      const bestHour = fluidHours.length > 0 ? fluidHours[0].hour : 'plus tard';
      
      let advice = '';
      if (mode === 'moto') {
        advice = 'Les motos peuvent circuler même en heure de pointe, mais prudence.';
      } else if (mode === 'marche') {
        advice = 'La marche est recommandée en dehors des heures de pointe.';
      } else {
        advice = `Évitez de partir entre ${densePeriod}. Privilégiez ${bestHour}.`;
      }

      return {
        warning: `Trafic dense entre ${densePeriod}`,
        advice: advice,
        bestHour: bestHour,
        severity: 'high'
      };
    }
    
    return {
      warning: 'Trafic fluide toute la journée',
      advice: 'Vous pouvez partir à n\'importe quelle heure.',
      bestHour: 'maintenant',
      severity: 'low'
    };
  };

  // Effectuer la prédiction
  const handlePredict = () => {
    setIsCalculating(true);
    setPredictions(null);
    setHourlyData([]);
    setRecommendation(null);

    setTimeout(() => {
      const data = generateHourlyPredictions(hour, transportMode);
      setHourlyData(data);
      
      const rec = calculateRecommendation(data, transportMode);
      setRecommendation(rec);
      
      const maxLevel = Math.max(...data.map(d => d.level));
      const globalTraffic = Object.keys(predictionLevels).find(
        key => predictionLevels[key]?.level === maxLevel
      ) || 'Moyen';

      setPredictions({
        hourly: data,
        global: globalTraffic,
        recommendation: rec
      });
      
      setIsCalculating(false);
    }, 1500);
  };

  const getModeIcon = (mode) => {
    const icons = {
      'voiture': <Car className="w-4 h-4" />,
      'bus': <Bus className="w-4 h-4" />,
      'marche': <Footprints className="w-4 h-4" />,
      'moto': <Bike className="w-4 h-4" />
    };
    return icons[mode] || <Car className="w-4 h-4" />;
  };

  const getModeLabel = (mode) => {
    const labels = {
      'voiture': 'Voiture',
      'bus': 'Bus',
      'marche': 'Marche',
      'moto': 'Moto'
    };
    return labels[mode] || 'Voiture';
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-[3000]"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3001] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
          
          {/* Header compact */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <LineChart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Prédictions</h2>
                <p className="text-[10px] text-slate-400">Anticipez les heures de pointe</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Colonne gauche - Formulaire compact */}
              <div className="space-y-3">
                {/* Province */}
                <div>
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-500" />
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800"
                  >
                    {regionsData && Object.keys(regionsData).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Zone */}
                <div>
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    Zone
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800"
                  >
                    {zonesList.length > 0 ? (
                      zonesList.map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))
                    ) : (
                      <option value="">Aucune zone</option>
                    )}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800"
                  />
                </div>

                {/* Heure */}
                <div>
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    Heure
                  </label>
                  <input
                    type="time"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800"
                  />
                </div>

                {/* Mode de transport compact */}
                <div>
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                    🚗 Transport
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['voiture', 'bus', 'moto', 'marche'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setTransportMode(mode)}
                        className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border transition ${
                          transportMode === mode
                            ? 'border-purple-500 bg-purple-50 text-purple-600'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        {getModeIcon(mode)}
                        <span className="text-[9px] font-medium">{getModeLabel(mode)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePredict}
                  disabled={isCalculating || !zone}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2 rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Prédire
                    </>
                  )}
                </button>

                {/* Légende compacte */}
                <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200">
                  {Object.values(predictionLevels).map((level) => (
                    <span 
                      key={level.label}
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: level.color + '20', 
                        color: level.color,
                        border: `1px solid ${level.color}40`
                      }}
                    >
                      {level.icon} {level.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Colonne droite - Résultats compact */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scroll">
                {predictions ? (
                  <div className="space-y-3">
                    {/* Prédictions horaires */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <h4 className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        Prévisions
                      </h4>
                      <div className="space-y-1.5">
                        {hourlyData.map((item, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200"
                          >
                            <span className="text-xs font-medium text-slate-700">{item.hour}</span>
                            <div className="flex items-center gap-2">
                              <span style={{ color: item.color }}>{item.icon}</span>
                              <span className={`text-xs font-medium`} style={{ color: item.color }}>
                                {item.traffic}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Graphique compact */}
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                      <h4 className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
                        Niveau trafic
                      </h4>
                      <div className="h-28 flex items-end gap-1.5">
                        {hourlyData.map((item, index) => {
                          const height = (item.level / 5) * 100;
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full rounded-t-lg transition-all duration-500"
                                style={{
                                  height: `${height}%`,
                                  backgroundColor: item.color,
                                  opacity: 0.8,
                                  minHeight: '8px',
                                  borderRadius: '4px 4px 0 0'
                                }}
                              />
                              <span className="text-[8px] text-slate-500 mt-0.5">{item.hour.split(':')[0]}h</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recommandation compacte */}
                    {recommendation && (
                      <div className={`rounded-xl p-3 border ${
                        recommendation.severity === 'high' 
                          ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
                          : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                      }`}>
                        <h4 className="text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-purple-500" />
                          💡 Recommandation
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-start gap-1.5 text-xs">
                            <AlertCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                              recommendation.severity === 'high' ? 'text-orange-500' : 'text-green-500'
                            }`} />
                            <p className="text-slate-700 text-xs">{recommendation.warning}</p>
                          </div>
                          {recommendation.bestHour && (
                            <div className="text-xs text-slate-500 bg-white/40 rounded-lg p-1.5">
                              Meilleure heure : <span className="font-bold text-purple-600">{recommendation.bestHour}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Statistiques compactes */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <h4 className="text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                        📊 Stats
                      </h4>
                      <div className="grid grid-cols-4 gap-1.5">
                        <div className="text-center p-1.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-sm font-bold text-green-500">
                            {hourlyData.filter(d => d.level === 1).length}
                          </div>
                          <div className="text-[9px] text-slate-500">Fluide</div>
                        </div>
                        <div className="text-center p-1.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-sm font-bold text-yellow-500">
                            {hourlyData.filter(d => d.level === 2).length}
                          </div>
                          <div className="text-[9px] text-slate-500">Moyen</div>
                        </div>
                        <div className="text-center p-1.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-sm font-bold text-orange-500">
                            {hourlyData.filter(d => d.level === 3).length}
                          </div>
                          <div className="text-[9px] text-slate-500">Modéré</div>
                        </div>
                        <div className="text-center p-1.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-sm font-bold text-red-500">
                            {hourlyData.filter(d => d.level >= 4).length}
                          </div>
                          <div className="text-[9px] text-slate-500">Dense+</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-xl border border-slate-200 min-h-[350px]">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                      <LineChart className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700">Prêt à prédire</h3>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Sélectionnez les paramètres et cliquez sur "Prédire"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}