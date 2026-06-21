// src/routes/trafficRoutes.js
const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');

// Vérifie bien l'orthographe de chaque fonction après le point !
router.get('/', trafficController.getTrafficData);
router.get('/regions', trafficController.getRegions);
router.get('/cities', trafficController.getCities);

module.exports = router;