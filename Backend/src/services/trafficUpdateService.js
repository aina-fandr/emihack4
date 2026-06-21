const pool = require('../config/database');

class TrafficUpdateService {
  // Générer des données réalistes en temps réel
  generateRealTimeData(roadId) {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18);
    const isLunch = hour >= 12 && hour <= 14;

    // Base de congestion
    let baseCongestion = 20;
    let baseSpeed = 45;

    if (isRushHour && !isWeekend) {
      baseCongestion = 60 + Math.random() * 30;
      baseSpeed = 15 + Math.random() * 15;
    } else if (isRushHour && isWeekend) {
      baseCongestion = 30 + Math.random() * 20;
      baseSpeed = 30 + Math.random() * 15;
    } else if (isLunch) {
      baseCongestion = 35 + Math.random() * 20;
      baseSpeed = 25 + Math.random() * 15;
    } else if (hour >= 22 || hour <= 5) {
      baseCongestion = 5 + Math.random() * 10;
      baseSpeed = 50 + Math.random() * 20;
    } else {
      baseCongestion = 15 + Math.random() * 20;
      baseSpeed = 35 + Math.random() * 15;
    }

    // Ajouter des variations aléatoires
    const variation = (Math.random() - 0.5) * 10;
    const congestion = Math.max(0, Math.min(100, Math.round(baseCongestion + variation)));
    const speed = Math.max(5, Math.round(baseSpeed + (Math.random() - 0.5) * 5));

    let status = 'VERT';
    if (congestion >= 70) status = 'ROUGE';
    else if (congestion >= 40) status = 'ORANGE';

    return {
      status,
      congestionLevel: congestion,
      speed,
      lastUpdate: new Date().toISOString()
    };
  }

  // Mettre à jour toutes les routes
  async updateAllTraffic() {
    try {
      const roads = await pool.query('SELECT road_id FROM roads');
      let updated = 0;

      for (const road of roads.rows) {
        const data = this.generateRealTimeData(road.road_id);
        
        await pool.query(
          `UPDATE roads 
           SET status = $1, 
               congestion_level = $2, 
               speed = $3,
               last_update = CURRENT_TIMESTAMP
           WHERE road_id = $4`,
          [data.status, data.congestionLevel, data.speed, road.road_id]
        );

        // Ajouter à l'historique
        await pool.query(
          `INSERT INTO traffic_history (road_id, status, congestion_level, speed)
           VALUES ($1, $2, $3, $4)`,
          [road.road_id, data.status, data.congestionLevel, data.speed]
        );

        updated++;
      }

      console.log(`✅ ${updated} routes mises à jour`);
      return { updated };
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      throw error;
    }
  }

  // Démarrer les mises à jour automatiques
  startAutoUpdate(intervalMinutes = 2) {
    console.log(`🔄 Mise à jour automatique toutes les ${intervalMinutes} minutes`);
    
    // Première mise à jour immédiate
    this.updateAllTraffic().catch((error) => {
      console.error('Échec de la première mise à jour automatique :', error.message || error);
      console.error('Vérifiez que la base de données et le schéma PostgreSQL sont initialisés.');
    });

    // Planifier les mises à jour
    setInterval(() => {
      this.updateAllTraffic().catch((error) => {
        console.error('Échec de la mise à jour automatique planifiée :', error.message || error);
      });
    }, intervalMinutes * 60 * 1000);
  }
}

module.exports = new TrafficUpdateService();