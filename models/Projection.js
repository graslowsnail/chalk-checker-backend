const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const schema = mongoose.Schema ({
    type: String,
    prizePickId: Number,
    board_time: Date,
    description: String,
    is_promo: Boolean,
    line_score: Number,
    odds_type: String,
    projection_type: String,
    start_time: Date,
    stat_type: String,
    status: String,
    today: Boolean,
});

module.exports = mongoose.model('Projection', schema);
