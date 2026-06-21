// src/controllers/trafficController.js
const trafficService = require('../services/trafficService');

exports.getTrafficData = async (req, res) => {
  try {
    const data = await trafficService.getAllTraffic();
    res.status(200).json({ data });
  } catch (error) {
    console.error('❌ Erreur contrôleur trafic:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du trafic' });
  }
};

exports.getRegions = async (req, res) => {
  try {
    const data = await trafficService.getDistinctRegions();
    res.status(200).json({ data });
  } catch (error) {
    console.error('❌ Erreur contrôleur régions:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des régions' });
  }
};

exports.getCities = async (req, res) => {
  try {
    const data = await trafficService.getDistinctCities();
    res.status(200).json({ data });
  } catch (error) {
    console.error('❌ Erreur contrôleur villes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des villes' });
  }
};