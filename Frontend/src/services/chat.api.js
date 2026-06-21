import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const chatApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercepteur pour injecter le token d'authentification si nécessaire
chatApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const chatService = {
  // Envoie le message à ton backend branché sur Groq
  sendMessage: async (message, city = '') => {
    try {
      const response = await chatApi.post('/chat/message', { message, city });
      return response.data; // Reçoit { reply: "..." }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message au backend:', error);
      throw error;
    }
  },

  getMessages: async () => {
    try {
      const response = await chatApi.get('/chat/messages');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      throw error;
    }
  },

  clearMessages: async () => {
    try {
      const response = await chatApi.delete('/chat/messages');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'effacement des messages:', error);
      throw error;
    }
  }
};

export default chatApi;