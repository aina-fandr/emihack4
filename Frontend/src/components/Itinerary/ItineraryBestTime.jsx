import React from 'react';
import { Calendar, Clock, TrendingDown } from 'lucide-react';

export default function ItineraryBestTime({ bestTime }) {
  // S'assurer que les données sont valides avec des valeurs par défaut
  const now = bestTime?.now || '35 min';
  const recommended = bestTime?.recommended || '14h00';
  const recommendedDuration = bestTime?.recommendedDuration || '20 min';

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-purple-500" />
        ⏰ Meilleure heure de départ
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-1">
            <Clock className="w-3 h-3" />
            Si vous partez maintenant
          </div>
          <p className="text-lg font-bold text-slate-800">{now}</p>
          <p className="text-xs text-orange-500 mt-1">⚠️ Trafic actuel</p>
        </div>
        <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-1">
            <TrendingDown className="w-3 h-3 text-green-500" />
            Recommandé à {recommended}
          </div>
          <p className="text-lg font-bold text-green-600">{recommendedDuration}</p>
          <p className="text-xs text-green-500 mt-1">✅ Trafic fluide</p>
        </div>
      </div>
      <p className="text-xs text-slate-400 text-center mt-2">
        💡 Partir à {recommended} vous permettra d'économiser du temps
      </p>
    </div>
  );
}