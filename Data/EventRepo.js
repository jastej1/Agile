const Event = require('../Models/Event')

class EventRepo {

    EventRepo(){}

    async allEvent(){
        let events = await Event.find().exec();
        return events;
    }

    async create(temp_event) {
        try {
            // Checks if model conforms to validation rules that we set in Mongoose.
            var error = await temp_event.validateSync();
    
            // The model is invalid. Return the object and error message. 
            if(error) {
                let response = {
                    obj:          temp_event,
                    errorMessage: error.message };
    
                return response; // Exit if the model is invalid.
            } 
    
            // Model is not invalid so save it.
            const result = await temp_event.save();
    
            // Success! Return the model and no error message needed.
            let response = {
                obj:          result,
                errorMessage: "" };
    
            return response;
        } 
        //  Error occurred during the save(). Return orginal model and error message.
        catch (err) {
            let response = {
                obj:          temp_event,
                errorMessage: err.message };
    
            return  response;
        }    
    }

    async delete(id) {
        console.log("Id to be deleted is: " + id);
        let deletedItem =  await Event.find({_id:id}).deleteOne().exec();
        console.log(deletedItem);
        return deletedItem;
    }

    async alt_delete(user_id) {
        console.log("Id to be deleted is: " + user_id);
        let deletedItem =  await Event.find({userID:user_id}).deleteOne().exec();
        console.log(deletedItem);
        return deletedItem;
    }

    async getevent(_id) {
        var event = await Event.findOne({_id: _id});
        if(event) {
            return event;
        }
        else {
            console.log("Not Found")
            return null;
        }
    }

    async update(id, new_name, new_description, new_date) {
        let response ="Good Update";
        let updated = await Event.updateOne(
            {_id: id},
            {$set: { name: new_name, description: new_description, date: new_date}}
        )
       return response;
    }
    
}

module.exports = EventRepo;