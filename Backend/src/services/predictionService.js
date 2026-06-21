import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Données mockées pour les provinces et zones
const MOCK_REGIONS = {
  'Analamanga': { zones: ['Antananarivo', 'Ankorondrano', 'Ivato', 'Ambohimangakely'] },
  'Atsinanana': { zones: ['Toamasina', 'Mahavelona'] },
  'Boeny': { zones: ['Mahajanga', 'Antsalova'] },
  'Vakinankaratra': { zones: ['Antsirabe', 'Betafo'] },
  'Haute Matsiatra': { zones: ['Fianarantsoa', 'Ambohimahasoa'] },
};

export const predictionService = {
  // Récupère les provinces (depuis le backend ou mock)
  getProvinces: async () => {
    try {
      const response = await api.get('/predictions/provinces');
      return response.data;
    } catch (error) {
      console.warn('Utilisation des provinces mockées');
      return MOCK_REGIONS;
    }
  },

  // Récupère les zones d'une province
  getZones: async (province) => {
    try {
      const response = await api.get(`/predictions/zones/${province}`);
      return response.data;
    } catch (error) {
      console.warn('Utilisation des zones mockées');
      return MOCK_REGIONS[province]?.zones || [];
    }
  },

  // Prédictions de trafic (mockées si l'API n'est pas disponible)
  getPredictions: async (params) => {
    try {
      const response = await api.get('/predictions/traffic', { params });
      return response.data;
    } catch (error) {
      console.warn('Prédictions mockées');
      return {
        hourly: [],
        global: 'Moyen',
        confidence: 70,
        recommendation: {
          warning: '✅ Données simulées',
          advice: 'Réessayez plus tard avec des données réelles.',
          bestHour: 'maintenant',
          severity: 'low',
          accuracy: 'Basse'
        }
      };
    }
  },

  // Données historiques (simulées)
  getHistoricalData: async (params) => {
    try {
      const response = await api.get('/predictions/historical', { params });
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Recommandations (simulées)
  getRecommendations: async (params) => {
    try {
      const response = await api.get('/predictions/recommendations', { params });
      return response.data;
    } catch (error) {
      return {
        warning: '✅ Trafic fluide',
        advice: 'Vous pouvez partir à l\'heure choisie.',
        bestHour: params.hour || 'maintenant',
        severity: 'low',
        accuracy: 'Moyenne'
      };
    }
  }
};

export default predictionService;