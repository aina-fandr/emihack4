import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const itineraryApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercepteur pour ajouter le token
itineraryApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Services pour l'itinéraire
export const itineraryService = {
  // Calculer un itinéraire
  calculateRoute: async (data) => {
    try {
      const response = await itineraryApi.post('/itinerary/calculate', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du calcul d\'itinéraire:', error);
      throw error;
    }
  },

  // Obtenir des suggestions d'itinéraires
  getSuggestions: async (params) => {
    try {
      const response = await itineraryApi.get('/itinerary/suggestions', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des suggestions:', error);
      throw error;
    }
  },

  // Obtenir les alertes trafic sur un itinéraire
  getAlerts: async (routeId) => {
    try {
      const response = await itineraryApi.get(`/itinerary/alerts/${routeId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
      throw error;
    }
  },

  // Obtenir la meilleure heure de départ
  getBestTime: async (params) => {
    try {
      const response = await itineraryApi.get('/itinerary/best-time', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du calcul de la meilleure heure:', error);
      throw error;
    }
  }
};

export default itineraryApi;