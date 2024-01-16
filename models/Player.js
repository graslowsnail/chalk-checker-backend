const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

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
});
module.exports = mongoose.model('Player', schema);
