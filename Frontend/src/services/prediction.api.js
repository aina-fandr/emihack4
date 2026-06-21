import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const predictionApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercepteur pour ajouter le token
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

// Services pour les prédictions
export const predictionService = {
  /**
   * Obtenir les prédictions de trafic
   * @param {Object} params - Paramètres de la requête
   * @param {string} params.province - Province (ex: "Analamanga")
   * @param {string} params.zone - Zone (ex: "Ankorondrano")
   * @param {string} params.date - Date (ex: "2024-01-15")
   * @param {string} params.hour - Heure (ex: "17:00")
   * @returns {Promise} - Données de prédiction
   */
  getPredictions: async (params) => {
    try {
      const response = await predictionApi.get('/predictions/traffic', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des prédictions:', error);
      throw error;
    }
  },

  /**
   * Obtenir les données historiques
   * @param {Object} params - Paramètres de la requête
   * @param {string} params.province - Province
   * @param {string} params.zone - Zone
   * @param {string} params.startDate - Date de début
   * @param {string} params.endDate - Date de fin
   * @returns {Promise} - Données historiques
   */
  getHistoricalData: async (params) => {
    try {
      const response = await predictionApi.get('/predictions/historical', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des données historiques:', error);
      throw error;
    }
  },

  /**
   * Obtenir les recommandations
   * @param {Object} params - Paramètres de la requête
   * @param {string} params.province - Province
   * @param {string} params.zone - Zone
   * @param {string} params.date - Date
   * @param {string} params.hour - Heure
   * @returns {Promise} - Recommandations
   */
  getRecommendations: async (params) => {
    try {
      const response = await predictionApi.get('/predictions/recommendations', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations:', error);
      throw error;
    }
  },

  /**
   * Obtenir la liste des provinces
   * @returns {Promise} - Liste des provinces
   */
  getProvinces: async () => {
    try {
      const response = await predictionApi.get('/predictions/provinces');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des provinces:', error);
      throw error;
    }
  },

  /**
   * Obtenir les zones d'une province
   * @param {string} province - Nom de la province
   * @returns {Promise} - Liste des zones
   */
  getZones: async (province) => {
    try {
      const response = await predictionApi.get(`/predictions/zones/${province}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des zones:', error);
      throw error;
    }
  }
};

export default predictionApi;