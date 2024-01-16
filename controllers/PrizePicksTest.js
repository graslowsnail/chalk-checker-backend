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
        let text = await preElement.getText();
        let jsonData = JSON.parse(text);

        const playerData = filterAndProcessPlayers(jsonData);
        await Player.insertMany(playerData);

        const projectionData = await filterAndProcessProjections(jsonData);

        res.json({ players: playerData, projections: projectionData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing data');
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
    const projections = [];

    for (const item of jsonData.data) {
        if (item.type === 'projection' || item.type === 'projection_type') {
            const { id, attributes, relationships } = item;
            const newPlayerId = relationships.new_player.data.id;
            const player = await Player.findOne({ prizePickId: newPlayerId });

            const newProjection = new Projection({
                // ... fields from attributes ...
                playerObject: player ? player._id : null
            });

            const savedProjection = await newProjection.save();

            if (player) {
                await Player.findByIdAndUpdate(
                    player._id,
                    { $addToSet: { projections: savedProjection._id } },
                    { new: true }
                );
            }

            projections.push(savedProjection);
        }
    }

    return projections;
}


module.exports = {
  savePlayersAndProjections,
};

