const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'traffic_assist',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

const Traffic = sequelize.define('Traffic', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING(100), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
  road: { type: DataTypes.STRING(50), allowNull: false },
  roadName: DataTypes.STRING(255),
  status: { type: DataTypes.ENUM('fluide', 'modere', 'dense', 'bloque'), defaultValue: 'fluide' },
  level: { type: DataTypes.INTEGER, defaultValue: 0 },
  currentSpeed: DataTypes.FLOAT,
  freeFlowSpeed: DataTypes.FLOAT,
  lastUpdate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'traffic_data', underscored: true, timestamps: false });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/traffic/realtime', async (req, res) => {
  try {
    const where = { isActive: true };
    if (req.query.region && req.query.region !== 'all') where.region = req.query.region;
    if (req.query.city) where.city = req.query.city;
    const data = await Traffic.findAll({ where });
    res.json({ success: true, data, count: data.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/traffic/statistics', async (req, res) => {
  try {
    const total = await Traffic.count({ where: { isActive: true } });
    const fluide = await Traffic.count({ where: { status: 'fluide', isActive: true } });
    const modere = await Traffic.count({ where: { status: 'modere', isActive: true } });
    const dense = await Traffic.count({ where: { status: 'dense', isActive: true } });
    const bloque = await Traffic.count({ where: { status: 'bloque', isActive: true } });
    res.json({ success: true, data: { total, fluide, modere, dense, bloque } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/traffic/regions', async (req, res) => {
  try {
    const regions = await Traffic.findAll({ attributes: ['region'], group: ['region'], where: { isActive: true } });
    res.json({ success: true, data: regions.map(r => r.region) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/traffic/cities', async (req, res) => {
  try {
    const where = { isActive: true };
    if (req.query.region) where.region = req.query.region;
    const cities = await Traffic.findAll({ attributes: ['city', 'region'], group: ['city', 'region'], where });
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Base de donnees connectee');
    await sequelize.sync({ force: true });
    console.log('✅ Table creee');
    
    const count = await Traffic.count();
    if (count === 0) {
      const data = [
        { region: 'Analamanga', city: 'Antananarivo', road: 'RN1', roadName: 'RN1', status: 'fluide', level: 20 },
        { region: 'Analamanga', city: 'Antananarivo', road: 'RN2', roadName: 'RN2', status: 'modere', level: 45 },
        { region: 'Analamanga', city: 'Antananarivo', road: 'RN3', roadName: 'RN3', status: 'dense', level: 70 },
        { region: 'Atsinanana', city: 'Toamasina', road: 'RN4', roadName: 'RN4', status: 'fluide', level: 15 },
        { region: 'Atsinanana', city: 'Toamasina', road: 'RN5', roadName: 'RN5', status: 'modere', level: 40 },
        { region: 'Boeny', city: 'Mahajanga', road: 'RN6', roadName: 'RN6', status: 'fluide', level: 10 },
        { region: 'Vakinankaratra', city: 'Antsirabe', road: 'RN7', roadName: 'RN7', status: 'dense', level: 65 },
        { region: 'Haute Matsiatra', city: 'Fianarantsoa', road: 'RN8', roadName: 'RN8', status: 'modere', level: 35 },
        { region: 'Atsimo-Andrefana', city: 'Toliara', road: 'RN9', roadName: 'RN9', status: 'fluide', level: 25 },
        { region: 'Diana', city: 'Antsiranana', road: 'RN10', roadName: 'RN10', status: 'bloque', level: 90 },
        { region: 'Diana', city: 'Nosy Be', road: 'RN11', roadName: 'RN11', status: 'fluide', level: 5 },
        { region: 'Analamanga', city: 'Antananarivo', road: 'RN12', roadName: 'RN12', status: 'bloque', level: 85 }
      ];
      await Traffic.bulkCreate(data);
      console.log('✅ 12 axes inseres');
    }

    app.listen(PORT, () => {
      console.log('Serveur: http://localhost:' + PORT);
    });
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

startServer();