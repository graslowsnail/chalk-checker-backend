const mongoose = require('mongoose');
const { Builder, By } = require('selenium-webdriver');
const Player = require('../models/Player'); // Import your Player model
const Projection = require('../models/Projection'); // Import your Projection model

async function savePlayersAndProjections(req, res) {
  let driver = await new Builder().forBrowser('chrome').build();
  let LINK = 'https://api.prizepicks.com/projections?league_id=7';

  try {
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    await driver.get(LINK);

    // Find the <pre> element
    let preElement = await driver.findElement(By.tagName('pre'));

    // Get the text from the <pre> element
    let text = await preElement.getText();
    let jsonData = JSON.parse(text);

    // Filter and process player data
    const playerData = filterAndProcessPlayers(jsonData);
    // Filter and process projection data with player references
    const projectionData = await filterAndProcessProjections(jsonData);

    // Save player data to MongoDB
    await Player.insertMany(playerData);

    // Save projection data to MongoDB and populate playerObject field
    await Projection.insertMany(projectionData).then(async (projections) => {
      await Projection.populate(projections, { path: 'playerObject' });
    });

    res.json({ players: playerData, projections: projectionData });
  } catch (err) {
    console.error(err);
    throw err; // Rethrow to handle in the route
  } finally {
    await driver.quit();
  }
}


function filterAndProcessPlayers(jsonData) {
  if (Array.isArray(jsonData)) {
    const filteredData = jsonData
      .filter((item) => item.attributes && item.attributes.display_name && item.attributes.image_url)
      .map((item) => {
        // Extract only the required fields
        const { prizePickId, attributes } = item;
        const { display_name, image_url,league,league_id,market,name,position,team,team_name  } = attributes;

        // Modify the filteredData to structure the data as needed
        return {
          prizePickId: id, 
          attributes: {
          display_name, image_url,league,league_id,market,name,position,team,team_name,
          },
        };
      });

    return filteredData;
  } else if (jsonData && jsonData.data && Array.isArray(jsonData.included)) {
    const filteredData = jsonData.included
      .filter((item) => item.attributes && item.attributes.display_name && item.attributes.image_url)
      .map((item) => {
        // Extract only the required fields
        const { id, attributes } = item;
        const { display_name, image_url,league,league_id,market,name,position,team,team_name } = attributes;

        // Modify the filteredData to structure the data as needed
        return {
          prizePickId: item.id, // Use the 'id' as the MongoDB document ID
          display_name,
          image_url,
          league,
          league_id,
          market,
          name,
          position,
          team,
          team_name,
        };
      });

    return filteredData;
  } else {
    console.error('Invalid player data structure:', jsonData);
    return [];
  }
}


async function filterAndProcessProjections(jsonData) {
  if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
    const filteredData = await Promise.all(
      jsonData.data
        .filter((item) => item.type === 'projection' || item.type === 'projection_type')
        .map(async (item) => {
          // Extract only the required fields
          const { type, id, attributes, relationships } = item;
          const { description, line_score, start_time, projection_type, stat_type, prizePickId } = attributes;
          const { new_player } = relationships;

          // Extract 'type' and 'id' from the 'new_player' relationship
          const newPlayerType = new_player.data.type;
          const newPlayerId = new_player.data.id;

          // Query the Player collection using Mongoose
          const player = await Player.findOne({ prizePickId: newPlayerId });

          // Modify the filteredData to structure the data as needed
          return {
            type,
            prizePickId: id, // Use the 'id' as the MongoDB document ID
            description,
            line_score,
            start_time,
            projection_type,
            stat_type,
            playerName: player ? player.name : null,
            playerObject: player ? player._id : null,
          };
        })
    );

    return filteredData;
  } else {
    console.error('Invalid projection data structure:', jsonData);
    return [];
  }
}




module.exports = {
  savePlayersAndProjections,
};

