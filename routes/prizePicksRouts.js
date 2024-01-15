const express = require('express');
const router = express.Router();

// imort getPlayers() from controllers file
const { 
  getPlayers
} = require('../controllers/PrizePicks.js');

// GET all players
router.get('/players', getPlayers);

module.exports = router;
