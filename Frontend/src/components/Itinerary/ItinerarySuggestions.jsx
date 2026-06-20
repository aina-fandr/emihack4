import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function ItinerarySuggestions({ routes }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Suggestions
      </h4>
      <div className="space-y-2">
        {routes.map((route) => (
          <div
            key={route.id}
            className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
              route.color === 'green' ? 'border-green-500 bg-green-50' :
              route.color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
              'border-red-500 bg-red-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                route.color === 'green' ? 'bg-green-500' :
                route.color === 'yellow' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></span>
              <div>
                <p className="text-sm font-medium text-slate-800">{route.name}</p>
                <p className="text-xs text-slate-500">{route.distance}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">{route.duration}</p>
              <p className="text-xs text-slate-500">{route.traffic}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}