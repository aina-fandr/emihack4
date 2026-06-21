import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, TrendingUp, 
  AlertCircle, BarChart3, LineChart, Activity,
  Loader2
} from 'lucide-react';
import { predictionService } from '../../services/prediction.api';

// Données mockées pour fallback
const fallbackProvinces = {
  'Analamanga': ['Ankorondrano', 'Analakely', 'Anosizato', 'Andraharo', 'Ivandry', 'Mahamasina', '67 Ha'],
  'Atsinanana': ['Toamasina', 'Brickaville', 'Vatomandry'],
  'Boeny': ['Mahajanga', 'Marovoay'],
  'Vakinankaratra': ['Antsirabe', 'Betafo'],
  'Haute Matsiatra': ['Fianarantsoa', 'Ambalavao'],
  'Atsimo-Andrefana': ['Toliara', 'Sakaraha'],
  'Diana': ['Antsiranana', 'Nosy Be'],
};

const fallbackPredictions = {
  'Fluide': { color: '#22c55e', icon: '🟢', level: 1 },
  'Moyen': { color: '#eab308', icon: '🟡', level: 2 },
  'Dense': { color: '#f97316', icon: '🟠', level: 3 },
  'Très dense': { color: '#ef4444', icon: '🔴', level: 4 },
};

export default function PredictionPopup({ isOpen, onClose }) {
  const [provinces, setProvinces] = useState(fallbackProvinces);
  const [province, setProvince] = useState('Analamanga');
  const [zones, setZones] = useState([]);
  const [zone, setZone] = useState('Ankorondrano');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hour, setHour] = useState('17:00');
  const [predictions, setPredictions] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les provinces au montage
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoading(true);
        const data = await predictionService.getProvinces();
        if (data && data.data) {
          setProvinces(data.data);
          // Mettre à jour les zones
          const firstProvince = Object.keys(data.data)[0] || 'Analamanga';
          setProvince(firstProvince);
          setZones(data.data[firstProvince] || []);
          setZone(data.data[firstProvince]?.[0] || '');
        }
      } catch (error) {
        console.log('Utilisation des données fallback pour les provinces');
        setProvinces(fallbackProvinces);
        setZones(fallbackProvinces['Analamanga'] || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  // Mettre à jour les zones quand la province change
  useEffect(() => {
    if (province && provinces[province]) {
      setZones(provinces[province]);
      setZone(provinces[province][0] || '');
    }
  }, [province, provinces]);

  // Générer les prédictions horaires (fallback)
  const generateFallbackPredictions = (selectedHour) => {
    const hours = [];
    const baseHour = parseInt(selectedHour.split(':')[0]);
    
    for (let i = 0; i < 5; i++) {
      const h = (baseHour + i) % 24;
      const hourStr = `${String(h).padStart(2, '0')}:00`;
      
      let traffic = 'Fluide';
      if (h >= 7 && h <= 9) traffic = 'Dense';
      else if (h >= 16 && h <= 18) traffic = 'Très dense';
      else if (h >= 12 && h <= 14) traffic = 'Moyen';
      else if (h >= 20 && h <= 22) traffic = 'Moyen';
      else if (h >= 23 || h <= 5) traffic = 'Fluide';
      
      hours.push({
        hour: hourStr,
        traffic: traffic,
        level: fallbackPredictions[traffic].level,
        icon: fallbackPredictions[traffic].icon,
        color: fallbackPredictions[traffic].color
      });
    }
    return hours;
  };

  // Calculer la recommandation (fallback)
  const calculateFallbackRecommendation = (data) => {
    const denseHours = data.filter(d => d.traffic === 'Très dense' || d.traffic === 'Dense');
    const fluidHours = data.filter(d => d.traffic === 'Fluide');
    
    if (denseHours.length > 0) {
      const densePeriod = denseHours.map(d => d.hour).join(' et ');
      let recommended = '';
      
      if (fluidHours.length > 0) {
        const firstFluid = fluidHours[0];
        recommended = `Partez à ${firstFluid.hour} ou après ${denseHours[denseHours.length - 1].hour}`;
      } else {
        recommended = 'Évitez les heures de pointe (7h-9h et 16h-18h)';
      }
      
      return {
        warning: `Trafic très dense entre ${densePeriod}`,
        advice: recommended
      };
    }
    
    return {
      warning: 'Trafic fluide toute la journée',
      advice: 'Vous pouvez partir à n\'importe quelle heure'
    };
  };

  // Effectuer la prédiction
  const handlePredict = async () => {
    if (!province || !zone) return;

    setIsCalculating(true);
    setError(null);
    setPredictions(null);
    setRecommendation(null);
    setHourlyData([]);

    try {
      // Appel API pour les prédictions
      const response = await predictionService.getPredictions({
        province,
        zone,
        date,
        hour
      });

      if (response && response.data) {
        const data = response.data;
        
        // Transformer les données de l'API
        const hourly = data.hourly || generateFallbackPredictions(hour);
        setHourlyData(hourly);
        
        const rec = data.recommendation || calculateFallbackRecommendation(hourly);
        setRecommendation(rec);
        
        setPredictions({
          hourly: hourly,
          global: data.global || 'Moyen',
          recommendation: rec
        });
      }
    } catch (error) {
      console.log('Erreur API, utilisation des données fallback');
      // Fallback: données mockées
      const hourly = generateFallbackPredictions(hour);
      setHourlyData(hourly);
      
      const rec = calculateFallbackRecommendation(hourly);
      setRecommendation(rec);
      
      setPredictions({
        hourly: hourly,
        global: 'Moyen',
        recommendation: rec
      });
      setError('Utilisation des données simulées (API non disponible)');
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
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
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
              
              {/* Colonne gauche - Formulaire avec scroll */}
              <div className="max-h-[450px] overflow-y-auto pr-3">
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
                      disabled={isLoading}
                    >
                      {Object.keys(provinces).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Zone */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      Zone
                    </label>
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800"
                    >
                      {zones.map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
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
                      Heure
                    </label>
                    <input
                      type="time"
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800"
                    />
                  </div>

                  {/* Bouton Prédire */}
                  <button
                    onClick={handlePredict}
                    disabled={isCalculating || isLoading}
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

                  {/* Message d'erreur */}
                  {error && (
                    <div className="text-xs text-orange-500 bg-orange-50 p-2 rounded-lg border border-orange-200">
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Légende des couleurs */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🟢 Fluide</span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">🟡 Moyen</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">🟠 Dense</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">🔴 Très dense</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite - Résultats avec scroll */}
              <div className="max-h-[450px] overflow-y-auto pr-3">
                {predictions ? (
                  <div className="space-y-4">
                    {/* Prédictions horaires */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        Prévisions horaires
                      </h4>
                      <div className="space-y-2">
                        {hourlyData.map((item, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200"
                          >
                            <span className="text-sm font-medium text-slate-700">{item.hour}</span>
                            <div className="flex items-center gap-2">
                              <span style={{ color: item.color }}>{item.icon}</span>
                              <span className={`text-sm font-medium`} style={{ color: item.color }}>
                                {item.traffic}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Graphique */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-500" />
                        Niveau du trafic
                      </h4>
                      <div className="h-40 flex items-end gap-2">
                        {hourlyData.map((item, index) => {
                          const height = (item.level / 4) * 100;
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full rounded-t-lg transition-all duration-500"
                                style={{
                                  height: `${height}%`,
                                  backgroundColor: item.color,
                                  opacity: 0.8,
                                  minHeight: '10px'
                                }}
                              />
                              <span className="text-[10px] text-slate-500 mt-1">{item.hour.split(':')[0]}h</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                        <span>Fluide</span>
                        <span>Moyen</span>
                        <span>Dense</span>
                        <span>Très dense</span>
                      </div>
                    </div>

                    {/* Recommandation */}
                    {recommendation && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                        <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-purple-500" />
                          💡 Recommandation
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700">{recommendation.warning}</p>
                          </div>
                          <div className="flex items-start gap-2 text-sm bg-white/60 rounded-lg p-2">
                            <span className="text-purple-500">⏰</span>
                            <p className="text-slate-700 font-medium">
                              Heure conseillée : {recommendation.advice}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <LineChart className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">Prêt à prédire</h3>
                    <p className="text-sm text-slate-400 max-w-xs">
                      Sélectionnez une province, une zone, une date et une heure, puis cliquez sur "Prédire le trafic"
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