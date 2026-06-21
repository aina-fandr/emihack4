import React from 'react';
import { getTravelTimeByMode } from '../../data/busData';

export default function ItinerarySummary({ distance, duration, traffic, transportMode }) {
  const getTrafficColor = (level) => {
    const colors = {
      'Fluide': 'text-green-500',
      'Moyen': 'text-yellow-500',
      'Modéré': 'text-orange-500',
      'Dense': 'text-red-500',
      'Très dense': 'text-red-600'
    };
    return colors[level] || 'text-slate-500';
  };

  const getTrafficIcon = (level) => {
    const icons = {
      'Fluide': '🟢',
      'Moyen': '🟡',
      'Modéré': '🟠',
      'Dense': '🔴',
      'Très dense': '🔴'
    };
    return icons[level] || '🟢';
  };

  // Calculer le temps estimé avec le moteur de calcul
  const distanceNum = parseFloat(distance) || 0;
  const trafficStatus = traffic === 'Fluide' ? 'VERT' : traffic === 'Moyen' ? 'ORANGE' : 'ROUGE';
  const travelTime = getTravelTimeByMode(distanceNum, transportMode || 'voiture', trafficStatus);

  // Icône selon le mode
  const getModeIcon = () => {
    const icons = {
      'voiture': '🚗',
      'bus': '🚌',
      'marche': '🚶',
      'moto': '🏍️'
    };
    return icons[transportMode] || '🚗';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-xs text-slate-500">Distance</p>
          <p className="text-base font-bold text-slate-800">📏 {distance}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Temps estimé</p>
          <p className="text-base font-bold text-slate-800">
            {getModeIcon()} {travelTime.label}
          </p>
        </div>
      </div>
      <div className="text-center mt-2 pt-2 border-t border-blue-100">
        <p className="text-xs text-slate-500">Niveau trafic</p>
        <p className={`text-sm font-bold ${getTrafficColor(traffic)}`}>
          {getTrafficIcon(traffic)} {traffic}
        </p>
      </div>
    </div>
  );
}