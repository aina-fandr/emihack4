// src/routes/chatRoutes.js
const express = require('express');
const { handleChat } = require('../controllers/chatController');

const router = express.Router();

// Route POST : http://localhost:5000/api/chat/message
router.post('/message', handleChat);

module.exports = router;