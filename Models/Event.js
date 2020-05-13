// Change this => Event
var mongoose              = require('mongoose');

// User Schema
var eventSchema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  people: {
    type: Array
  },
  date: {
    type: Date,
    required: true
  },
  userID: {
    type: String
  }

});
var Event = module.exports = mongoose.model('Event', eventSchema);
module.exports = Event;
