// src/services/trafficService.js
const pool = require('../config/database'); // Ton pool PostgreSQL

class TrafficService {
  // Récupérer tous les axes avec les coordonnées de tracé pour les Polylines
  async getAllTraffic() {
    const query = `
      SELECT 
        id, 
        region, 
        city, 
        road, 
        status, 
        level,
        latitude,
        longitude,
        lat_start,
        lng_start,
        lat_end,
        lng_end,
        last_update AS "lastUpdate"
      FROM traffic
      ORDER BY road ASC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  // Extraire les régions uniques pour ton sélecteur 🌍
  async getDistinctRegions() {
    const query = 'SELECT DISTINCT region FROM traffic ORDER BY region ASC;';
    const { rows } = await pool.query(query);
    return rows.map(r => r.region);
  }

  // Extraire les villes uniques
  async getDistinctCities() {
    const query = 'SELECT DISTINCT city FROM traffic ORDER BY city ASC;';
    const { rows } = await pool.query(query);
    return rows.map(r => r.city);
  }
}

module.exports = new TrafficService();