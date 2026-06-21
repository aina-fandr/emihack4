// scripts/generatePredictions.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function timeFactor(hour) {
  const h = parseInt(hour.split(':')[0], 10);
  if (h >= 7 && h <= 9) return 1.0;
  if (h >= 17 && h <= 19) return 0.9;
  if (h >= 10 && h <= 16) return 0.5;
  return 0.2;
}

function scoreToTraffic(score) {
  if (score < 0.2) return { level: 'Fluide', color: '#22c55e' };
  if (score < 0.4) return { level: 'Moyen', color: '#eab308' };
  if (score < 0.6) return { level: 'Modéré', color: '#f97316' };
  if (score < 0.8) return { level: 'Dense', color: '#ef4444' };
  return { level: 'Très dense', color: '#dc2626' };
}

async function main() {
  // 1. Récupère les villes déjà présentes dans traffic_data (source fiable)
  const { rows: cities } = await pool.query(
    'SELECT DISTINCT city, region FROM traffic_data'
  );

  if (cities.length === 0) {
    console.error('❌ Aucune ville trouvée dans traffic_data. Exécute d’abord le script d’insertion manuelle ou vérifie ta base.');
    process.exit(1);
  }

  console.log(`Villes trouvées : ${cities.length}`);

  // 2. Congestion de base
  const baseCongestion = 0.5;

  // 3. Créneaux
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  const hours = ['06:00', '07:00', '08:00', '09:00', '12:00', '17:00', '18:00', '22:00'];

  // 4. Insertion
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const { city, region } of cities) {
      for (const date of days) {
        for (const hour of hours) {
          const tf = timeFactor(hour);
          const score = baseCongestion * tf;
          const { level, color } = scoreToTraffic(score);

          await client.query(
            `INSERT INTO traffic_data (city, region, date, hour, traffic_level, color)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (city, date, hour) DO NOTHING`,
            [city, region, date, hour, level, color]
          );
        }
      }
    }
    await client.query('COMMIT');
    console.log(`✅ Insertion réussie : ${cities.length} villes × 7 jours × 8 heures = ${cities.length * 7 * 8} prédictions.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur :', err);
  } finally {
    client.release();
    pool.end();
  }
}

main();