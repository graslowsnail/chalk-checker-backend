const { Builder, By } = require('selenium-webdriver');

// GET ALL PLAYERS
// // Function to run Selenium script and get all players with a prop on prizepicks

async function getPlayers(req, res) {
  let driver = await new Builder().forBrowser('chrome').build();
  let LINK = 'https://api.prizepicks.com/projections?league_id=7';
  try {
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    await driver.get(LINK);

    // Find the <pre> element
    let preElement = await driver.findElement(By.tagName('pre'));

    // Get the text from the <pre> element
    let text = await preElement.getText();
    const jsonData = JSON.parse(text);
    //console.log(text);

    if (Array.isArray(jsonData)) {
      // Filter and return only objects with "display_name" and "image_url" attributes
      const filteredData = jsonData.filter(item => (
        item.attributes && item.attributes.display_name && item.attributes.image_url
      ));
      console.log(filteredData);
      res.json(filteredData);
      return filteredData;
    } else if (jsonData && jsonData.data && Array.isArray(jsonData.included)) {
      // Handle cases where jsonData has a different structure
      const filteredData = jsonData.included.filter(item => (
        item.attributes && item.attributes.display_name && item.attributes.image_url
      ));
      res.json(filteredData);
      return filteredData;
    } else {
      console.error('Invalid data structure:', jsonData);
      throw new Error('Invalid data structure');
    }
  } catch (err) {
    console.log(err);
    throw err; // Rethrow to handle in the route
  } finally {
    await driver.quit();
  }
}

module.exports = {
  getPlayers
};

