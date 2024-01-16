const express = require('express');
const router = express.Router();
const Player = require('../models/Player.js');

const {
    getPlayersFromMongoDb,
} = require('../controllers/Player.js');


// GET all players from internal db
router.get('/mongoplayers', getPlayersFromMongoDb);


module.exports = router;
