// npm start to run with nodemon
require('dotenv').config();
const express = require('express');
//const { Builder, By } = require('selenium-webdriver');


// routes 
const playerRoutes = require('./routes/prizePicksRouts.js');

// express app
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  next();
});


// Function to run Selenium script
/*
async function runSeleniumScript() {
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

    if (Array.isArray(jsonData)) {
      // Filter and return only objects with "display_name" and "image_url" attributes
      const filteredData = jsonData.filter(item => (
        item.attributes && item.attributes.display_name && item.attributes.image_url
      ));
      return filteredData;
    } else if (jsonData && jsonData.data && Array.isArray(jsonData.included)) {
      // Handle cases where jsonData has a different structure
      const filteredData = jsonData.included.filter(item => (
        item.attributes && item.attributes.display_name && item.attributes.image_url
      ));
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
  */

// EXAMPLE: this is how a api call will be made to a api
 //app.use('/player', playerRoutes);
 app.get('/players', playerRoutes);

// Express route to run the script and send filtered data
/*
app.get('/run-selenium/players', async (req, res) => {
  try {
    const filteredData = await runSeleniumScript();
    res.json(filteredData); // Send the filtered data as JSON response
  } catch (error) {
    res.status(500).send('Error running Selenium script');
  }
});
*/

// this logs the mongoDb queries being executed
// mongoose.set('debug', true);


app.listen(process.env.PORT, () => {
    console.log(' connected to Bet Checker backend🌎');
    console.log(' listening on port', process.env.PORT + '🗿 ')
})

