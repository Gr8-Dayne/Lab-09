'use strict';

const PORT = process.env.PORT || 3077;
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const app = express();

const Geolocation = require('./modules/location');
const Forecast = require('./modules/weather.js');
const Event = require('./modules/events.js');

require('dotenv').config();
app.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);
client.on('err', err => { throw err; });

app.get('/location', (req, res) => {


  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=${process.env.GEOCODE_API_KEY}`;

  console.log('YOOOOOO');
  superagent.get(url).then(response => {
    const geoDataArray = response.body.results;
    const search_query = geoDataArray[0].address_components[0].short_name;
    const formatted_query = geoDataArray[0].formatted_address;
    const lat = geoDataArray[0].geometry.location.lat;
    const lng = geoDataArray[0].geometry.location.lng;

    const nextLocation = new Geolocation(lat, lng, formatted_query, search_query);

    res.send(nextLocation);

  });

});

app.get('/weather', (req, res) => {

  superagent.get(`https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${req.query.data.latitude},${req.query.data.longitude}`).then(response => {

    let dailyData = response.body.daily.data;

    let nextForecast = dailyData.map((val) => {
      let nextForeCastObj = new Forecast(val.summary, val.time);
      return nextForeCastObj;
    });

    res.send(nextForecast);
  });
});

app.get('/events', (req, res) => {

  superagent.get(`http://api.eventful.com/json/events/search?location=${req.query.data.formatted_query}&app_key=${process.env.EVENTFUL_API_KEY}`).then(response => {
    const eventfulJSON = JSON.parse(response.text);

    const eventsArray = eventfulJSON.events.event;

    const nextEvents = eventsArray.map((val) => {
      let nextEventObj = new Event(val.url, val.venue_name, val.start_time, val.title);
      return nextEventObj;
    });

    res.send(nextEvents);

  });
});

app.get('/add', (req, res) => {
  res.status(255).json({ location: 'Seattle '});
});

app.listen(PORT, () => {
  console.log(`App is on PORT: ${PORT}`);
})

