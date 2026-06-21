import React, { useState, useEffect } from 'react';
import {
  X, Calendar, Clock, MapPin, TrendingUp,
  AlertCircle, BarChart3, LineChart, Activity,
  Loader2, Car, Bus, Bike, Footprints
} from 'lucide-react';
import { predictionService } from '../../services/prediction.api';

const predictionLevels = {
  'Fluide': { color: '#22c55e', icon: '🟢', level: 1 },
  'Moyen': { color: '#eab308', icon: '🟡', level: 2 },
  'Modéré': { color: '#f97316', icon: '🟠', level: 3 },
  'Dense': { color: '#ef4444', icon: '🔴', level: 4 },
  'Très dense': { color: '#dc2626', icon: '🔴', level: 5 }
};

export default function PredictionPopup({ isOpen, onClose }) {
  const [provincesList, setProvincesList] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  
  const [province, setProvince] = useState('');
  const [zone, setZone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hour, setHour] = useState('17:00');
  
  const [predictions, setPredictions] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 1. Charger les provinces au montage
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await predictionService.getProvinces();
        setProvincesList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur provinces:", error);
      }
    };
    loadProvinces();
  }, []);

  // 2. Charger les zones quand la province change
  useEffect(() => {
    const loadZones = async () => {
      if (!province) return;
      try {
        const zones = await predictionService.getZones(province);
        setZonesList(Array.isArray(zones) ? zones : []);
        if (zones?.length > 0) setZone(zones[0]);
      } catch (error) {
        console.error("Erreur zones:", error);
        setZonesList([]);
      }
    };
    loadZones();
  }, [province]);

  // 3. Calculer les prédictions
  const handlePredict = async () => {
    setIsCalculating(true);
    try {
      const result = await predictionService.getPredictions({ province, zone, date, hour });
      setPredictions(result);
    } catch (error) {
      console.error("Erreur prédiction:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[3000]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3001] w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LineChart className="text-purple-600" /> Prédictions du trafic
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Province</label>
              <select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="">Sélectionner une province</option>
                {provincesList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Zone / Ville</label>
              <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full p-2 border rounded-lg" disabled={!province}>
                <option value="">{province ? "Choisir une zone" : "Choisir une province d'abord"}</option>
                {zonesList.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            
            <div className="flex gap-4">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded-lg" />
              <input type="time" value={hour} onChange={(e) => setHour(e.target.value)} className="w-full p-2 border rounded-lg" />
            </div>
            
            <button 
              onClick={handlePredict} 
              disabled={isCalculating || !zone}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition"
            >
              {isCalculating ? <Loader2 className="animate-spin inline" /> : 'Prédire le trafic'}
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[300px]">
            {predictions ? (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-700 mb-4">Résultats :</h3>
                {(predictions.hourly || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-mono text-sm">{item.hour}</span>
                    <span style={{ color: item.color }} className="font-bold">{item.traffic}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Activity size={48} className="mb-2 opacity-50" />
                <p>En attente des paramètres</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}