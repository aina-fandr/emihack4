import React from 'react';

export default function SearchResults({ results, onSelect, onClose, isSearching, query }) {
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

  if (results.length === 0 && query.length >= 2 && !isSearching) {
    return (
      <div className="px-4 md:px-6 py-4 text-center text-slate-400 text-sm border-t border-slate-700">
        <p>Aucun résultat trouvé pour "{query}"</p>
      </div>
    );
  }

  if (query.length > 0 && query.length < 2) {
    return (
      <div className="px-4 md:px-6 py-3 text-center text-slate-500 text-xs border-t border-slate-700">
        Tapez au moins 2 caractères
      </div>
    );
  }

  return (
    <div className="border-t border-slate-700 max-h-60 overflow-y-auto">
      {results.map((result) => (
        <button
          key={result.id}
          onClick={() => onSelect(result)}
          className="w-full flex items-center justify-between px-4 md:px-6 py-2.5 hover:bg-slate-800 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: getTrafficColor(result.traffic) }}
            ></div>
            <div>
              <p className="text-sm text-white font-medium">{result.name}</p>
              <p className="text-xs text-slate-400">{result.type}</p>
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
  );
}