var HomeController   = require('./Controllers/HomeController');
var UserController   = require('./Controllers/UserController');
const authMiddleware = require('./authHelper')
const cors           = require('cors');
var express          = require('express');

// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);
    app.use(express.static('public'))
    app.get('/home/index', HomeController.Index)
    app.get('/home/index', UserController.Register);
    app.get('/user/Register', UserController.Register);
    app.post('/user/registeruser', cors(), UserController.RegisterUser);
    app.get('/user/Login', UserController.Login);
    app.post('/user/LoginUser', UserController.LoginUser);
    app.get('/user/Logout', UserController.Logout);
    app.get('/user/Profile', UserController.Profile);
    app.get('/user/MyEvents', UserController.Events);
    app.get('/user/CreateEvent', UserController.CreateEvent);
    app.post('/user/CreationEvent', cors(), UserController.CreationEvent);
    app.post('/user/UpdateUser', cors(), UserController.UpdateUser);
    app.post('/event/Delete', cors(), UserController.DeleteEvent);
    app.post('/event/EditEvent', cors(), UserController.EditEvent);
    app.post('/event/EditingEvent', cors(), UserController.EditingEvent);
    app.post('/event/altDelete', cors(), UserController.AltDeleteEvent);
    // Sign in
    app.post(
        '/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
    )

};
