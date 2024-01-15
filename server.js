// npm start to run with nodemon
require('dotenv').config();
const express = require('express');

// routes 
const playerRoutes = require('./routes/prizePicksRouts.js');

// express app
const app = express();

// EXAMPLE: this is how a api call will be made to a api 
app.use('/api', playerRoutes);

// this logs the mongoDb queries being executed
// mongoose.set('debug', true);


app.listen(process.env.PORT, () => {
    console.log(' connected to Bet Checker backend🌎');
    console.log(' listening on port', process.env.PORT + '🗿 ')
})

