const User           = require('../Models/User');
var   passport       = require('passport');
const RequestService = require('../Services/RequestService');
const UserRepo       = require('../Data/UserRepo');
const _userRepo      = new UserRepo();
const EventRepo      = require('../Data/EventRepo');
const _EventRepo     = new EventRepo();
const Event          = require('../Models/Event')
const dateFormat     = require('dateformat');

// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('user/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
    let flag = false;
    let reqInfo      = RequestService.reqHelper(req);
    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;
    if(req.body.username == "" || req.body.firstName == "" || req.body.lastName == "")
    {
        flag = true;
        return res.render('user/Register', {errorMessage:"Invalid Entry", user:{}, reqInfo:reqInfo})

    }
    
    if(!(req.body.email.includes("@")))
    {
        flag = true;
        return res.render('user/Register', {errorMessage:"Invalid Email", user:{}, reqInfo:reqInfo})

    }

    if(req.body.password.length < 6)
    {
        flag = true;
        return res.render('user/Register', {errorMessage:"Password must be minimum of 6 characters", user:{}, reqInfo:reqInfo})

    }

    //console.log(flag);
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
                        return res.render('user/Register', 
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
      res.render('user/Register', { user:{}, 
              errorMessage: "Passwords do not match.", 
              reqInfo:reqInfo})
    }
};

// Shows login form.
exports.Login = async function(req, res) {
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    res.render('user/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
}

exports.LoginUser = async function(req, res, next) {
    
    passport.authenticate('local', {
        successRedirect : '/Home/Index', 
        failureRedirect : '/user/Login?errorMessage=Invalid login.', 
    }) (req, res, next);
  };
  

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('user/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};



exports.Profile  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let user = await _userRepo.getUser(reqInfo.username);
    if(reqInfo.authenticated) {
        res.render('user/Profile', {errorMessage:"",user:{}, reqInfo:reqInfo, user})
    }
    else {
        res.redirect('/user/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
}

exports.EditEvent  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let user = await _userRepo.getUser(reqInfo.username);
    let event = await _EventRepo.getevent(req.body._id)
    let allusers = await _userRepo.allUsers()
    if(reqInfo.authenticated) {
        res.render('user/EditEvent', {errorMessage:"",event:event, reqInfo:reqInfo, user, allusers: allusers})
    }
    else {
        res.redirect('/user/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
}

exports.EditingEvent  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let successmsg ="Updated Successfully"
    let errorMessage = req.query.errorMessage; 
    let responseObject = await _EventRepo.update(req.body.eventid, req.body.new_name, req.body.new_description, req.body.new_date)
    return res.redirect('/user/MyEvents')
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

    let responseObject = await _userRepo.update(old_username, new_username, new_firstName, new_lastName, new_email);
    reqInfo = RequestService.reqHelper(req)
    req.logout();
    exports.Login(req, res);
}

exports.Events = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let eventsalt = await _EventRepo.allEvent();
    let user2 = await _userRepo.getUser(reqInfo.username);
    let today = new Date()
    var Notification = false;
    if(reqInfo.authenticated)
    {
        Notification = check_notification(eventsalt, user2)
    }
    if(!(reqInfo.authenticated)) {
        res.redirect('/user/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
        return
        }
    let events = [];
    let events2 = [];
    let events3 = [];
    let user = await _userRepo.getUser(reqInfo.username);
    let events_temp = await _EventRepo.allEvent();

    for(let i = 0; i < events_temp.length; i++)
    {   
        if(events_temp[i].userID == user._id)
        {
            events.push(events_temp[i]);
        }
        if(events_temp[i].userID == user._id && today.getDate() == events_temp[i].date.getDate() && today.getMonth() == events_temp[i].date.getMonth())
        {
            events2.push(events_temp[i]);
        }
        if(events_temp[i].userID == user._id && today.getMonth() == events_temp[i].date.getMonth() )
        {
            events3.push(events_temp[i]);
        }
    }

    let alt_events = []

    for(let i = 0; i < events_temp.length; i++) {
        for(let username in events_temp[i].people) {
            username = parseInt(username)
            if (events_temp[i].people[username] == reqInfo.username) {
                alt_events.push(events_temp[i])
            }
        }
    }

    for(let i = 0; i < alt_events.length; i++) {   
        events.push(alt_events[i]);
        if(today.getDate() == alt_events[i].date.getDate() && today.getMonth() == alt_events[i].date.getMonth()) {
            events2.push(alt_events[i]);
        }
        if(today.getMonth() == alt_events[i].date.getMonth() ) {
            events3.push(alt_events[i]);
        }
    }




    events.sort((a, b) => b.date - a.date).reverse()
    events2.sort((a, b) => b.date - a.date).reverse()
    events3.sort((a, b) => b.date - a.date).reverse()
    if(reqInfo.authenticated) {
    return res.render('user/Events', { reqInfo:reqInfo, events:events, events2:events2, events3:events3, dateFormat:dateFormat, Notification:Notification });
    }
    else {
        res.redirect('/user/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
};

exports.CreationEvent = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if(req.body.name == null || req.body.date == null)
    {
        return res.render('user/CreateEvent', {errorMessage:"Invalid Entry", reqInfo:reqInfo})
    }
    let temp  = new Event( {
        name:               req.body.name,
        description:        req.body.description,
        people:             req.body.attendees,
        date:               req.body.date,
        userID:             req.body.userID,
    });
    let responseObject = await _EventRepo.create(temp);
    if(responseObject.errorMessage == "") {
        console.log('Saved without errors.');
        exports.Events(req, res);
    }
    else {
        console.log("An error occured. Item not created.");
        let err = "An error occured. Item not created."
        exports.CreateEvent(req,res,"", err);
    }
};

exports.CreateEvent = async function(req, res, temp ="", errorMessage="") {
    let reqInfo = RequestService.reqHelper(req);
    let user = await _userRepo.getUser(reqInfo.username);
    let allusers = await _userRepo.allUsers()
    if(reqInfo.authenticated) {
        res.render('user/CreateEvent', { reqInfo, user, event:{}, allusers:allusers, errorMessage:errorMessage});
    }
    else {
        res.redirect('/user/Login')
    }
};

exports.DeleteEvent = async function(req, res, temp ="", errorMessage="") {
    let id           = req.body._id;
    let deletedItem  = await _EventRepo.delete(id);

    // Some debug data to ensure the item is deleted.
    console.log(JSON.stringify(deletedItem));
    if(deletedItem.deletedCount == 0)
    {
        return res.send(404);
    }
    exports.Events(req, res);
}

exports.AltDeleteEvent = async function(req, res, temp ="", errorMessage="") {
    let id           = req.body._id;
    let deletedItem  = await _EventRepo.alt_delete(id)

    // Some debug data to ensure the item is deleted.
    console.log(JSON.stringify(deletedItem));
    if(deletedItem.deletedCount == 0)
    {
        return res.send(404);
    }
    exports.Events(req, res);
}

function check_notification(events, user)
{
    user = user._id
    let today = new Date()
    for(let i = 0; i < events.length; i++)
    {  
        //console.log(today.getDate());
        //console.log(events[i].date.getDate())
        if(user == events[i].userID && today.getMonth() == events[i].date.getMonth() && today.getDate() == events[i].date.getDate())
        {
            return true
        }
    }
    return false
}