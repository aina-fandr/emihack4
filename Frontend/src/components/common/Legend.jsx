import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function Legend({ stats, selectedCity, selectedRegion }) {
  const legendItems = [
    {
      status: 'fluide',
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/20',
      label: 'Fluide',
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" className="text-green-500" />
          <polyline points="8 12 11 15 16 9" className="text-white" fill="none" stroke="white" strokeWidth="2" />
        </svg>
      ),
      count: stats?.fluide || 0
    },
    {
      status: 'modere',
      color: 'bg-yellow-500',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      label: 'Modéré',
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" className="text-yellow-500" />
          <line x1="12" y1="8" x2="12" y2="12" className="text-yellow-500" />
          <line x1="12" y1="16" x2="12.01" y2="16" className="text-yellow-500" />
        </svg>
      ),
      count: stats?.modere || 0
    },
    {
      status: 'dense',
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      label: 'Dense',
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" className="text-orange-500" />
          <line x1="12" y1="9" x2="12" y2="13" className="text-orange-500" />
          <line x1="12" y1="17" x2="12.01" y2="17" className="text-orange-500" />
        </svg>
      ),
      count: stats?.dense || 0
    },
    {
      status: 'bloque',
      color: 'bg-red-500',
      borderColor: 'border-red-500',
      textColor: 'text-red-400',
      bgColor: 'bg-red-500/20',
      label: 'Bloqué',
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" className="text-red-500" />
          <line x1="15" y1="9" x2="9" y2="15" className="text-red-500" />
          <line x1="9" y1="9" x2="15" y2="15" className="text-red-500" />
        </svg>
      ),
      count: stats?.bloque || 0
    }
  ];

  return (
    <div className="bg-black/85 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-700/50 min-w-[200px]">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Légende Trafic
        </h3>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] text-slate-400">En direct</span>
        </div>
      </div>

      {/* Items de la légende */}
      <div className="space-y-2">
        {legendItems.map((item) => (
          <div 
            key={item.status}
            className={`flex items-center justify-between p-1.5 rounded-lg ${item.bgColor} border ${item.borderColor}/30 transition-all hover:scale-105`}
          >
            <div className="flex items-center gap-2.5">
              {/* Indicateur visuel de route */}
              <div className="relative">
                <div className={`w-8 h-1.5 ${item.color} rounded-full`}></div>
                <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${item.color} rounded-full border border-white/20`}></div>
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium ${item.textColor}`}>
                {item.label}
              </span>
            </div>

            {/* Compteur */}
            <span className={`text-xs font-bold ${item.textColor} bg-black/30 px-1.5 py-0.5 rounded`}>
              {item.count}
            </span>
          </div>
        ))}
      </div>

      {/* Localisation sélectionnée */}
      {(selectedCity || selectedRegion) && (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-3 h-3 text-blue-400" />
            <div>
              {selectedCity && (
                <span className="text-blue-400 font-medium">{selectedCity}</span>
              )}
              {selectedRegion && selectedRegion !== 'all' && (
                <span className="text-slate-400 ml-1">• {selectedRegion}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Barre de progression totale */}
      {stats?.total > 0 && (
        <div className="mt-3">
          <div className="flex h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 transition-all duration-500" 
              style={{ width: `${(stats.fluide / stats.total) * 100}%` }}
            ></div>
            <div 
              className="bg-yellow-500 transition-all duration-500" 
              style={{ width: `${(stats.modere / stats.total) * 100}%` }}
            ></div>
            <div 
              className="bg-orange-500 transition-all duration-500" 
              style={{ width: `${(stats.dense / stats.total) * 100}%` }}
            ></div>
            <div 
              className="bg-red-500 transition-all duration-500" 
              style={{ width: `${(stats.bloque / stats.total) * 100}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-500 text-center mt-1">
            {stats.total} axes surveillés
          </div>
        </div>
      )}
    </div>
  );
}