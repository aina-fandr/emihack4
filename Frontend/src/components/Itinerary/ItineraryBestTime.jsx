import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function ItineraryBestTime({ bestTime }) {
  return (
    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
      <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-purple-500" />
        Meilleure heure
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-white rounded-lg">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Maintenant
          </p>
          <p className="text-base font-bold text-slate-800">{bestTime.now}</p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border border-green-200">
          <p className="text-xs text-green-600 flex items-center justify-center gap-1">
            ✓ à {bestTime.recommended}
          </p>
          <p className="text-base font-bold text-green-600">{bestTime.recommendedDuration}</p>
        </div>
      </div>
      <p className="text-xs text-slate-400 text-center mt-2">
        Partir à {bestTime.recommended} vous fera gagner du temps
      </p>
    </div>
  );
}