// src/routes/predictionRoutes.js
const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

router.get('/traffic', predictionController.getTrafficPredictions);  // ← réactivée
router.get('/provinces', predictionController.getProvinces);
router.get('/zones/:province', predictionController.getZones);
// les autres routes peuvent rester commentées

module.exports = router;