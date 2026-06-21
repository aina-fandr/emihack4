import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const realTimeApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const realTimeService = {
  // Récupérer toutes les données en temps réel
  getAllData: async (params = {}) => {
    try {
      const response = await realTimeApi.get('/realtime/all', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur données en temps réel:', error);
      throw error;
    }
  },

  // Récupérer la météo
  getWeather: async (city = 'Antananarivo') => {
    try {
      const response = await realTimeApi.get('/realtime/weather', { params: { city } });
      return response.data;
    } catch (error) {
      console.error('Erreur météo:', error);
      throw error;
    }
  },

  // Récupérer les prévisions
  getForecast: async (city = 'Antananarivo') => {
    try {
      const response = await realTimeApi.get('/realtime/forecast', { params: { city } });
      return response.data;
    } catch (error) {
      console.error('Erreur prévisions:', error);
      throw error;
    }
  },

  // Récupérer le trafic
  getTraffic: async (lat = -18.9137, lon = 47.5361) => {
    try {
      const response = await realTimeApi.get('/realtime/traffic', { params: { lat, lon } });
      return response.data;
    } catch (error) {
      console.error('Erreur trafic:', error);
      throw error;
    }
  },

  // Récupérer les incidents
  getIncidents: async () => {
    try {
      const response = await realTimeApi.get('/realtime/incidents');
      return response.data;
    } catch (error) {
      console.error('Erreur incidents:', error);
      throw error;
    }
  }
};

export default realTimeApi;