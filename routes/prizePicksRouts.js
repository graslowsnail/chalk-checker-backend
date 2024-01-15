const express = require('express');
const router = express.Router();

// example for use with mongodb 
//const Players = require('../models/Player.js');

// EXAMPLE for use wiht middlewear
// const auth = require('../middlewear/auth');

// EXAMPLE using controllers
const { 
  getPlayers
} = require('../controllers/PrizePicks.js');

// GET all players
router.get('/players', getPlayers);

module.exports = router;
