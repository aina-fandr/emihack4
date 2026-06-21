// src/routes/predictionRoutes.js
const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

router.get('/traffic', predictionController.getTrafficPredictions);
router.get('/historical', predictionController.getHistoricalData);
router.get('/recommendations', predictionController.getRecommendations);
router.get('/provinces', predictionController.getProvinces);
router.get('/zones/:province', predictionController.getZones);

module.exports = router;
