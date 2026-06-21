const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController'); // Ton contrôleur d'inscription/connexion classique

// ==========================================
// 1. AUTHENTIFICATION CLASSIQUE (POSTGRESQL)
// ==========================================
router.post('/register', authController.register);
router.post('/login', authController.login);

// ==========================================
// 2. AUTHENTIFICATION GOOGLE OAUTH2
// ==========================================

// Route déclenchée par React pour initier la connexion Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route utilisée par le front-end React pour vérifier un token Google côté backend
router.post('/google', authController.googleLogin);

// URL de redirection après validation par Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Authentification réussie ! 
    // Comme React tourne sur un autre port (ex: 3000), on redirige vers le frontend avec les infos
    // Idéalement, transmet un token ou laisse la session s'occuper du cookie
    res.redirect('http://localhost:3000/');
  }
);

// Route pour vérifier l'état de la session (appelée par le useEffect de ton App.js)
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