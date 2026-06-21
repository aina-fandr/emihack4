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

// Données pour les prédictions avec probabilités
const predictionLevels = {
  'Fluide': { color: '#22c55e', icon: '🟢', level: 1, label: 'Fluide', probability: 0.85 },
  'Moyen': { color: '#eab308', icon: '🟡', level: 2, label: 'Moyen', probability: 0.70 },
  'Modéré': { color: '#f97316', icon: '🟠', level: 3, label: 'Modéré', probability: 0.55 },
  'Dense': { color: '#ef4444', icon: '🔴', level: 4, label: 'Dense', probability: 0.40 },
  'Très dense': { color: '#dc2626', icon: '🔴', level: 5, label: 'Très dense', probability: 0.25 }
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

  // Générer des prédictions réalistes avec probabilités
  const generateHourlyPredictions = (selectedHour, mode) => {
    const hours = [];
    const baseHour = parseInt(selectedHour.split(':')[0]);
    const today = new Date().getDay();
    const isWeekend = today === 0 || today === 6;
    const currentMonth = new Date().getMonth();
    const isHolidaySeason = currentMonth === 11 || currentMonth === 0; // Décembre ou Janvier
    
    for (let i = -1; i < 6; i++) {
      const h = (baseHour + i) % 24;
      const hourStr = `${String(h).padStart(2, '0')}:00`;
      
      // Facteurs influençant le trafic
      let trafficBase = 1; // Niveau de base
      let probability = 0.75; // Probabilité de base
      
      // 1. Heures de pointe
      const isMorningPeak = (h >= 7 && h <= 9);
      const isEveningPeak = (h >= 16 && h <= 18);
      const isLunch = (h >= 12 && h <= 14);
      const isNight = (h >= 22 || h <= 5);
      const isEvening = (h >= 19 && h <= 21);
      
      // 2. Week-end vs semaine
      const weekdayFactor = isWeekend ? 0.6 : 1.0;
      
      // 3. Saison des fêtes
      const holidayFactor = isHolidaySeason ? 1.2 : 1.0;
      
      // 4. Calcul du niveau de trafic
      if (isMorningPeak || isEveningPeak) {
        if (!isWeekend) {
          trafficBase = 5; // Très dense
          probability = 0.85;
        } else {
          trafficBase = 3; // Modéré
          probability = 0.65;
        }
      } else if (isLunch) {
        trafficBase = 3; // Modéré
        probability = 0.70;
      } else if (isNight) {
        trafficBase = 1; // Fluide
        probability = 0.90;
      } else if (isEvening) {
        trafficBase = 2; // Moyen
        probability = 0.75;
      } else {
        trafficBase = 2; // Moyen
        probability = 0.70;
      }
      
      // Ajustement selon le mode de transport
      if (mode === 'moto') {
        // Les motos sont moins impactées par les bouchons
        trafficBase = Math.max(1, trafficBase - 1);
        probability = Math.min(0.95, probability + 0.10);
      } else if (mode === 'marche') {
        trafficBase = 2; // Toujours modéré pour la marche
        probability = 0.80;
      } else if (mode === 'bus') {
        // Les bus sont plus impactés par le trafic
        trafficBase = Math.min(5, trafficBase + 0.5);
        probability = Math.max(0.4, probability - 0.10);
      }
      
      // Application des facteurs
      trafficBase = Math.min(5, Math.round(trafficBase * weekdayFactor * holidayFactor));
      
      // Déterminer le niveau de trafic
      let traffic = 'Fluide';
      let level = 1;
      
      const trafficMap = {
        1: { label: 'Fluide', level: 1 },
        2: { label: 'Moyen', level: 2 },
        3: { label: 'Modéré', level: 3 },
        4: { label: 'Dense', level: 4 },
        5: { label: 'Très dense', level: 5 }
      };
      
      const result = trafficMap[trafficBase] || trafficMap[1];
      traffic = result.label;
      level = result.level;
      
      // Ajuster la probabilité selon le niveau
      const probMap = {
        1: 0.90,
        2: 0.80,
        3: 0.70,
        4: 0.55,
        5: 0.40
      };
      probability = probMap[level] || 0.70;
      
      hours.push({
        hour: hourStr,
        traffic: traffic,
        level: level,
        probability: Math.round(probability * 100),
        icon: predictionLevels[traffic]?.icon || '🟢',
        color: predictionLevels[traffic]?.color || '#22c55e',
        label: predictionLevels[traffic]?.label || 'Fluide'
      });
    }
    return hours;
  };

  // Calculer la recommandation avancée
  const calculateRecommendation = (data, mode) => {
    const denseHours = data.filter(d => d.level >= 4);
    const moderateHours = data.filter(d => d.level === 3);
    const fluidHours = data.filter(d => d.level <= 2);
    
    if (denseHours.length > 0) {
      const densePeriod = denseHours.map(d => d.hour).join(' - ');
      const bestHour = fluidHours.length > 0 ? fluidHours[0].hour : 'plus tard';
      
      let advice = '';
      let severity = 'high';
      
      if (mode === 'moto') {
        advice = 'Les motos peuvent circuler même en heure de pointe, mais prudence sur les routes glissantes.';
        severity = 'medium';
      } else if (mode === 'marche') {
        advice = 'La marche est recommandée en dehors des heures de pointe. Prévoyez un parapluie.';
        severity = 'low';
      } else if (mode === 'bus') {
        advice = `Évitez de prendre le bus entre ${densePeriod}. Privilégiez ${bestHour} pour éviter les retards.`;
        severity = 'high';
      } else {
        advice = `Évitez de partir entre ${densePeriod}. Privilégiez ${bestHour} pour un trajet plus rapide.`;
        severity = 'high';
      }

      // Ajouter une probabilité de précision
      const accuracy = denseHours.length > 2 ? 'Élevée' : 'Moyenne';

      return {
        warning: `🚨 Trafic dense entre ${densePeriod}`,
        advice: advice,
        bestHour: bestHour,
        severity: severity,
        accuracy: accuracy,
        denseCount: denseHours.length,
        moderateCount: moderateHours.length
      };
    }
    
    if (moderateHours.length > 0) {
      return {
        warning: '⚠️ Trafic modéré à certaines heures',
        advice: 'Prévoyez un peu de temps supplémentaire pour votre trajet.',
        bestHour: fluidHours.length > 0 ? fluidHours[0].hour : 'maintenant',
        severity: 'medium',
        accuracy: 'Bonne',
        denseCount: 0,
        moderateCount: moderateHours.length
      };
    }
    
    return {
      warning: '✅ Trafic fluide toute la journée',
      advice: 'Vous pouvez partir à n\'importe quelle heure, le trafic sera fluide.',
      bestHour: 'maintenant',
      severity: 'low',
      accuracy: 'Élevée',
      denseCount: 0,
      moderateCount: 0
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
        recommendation: rec,
        confidence: Math.round((1 - (maxLevel - 1) / 5) * 100)
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

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3001] w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center">
                <LineChart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Prédictions du trafic</h2>
                <p className="text-xs text-slate-400">Anticipez les heures de pointe</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition p-1.5 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Colonne gauche - Formulaire */}
              <div className="space-y-4">
                {/* Province */}
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800"
                  >
                    {regionsData && Object.keys(regionsData).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Zone */}
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    Zone / Arrêt de bus
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800"
                  >
                    {zonesList.length > 0 ? (
                      zonesList.map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))
                    ) : (
                      <option value="">Aucune zone disponible</option>
                    )}
                  </select>
                  {zonesList.length === 0 && (
                    <p className="text-xs text-orange-500 mt-1">
                      Aucune zone trouvée pour cette province
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800"
                  />
                </div>

                {/* Heure */}
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                    <Clock className="w-4 h-4 text-purple-500" />
                    Heure de départ
                  </label>
                  <input
                    type="time"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800"
                  />
                </div>

                {/* Mode de transport */}
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                    🚗 Mode de transport
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['voiture', 'bus', 'moto', 'marche'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setTransportMode(mode)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border transition ${
                          transportMode === mode
                            ? 'border-purple-500 bg-purple-50 text-purple-600'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        {getModeIcon(mode)}
                        <span className="text-[10px] font-medium">{getModeLabel(mode)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePredict}
                  disabled={isCalculating || !zone}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Prédire le trafic
                    </>
                  )}
                </button>

                {/* Légende des couleurs */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                  {Object.values(predictionLevels).map((level) => (
                    <span 
                      key={level.label}
                      className="text-xs px-2 py-1 rounded-full"
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

              {/* Colonne droite - Résultats avec probabilités */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scroll">
                {predictions ? (
                  <div className="space-y-4">
                    {/* Prédictions horaires avec probabilités */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        Prévisions horaires
                      </h4>
                      <div className="space-y-2">
                        {hourlyData.map((item, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition"
                          >
                            <span className="text-sm font-medium text-slate-700">{item.hour}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400">
                                {item.probability}%
                              </span>
                              <span style={{ color: item.color }}>{item.icon}</span>
                              <span className={`text-sm font-medium`} style={{ color: item.color }}>
                                {item.traffic}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Graphique avec probabilités */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-500" />
                        Niveau du trafic
                      </h4>
                      <div className="h-40 flex items-end gap-2">
                        {hourlyData.map((item, index) => {
                          const height = (item.level / 5) * 100;
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full rounded-t-lg transition-all duration-500 relative group"
                                style={{
                                  height: `${height}%`,
                                  backgroundColor: item.color,
                                  opacity: 0.8,
                                  minHeight: '10px',
                                  borderRadius: '8px 8px 0 0'
                                }}
                              >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition">
                                  {item.probability}%
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-500 mt-1">{item.hour.split(':')[0]}h</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                        <span>Fluide</span>
                        <span>Moyen</span>
                        <span>Modéré</span>
                        <span>Dense</span>
                        <span>Très dense</span>
                      </div>
                    </div>

                    {/* Recommandation avec précision */}
                    {recommendation && (
                      <div className={`rounded-xl p-4 border ${
                        recommendation.severity === 'high' 
                          ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
                          : recommendation.severity === 'medium'
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                          : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                      }`}>
                        <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-purple-500" />
                          💡 Recommandation
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              recommendation.severity === 'high' ? 'text-orange-500' : 
                              recommendation.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                            }`} />
                            <p className="text-slate-700">{recommendation.warning}</p>
                          </div>
                          <div className="flex items-start gap-2 text-sm bg-white/60 rounded-lg p-2">
                            <span className="text-purple-500">⏰</span>
                            <p className="text-slate-700 font-medium">
                              {recommendation.advice}
                            </p>
                          </div>
                          {recommendation.bestHour && (
                            <div className="text-xs text-slate-500 bg-white/40 rounded-lg p-2 flex items-center justify-between">
                              <span>Meilleure heure : <span className="font-bold text-purple-600">{recommendation.bestHour}</span></span>
                              <span className="text-green-600">Précision: {recommendation.accuracy}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Statistiques avec confiance */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        📊 Statistiques
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="text-center p-2 bg-white rounded-lg border border-slate-200">
                          <div className="text-lg font-bold text-green-500">
                            {hourlyData.filter(d => d.level === 1).length}
                          </div>
                          <div className="text-xs text-slate-500">Fluide</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg border border-slate-200">
                          <div className="text-lg font-bold text-yellow-500">
                            {hourlyData.filter(d => d.level === 2).length}
                          </div>
                          <div className="text-xs text-slate-500">Moyen</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg border border-slate-200">
                          <div className="text-lg font-bold text-orange-500">
                            {hourlyData.filter(d => d.level === 3).length}
                          </div>
                          <div className="text-xs text-slate-500">Modéré</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg border border-slate-200">
                          <div className="text-lg font-bold text-red-500">
                            {hourlyData.filter(d => d.level >= 4).length}
                          </div>
                          <div className="text-xs text-slate-500">Dense+</div>
                        </div>
                      </div>
                      <div className="mt-2 text-center text-xs text-slate-400">
                        Confiance de la prédiction: {predictions.confidence}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-xl border border-slate-200 min-h-[400px]">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <LineChart className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">Prêt à prédire</h3>
                    <p className="text-sm text-slate-400 max-w-xs">
                      Sélectionnez une province, une zone, une date et une heure, puis cliquez sur "Prédire le trafic"
                    </p>
                    <div className="mt-4 flex gap-2 flex-wrap justify-center">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🟢 Fluide</span>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">🟡 Moyen</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">🟠 Modéré</span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">🔴 Dense</span>
                    </div>
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