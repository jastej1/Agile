// Change this => Event
var mongoose              = require('mongoose');

// User Schema
var eventSchema = mongoose.Schema({

  name: {
    type: String
  },
  description: {
    type: String
  },
  people: {
    type: Array
  },
  month: {
    type: Number
  },
  day: {
    type: Number
  },
  time: {
    type: Number
  }

});
var Event = module.exports = mongoose.model('Event', eventSchema);
module.exports = Event;
