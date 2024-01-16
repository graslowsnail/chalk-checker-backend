// npm start to run with nodemon
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// routes 
const prizePicksRouts = require('./routes/prizePicksRouts.js');
const playerRoutes = require('./routes/playerRoutes.js');


// express app
const app = express();

// EXAMPLE: this is how a api call will be made to a api 
app.use('/api', prizePicksRouts);
app.use('/api', playerRoutes);


// to stop deprecation warning in console
mongoose.set('strictQuery', false);

// connect to mongoDb 
mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    }
);

// this logs the mongoDb queries being executed
mongoose.set('debug', true);

app.listen(process.env.PORT, () => {
    console.log(' connected to Bet Checker backend🌎');
    console.log(' listening on port', process.env.PORT + '🗿 ')
})

