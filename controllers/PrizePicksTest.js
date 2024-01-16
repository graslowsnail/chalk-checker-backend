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
  const projectionData = jsonData.data.filter((item) =>
    item.type === 'projection' || item.type === 'projection_type'
  ).map((item) => {
    const { attributes } = item;
    
    return {
      type: attributes.type,
      prizePickId: attributes.prizePickId,
      board_time: attributes.board_time,
      description: attributes.description,
      is_promo: attributes.is_promo,
      line_score: attributes.line_score,
      odds_type: attributes.odds_type,
      projection_type: attributes.projection_type,
      start_time: attributes.start_time,
      stat_type: attributes.stat_type,
      status: attributes.status,
      today: attributes.today,
      playerId: attributes.playerId, // Assuming you want to store playerId as well
    };
  });

  const projections = await Projection.insertMany(projectionData);
  return projections;
}

module.exports = {
  savePlayersAndProjections,
};

