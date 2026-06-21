const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("traffic_assist", "postgres", "123", {
  host: "localhost",
  dialect: "postgres",
  logging: false
});

const Traffic = sequelize.define("Traffic", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING(100) },
  city: { type: DataTypes.STRING(100) },
  road: { type: DataTypes.STRING(50) },
  status: { type: DataTypes.ENUM("fluide", "modere", "dense", "bloque"), defaultValue: "fluide" },
  level: { type: DataTypes.INTEGER, defaultValue: 0 },
  currentSpeed: DataTypes.FLOAT,
  freeFlowSpeed: DataTypes.FLOAT,
  lastUpdate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: "traffic_data", underscored: true, timestamps: false });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/traffic/realtime", async (req, res) => {
  try {
    const where = {};
    if (req.query.region && req.query.region !== "all") where.region = req.query.region;
    if (req.query.city) where.city = req.query.city;
    const data = await Traffic.findAll({ where });
    res.json({ success: true, data, count: data.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/traffic/statistics", async (req, res) => {
  try {
    const total = await Traffic.count();
    const fluide = await Traffic.count({ where: { status: "fluide" } });
    const modere = await Traffic.count({ where: { status: "modere" } });
    const dense = await Traffic.count({ where: { status: "dense" } });
    const bloque = await Traffic.count({ where: { status: "bloque" } });
    res.json({ success: true, data: { total, fluide, modere, dense, bloque } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/traffic/regions", async (req, res) => {
  try {
    const regions = await Traffic.findAll({ attributes: ["region"], group: ["region"] });
    res.json({ success: true, data: regions.map(r => r.region) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/traffic/cities", async (req, res) => {
  try {
    const where = {};
    if (req.query.region) where.region = req.query.region;
    const cities = await Traffic.findAll({ attributes: ["city", "region"], group: ["city", "region"], where });
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fonction pour générer des données aléatoires réalistes
function getRandomTraffic(hour) {
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  const isNight = (hour >= 22 || hour <= 5);
  
  let speedRatio;
  if (isNight) {
    speedRatio = 0.8 + Math.random() * 0.2; // 80-100% fluide la nuit
  } else if (isRushHour) {
    speedRatio = 0.2 + Math.random() * 0.5; // 20-70% bouchons
  } else {
    speedRatio = 0.5 + Math.random() * 0.4; // 50-90% normal
  }
  
  let status;
  if (speedRatio >= 0.75) status = "fluide";
  else if (speedRatio >= 0.5) status = "modere";
  else if (speedRatio >= 0.25) status = "dense";
  else status = "bloque";
  
  return {
    status,
    level: Math.round((1 - speedRatio) * 100),
    currentSpeed: Math.round(speedRatio * 50 * 10) / 10,
    lastUpdate: new Date()
  };
}

// Mettre à jour les données toutes les 30 secondes
async function updateTrafficData() {
  try {
    const axes = await Traffic.findAll();
    
    for (const axe of axes) {
      const newData = getRandomTraffic(new Date().getHours());
      await axe.update({
        status: newData.status,
        level: newData.level,
        currentSpeed: newData.currentSpeed,
        lastUpdate: new Date()
      });
    }
    
    const stats = await Traffic.count({ group: ["status"] });
    console.log(`[${new Date().toLocaleTimeString()}] Données mises à jour - ${axes.length} axes`);
  } catch (error) {
    console.error("Erreur mise à jour:", error.message);
  }
}

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Base de donnees connectee");
    
    await sequelize.sync({ force: true });
    console.log("✅ Table creee");
    
    // Insérer les données initiales
    await Traffic.bulkCreate([
      { region: "Analamanga", city: "Antananarivo", road: "RN1", status: "fluide", level: 20 },
      { region: "Analamanga", city: "Antananarivo", road: "RN2", status: "modere", level: 45 },
      { region: "Analamanga", city: "Antananarivo", road: "RN3", status: "dense", level: 70 },
      { region: "Atsinanana", city: "Toamasina", road: "RN4", status: "fluide", level: 15 },
      { region: "Atsinanana", city: "Toamasina", road: "RN5", status: "modere", level: 40 },
      { region: "Boeny", city: "Mahajanga", road: "RN6", status: "fluide", level: 10 },
      { region: "Vakinankaratra", city: "Antsirabe", road: "RN7", status: "dense", level: 65 },
      { region: "Haute Matsiatra", city: "Fianarantsoa", road: "RN8", status: "modere", level: 35 },
      { region: "Atsimo-Andrefana", city: "Toliara", road: "RN9", status: "fluide", level: 25 },
      { region: "Diana", city: "Antsiranana", road: "RN10", status: "bloque", level: 90 },
      { region: "Diana", city: "Nosy Be", road: "RN11", status: "fluide", level: 5 },
      { region: "Analamanga", city: "Antananarivo", road: "RN12", status: "bloque", level: 85 }
    ]);
    console.log("✅ 12 axes inseres");

    // Mise à jour toutes les 30 secondes
    setInterval(updateTrafficData, 30000);
    
    // Première mise à jour après 5 secondes
    setTimeout(updateTrafficData, 5000);

    app.listen(5000, () => {
      console.log("🚀 Serveur: http://localhost:5000");
      console.log("📡 API: http://localhost:5000/api/traffic/realtime");
      console.log("🔄 Mise à jour automatique toutes les 30 secondes");
    });
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

start();