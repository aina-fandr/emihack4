// import-osm.js
const axios = require('axios');
const { Pool } = require('pg');

// Configuration de ta base de données PostgreSQL
const pool = new Pool({
  user: 'neva',              
  host: 'localhost',
  database: 'transport_db',   
  password: 'aina2006', // ⚠️ TRÈS IMPORTANT
  port: 5432,
});

// Coordonnées réelles (Bounding Boxes) englobant les centres-villes urbains à Madagascar
const CITIES_TO_IMPORT = [
  { name: 'Antananarivo', region: 'Analamanga', bbox: '-18.9600,47.4700,-18.8600,47.5800' },
  { name: 'Toamasina', region: 'Atsinanana', bbox: '-18.1800,49.3700,-18.1100,49.4300' },
  { name: 'Mahajanga', region: 'Boeny', bbox: '-15.7500,46.2800,-15.6800,46.3600' },
  { name: 'Antsirabe', region: 'Vakinankaratra', bbox: '-19.9000,47.0000,-19.8300,47.0700' },
  { name: 'Fianarantsoa', region: 'Haute Matsiatra', bbox: '-21.4900,47.0500,-21.4200,47.1200' },
  { name: 'Toliara', region: 'Atsimo-Andrefana', bbox: '-23.3900,43.6400,-23.3200,43.7100' },
  { name: 'Antsiranana', region: 'Diana', bbox: '-12.3300,49.2600,-12.2500,49.3200' }
];

// Fonction pour forcer une pause (évite le rate limiting)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function importFromOSM() {
  console.log("🚀 Début de l'importation automatique optimisée par Bounding Box...");

  for (const cityInfo of CITIES_TO_IMPORT) {
    console.log(`⏳ Extraction des axes routiers pour : ${cityInfo.name}...`);
    
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    
    // Requête Overpass utilisant la Bounding Box de la ville
    const query = `
      [out:json][timeout:120];
      (
        way["highway"~"primary|secondary|tertiary"](${cityInfo.bbox});
      );
      out body geom;
    `;

    try {
      const params = new URLSearchParams();
      params.append('data', query);

      const response = await axios.post(overpassUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'EmiHack4TrafficSimulationProject/1.0 (etudiant-neva@domain.com)'
        }
      });

      const ways = response.data.elements || [];
      let count = 0;

      for (const way of ways) {
        // On cible les routes nommées ou les axes nationaux/urbains importants
        const roadName = way.tags?.name || way.tags?.ref || `Axe Urbain ${way.id}`;
        
        if (way.geometry && way.geometry.length >= 2) {
          const lat_start = way.geometry[0].lat;
          const lng_start = way.geometry[0].lon;
          const lat_end = way.geometry[way.geometry.length - 1].lat;
          const lng_end = way.geometry[way.geometry.length - 1].lon;
          
          const latitude = (lat_start + lat_end) / 2;
          const longitude = (lng_start + lng_end) / 2;

          await pool.query(`
            INSERT INTO traffic (region, city, road, status, level, latitude, longitude, lat_start, lng_start, lat_end, lng_end, last_update)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
            ON CONFLICT DO NOTHING;
          `, [
            cityInfo.region,
            cityInfo.name,
            roadName,
            'fluide',
            10,
            latitude,
            longitude,
            lat_start,
            lng_start,
            lat_end,
            lng_end
          ]);
          
          count++;
        }
      }
      console.log(`✅ ${cityInfo.name} terminé : ${count} axes routiers insérés.`);
    } catch (error) {
      if (error.response?.data && error.response.data.includes("rate_limited")) {
        console.error(`❌ Erreur : Trop de requêtes sur l'API OSM. On attendra plus longtemps au prochain tour.`);
      } else {
        console.error(`❌ Erreur lors de l'importation de ${cityInfo.name}:`, error.message);
      }
    }

    // 🕒 Pause de 5 secondes entre chaque ville pour laisser respirer l'API OSM
    console.log("🕒 Temporisation de 5 secondes...");
    await sleep(5000);
  }

  console.log("🏁 Importation globale terminée !");
  pool.end();
}

importFromOSM();