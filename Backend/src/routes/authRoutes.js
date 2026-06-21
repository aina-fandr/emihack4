const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Ton contrôleur d'inscription/connexion classique

// ==========================================
// 1. AUTHENTIFICATION CLASSIQUE (POSTGRESQL)
// ==========================================
router.post('/register', authController.register);
router.post('/login', authController.login);

// Route pour vérifier l'état de la session (si tu en as besoin)
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      isAuthenticated: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } else {
    res.status(401).json({ isAuthenticated: false, message: "Non autorisé" });
  }
});

// Déconnexion
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    req.session.destroy();
    res.status(200).json({ message: "Déconnexion réussie" });
  });
});

module.exports = router;