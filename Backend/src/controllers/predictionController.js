const pool = require('../config/database');

const PROVINCE_MAP = {
    'Antananarivo': ['Analamanga', 'Vakinankaratra', 'Itasy', 'Bongolava'],
    'Fianarantsoa': ['Haute Matsiatra', 'Amoron\'i Mania', 'Ihorombe', 'Atsimo-Atsinanana', 'Vatovavy-Fitovinany'],
    'Toamasina': ['Atsinanana', 'Analanjirofo', 'Alaotra-Mangoro'],
    'Mahajanga': ['Boeny', 'Betsiboka', 'Melaky', 'Sofia'],
    'Toliara': ['Atsimo-Andrefana', 'Androy', 'Anosy', 'Menabe'],
    'Antsiranana': ['Diana', 'Sava']
};

// ✅ Obligatoire pour la route /provinces
exports.getProvinces = (req, res) => {
    res.json({ data: Object.keys(PROVINCE_MAP) });
};

// ✅ Obligatoire pour la route /zones/:province
exports.getZones = async (req, res) => {
    const { province } = req.params;
    const regionsAssociees = PROVINCE_MAP[province] || [];
    try {
        const query = `SELECT DISTINCT city FROM traffic WHERE region = ANY($1) ORDER BY city ASC`;
        const result = await pool.query(query, [regionsAssociees]);
        res.json({ data: result.rows.map(row => row.city) });
    } catch (err) {
        res.status(500).json({ error: "Erreur DB" });
    }
};

// ✅ Pour la route /traffic (si réactivée)
exports.getTrafficPredictions = async (req, res) => {
    try {
        const { zone, date, hour } = req.query;
        let result = await pool.query(
            `SELECT hour, traffic_level, color FROM traffic_data WHERE city = $1 AND date = $2 AND hour = $3 LIMIT 1`,
            [zone, date, hour]
        );
        if (result.rows.length === 0) {
            result = await pool.query(
                `SELECT hour, traffic_level, color FROM traffic_data WHERE city = $1 AND hour = $3 AND date < $2 ORDER BY date DESC LIMIT 1`,
                [zone, date, hour]
            );
        }
        if (result.rows.length === 0) {
            return res.json({ hourly: [{ hour, traffic: 'Indisponible', color: '#9ca3af' }] });
        }
        const hourly = result.rows.map(row => ({
            hour: row.hour,
            traffic: row.traffic_level,
            color: row.color
        }));
        res.json({ hourly });
    } catch (err) {
        console.error('Erreur prédiction:', err);
        res.status(500).json({ error: err.message });
    }
};

// Stubs pour les autres routes (facultatives)
exports.getHistoricalData = (req, res) => { res.status(501).json({ error: 'Not implemented' }); };
exports.getRecommendations = (req, res) => { res.status(501).json({ error: 'Not implemented' }); };