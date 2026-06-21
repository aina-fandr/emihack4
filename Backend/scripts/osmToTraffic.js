const fs = require('fs');
const pool = require('../src/config/database'); // ton pool

const OSM_FILE = './osm_data/antananarivo.json'; // chemin vers ton gros JSON
const PROVINCE_REGION_MAP = {
  'Antananarivo': 'Analamanga',
  // Ajoute les autres mappings si le fichier contient plusieurs provinces
};

// Poids des types de routes (comme avant)
const HIGHWAY_WEIGHT = {
  motorway: 3, trunk: 3, primary: 5, secondary: 4, tertiary: 2,
  residential: 1, unclassified: 1, living_street: 0.5
};

// Facteur horaire simple
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
  const raw = JSON.parse(fs.readFileSync(OSM_FILE, 'utf8'));
  const ways = raw.elements.filter(e => e.type === 'way' && e.tags && e.tags.highway);

  // Étape 1 : accumuler la somme des poids par ville
  const cityWeights = {}; // { ville: { totalWeight: number, count: number } }

  for (const way of ways) {
    const city = way.tags['addr:city'];
    if (!city) continue; // on ignore les routes sans ville

    const highway = way.tags.highway;
    const weight = HIGHWAY_WEIGHT[highway] || 1;

    if (!cityWeights[city]) cityWeights[city] = { totalWeight: 0, count: 0 };
    cityWeights[city].totalWeight += weight;
    cityWeights[city].count += 1;
  }

  console.log('Villes trouvées dans OSM :', Object.keys(cityWeights).length);
  
  // Étape 2 (optionnelle) : ajouter les villes manquantes de ta table traffic
  // Récupère la liste de toutes les villes de ta base (table traffic)
  const { rows: allCities } = await pool.query('SELECT DISTINCT city, region FROM traffic');
  for (const row of allCities) {
    if (!cityWeights[row.city]) {
      // attribuer un poids moyen par défaut
      cityWeights[row.city] = { totalWeight: 20, count: 5 }; // valeur arbitraire
    }
  }

  // Étape 3 : générer les créneaux (7 jours, 8 heures)
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  const hours = ['06:00', '07:00', '08:00', '09:00', '12:00', '17:00', '18:00', '22:00'];

  // Étape 4 : insertion
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const city of Object.keys(cityWeights)) {
      const { totalWeight, count } = cityWeights[city];
      // Facteur de congestion de base de la ville : plus y a de routes majeures, plus la congestion de base est élevée
      const baseCongestion = Math.min(1, totalWeight / (count * 5)); // normalisé entre 0 et 1

      // Déterminer la région à partir de la ville (utilise ta table traffic ou une map)
      const region = PROVINCE_REGION_MAP[city] || (await getRegionForCity(city));

      for (const date of days) {
        for (const hour of hours) {
          const tf = timeFactor(hour);
          const score = baseCongestion * tf; // combinaison
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
    console.log('✅ Données de prédiction insérées avec succès.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}

// Petite fonction pour retrouver la région d'une ville (depuis ta table traffic)
async function getRegionForCity(city) {
  const { rows } = await pool.query('SELECT region FROM traffic WHERE city = $1 LIMIT 1', [city]);
  return rows[0]?.region || 'Inconnu';
}

main();