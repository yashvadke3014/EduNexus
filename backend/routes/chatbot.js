const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatbotController');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, handleChat);

module.exports = router;
