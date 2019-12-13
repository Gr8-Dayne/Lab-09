'use strict';



function Event(link, name, date, summary) {
  this.link = link,
  this.name = name,
  this.event_date = date,
  this.summary = summary
}

module.exports = Event;
