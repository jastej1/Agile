var HomeController = require('./Controllers/HomeController');
var UserController = require('./Controllers/UserController');

// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/' , HomeController.Index)
    app.get('/User/Register', UserController.Register); 
    app.post('/User/RegisterUser', UserController.RegisterUser); 
    app.get('/User/Profile', UserController.Profile); 
    app.post('/User/UpdateUser', UserController.UpdateUser); 
    app.get('/User/Login', UserController.Login); 
    app.post('/User/LoginUser', UserController.LoginUser); 
    app.get('/User/Logout', UserController.Logout); 
    app.get('/User/SecureArea', UserController.SecureArea); 
    app.get('/User/UpdateSuccess', UserController.Profile)
    app.get('/User/Notice', UserController.Notice); 
    
};
