import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const chatApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercepteur pour ajouter le token
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

// Services pour le chat
export const chatService = {
  // Envoyer un message
  sendMessage: async (message) => {
    try {
      const response = await chatApi.post('/chat/message', { message });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  },

  // Récupérer l'historique des messages
  getMessages: async () => {
    try {
      const response = await chatApi.get('/chat/messages');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      throw error;
    }
  },

  // Effacer l'historique
  clearMessages: async () => {
    try {
      const response = await chatApi.delete('/chat/messages');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'effacement des messages:', error);
      throw error;
    }
  },

  // Générer une réponse du bot (simulation côté frontend)
  generateBotResponse: (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    const responses = {
      trafic: 'Actuellement, le trafic est fluide sur la majorité des axes. Les zones les plus chargées sont Anosizato et Andraharo avec un niveau de congestion de 70%.',
      itineraire: 'Je vous recommande d\'éviter l\'axe Anosizato entre 7h30 et 9h. Utilisez les ruelles pour les motos et piétons.',
      signalement: 'Pour signaler un incident, cliquez sur le bouton "Signaler" dans le menu de gauche. Vous pouvez signaler : embouteillage, accident, travaux ou ralentissement.',
      statistique: 'Actuellement, nous surveillons 12 axes routiers. 5 axes sont fluides, 3 modérés, 2 denses et 2 bloqués.',
      bonjour: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      aide: 'Je peux vous aider avec :\n• Les informations de trafic\n• Les itinéraires\n• Les signalements\n• Les statistiques',
      merci: 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions.',
      meteo: '🌤️ Actuellement à Antananarivo : 22°C, ciel dégagé. Bonne visibilité sur les routes.',
      taxi: '🚕 Les Taxi-be sont disponibles sur les lignes principales. Les prix varient entre 1000 et 5000 Ar selon la distance.',
      securite: '🛡️ Les forces de l\'ordre sont déployées sur les axes critiques. En cas d\'urgence, composez le 117.'
    };

    if (lowerInput.includes('trafic') || lowerInput.includes('circulation') || lowerInput.includes('bouchon')) {
      return responses.trafic;
    }
    if (lowerInput.includes('itinéraire') || lowerInput.includes('route') || lowerInput.includes('chemin')) {
      return responses.itineraire;
    }
    if (lowerInput.includes('signal') || lowerInput.includes('incident') || lowerInput.includes('problème')) {
      return responses.signalement;
    }
    if (lowerInput.includes('statistique') || lowerInput.includes('donnée') || lowerInput.includes('nombre')) {
      return responses.statistique;
    }
    if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('coucou')) {
      return responses.bonjour;
    }
    if (lowerInput.includes('aide') || lowerInput.includes('help') || lowerInput.includes('assistance')) {
      return responses.aide;
    }
    if (lowerInput.includes('merci')) {
      return responses.merci;
    }
    if (lowerInput.includes('météo') || lowerInput.includes('temps') || lowerInput.includes('pluie')) {
      return responses.meteo;
    }
    if (lowerInput.includes('taxi') || lowerInput.includes('transport') || lowerInput.includes('bus')) {
      return responses.taxi;
    }
    if (lowerInput.includes('sécurité') || lowerInput.includes('police') || lowerInput.includes('urgence')) {
      return responses.securite;
    }
    
    return "Je n'ai pas bien compris votre demande. Je peux vous aider avec :\n• Les informations de trafic 🚦\n• Les itinéraires 🗺️\n• Les signalements ⚠️\n• Les statistiques 📊\n• La météo 🌤️\n• Les transports 🚕\nPouvez-vous reformuler ?";
  }
};

export default chatApi;