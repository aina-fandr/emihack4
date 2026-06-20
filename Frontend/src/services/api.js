import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== SERVICES TRAFIC ====================

export const trafficService = {
  // Récupérer tout le trafic
  getTraffic: async (params) => {
    try {
      const response = await api.get('/traffic', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur chargement trafic:', error);
      throw error;
    }
  },

  // Récupérer le trafic par région
  getTrafficByRegion: async (region) => {
    try {
      const response = await api.get(`/traffic/region/${region}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur chargement trafic région ${region}:`, error);
      throw error;
    }
  },

  // Récupérer le trafic par ville
  getTrafficByCity: async (city) => {
    try {
      const response = await api.get(`/traffic/city/${city}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur chargement trafic ville ${city}:`, error);
      throw error;
    }
  },

  // Récupérer les segments de route
  getSegments: (params) => api.get('/traffic/segments', { params }),
  
  // Récupérer un segment spécifique
  getSegment: (id) => api.get(`/traffic/segment/${id}`),
  
  // Signaler un trafic
  reportTraffic: (data) => api.post('/traffic/segment/report', data),
  
  // Récupérer les prédictions
  getPredictions: () => api.get('/traffic/predictions'),
  
  // Récupérer les statistiques
  getStatistics: () => api.get('/traffic/statistics'),
};

// ==================== SERVICES SIGNALEMENTS ====================

export const reportService = {
  createReport: (data) => api.post('/reports', data),
  getRecentReports: (params) => api.get('/reports/recent', { params }),
  getStatistics: () => api.get('/reports/statistics'),
  getReportsByRegion: (region) => api.get(`/reports/region/${region}`),
};

// ==================== SERVICES CARTE ====================

export const mapService = {
  getRegions: async () => {
    try {
      const response = await api.get('/map/regions');
      return response.data;
    } catch (error) {
      console.error('Erreur chargement régions:', error);
      throw error;
    }
  },
  getCities: async () => {
    try {
      const response = await api.get('/map/cities');
      return response.data;
    } catch (error) {
      console.error('Erreur chargement villes:', error);
      throw error;
    }
  },
  getRoads: async (params) => {
    try {
      const response = await api.get('/map/roads', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur chargement routes:', error);
      throw error;
    }
  }
};

export default api;