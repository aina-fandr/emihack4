import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const trafficApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const trafficService = {
  // Récupérer les données de trafic en temps réel
  getRealTimeTraffic: async (params = {}) => {
    try {
      const response = await trafficApi.get('/traffic/realtime', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération trafic:', error);
      throw error;
    }
  },

  // Récupérer les métriques
  getMetrics: async () => {
    try {
      const response = await trafficApi.get('/traffic/metrics');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération métriques:', error);
      throw error;
    }
  },

  // Forcer la mise à jour
  forceUpdate: async () => {
    try {
      const response = await trafficApi.post('/traffic/force-update');
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      throw error;
    }
  },

  // Récupérer les alertes
  getAlerts: async (params = {}) => {
    try {
      const response = await trafficApi.get('/traffic/alerts', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération alertes:', error);
      throw error;
    }
  },

  // Récupérer les statistiques
  getStatistics: async () => {
    try {
      const response = await trafficApi.get('/traffic/statistics');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      throw error;
    }
  }
};

export default trafficApi;