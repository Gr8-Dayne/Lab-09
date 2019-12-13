'use strict';



function Forecast(forecast, time) {
  this.forecast = forecast,
  this.time = new Date(time * 1000).toDateString();
}

module.exports = Forecast;
