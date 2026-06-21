// services/prediction.api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // à adapter

export const predictionService = {
  getProvinces: async () => {
    const res = await axios.get(`${API_URL}/predictions/provinces`);
    return res.data.data;   // car ton backend renvoie { data: [...] }
  },
  getZones: async (province) => {
    const res = await axios.get(`${API_URL}/predictions/zones/${province}`);
    return res.data.data;
  },
  getPredictions: async ({ province, zone, date, hour }) => {
    const res = await axios.get(`${API_URL}/predictions/traffic`, {
      params: { zone, date, hour }
    });
    return res.data;   // l'objet { hourly: [...] }
  }
};