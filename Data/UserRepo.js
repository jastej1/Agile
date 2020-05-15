const User = require('../Models/User');

class UserRepo {
    UserRepo() {        
    }

    async getUserByEmail(email) {
        var user = await User.findOne({email: email});
        if(user) {
            let respose = { obj: user, errorMessage:"" }
            return respose;
        }
        else {
            return null;
        }
    }

    async getRolesByUsername(username) {
        var user = await User.findOne({username: username}, {_id:0, roles:1});
        if(user.roles) {
            return user.roles;
        }
        else {
            return [];
        }
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

    async delete(username) {
        let detail = await this.getUser(username)
        let id = detail._id
        console.log("Id to be deleted is: " + id);
        let deletedItem =  await User.find({_id:id}).deleteOne().exec();
        console.log(deletedItem);
        return deletedItem;
    }
}
module.exports = UserRepo;

