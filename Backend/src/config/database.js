// src/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'neva',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'transport_db',
  password: process.env.DB_PASSWORD || 'aina2006',
  port: process.env.DB_PORT || 5432,
});

// Script d'initialisation automatique des tables et données réelles
const initDatabase = async () => {
  try {
    // 1. Créer la table si elle n'existe pas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS traffic (
        id SERIAL PRIMARY KEY,
        region VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        road VARCHAR(100) NOT NULL,
        status VARCHAR(20) CHECK (status IN ('fluide', 'modere', 'dense', 'bloque')),
        level INT CHECK (level >= 0 AND level <= 100),
        latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Structure PostgreSQL vérifiée (Table "traffic" OK)');

    // 2. Insérer des données réelles uniquement si la table est vide
    const { rows } = await pool.query('SELECT COUNT(*) FROM traffic');
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO traffic (region, city, road, status, level, latitude, longitude) VALUES
        ('Analamanga', 'Antananarivo', 'RN1 - Itaosy', 'dense', 70, -18.9137, 47.5361),
        ('Analamanga', 'Antananarivo', 'RN2 - Ambohimangakely', 'bloque', 90, -18.9050, 47.5600),
        ('Analamanga', 'Antananarivo', 'RN3 - Analamahitsy', 'modere', 45, -18.8680, 47.5450),
        ('Atsinanana', 'Toamasina', 'RN2 - Boulevard Maritime', 'fluide', 15, -18.1496, 49.4023),
        ('Boeny', 'Mahajanga', 'RN4 - Av. de France', 'fluide', 10, -15.7208, 46.3142),
        ('Vakinankaratra', 'Antsirabe', 'RN7 - Centre Ville', 'dense', 65, -19.8659, 47.0332),
        ('Haute Matsiatra', 'Fianarantsoa', 'RN7 - Nouvelle Ville', 'modere', 35, -21.4536, 47.0858),
        ('Diana', 'Antsiranana', 'Route de l''Aéroport', 'bloque', 85, -12.3000, 49.2900);
      `);
      console.log('🌱 Données de trafic réelles injectées avec succès !');
    }
  } catch (err) {
    console.error('❌ Erreur lors de l’initialisation de la DB :', err.message);
  }
};

initDatabase();

module.exports = pool;