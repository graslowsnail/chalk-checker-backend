const { Builder, By } = require('selenium-webdriver');
const mongoose = require('mongoose');
const Player = require('../models/Player.js');
const Projection = require('../models/Projection.js');

// GET ALL PLAYERS Function to run Selenium script and get all players with a prop on prizepicks
async function getPlayers(req, res) {
}

// GET ALL PROJECTIONS Function to run Selenium script and get all projections on prizepicks
async function getProjections(req, res) {
}

// GET ALL PROJECTIONS Function to run Selenium script and get all projections on prizepicks
async function getAllPrizepicksData(req, res) {
}


module.exports = {
  getPlayers,
  getProjections,
  getAllPrizepicksData,
};

