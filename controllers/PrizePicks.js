const { Builder, By } = require('selenium-webdriver');

// GET ALL PLAYERS Function to run Selenium script and get all players with a prop on prizepicks
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

// GET ALL PROJECTIONS Function to run Selenium script and get all projections on prizepicks
async function getProjections(req, res) {
  let driver = await new Builder().forBrowser('chrome').build();
  let LINK = 'https://api.prizepicks.com/projections?league_id=7';
    try { 
    await driver.manage().window().setRect({width: 1920, height: 1080});
    await driver.get(LINK);

    // Find the <pre> element
    let preElement = await driver.findElement(By.tagName('pre'));

    // Get the text from the <pre> element
    let text = await preElement.getText();
    let jsonData = JSON.parse(text);
    
   function filterProjections(jsonData) {
    // Check if jsonData has a 'data' property and it is an array
    if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
        return jsonData.data.filter(item => 
            item.type === "projection" || item.type === "projection_type"
        ).map(item => {
            // Include relationships information
            return {
                ...item, 
                relationships: item.relationships // Include relationships
            };
        });
    } else {
        console.error('jsonData is not an array or has no data property:', jsonData);
        return []; // Return an empty array or handle the error as needed
    }
}
      const filteredProjections = filterProjections(jsonData)
    console.log(filteredProjections);
    //console.log(json.data[0].attributes);
    //console.log(JSON.parse(text));
      res.json(filteredProjections);

  } catch (err) {
    console.log(err);
  }
  finally {
    await driver.quit();
  }
}

// GET ALL PROJECTIONS Function to run Selenium script and get all projections on prizepicks
async function getAllPrizepicksData(req, res) {
  let driver = await new Builder().forBrowser('chrome').build();
  let LINK = 'https://api.prizepicks.com/projections?league_id=7';
    try { 
    await driver.manage().window().setRect({width: 1920, height: 1080});
    await driver.get(LINK);

    // Find the <pre> element
    let preElement = await driver.findElement(By.tagName('pre'));

    // Get the text from the <pre> element
    let text = await preElement.getText();
    let jsonData = JSON.parse(text);
    
    //console.log(json.data[0].attributes);
    //console.log(JSON.parse(text));
      res.json(jsonData);

  } catch (err) {
    console.log(err);
  }
  finally {
    await driver.quit();
  }
}



module.exports = {
  getPlayers,
  getProjections,
  getAllPrizepicksData,
};

