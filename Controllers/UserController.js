const User           = require('../Models/User');
var   passport       = require('passport');
const RequestService = require('../Services/RequestService');
const UserRepo = require('../Data/UserRepo');
const _UserRepo = new UserRepo();



// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('User/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
   
    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {

        // Creates user object with mongoose model.
        // Note that the password is not present.
        var newUser = new User({
            firstName:    req.body.firstName,
            lastName:     req.body.lastName,
            email:        req.body.email,
            username:     req.body.username,
        });
       
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(new User(newUser), req.body.password, 
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        let reqInfo = RequestService.reqHelper(req);
                        return res.render('User/Register', 
                        { user : newUser, errorMessage: err, 
                          reqInfo:reqInfo });
                    }
                    // User registered so authenticate and redirect to secure 
                    // area.
                    passport.authenticate('local') (req, res, 
                            function () { res.redirect('/'); });
                });

    }
    else {
      res.render('User/Register', { user:newUser, 
              errorMessage: "Passwords do not match.", 
              reqInfo:reqInfo})
    }
};

exports.Profile  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let user = await _UserRepo.getUser(reqInfo.username);
    if(reqInfo.authenticated) {
        res.render('User/Profile', {errorMessage:"",user:{}, reqInfo:reqInfo, user})
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
}

exports.UpdateUser  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let successmsg ="Updated Successfully"
    let old_username = req.body.old_username;
    let new_username = req.body.username;
    let new_firstName = req.body.firstName;
    let new_lastName = req.body.lastName;
    let new_email = req.body.email;
    let errorMessage = req.query.errorMessage; 

    let responseObject = await _UserRepo.update(old_username, new_username, new_firstName, new_lastName, new_email);
    reqInfo = RequestService.reqHelper(req)
    req.logout();
    exports.Login(req, res);


}

// Shows login form.
exports.Login = async function(req, res) {
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    res.render('User/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
}

// Receives login information & redirects 
// depending on pass or fail.
exports.LoginUser = (req, res, next) => {

  passport.authenticate('local', {
      successRedirect : '/', 
      failureRedirect : '/User/Login?errorMessage=Invalid login.', 
  }) (req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('User/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};

// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.SecureArea  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);

    if(reqInfo.authenticated) {
        res.render('User/SecureArea', {errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
}

exports.Notice  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let user = await _UserRepo.getUser(reqInfo.username);
    let reviews = await _ReviewRepo.allReviews();


    if(reqInfo.authenticated) {
        exports.MyReviews(req, res);
    }
    else {
        res.render('User/Notice', {errorMessage:"", reqInfo:reqInfo, user, reviews})
    }
}




