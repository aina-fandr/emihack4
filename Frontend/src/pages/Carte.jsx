import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Loader2,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import MapComponent from '../components/maps/MapComponent';
import Legend from '../components/common/Legend';
import { trafficService } from '../services/api'; // mapService retiré car inutile maintenant
import ChatAssistant from '../components/common/ChatAssistant';

// Coordonnées pour recentrer dynamiquement la carte
const CITY_COORDINATES = {
  'antananarivo': [-18.9137, 47.5361],
  'toamasina': [-18.1496, 49.4023],
  'mahajanga': [-15.7208, 46.3142],
  'antsirabe': [-19.8659, 47.0332],
  'fianarantsoa': [-21.4536, 47.0858],
  'toliara': [-23.3544, 43.6688],
  'antsiranana': [-12.2750, 49.2900],
  'nosy be': [-13.3122, 48.2664]
};

export default function Carte() {
  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [stats, setStats] = useState({ total: 0, fluide: 0, modere: 0, dense: 0, bloque: 0 });

  // Nettoyeur universel de données d'API
  const extractArray = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.traffic)) return res.traffic;
    
    const foundKey = Object.keys(res).find(key => Array.isArray(res[key]));
    if (foundKey) return res[foundKey];
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. On appelle uniquement la route du trafic qui est bien définie sur le serveur
        const trafficRes = await trafficService.getTraffic();
        const rawTraffic = extractArray(trafficRes);

        // 2. EXTRACTION EN DIRECT : On génère les filtres uniques depuis les données réelles du trafic
        const extractedRegions = Array.from(
          new Set(rawTraffic.map(item => item?.region?.toString().trim()).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));

        const extractedCities = Array.from(
          new Set(rawTraffic.map(item => item?.city?.toString().trim()).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));

        // 3. Mise à jour des états de l'application
        setTrafficData(rawTraffic);
        setRegions(extractedRegions);
        setCities(extractedCities);

        calculateStats(rawTraffic);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de trafic :", error);
        setTrafficData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (data) => {
    const total = data.length;
    const fluide = data.filter(d => d.status === 'fluide').length;
    const modere = data.filter(d => d.status === 'modere').length;
    const dense = data.filter(d => d.status === 'dense').length;
    const bloque = data.filter(d => d.status === 'bloque').length;
    setStats({ total, fluide, modere, dense, bloque });
  };

  const getFilteredData = () => {
    let filtered = Array.isArray(trafficData) ? trafficData : [];

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(d => d.region?.toLowerCase().trim() === selectedRegion.toLowerCase().trim());
    }

    if (selectedCity) {
      filtered = filtered.filter(d => d.city?.toLowerCase().trim() === selectedCity.toLowerCase().trim());
    }

    if (searchTerm) {
      const lowTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.road?.toLowerCase().includes(lowTerm) ||
        d.city?.toLowerCase().includes(lowTerm) ||
        d.region?.toLowerCase().includes(lowTerm)
      );
    }

    return filtered;
  };

  const getMapFilteredData = (baseData) => {
    const namesSeenInCity = new Set();

    return baseData
      .filter(d => {
        const roadName = d.road ? d.road.toLowerCase() : '';
        return (
          roadName.includes('rn') || 
          roadName.includes('route nat') || 
          roadName.includes('boulevard') || 
          roadName.includes('blvd') || 
          roadName.includes('avenue') || 
          roadName.includes('ave') || 
          parseInt(d.level || 0) >= 75
        );
      })
      .map(d => {
        const uniqueKey = `${d.road?.toLowerCase().trim()}-${d.city?.toLowerCase().trim()}`;
        if (!namesSeenInCity.has(uniqueKey)) {
          namesSeenInCity.add(uniqueKey);
          return { ...d, showLabelOnMap: true };
        }
        return { ...d, showLabelOnMap: false };
      });
  };

  const filteredData = getFilteredData();
  const mapFilteredData = getMapFilteredData(filteredData);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.querySelector('input')?.value || '';
    setSearchTerm(term);
  };

  const getMapCenter = () => {
    if (selectedCity) {
      const key = selectedCity.toLowerCase().trim();
      if (CITY_COORDINATES[key]) return CITY_COORDINATES[key];
    }
    if (userLocation) return [userLocation.lat, userLocation.lng];
    return [-18.9137, 47.5361];
  };

  const getMapZoom = () => selectedCity ? 14 : 12;

  const getStatusColor = (status) => {
    const colors = {
      fluide: 'text-green-500 bg-green-500/10 border-green-500/30',
      modere: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
      dense: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
      bloque: 'text-red-500 bg-red-500/10 border-red-500/30'
    };
    return colors[status] || colors.fluide;
  };

  const getStatusIcon = (status) => {
    const icons = {
      fluide: <CheckCircle className="w-3.5 h-3.5" />,
      modere: <Clock className="w-3.5 h-3.5" />,
      dense: <AlertTriangle className="w-3.5 h-3.5" />,
      bloque: <AlertTriangle className="w-3.5 h-3.5" />
    };
    return icons[status] || icons.fluide;
  };

  if (loading) {
    return (
      <div className="h-full w-full bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full relative bg-slate-900">
      <div className="absolute inset-0 z-0">
        <MapComponent
          center={getMapCenter()}
          zoom={getMapZoom()}
          trafficPoints={mapFilteredData}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />

      {/* ============ NAVIGATION & RECHERCHE OPTIMISÉE ============ */}
      <div className="absolute top-20 right-6 z-20 flex flex-col items-end gap-2 max-w-md w-full px-4">
        <div className="w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-2">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 px-2">
                <Search className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher une route..."
                  className="w-full bg-transparent text-slate-800 text-xs py-1 focus:outline-none"
                  defaultValue={searchTerm}
                />
              </div>

              {/* Sélecteur Région */}
              <select
                value={selectedRegion}
                onChange={(e) => { setSelectedRegion(e.target.value); setSelectedCity(''); }}
                className="bg-slate-100 text-slate-700 text-[10px] rounded-xl px-2 py-1 focus:outline-none border-0 max-w-[85px] cursor-pointer"
              >
                <option value="all">🌍 Région</option>
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>

              {/* Sélecteur Ville */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-100 text-slate-700 text-[10px] rounded-xl px-2 py-1 focus:outline-none border-0 max-w-[85px] cursor-pointer"
              >
                <option value="">🏙️ Ville</option>
                {cities
                  .filter(c => {
                    if (selectedRegion === 'all') return true;
                    // Filtre optionnel pour n'afficher que les villes de la région sélectionnée
                    const matchingPoints = trafficData.filter(d => d.region?.toLowerCase().trim() === selectedRegion.toLowerCase().trim());
                    return matchingPoints.some(d => d.city?.toLowerCase().trim() === c.toLowerCase().trim());
                  })
                  .map((c) => <option key={c} value={c}>{c}</option>)
                }
              </select>

              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-xl text-[10px] font-medium hover:bg-blue-600 transition">Go</button>
            </form>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/50 w-full">
          <h4 className="text-xs font-bold text-slate-600 uppercase mb-2 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Statistiques</h4>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-green-50 rounded-xl p-2 text-center border">
              <div className="text-md font-bold text-green-600">{stats.fluide}</div>
              <p className="text-[9px] text-green-600 font-medium">Fluide</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-2 text-center border">
              <div className="text-md font-bold text-yellow-600">{stats.modere}</div>
              <p className="text-[9px] text-yellow-600 font-medium">Modéré</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-2 text-center border">
              <div className="text-md font-bold text-orange-600">{stats.dense}</div>
              <p className="text-[9px] text-orange-600 font-medium">Dense</p>
            </div>
            <div className="bg-red-50 rounded-xl p-2 text-center border">
              <div className="text-md font-bold text-red-600">{stats.bloque}</div>
              <p className="text-[9px] text-red-600 font-medium">Bloqué</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ LISTE DES AXES FILTRÉS ============ */}
      <div className="absolute bottom-[calc(16rem+1cm)] left-6 z-20 w-72">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border p-2.5 max-h-48 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b sticky top-0 bg-white/95 z-10">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Axes ({filteredData.length})
            </h4>
            {(selectedRegion !== 'all' || selectedCity || searchTerm) && (
              <button 
                onClick={() => { setSelectedRegion('all'); setSelectedCity(''); setSearchTerm(''); }}
                className="text-[9px] text-blue-500 font-bold hover:underline"
              >
                Réinitialiser
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {filteredData.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-1.5 rounded-xl border ${getStatusColor(item.status)}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-slate-700 truncate">{item.road}</p>
                  <p className="text-[9px] text-slate-500 truncate">{item.city} • {item.region}</p>
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-[10px] font-bold">{item.level}%</span>
                  {getStatusIcon(item.status)}
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <p className="text-center text-slate-400 text-[11px] py-4">Aucun axe disponible pour ces critères.</p>
            )}
          </div>
        </div>
      </div>

      <ChatAssistant />
      <div className="absolute bottom-8 left-6 z-20"><Legend /></div>
    </div>
  );
}