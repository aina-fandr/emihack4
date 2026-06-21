import React from 'react';
import { MapPin, Navigation, ArrowRight, Clock, AlertTriangle, CheckCircle, Bus, Car, Footprints, Bike } from 'lucide-react';

export default function ItinerarySteps({ steps, transportMode, duration, distance }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center text-slate-500 py-4">
        <p className="text-sm">Aucune étape disponible</p>
      </div>
    );
  }

  const getTransportIcon = () => {
    const icons = {
      'voiture': <Car className="w-4 h-4" />,
      'bus': <Bus className="w-4 h-4" />,
      'marche': <Footprints className="w-4 h-4" />,
      'moto': <Bike className="w-4 h-4" />
    };
    return icons[transportMode] || <Car className="w-4 h-4" />;
  };

  const getStepIcon = (type) => {
    switch(type) {
      case 'start': return <MapPin className="w-4 h-4 text-green-500" />;
      case 'end': return <Navigation className="w-4 h-4 text-red-500" />;
      case 'turn': return <ArrowRight className="w-4 h-4 text-blue-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* En-tête */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              {getTransportIcon()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Itinéraire détaillé</h4>
              <p className="text-xs text-slate-500">
                {transportMode === 'voiture' ? '🚗 Voiture' :
                 transportMode === 'bus' ? '🚌 Bus' :
                 transportMode === 'marche' ? '🚶 Marche' :
                 transportMode === 'moto' ? '🏍️ Moto' : 'Voiture'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{duration}</p>
            <p className="text-xs text-slate-500">{distance}</p>
          </div>
        </div>
      </div>

      {/* Liste des étapes */}
      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-start gap-4 mb-4 last:mb-0">
              {/* Point de l'étape */}
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center flex-shrink-0">
                  {getStepIcon(step.type)}
                </div>
              </div>
              
              {/* Contenu de l'étape */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{step.title}</p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                  {step.duration && (
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {step.duration}
                    </span>
                  )}
                </div>
                
                {/* Alertes spécifiques à l'étape */}
                {step.alert && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{step.alert}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pied de page */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          Itinéraire optimisé
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Temps estimé: {duration}
        </span>
      </div>
    </div>
  );
}