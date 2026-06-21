// src/controllers/chatController.js
const Groq = require('groq-sdk');
const pool = require('../config/database'); 

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const handleChat = async (req, res) => {
  try {
    const { message, city } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Le message est requis." });
    }

    // 1. Stratégie anti-saturation : On cible uniquement les axes perturbés ou majeurs
    let query = `
      SELECT road, city, status, level 
      FROM traffic 
      WHERE status IN ('bloque', 'dense', 'modere') 
         OR road ILIKE 'RN%' 
         OR road ILIKE '%boulevard%' 
         OR road ILIKE '%avenue%'
    `;
    let params = [];
    
    if (city) {
      query += ' AND city = $1';
      params.push(city);
    }

    // On trie par niveau d'embouteillage décroissant et on limite STRICTEMENT à 40 lignes maximum
    query += ' ORDER BY level DESC LIMIT 40';
    
    const dbResult = await pool.query(query, params);
    
    // Formatage super compact pour économiser au maximum les tokens
    const trafficContext = dbResult.rows.map(r => 
      `* ${r.road} (${r.city}): ${r.status} (${r.level}%)`
    ).join('\n');

    // 2. Prompt système ultra-allégé
    const systemPrompt = `
      Tu es l'assistant IA de TrafficAssist à Madagascar.
      Voici les perturbations majeures et axes principaux actuels (PostgreSQL) :
      ${trafficContext || "Trafic globalement fluide partout."}
      
      Instructions :
      - Réponds de manière très concise (maximum 3-4 phrases).
      - Utilise ces données pour guider l'utilisateur. Si une route n'est pas dans la liste, dis qu'elle est présumée fluide ou non répertoriée.
      - Parle en français (courtes salutations malgaches comme "Salama" acceptées).
    `;

    // 3. Appel à Groq (les tokens consommés vont chuter de 55 000 à moins de 800 !)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2, 
      max_tokens: 300, // On bride aussi la longueur de sa réponse
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Je n'ai pas pu formuler de réponse.";
    
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("💥 Erreur critique dans le ChatController :", error);
    return res.status(500).json({ error: "L'assistant IA est saturé ou indisponible." });
  }
};

module.exports = {
  handleChat
};