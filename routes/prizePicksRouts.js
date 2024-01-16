const express = require('express');
const router = express.Router();

// imort getPlayers() from controllers file
const { 
  getPlayers,
  getProjections,
  getAllPrizepicksData,
} = require('../controllers/PrizePicks.js');

const {
  savePlayersAndProjections,
} = require('../controllers/PrizePicksTest.js');

// GET all players
router.get('/players', getPlayers);

// GET all projections
router.get('/projections', getProjections);

// GET all prize picks data
router.get('/alldata', getAllPrizepicksData);

router.get('/yes', savePlayersAndProjections);

module.exports = router;
