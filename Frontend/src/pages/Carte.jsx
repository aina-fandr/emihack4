import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Users,
  Loader2,
  Search,
  Crosshair,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  X
} from 'lucide-react';
import MapComponent from '../components/maps/MapComponent';
import Legend from '../components/common/Legend';
import { trafficService, mapService } from '../services/api';

export default function Carte() {
  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    fluide: 0,
    modere: 0,
    dense: 0,
    bloque: 0
  });

  // Données mockées pour le trafic
  const mockTrafficData = [
    { id: 1, region: 'Analamanga', city: 'Antananarivo', road: 'RN1', status: 'fluide', level: 20, lastUpdate: '2024-01-15T10:30:00' },
    { id: 2, region: 'Analamanga', city: 'Antananarivo', road: 'RN2', status: 'modere', level: 45, lastUpdate: '2024-01-15T10:30:00' },
    { id: 3, region: 'Analamanga', city: 'Antananarivo', road: 'RN3', status: 'dense', level: 70, lastUpdate: '2024-01-15T10:30:00' },
    { id: 4, region: 'Atsinanana', city: 'Toamasina', road: 'RN4', status: 'fluide', level: 15, lastUpdate: '2024-01-15T10:30:00' },
    { id: 5, region: 'Atsinanana', city: 'Toamasina', road: 'RN5', status: 'modere', level: 40, lastUpdate: '2024-01-15T10:30:00' },
    { id: 6, region: 'Boeny', city: 'Mahajanga', road: 'RN6', status: 'fluide', level: 10, lastUpdate: '2024-01-15T10:30:00' },
    { id: 7, region: 'Vakinankaratra', city: 'Antsirabe', road: 'RN7', status: 'dense', level: 65, lastUpdate: '2024-01-15T10:30:00' },
    { id: 8, region: 'Haute Matsiatra', city: 'Fianarantsoa', road: 'RN8', status: 'modere', level: 35, lastUpdate: '2024-01-15T10:30:00' },
    { id: 9, region: 'Atsimo-Andrefana', city: 'Toliara', road: 'RN9', status: 'fluide', level: 25, lastUpdate: '2024-01-15T10:30:00' },
    { id: 10, region: 'Diana', city: 'Antsiranana', road: 'RN10', status: 'bloque', level: 90, lastUpdate: '2024-01-15T10:30:00' },
    { id: 11, region: 'Diana', city: 'Nosy Be', road: 'RN11', status: 'fluide', level: 5, lastUpdate: '2024-01-15T10:30:00' },
    { id: 12, region: 'Analamanga', city: 'Antananarivo', road: 'RN12', status: 'bloque', level: 85, lastUpdate: '2024-01-15T10:30:00' },
  ];

  const mockRegions = [
    'Analamanga', 'Atsinanana', 'Boeny', 'Vakinankaratra', 
    'Haute Matsiatra', 'Atsimo-Andrefana', 'Diana', 'Sava', 
    'Itasy', 'Bongolava', 'Menabe', 'Atsimo-Atsinanana'
  ];

  const mockCities = [
    'Antananarivo', 'Toamasina', 'Mahajanga', 'Antsirabe', 
    'Fianarantsoa', 'Toliara', 'Antsiranana', 'Nosy Be',
    'Morondava', 'Manakara', 'Mahanoro', 'Ambatondrazaka'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [trafficRes, regionsRes, citiesRes] = await Promise.all([
          trafficService.getTraffic().catch(() => ({ data: mockTrafficData })),
          mapService.getRegions().catch(() => ({ data: mockRegions })),
          mapService.getCities().catch(() => ({ data: mockCities }))
        ]);

        const traffic = trafficRes.data || mockTrafficData;
        setTrafficData(traffic);
        setRegions(regionsRes.data || mockRegions);
        setCities(citiesRes.data || mockCities);
        
        calculateStats(traffic);
        
      } catch (error) {
        console.log('Utilisation des données mockées');
        setTrafficData(mockTrafficData);
        setRegions(mockRegions);
        setCities(mockCities);
        calculateStats(mockTrafficData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log('Position non disponible')
      );
    }
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
    let filtered = trafficData;
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(d => d.region === selectedRegion);
    }
    
    if (selectedCity) {
      filtered = filtered.filter(d => d.city === selectedCity);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.road?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredData = getFilteredData();

  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.querySelector('input')?.value || '';
    setSearchTerm(term);
    
    if (term.length > 0) {
      const results = trafficData.filter(d =>
        d.road?.toLowerCase().includes(term.toLowerCase()) ||
        d.city?.toLowerCase().includes(term.toLowerCase()) ||
        d.region?.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

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
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="text-slate-400 mt-4">Chargement des données trafic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative bg-slate-900">
      
      {/* Carte */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
          center={userLocation ? [userLocation.lat, userLocation.lng] : [-18.9137, 47.5361]}
          zoom={13}
        />
      </div>

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />

      {/* ============ RECHERCHE + EN DIRECT + STATISTIQUES ============ */}
      <div className="absolute top-20 right-6 z-20 flex flex-col items-end gap-2 max-w-sm">
        
        {/* Barre de recherche */}
        <div className="w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-1.5">
            <form onSubmit={handleSearch} className="flex items-center gap-1">
              <div className="flex-1 flex items-center gap-1.5 px-2">
                <Search className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher une route, ville..."
                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs py-1"
                  defaultValue={searchTerm}
                />
              </div>
              
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-100 text-slate-700 text-[10px] rounded-xl px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 border-0 max-w-[80px]"
              >
                <option value="all">🌍</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region.slice(0, 6)}</option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1 rounded-xl text-[10px] font-medium transition"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Badge En direct */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-xl border border-slate-200/50 self-end">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-slate-600 font-medium">En direct</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400 text-[10px]">
              {selectedRegion !== 'all' ? selectedRegion : 'Toutes les régions'}
            </span>
          </div>
        </div>

        {/* Statistiques agrandies */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/50 w-full">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Statistiques du trafic
          </h4>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-green-50 rounded-xl p-2 text-center border border-green-200/50">
              <div className="text-lg font-bold text-green-600">{stats.fluide}</div>
              <p className="text-[10px] text-green-600 font-medium">Fluide</p>
              <div className="w-full h-1 bg-green-200 rounded-full mt-1">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${(stats.fluide / stats.total) * 100}%` }}></div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-2 text-center border border-yellow-200/50">
              <div className="text-lg font-bold text-yellow-600">{stats.modere}</div>
              <p className="text-[10px] text-yellow-600 font-medium">Modéré</p>
              <div className="w-full h-1 bg-yellow-200 rounded-full mt-1">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(stats.modere / stats.total) * 100}%` }}></div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-2 text-center border border-orange-200/50">
              <div className="text-lg font-bold text-orange-600">{stats.dense}</div>
              <p className="text-[10px] text-orange-600 font-medium">Dense</p>
              <div className="w-full h-1 bg-orange-200 rounded-full mt-1">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(stats.dense / stats.total) * 100}%` }}></div>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-2 text-center border border-red-200/50">
              <div className="text-lg font-bold text-red-600">{stats.bloque}</div>
              <p className="text-[10px] text-red-600 font-medium">Bloqué</p>
              <div className="w-full h-1 bg-red-200 rounded-full mt-1">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${(stats.bloque / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
          <div className="text-center mt-2 pt-2 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-700">Total: {stats.total} axes surveillés</span>
          </div>
        </div>
      </div>

      {/* ============ LISTE DES AXES ============ */}
      <div className="absolute bottom-[calc(16rem+1cm)] left-6 z-20 w-72">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/50 p-2.5 max-h-48 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-2 sticky top-0 bg-white/95 z-10 pb-1.5 border-b border-slate-200/50">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              Axes {filteredData.length}
            </h4>
            <button 
              onClick={() => {
                setSelectedRegion('all');
                setSelectedCity('');
                setSearchTerm('');
              }}
              className="text-[10px] text-blue-500 hover:text-blue-600 font-medium"
            >
              ✕ Réinitialiser
            </button>
          </div>
          
          <div className="space-y-1.5">
            {filteredData.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-1.5 rounded-xl border ${getStatusColor(item.status)} transition hover:shadow-md`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-slate-700 truncate">{item.road}</p>
                  <p className="text-[9px] text-slate-500 truncate">{item.city} • {item.region}</p>
                </div>
                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold ${
                    item.status === 'fluide' ? 'text-green-500' :
                    item.status === 'modere' ? 'text-yellow-500' :
                    item.status === 'dense' ? 'text-orange-500' :
                    'text-red-500'
                  }`}>
                    {item.level}%
                  </span>
                  {getStatusIcon(item.status)}
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="text-center text-slate-500 py-4 text-[10px]">
                <Search className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                Aucun axe trouvé
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ LÉGENDE ============ */}
      <div className="absolute bottom-8 left-6 z-20">
        <Legend />
      </div>

      {/* ============ PIED DE PAGE ============ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
          <span className="text-[10px] text-white/60 font-medium flex items-center gap-1.5">
            <MapPin className="w-2.5 h-2.5" />
            TrafficAssist • {filteredData.length} axes surveillés
          </span>
        </div>
      </div>

    </div>
  );
}