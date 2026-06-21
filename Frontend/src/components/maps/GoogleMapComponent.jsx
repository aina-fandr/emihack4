import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

// Configuration
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'VOTRE_CLE_API';

const libraries = ['places', 'directions', 'geometry'];

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: -18.9137,
  lng: 47.5361
};

export default function GoogleMapComponent({ 
  startPoint, 
  destination, 
  onRouteCalculated,
  transportMode = 'DRIVING'
}) {
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  // Types de transport Google
  const travelModes = {
    'voiture': 'DRIVING',
    'bus': 'TRANSIT',
    'marche': 'WALKING',
    'moto': 'DRIVING'
  };

  // Calculer l'itinéraire
  const calculateRoute = () => {
    if (!originRef.current?.value || !destinationRef.current?.value) {
      setError('Veuillez saisir un départ et une destination');
      return;
    }

    setLoading(true);
    setError(null);

    const directionsService = new window.google.maps.DirectionsService();

    const request = {
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: travelModes[transportMode] || 'DRIVING',
      unitSystem: window.google.maps.UnitSystem.METRIC,
      optimizeWaypoints: true,
      provideRouteAlternatives: true,
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        setDirections(result);
        setLoading(false);
        
        // Extraire les informations de l'itinéraire
        const route = result.routes[0];
        const leg = route.legs[0];
        const distance = leg.distance.text;
        const duration = leg.duration.text;
        const steps = leg.steps.map((step, index) => ({
          index: index + 1,
          instruction: step.instructions,
          distance: step.distance.text,
          duration: step.duration.text,
          lat: step.start_location.lat(),
          lng: step.start_location.lng()
        }));

        // Transmettre les résultats
        if (onRouteCalculated) {
          onRouteCalculated({
            distance,
            duration,
            steps,
            polyline: route.overview_path,
            bounds: result.routes[0].bounds
          });
        }
      } else {
        console.error('Erreur de calcul:', status);
        setError(`Impossible de calculer l'itinéraire: ${status}`);
        setLoading(false);
      }
    });
  };

  // Centrer la carte sur le trajet
  const onLoad = (map) => {
    mapRef.current = map;
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="w-full h-full relative">
        {/* Barre de recherche intégrée */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl bg-white rounded-xl shadow-xl p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                <MapPin className="w-4 h-4 text-green-500" />
                <Autocomplete>
                  <input
                    ref={originRef}
                    type="text"
                    placeholder="Départ"
                    className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
                  />
                </Autocomplete>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                <Navigation className="w-4 h-4 text-red-500" />
                <Autocomplete>
                  <input
                    ref={destinationRef}
                    type="text"
                    placeholder="Destination"
                    className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
                  />
                </Autocomplete>
              </div>
            </div>
            <button
              onClick={calculateRoute}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                'Calculer'
              )}
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}
        </div>

        {/* Carte Google */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={startPoint || defaultCenter}
          zoom={13}
          onLoad={onLoad}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* Marqueur de départ */}
          {startPoint && (
            <Marker
              position={startPoint}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new window.google.maps.Size(40, 40)
              }}
            />
          )}

          {/* Marqueur de destination */}
          {destination && (
            <Marker
              position={destination}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(40, 40)
              }}
            />
          )}

          {/* Tracé de l'itinéraire */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: '#22c55e',
                  strokeWeight: 5,
                  strokeOpacity: 0.9,
                },
                suppressMarkers: true,
                preserveViewport: true,
              }}
            />
          )}
        </GoogleMap>

        {/* Légende */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-slate-600">Départ</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-green-500" style={{ border: '2px solid #22c55e' }}></div>
              <span className="text-slate-600">Itinéraire</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-red-500"></div>
              <span className="text-slate-600">Arrivée</span>
            </div>
          </div>
        </div>

        {/* Info Google Maps */}
        <div className="absolute bottom-4 right-4 z-[1000] bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-medium shadow-lg">
          <span className="flex items-center gap-1">
            <span>🗺️</span>
            Données Google Maps
          </span>
        </div>
      </div>
    </LoadScript>
  );
}