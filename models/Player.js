const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const Projection = require('../models/Projection.js');

const schema = mongoose.Schema ({
    type: String,
  prizePickId: Number,
    combo: Boolean,
    display_name: String,
    image_url: String,
    league: String,
    league_id: Number,
    market: String,
    name: String,
    position: String,
    team: String,
    team_name: String,
    projections: [{
      type: ObjectId,
      ref: 'Projection', // Reference to the Projection model
    }],
});
module.exports = mongoose.model('Player', schema);
