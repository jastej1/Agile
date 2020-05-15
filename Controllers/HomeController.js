const RequestService = require('../Services/RequestService');
const EventRepo      = require('../Data/EventRepo');
const _EventRepo     = new EventRepo();
const UserRepo       = require('../Data/UserRepo');
const _userRepo      = new UserRepo();

exports.Index = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let events = await _EventRepo.allEvent();
    let user = await _userRepo.getUser(reqInfo.username);
    var Notification = false;
    let myevents = [];
    if(reqInfo.authenticated)
    {
        Notification = check_notification(events, user)
        
        for(let i = 0; i < events.length; i++)
        {   
            if(events[i].userID == user._id)
            {
                myevents.push(events[i].name + "|" + events[i].date);
            }
        }
    }
    return res.render('home/index', { reqInfo:reqInfo, Notification:Notification, myevents:myevents });
};
function check_notification(events, user)
{
    user = user._id
    let today = new Date()
    for(let i = 0; i < events.length; i++)
    {  
        if(user == events[i].userID && today.getMonth() == events[i].date.getMonth() && today.getDate() == events[i].date.getDate())
        {
            return true
        }
    }
    return false
}