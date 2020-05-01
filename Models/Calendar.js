// Change this => Calendar
var mongoose              = require('mongoose');

// User Schema
var calendarSchema = mongoose.Schema({
  

});
calendarSchema.plugin(passportLocalMongoose);
var Calendar = module.exports = mongoose.model('Calendar',calendarSchema);
module.exports = Calendar;
