var mongoose              = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var ObjectId = require('mongodb').ObjectID;

// User Schema
var userSchema = mongoose.Schema({

  userID: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
      type: String
  },
  array: {
    type: Array
  }
});
userSchema.plugin(passportLocalMongoose);
var User = module.exports = mongoose.model('User', userSchema);
module.exports = User;
