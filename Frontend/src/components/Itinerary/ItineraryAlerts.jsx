import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ItineraryAlerts({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-sm text-green-600">✓ Aucune alerte</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        Alertes
      </h4>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              alert.type === 'danger'
                ? 'bg-red-50 border border-red-200'
                : 'bg-orange-50 border border-orange-200'
            }`}
          >
            <span className={alert.type === 'danger' ? 'text-red-500' : 'text-orange-500'}>
              {alert.type === 'danger' ? '!' : 'i'}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-800">{alert.location}</p>
              <p className="text-xs text-slate-500">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}