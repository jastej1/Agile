// Change this => Event
var mongoose              = require('mongoose');

// User Schema
var notificationSchema = mongoose.Schema({

  name: {
    type: String
  },
  description: {
    type: String
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
var Notification = module.exports = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
