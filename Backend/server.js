// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importer le pool de connexion pour s'assurer que la DB se lance
const pool = require('./src/config/database'); 

const app = express();

// Middlewares
app.use(cors({ origin: '*' })); // Permet à ton React de se connecter sans blocage CORS
app.use(express.json());       // Permet de lire le JSON dans req.body (très important pour le chat)

// Liaison des Routes API
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/traffic', require('./src/routes/trafficRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/predictions', require('./src/routes/predictionRoutes'));

// Gestion des routes inexistantes (404)
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée sur le serveur" });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📡 Trafic API : http://localhost:${PORT}/api/traffic`);
  console.log(`📈 Prédictions API : http://localhost:${PORT}/api/predictions`);
  console.log(`🤖 Chat AI API : http://localhost:${PORT}/api/chat`);
});