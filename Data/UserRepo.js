const User = require('../Models/User');

class UserRepo {
    UserRepo() {        
    }

    async allUsers(){
        let users = await User.find().exec();
        return users;
    }

    async getUser(username) {
        var user = await User.findOne({username: username});
        if(user) {
            let respose = user
            return respose;
        }
        else {
            return null;
        }
    }

    async update(old_username, new_username, new_firstName, new_lastName, new_email) {
        let respose ="all good";
        let main_user = await this.getUser(old_username);
        let updated = await User.updateOne(
            {username: old_username},
            {$set: { username: new_username, firstName: new_firstName, lastName: new_lastName, email:new_email}}
        )
       return respose;
    }
}
module.exports = UserRepo;

