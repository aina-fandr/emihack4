import React, { useState, useEffect } from 'react';
import { Bus, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { regionsData, getBusStopsByRegion } from '../../data/madagascar.data';

export default function BusStopsList() {
  const [expandedRegion, setExpandedRegion] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [busStops, setBusStops] = useState([]);

  useEffect(() => {
    if (selectedRegion) {
      const stops = getBusStopsByRegion(selectedRegion);
      setBusStops(stops);
    } else {
      // Afficher tous les arrêts
      const allStops = [];
      for (const [region, data] of Object.entries(regionsData)) {
        if (data.busStops) {
          data.busStops.forEach(stop => {
            allStops.push({ name: stop, region: region });
          });
        }
      }
      setBusStops(allStops);
    }
  }, [selectedRegion]);

  const toggleRegion = (region) => {
    setExpandedRegion(expandedRegion === region ? null : region);
    setSelectedRegion(region);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Bus className="w-4 h-4 text-blue-500" />
          Arrêts de bus par région
        </h3>
      </div>
      
      <div className="p-3 max-h-96 overflow-y-auto">
        {Object.keys(regionsData).map((region) => {
          const regionData = regionsData[region];
          const stops = regionData.busStops || [];
          
          return (
            <div key={region} className="mb-2">
              <button
                onClick={() => toggleRegion(region)}
                className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">{region}</span>
                  <span className="text-xs text-slate-400">({stops.length} arrêts)</span>
                </div>
                {expandedRegion === region ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              
              {expandedRegion === region && (
                <div className="mt-1 ml-6 space-y-1">
                  {stops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                      <Bus className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      <span className="text-xs text-slate-600">{stop}</span>
                    </div>
                  ))}
                  {stops.length === 0 && (
                    <p className="text-xs text-slate-400 italic p-2">Aucun arrêt de bus dans cette région</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}