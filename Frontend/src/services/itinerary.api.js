import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const itineraryApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercepteur pour injecter le token d'authentification
itineraryApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const itineraryService = {
  /**
   * Calcule le meilleur itinéraire en fonction du trafic
   * @param {Object} params 
   * @param {string} params.start - Coordonnées ou adresse de départ
   * @param {string} params.destination - Coordonnées ou adresse d'arrivée
   * @param {string} params.mode - "voiture", "bus", "marche", "moto"
   */
  getItinerary: async (params) => {
    try {
      const response = await itineraryApi.get('/itineraries/calculate', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire:', error);
      throw error;
    }
  },

  /**
   * Sauvegarde un itinéraire dans l'historique de l'utilisateur
   */
  saveItinerary: async (itineraryData) => {
    try {
      const response = await itineraryApi.post('/itineraries/save', itineraryData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }
};

export default itineraryApi;