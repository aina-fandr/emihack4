import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Données mockées de secours
const mockTrafficData = [
  { id: 1, region: 'Analamanga', city: 'Antananarivo', road: 'RN1', roadName: 'Route Nationale 1', status: 'fluide', level: 20, currentSpeed: 45, freeFlowSpeed: 50, lastUpdate: new Date().toISOString() },
  { id: 2, region: 'Analamanga', city: 'Antananarivo', road: 'RN2', roadName: 'Route Nationale 2', status: 'modere', level: 45, currentSpeed: 30, freeFlowSpeed: 50, lastUpdate: new Date().toISOString() },
  { id: 3, region: 'Analamanga', city: 'Antananarivo', road: 'RN3', roadName: 'Route Nationale 3', status: 'dense', level: 70, currentSpeed: 15, freeFlowSpeed: 50, lastUpdate: new Date().toISOString() },
  { id: 4, region: 'Atsinanana', city: 'Toamasina', road: 'RN4', roadName: 'Route Nationale 4', status: 'fluide', level: 15, currentSpeed: 40, freeFlowSpeed: 45, lastUpdate: new Date().toISOString() },
  { id: 5, region: 'Atsinanana', city: 'Toamasina', road: 'RN5', roadName: 'Route Nationale 5', status: 'modere', level: 40, currentSpeed: 28, freeFlowSpeed: 45, lastUpdate: new Date().toISOString() },
  { id: 6, region: 'Boeny', city: 'Mahajanga', road: 'RN6', roadName: 'Route Nationale 6', status: 'fluide', level: 10, currentSpeed: 50, freeFlowSpeed: 55, lastUpdate: new Date().toISOString() },
  { id: 7, region: 'Vakinankaratra', city: 'Antsirabe', road: 'RN7', roadName: 'Route Nationale 7', status: 'dense', level: 65, currentSpeed: 18, freeFlowSpeed: 50, lastUpdate: new Date().toISOString() },
  { id: 8, region: 'Haute Matsiatra', city: 'Fianarantsoa', road: 'RN8', roadName: 'Route Nationale 8', status: 'modere', level: 35, currentSpeed: 30, freeFlowSpeed: 45, lastUpdate: new Date().toISOString() },
  { id: 9, region: 'Atsimo-Andrefana', city: 'Toliara', road: 'RN9', roadName: 'Route Nationale 9', status: 'fluide', level: 25, currentSpeed: 42, freeFlowSpeed: 55, lastUpdate: new Date().toISOString() },
  { id: 10, region: 'Diana', city: 'Antsiranana', road: 'RN10', roadName: 'Route Nationale 10', status: 'bloque', level: 90, currentSpeed: 5, freeFlowSpeed: 50, lastUpdate: new Date().toISOString() },
  { id: 11, region: 'Diana', city: 'Nosy Be', road: 'RN11', roadName: 'Route Nationale 11', status: 'fluide', level: 5, currentSpeed: 43, freeFlowSpeed: 45, lastUpdate: new Date().toISOString() },
  { id: 12, region: 'Analamanga', city: 'Antananarivo', road: 'RN12', roadName: 'Route Nationale 12', status: 'bloque', level: 85, currentSpeed: 8, freeFlowSpeed: 50, lastUpdate: new Date().toISOString() },
];

const mockRegions = [
  'Analamanga', 'Atsinanana', 'Boeny', 'Vakinankaratra', 
  'Haute Matsiatra', 'Atsimo-Andrefana', 'Diana', 'Sava', 
  'Itasy', 'Bongolava', 'Menabe', 'Atsimo-Atsinanana'
];

const mockCities = [
  { name: 'Antananarivo', region: 'Analamanga' },
  { name: 'Toamasina', region: 'Atsinanana' },
  { name: 'Mahajanga', region: 'Boeny' },
  { name: 'Antsirabe', region: 'Vakinankaratra' },
  { name: 'Fianarantsoa', region: 'Haute Matsiatra' },
  { name: 'Toliara', region: 'Atsimo-Andrefana' },
  { name: 'Antsiranana', region: 'Diana' },
  { name: 'Nosy Be', region: 'Diana' },
];

const mockStats = {
  total: 12,
  fluide: 5,
  modere: 3,
  dense: 2,
  bloque: 2,
  averageSpeed: 29.9,
  averageLevel: 42.1,
  globalStatus: 'normal',
  percentages: {
    fluide: 42,
    modere: 25,
    dense: 17,
    bloque: 17
  }
};

export const trafficService = {
  // Récupérer les données de trafic en temps réel
  getTraffic: async (params = {}) => {
    try {
      const response = await api.get('/traffic/realtime', { params });
      return response;
    } catch (error) {
      console.warn('Erreur API trafic, utilisation des données mockées:', error.message);
      return { 
        data: { 
          success: true,
          data: mockTrafficData,
          count: mockTrafficData.length,
          timestamp: new Date().toISOString()
        } 
      };
    }
  },

  // Récupérer les statistiques
  getStatistics: async () => {
    try {
      const response = await api.get('/traffic/statistics');
      return response;
    } catch (error) {
      console.warn('Erreur API statistiques, utilisation des données mockées:', error.message);
      return { 
        data: { 
          success: true,
          data: mockStats,
          timestamp: new Date().toISOString()
        } 
      };
    }
  },

  // Rechercher des axes
  searchTraffic: async (query) => {
    try {
      const response = await api.get('/traffic/search', { params: { q: query } });
      return response;
    } catch (error) {
      console.warn('Erreur API recherche, utilisation des données mockées:', error.message);
      const results = mockTrafficData.filter(item => 
        item.road?.toLowerCase().includes(query.toLowerCase()) ||
        item.city?.toLowerCase().includes(query.toLowerCase()) ||
        item.region?.toLowerCase().includes(query.toLowerCase())
      );
      return { 
        data: { 
          success: true,
          data: results,
          count: results.length
        } 
      };
    }
  },

  // Récupérer les alertes
  getAlerts: async () => {
    try {
      const response = await api.get('/traffic/alerts');
      return response;
    } catch (error) {
      console.warn('Erreur API alertes:', error.message);
      const alerts = mockTrafficData.filter(item => 
        item.status === 'dense' || item.status === 'bloque'
      );
      return { 
        data: { 
          success: true,
          data: alerts,
          count: alerts.length
        } 
      };
    }
  },

  // Récupérer l'historique d'une route
  getHistory: async (roadId) => {
    try {
      const response = await api.get(`/traffic/history/${roadId}`);
      return response;
    } catch (error) {
      console.warn('Erreur API historique:', error.message);
      return { 
        data: { 
          success: true,
          data: [],
          count: 0
        } 
      };
    }
  },

  // Mettre à jour les données
  updateTraffic: async () => {
    try {
      const response = await api.post('/traffic/update');
      return response;
    } catch (error) {
      console.warn('Erreur API mise à jour:', error.message);
      return { 
        data: { 
          success: true,
          message: 'Mise à jour simulée'
        } 
      };
    }
  }
};

export const mapService = {
  // Récupérer les régions
  getRegions: async () => {
    try {
      const response = await api.get('/traffic/regions');
      return response;
    } catch (error) {
      console.warn('Erreur API régions, utilisation des données mockées:', error.message);
      return { 
        data: { 
          success: true,
          data: mockRegions
        } 
      };
    }
  },

  // Récupérer les villes
  getCities: async (region = '') => {
    try {
      const params = region ? { region } : {};
      const response = await api.get('/traffic/cities', { params });
      return response;
    } catch (error) {
      console.warn('Erreur API villes, utilisation des données mockées:', error.message);
      let cities = mockCities;
      if (region) {
        cities = mockCities.filter(c => c.region === region);
      }
      return { 
        data: { 
          success: true,
          data: cities
        } 
      };
    }
  },

  // Récupérer les données pour la carte de chaleur
  getHeatmapData: async () => {
    try {
      const response = await api.get('/traffic/heatmap');
      return response;
    } catch (error) {
      console.warn('Erreur API heatmap:', error.message);
      return { 
        data: { 
          success: true,
          data: []
        } 
      };
    }
  }
};

export const historyService = {
  // Récupérer l'historique d'une route
  getHistory: async (roadId, limit = 50) => {
    try {
      const response = await api.get(`/traffic/history/${roadId}`, { params: { limit } });
      return response;
    } catch (error) {
      console.warn('Erreur API historique:', error.message);
      return { 
        data: { 
          success: true,
          data: []
        } 
      };
    }
  },

  // Forcer la mise à jour
  forceUpdate: async () => {
    try {
      const response = await api.post('/traffic/update');
      return response;
    } catch (error) {
      console.warn('Erreur API force update:', error.message);
      return { 
        data: { 
          success: true,
          message: 'Mise à jour simulée'
        } 
      };
    }
  }
};

export default api;