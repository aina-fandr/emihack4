import React from 'react';
import { X, Route } from 'lucide-react';

export default function ItineraryHeader({ onClose }) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
          <Route className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Itinéraire</h2>
          <p className="text-xs text-slate-400">Planifier votre trajet</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 transition p-1.5 hover:bg-slate-100 rounded-lg"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}