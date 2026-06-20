import React from 'react';

export default function ItinerarySummary({ distance, duration, traffic }) {
  const getTrafficColor = (level) => {
    const colors = {
      'Fluide': 'text-green-500',
      'Moyen': 'text-yellow-500',
      'Modéré': 'text-orange-500',
      'Dense': 'text-red-500'
    };
    return colors[level] || 'text-slate-500';
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-slate-400">Distance</p>
          <p className="text-base font-bold text-slate-800">{distance}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Temps</p>
          <p className="text-base font-bold text-slate-800">{duration}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Trafic</p>
          <p className={`text-base font-bold ${getTrafficColor(traffic)}`}>
            {traffic}
          </p>
        </div>
      </div>
    </div>
  );
}