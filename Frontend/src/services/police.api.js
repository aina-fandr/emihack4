import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const policeApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercepteur pour ajouter le token police
policeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('police_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401
policeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('police_token');
      localStorage.removeItem('police_user');
      window.location.href = '/police/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================
// SERVICES POLICE
// ============================================================

export const policeService = {
  /**
   * Authentification police
   * @param {string} username - Identifiant de l'agent
   * @param {string} password - Mot de passe
   * @returns {Promise} - Token et informations utilisateur
   */
  login: async (username, password) => {
    try {
      const response = await policeApi.post('/police/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Erreur login police:', error);
      throw error;
    }
  },

  /**
   * Vérifier le token police
   * @returns {Promise} - Informations utilisateur
   */
  verify: async () => {
    try {
      const response = await policeApi.post('/police/verify');
      return response.data;
    } catch (error) {
      console.error('Erreur vérification police:', error);
      throw error;
    }
  },

  /**
   * Récupérer toutes les alertes
   * @param {Object} params - Filtres (status, severity, limit, offset)
   * @returns {Promise} - Liste des alertes
   */
  getAlerts: async (params = {}) => {
    try {
      const response = await policeApi.get('/police/alerts', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération alertes:', error);
      throw error;
    }
  },

  /**
   * Créer une nouvelle alerte
   * @param {Object} data - Données de l'alerte
   * @returns {Promise} - Alerte créée
   */
  createAlert: async (data) => {
    try {
      const response = await policeApi.post('/police/alerts', data);
      return response.data;
    } catch (error) {
      console.error('Erreur création alerte:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une alerte
   * @param {number} id - ID de l'alerte
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise} - Alerte mise à jour
   */
  updateAlert: async (id, data) => {
    try {
      const response = await policeApi.put(`/police/alerts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour alerte:', error);
      throw error;
    }
  },

  /**
   * Récupérer les statistiques
   * @returns {Promise} - Statistiques
   */
  getStatistics: async () => {
    try {
      const response = await policeApi.get('/police/statistics');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      throw error;
    }
  },

  /**
   * Récupérer les interventions
   * @param {Object} params - Filtres
   * @returns {Promise} - Liste des interventions
   */
  getInterventions: async (params = {}) => {
    try {
      const response = await policeApi.get('/police/interventions', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération interventions:', error);
      throw error;
    }
  },

  /**
   * Créer une intervention
   * @param {Object} data - Données de l'intervention
   * @returns {Promise} - Intervention créée
   */
  createIntervention: async (data) => {
    try {
      const response = await policeApi.post('/police/interventions', data);
      return response.data;
    } catch (error) {
      console.error('Erreur création intervention:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une intervention
   * @param {number} id - ID de l'intervention
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise} - Intervention mise à jour
   */
  updateIntervention: async (id, data) => {
    try {
      const response = await policeApi.put(`/police/interventions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour intervention:', error);
      throw error;
    }
  },

  /**
   * Récupérer les agents de police
   * @param {Object} params - Filtres
   * @returns {Promise} - Liste des agents
   */
  getOfficers: async (params = {}) => {
    try {
      const response = await policeApi.get('/police/officers', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération agents:', error);
      throw error;
    }
  },

  /**
   * Récupérer les logs d'activité
   * @param {Object} params - Filtres
   * @returns {Promise} - Logs d'activité
   */
  getActivityLogs: async (params = {}) => {
    try {
      const response = await policeApi.get('/police/activity-logs', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération logs:', error);
      throw error;
    }
  }
};

export default policeApi;