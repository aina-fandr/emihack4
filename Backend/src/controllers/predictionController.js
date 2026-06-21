const pool = require('../config/db');

// Mapping pour regrouper tes régions (table 'traffic') sous les 6 provinces
const PROVINCE_MAP = {
    'Antananarivo': ['Analamanga', 'Vakinankaratra', 'Itasy', 'Bongolava'],
    'Fianarantsoa': ['Haute Matsiatra', 'Amoron\'i Mania', 'Ihorombe', 'Atsimo-Atsinanana', 'Vatovavy-Fitovinany'],
    'Toamasina': ['Atsinanana', 'Analanjirofo', 'Alaotra-Mangoro'],
    'Mahajanga': ['Boeny', 'Betsiboka', 'Melaky', 'Sofia'],
    'Toliara': ['Atsimo-Andrefana', 'Androy', 'Anosy', 'Menabe'],
    'Antsiranana': ['Diana', 'Sava']
};

exports.getProvinces = (req, res) => {
    res.json({ data: Object.keys(PROVINCE_MAP) });
};

exports.getZones = async (req, res) => {
    const { province } = req.params;
    const regionsAssociees = PROVINCE_MAP[province] || [];
    
    try {
        // On récupère les 'city' (villes) uniques pour les régions liées à cette province
        const query = `
            SELECT DISTINCT city 
            FROM traffic 
            WHERE region = ANY($1) 
            ORDER BY city ASC
        `;
        const result = await pool.query(query, [regionsAssociees]);
        res.json({ data: result.rows.map(row => row.city) });
    } catch (err) {
        res.status(500).json({ error: "Erreur DB" });
    }
};