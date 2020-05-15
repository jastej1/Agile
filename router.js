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
    app.get('/Home/Index', HomeController.Index)
    app.get('/Home/Index', UserController.Register);
    app.get('/User/Register', UserController.Register);
    app.post('/user/registeruser', cors(), UserController.RegisterUser);
    app.get('/User/Login', UserController.Login);
    app.post('/User/LoginUser', UserController.LoginUser);
    app.get('/User/Logout', UserController.Logout);
    app.get('/User/Profile', UserController.Profile);
    app.get('/User/MyEvents', UserController.Events);
    app.get('/User/CreateEvent', UserController.CreateEvent);
    app.post('/User/CreationEvent', cors(), UserController.CreationEvent);
    app.post('/User/UpdateUser', cors(), UserController.UpdateUser);
    app.post('/Event/Delete', cors(), UserController.DeleteEvent);
    app.post('/Event/altDelete', cors(), UserController.AltDeleteEvent);    
    // Sign in
    app.post(
        '/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
    )

};
