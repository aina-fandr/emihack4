import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const predictionApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercepteur pour le token
predictionApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const predictionService = {
  // Liste des provinces
  getProvinces: async () => {
    try {
      const response = await predictionApi.get('/predictions/provinces');
      // On extrait .data.data car ton backend renvoie { "data": [...] }
      return response.data.data; 
    } catch (error) {
      console.error('Erreur chargement provinces:', error);
      throw error;
    }
  },

  // Liste des zones (villes)
  getZones: async (province) => {
    try {
      const response = await predictionApi.get(`/predictions/zones/${province}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur chargement zones pour ${province}:`, error);
      throw error;
    }
  },

  // Prédiction trafic
  getPredictions: async (params) => {
    try {
      const response = await predictionApi.get('/predictions/traffic', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur prédictions:', error);
      throw error;
    }
  },

  // Historique
  getHistoricalData: async (params) => {
    try {
      const response = await predictionApi.get('/predictions/historical', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur historique:', error);
      throw error;
    }
  },

  // Recommandations
  getRecommendations: async (params) => {
    try {
      const response = await predictionApi.get('/predictions/recommendations', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur recommandations:', error);
      throw error;
    }
  }
};

export default predictionApi;