const mongoose = require('mongoose');
const Player = require('../models/Player.js');
const Projection = require('../models/Projection.js');

// get all players
const getPlayersFromMongoDb = async (req, res) => {
  try {
    const players = await Player.find().populate('projections');
    console.log(players);
    res.send(players);
  } catch(err) {
    console.log('#### error fetching parts');
    console.log(err.message);
    res.status(500).send({ error: err.message});
  }
};

module.exports = {
  getPlayersFromMongoDb,
};
